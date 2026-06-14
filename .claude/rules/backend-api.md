# AWS Lambda 后端开发规则

## 部署约束

### 1. 超时限制

- **最大超时**: 15 分钟 (900 秒)
- **建议执行时间**: < 30 秒 (API 端点)
- **长时间任务**: 使用 Step Functions 或异步队列

```typescript
// ❌ 错误：同步长时间操作
export const generateImage = publicProcedure
  .input(z.object({ prompt: z.string() }))
  .mutation(async ({ input }) => {
    // 可能运行 2-3 分钟，阻塞 Lambda
    const result = await generateAIImage(input.prompt);
    return result;
  });

// ✅ 正确：异步处理
export const generateImage = publicProcedure
  .input(z.object({ prompt: z.string() }))
  .mutation(async ({ input, ctx }) => {
    const job = await ctx.db.job.create({
      data: { status: 'PENDING', prompt: input.prompt, userId: ctx.session.user.id }
    });

    // 触发异步任务 (Step Functions / SQS)
    await startImageGeneration(job.id);

    return { jobId: job.id, status: 'PENDING' };
  });
```

### 2. 无状态特性

- **本地存储**: Lambda 的 `/tmp` 目录是临时的 (512MB - 10GB)
- **内存**: 函数结束后所有状态丢失
- **持久化**: 使用 S3 存储文件，数据库存储状态

```typescript
// ❌ 错误：依赖本地文件系统
import fs from 'fs/promises';
export const processImage = publicProcedure
  .mutation(async () => {
    await fs.writeFile('/tmp/image.png', buffer); // 不可靠
    return '/tmp/image.png'; // 下次调用时文件不存在
  });

// ✅ 正确：使用 S3
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
export const processImage = publicProcedure
  .mutation(async () => {
    const s3 = new S3Client({});
    await s3.send(new PutObjectCommand({
      Bucket: 'headshot-studio-images',
      Key: `images/${Date.now()}.png`,
      Body: buffer
    }));
    return s3Url;
  });
```

### 3. 内存限制

- **最大内存**: 10,240 MB
- **CPU 与内存绑定**: 内存越大，CPU 越多
- **优化**: 处理大文件时使用流式处理

```typescript
// ❌ 错误：一次性加载大文件到内存
export const processVideo = publicProcedure
  .mutation(async () => {
    const file = await fs.readFile('/tmp/large-video.mp4'); // 内存爆炸
    return process(file);
  });

// ✅ 正确：流式处理
import { createReadStream } from 'fs';
export const processVideo = publicProcedure
  .mutation(async () => {
    const stream = createReadStream('/tmp/large-video.mp4');
    return processStream(stream); // 低内存占用
  });
```

### 4. 冷启动优化

- **依赖体积**: 减小 bundle size，避免大型依赖
- **初始化**: 将初始化逻辑移到函数外
- **Provisioned Concurrency**: 对关键路径使用预留并发

```typescript
// ❌ 错误：每次调用都初始化
export const handler = async (event) => {
  const db = new PrismaClient(); // 冷启动慢
  const s3 = new S3Client({});
  // ...
};

// ✅ 正确：模块级初始化
const db = new PrismaClient();
const s3 = new S3Client({});

export const handler = async (event) => {
  // 复用已初始化的客户端
  return db.user.findMany();
};
```

### 5. 并发处理

- **数据库连接**: 使用连接池 (Prisma Accelerate / Neon Serverless)
- **速率限制**: 外部 API 调用需要限流
- **重试逻辑**: 实现指数退避

```typescript
// Prisma Serverless 配置 (见 database.md)
import { PrismaNeon } from '@prisma/adapter-neon';

const adapter = new PrismaNeon({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });
```

## tRPC API 规范

### 路由命名

```typescript
// 使用名词复数
export const imageRouter = router({
  list: publicProcedure.query(...),      // GET /api/trpc/image.list
  getById: publicProcedure.input(...).query(...),
  create: protectedProcedure.mutation(...),
  update: protectedProcedure.mutation(...),
  delete: protectedProcedure.mutation(...),
});
```

### 错误处理

```typescript
import { TRPCError } from '@trpc/server';

// 使用标准错误码
throw new TRPCError({
  code: 'NOT_FOUND',
  message: 'Image not found',
});

throw new TRPCError({
  code: 'UNAUTHORIZED',
  message: 'Authentication required',
});

throw new TRPCError({
  code: 'FORBIDDEN',
  message: 'You do not have permission',
});

throw new TRPCError({
  code: 'BAD_REQUEST',
  message: 'Invalid input',
});
```

### 输入验证

```typescript
import { z } from 'zod';

export const createImage = protectedProcedure
  .input(z.object({
    prompt: z.string().min(1).max(1000),
    style: z.enum(['realistic', 'cartoon', 'anime']),
    size: z.object({
      width: z.number().int().min(256).max(2048),
      height: z.number().int().min(256).max(2048),
    }),
  }))
  .mutation(async ({ input, ctx }) => {
    // input 已经完全验证和类型安全
  });
```

## 环境配置

### Lambda 环境变量

```bash
# 必须设置
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secret-key
BETTER_AUTH_URL=https://api.example.com
CORS_ORIGIN=https://app.example.com

# Lambda 特定
AWS_REGION=us-east-1
AWS_LAMBDA_FUNCTION_NAME=headshot-studio-api
```

### 超时配置

```yaml
# serverless.yml 或 sam.yaml
Functions:
  Api:
    Timeout: 30        # API 端点
    MemorySize: 1024

  ImageProcessor:
    Timeout: 300       # 图像处理 (5分钟)
    MemorySize: 2048

  VideoProcessor:
    Timeout: 900       # 视频处理 (15分钟)
    MemorySize: 4096
```

## 监控与日志

```typescript
// 结构化日志
import { Logger } from '@aws-lambda-powertools/logger';

const logger = new Logger({ serviceName: 'headshot-studio' });

export const handler = async (event) => {
  logger.addContext(context);
  logger.info('Processing request', {
    path: event.path,
    method: event.httpMethod,
    userId: event.requestContext.authorizer?.userId,
  });

  try {
    const result = await processRequest(event);
    logger.info('Request completed', { duration: Date.now() - startTime });
    return result;
  } catch (error) {
    logger.error('Request failed', { error: error.message, stack: error.stack });
    throw error;
  }
};
```
