# /gz:ai-integration — AI 服务集成专家

你现在是 GZ AI 服务集成专家，负责实现 AI 头像生成系统的完整流程。

## 执行前置

执行前先确认：

1. 读取 `docs/PRD.md` 了解功能需求
2. 读取 `packages/api/src/routers/generation.ts` 了解现有 API
3. 读取 `packages/db/prisma/schema.prisma` 了解数据模型
4. 确认 AI 服务选型 (Replicate / RunPod / 自建)

## 输入约定

用户需要提供：

1. **AI 服务选择**:
   - Replicate (推荐，简单)
   - RunPod (便宜，复杂)
   - 自建 (完全控制)

2. **模型选择**:
   - Stable Diffusion XL (推荐)
   - Stable Diffusion 1.5
   - 自定义模型

3. **环境变量**:
   ```bash
   # Replicate
   REPLICATE_API_TOKEN=
   
   # 或 RunPod
   RUNPOD_API_KEY=
   RUNPOD_ENDPOINT_ID=
   
   # 通用
   AI_MODEL_NAME=sdxl
   AI_TIMEOUT=300000  # 5 分钟
   AI_MAX_RETRIES=3
   ```

## 执行节点

### N1: 需求分析

确定 AI 生成流程：

```
用户上传照片 → 创建生成任务 → 触发 AI 处理 → 生成头像 → 存储结果 → 通知用户
```

关键需求：

1. **输入**:
   - 用户上传的 10+ 张照片
   - 选择的风格 (EXECUTIVE, CREATIVE, OUTDOOR)
   - 生成数量 (默认 40 张)

2. **输出**:
   - 40+ 张生成的头像
   - 存储到 S3
   - 记录到数据库

3. **约束**:
   - 异步处理 (不能阻塞 API)
   - 超时控制 (< 5 分钟)
   - 错误重试 (最多 3 次)
   - 成本控制 (记录每次调用成本)

### N2: 架构设计

设计系统架构：

```typescript
// 方案 A: AWS Step Functions (推荐)
┌─────────────┐
│ API 创建任务 │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Step Function│
│ 状态机       │
└──────┬──────┘
       │
       ├─→ 1. 获取用户上传照片
       ├─→ 2. 调用 AI API
       ├─→ 3. 下载生成图片
       ├─→ 4. 上传到 S3
       ├─→ 5. 更新数据库
       └─→ 6. 发送通知 (可选)

// 方案 B: SQS + Lambda
┌─────────────┐
│ API 创建任务 │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ SQS 队列    │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Lambda 消费者│
│ - 调用 AI   │
│ - 处理结果  │
│ - 更新数据库│
└─────────────┘

// 方案 C: 数据库轮询 (简单但不推荐)
┌─────────────┐
│ API 创建任务 │
│ status=PENDING│
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ 定时任务     │
│ 扫描 PENDING │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Lambda 处理  │
└─────────────┘
```

推荐方案 A (Step Functions)，因为：
- 可视化工作流
- 自动重试
- 错误处理
- 成本追踪

### N3: 服务实现

安装依赖：

```bash
pnpm add replicate @aws-sdk/client-s3
```

实现 AI 调用服务：

```typescript
// packages/functions/src/ai-service.ts
import Replicate from 'replicate';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const s3 = new S3Client({});

interface GenerateOptions {
  inputImages: string[];  // S3 keys
  style: string;
  count: number;
}

export async function generateHeadshots(options: GenerateOptions) {
  const { inputImages, style, count } = options;
  
  // 1. 下载输入图片
  const base64Images = await Promise.all(
    inputImages.map(key => downloadFromS3(key))
  );
  
  // 2. 构建提示词
  const prompt = buildPrompt(style);
  
  // 3. 调用 Replicate API
  const output = await replicate.run(
    "stability-ai/sdxl:7762fd07cf82c948538e41f63f77d685e02b063e37e496e96eefd46c929f9bdc",
    {
      input: {
        prompt: prompt,
        image: base64Images[0],  // 使用第一张作为参考
        num_outputs: count,
        width: 512,
        height: 512,
      }
    }
  ) as string[];
  
  // 4. 上传生成的图片到 S3
  const s3Keys = await Promise.all(
    output.map(url => uploadToS3(url))
  );
  
  return s3Keys;
}

function buildPrompt(style: string): string {
  const prompts = {
    EXECUTIVE: "professional business headshot, corporate style, studio lighting, high quality",
    CREATIVE: "creative portrait, artistic style, natural lighting, professional",
    OUTDOOR: "outdoor portrait, natural setting, casual professional, high quality",
  };
  
  return prompts[style] || prompts.EXECUTIVE;
}

async function downloadFromS3(key: string): Promise<string> {
  // 实现从 S3 下载并转为 base64
  // ...
}

async function uploadToS3(url: string): Promise<string> {
  const response = await fetch(url);
  const buffer = await response.arrayBuffer();
  
  const key = `generated/${Date.now()}-${Math.random().toString(36)}.png`;
  
  await s3.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET_GENERATED,
    Key: key,
    Body: buffer,
    ContentType: 'image/png',
  }));
  
  return key;
}
```

### N4: 队列配置

配置 Step Functions 状态机：

```json
{
  "Comment": "AI Headshot Generation Workflow",
  "StartAt": "GetUploadedPhotos",
  "States": {
    "GetUploadedPhotos": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789:function:get-uploaded-photos",
      "Next": "CallAIService"
    },
    "CallAIService": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789:function:ai-generate",
      "TimeoutSeconds": 300,
      "Retry": [
        {
          "ErrorEquals": ["States.TaskFailed"],
          "IntervalSeconds": 2,
          "MaxAttempts": 3,
          "BackoffRate": 2
        }
      ],
      "Next": "SaveResults"
    },
    "SaveResults": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789:function:save-generation-results",
      "Next": "NotifyUser"
    },
    "NotifyUser": {
      "Type": "Task",
      "Resource": "arn:aws:lambda:us-east-1:123456789:function:notify-user",
      "End": true
    }
  }
}
```

实现触发 Lambda：

```typescript
// packages/functions/src/trigger-generation.ts
import { SFNClient, StartExecutionCommand } from '@aws-sdk/client-sfn';

const sfn = new SFNClient({});

export async function triggerGeneration(generationId: string) {
  await sfn.send(new StartExecutionCommand({
    stateMachineArn: process.env.STATE_MACHINE_ARN,
    input: JSON.stringify({ generationId }),
  }));
}
```

### N5: 错误处理

实现错误处理和重试：

```typescript
// packages/functions/src/error-handler.ts
export class AIError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly retryable: boolean
  ) {
    super(message);
  }
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  let lastError: Error | null = null;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (error instanceof AIError && !error.retryable) {
        throw error;
      }
      
      // 指数退避
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}
```

### N6: 性能优化

优化 AI 调用性能：

```typescript
// 1. 批量处理
export async function generateBatch(
  generations: Generation[]
) {
  // 并行处理多个生成任务
  await Promise.all(
    generations.map(gen => generateHeadshots({
      inputImages: gen.uploadedPhotos,
      style: gen.style,
      count: gen.photoCount,
    }))
  );
}

// 2. 缓存常用提示词
const promptCache = new Map<string, string>();

function getCachedPrompt(style: string): string {
  if (!promptCache.has(style)) {
    promptCache.set(style, buildPrompt(style));
  }
  return promptCache.get(style)!;
}

// 3. 预加载模型 (如果使用自建模型)
let model: any = null;

async function getModel() {
  if (!model) {
    model = await loadModel();
  }
  return model;
}
```

### N7: 测试验证

实现端到端测试：

```typescript
// packages/functions/src/__tests__/ai-generation.test.ts
describe('AI Generation', () => {
  it('should generate headshots successfully', async () => {
    // 1. 上传测试照片
    const uploadedPhotos = await uploadTestPhotos();
    
    // 2. 创建生成任务
    const generation = await createGeneration({
      style: 'EXECUTIVE',
      photoCount: 5,
      uploadedPhotos,
    });
    
    // 3. 触发 AI 生成
    await triggerGeneration(generation.id);
    
    // 4. 等待完成
    await waitForCompletion(generation.id, 300000);
    
    // 5. 验证结果
    const result = await getGeneration(generation.id);
    expect(result.status).toBe('COMPLETED');
    expect(result.photos.length).toBe(5);
  });
  
  it('should handle AI service timeout', async () => {
    // 模拟超时
    // 验证重试机制
  });
  
  it('should handle AI service error', async () => {
    // 模拟错误
    // 验证错误处理
  });
});
```

### N8: 监控配置

配置 AI 服务监控：

```typescript
// packages/functions/src/monitoring.ts
import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';

const cloudwatch = new CloudWatchClient({});

export async function recordAIMetric(
  metricName: string,
  value: number,
  unit: string = 'Count'
) {
  await cloudwatch.send(new PutMetricDataCommand({
    Namespace: 'HeadshotStudio/AI',
    MetricData: [
      {
        MetricName: metricName,
        Value: value,
        Unit: unit,
        Timestamp: new Date(),
      },
    ],
  }));
}

// 使用示例
await recordAIMetric('GenerationSuccess', 1);
await recordAIMetric('GenerationFailed', 1);
await recordAIMetric('AICallDuration', 120, 'Seconds');
await recordAIMetric('AICallCost', 0.05, 'None');
```

## 强制规则

- **必须异步处理**: 不能阻塞 API 请求
- **必须有超时控制**: AI 调用必须设置超时 (< 5 分钟)
- **必须有错误重试**: 失败任务必须自动重试 (最多 3 次)
- **必须记录成本**: 每次 AI 调用必须记录成本
- **必须有监控**: 必须配置 CloudWatch 监控

## 失败处理

### AI 服务超时
1. 增加超时时间
2. 检查网络连接
3. 检查 AI 服务状态
4. 考虑切换到备用服务

### AI 生成质量差
1. 调整提示词
2. 优化输入照片
3. 尝试不同模型
4. 调整生成参数

### 成本过高
1. 优化批处理
2. 使用更便宜的模型
3. 缓存常用结果
4. 设置成本告警

## 触发命令

运行 `/gz:ai-integration` 开始 AI 服务集成。
