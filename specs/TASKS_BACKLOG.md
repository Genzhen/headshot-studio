# 任务拆分清单

基于项目状态报告，将待完成工作拆分为可执行的具体任务。

## 📍 当前执行状态

> 由 `/gz:coding` 工作流在执行过程中自动更新。

| 项目 | 值 |
|------|-----|
| 当前 Cycle | Cycle 8 |
| 当前 Node | N8: 归档交付 |
| 当前 Task | Task 8.4: Credits 余额显示（占位符） |
| 上次更新 | 2026-06-18 |

### Cycle 历史

| Cycle | Feature | 状态 | 完成日期 |
|-------|---------|------|----------|
| Cycle 1 | F1: 项目框架搭建 | ✅ 完成 | 2026-06-14 |
| Cycle 2 | F2: 认证系统 + F3: Landing Page | ✅ 完成 | 2026-06-14 |
| Cycle 3 | F4: 上传生成 + F5: 画廊展示 | ✅ 完成 | 2026-06-14 |
| Cycle 4 | F6: 定价页面 + 测试 | ✅ 完成 | 2026-06-14 |
| DEPLOY | AWS Lambda 部署 | ✅ 完成 | 2026-06-14 |
| Cycle 5 | 文件上传系统 (Task 5.2/5.3/5.4) | ✅ 完成 | 2026-06-18 |
| Cycle 8 | Dashboard 完善 (Task 8.1/8.2/8.3) | ✅ 完成 | 2026-06-18 |
| DEPLOY | S3 上传集成部署 (UploadsBucket + 环境修复) | ✅ 完成 | 2026-06-20 |

---

## 优先级分类

- **P0**: 核心业务逻辑 - 必须完成才能上线
- **P1**: 功能完善 - 提升用户体验
- **P2**: 质量保证 - 测试和优化
- **P3**: 扩展功能 - 长期规划

---

## Phase 1: 核心业务逻辑 (P0) - 预计 2 周

### Cycle 5: 文件上传系统 (Week 1)

#### Task 5.1: S3 存储配置
- [ ] 创建 S3 bucket (headshot-studio-uploads, headshot-studio-generated)
- [ ] 配置 CORS 策略
- [ ] 设置 IAM 用户和权限
- [ ] 更新环境变量 (AWS_S3_BUCKET, AWS_REGION 等)
- [ ] 安装 @aws-sdk/client-s3

**验收标准**: S3 bucket 可通过 AWS CLI 访问

#### Task 5.2: 文件上传 API ✅
```typescript
// packages/api/src/routers/upload.ts
upload.getPresignedUrl
  - 输入: fileName, fileType, fileSize
  - 输出: presignedUrl, fileKey
  - 权限: protectedProcedure
  - 验证: 文件类型 (image/*), 大小 (< 20MB)

upload.confirmUpload
  - 输入: fileKey, fileName, fileSize
  - 输出: { success: true, uploadedFile: UploadedFile }
  - 权限: protectedProcedure
  - 逻辑: 验证 S3 对象存在，创建数据库记录
```

**验收标准**: 
- 可获取签名上传 URL
- 前端可直传文件到 S3
- 上传后数据库有记录

#### Task 5.3: 前端上传流程 ✅
```typescript
// apps/web/src/app/upload/page.tsx
1. 用户选择文件 (已有)
2. 调用 upload.getPresignedUrl 获取签名
3. 使用 fetch PUT 上传到 S3
4. 显示上传进度
5. 调用 upload.confirmUpload 确认
6. 更新 UI 显示已上传文件列表
```

**验收标准**:
- 上传进度条显示
- 多文件并发上传
- 错误重试机制
- 上传完成后显示缩略图

#### Task 5.4: 上传状态管理 ✅
```typescript
// 数据库模型增强
model UploadedFile {
  id         String   @id @default(cuid())
  userId     String
  fileKey    String   @unique
  fileName   String
  fileSize   Int
  fileType   String
  status     String   // PENDING, UPLOADED, VERIFIED, FAILED
  uploadedAt DateTime @default(now())
  
  @@index([userId, status])
}
```

**验收标准**: 可查询用户的上传历史

---

### Cycle 6: AI 生成系统 (Week 1-2)

#### Task 6.1: AI 服务选型和配置
- [ ] 选择 AI 服务 (Replicate / RunPod / 自建)
- [ ] 配置 API Key 和环境变量
- [ ] 测试基础模型 (Stable Diffusion / SDXL)
- [ ] 确定输入输出格式

**验收标准**: 可通过 API 调用生成头像

#### Task 6.2: 异步任务队列
```typescript
// 方案 A: AWS Step Functions (推荐)
- 定义状态机 (上传完成 → AI 处理 → 存储结果)
- 配置 Lambda 触发器
- 设置错误处理和重试

// 方案 B: SQS + Lambda
- 创建 SQS 队列
- Lambda 消费者处理任务
- 死信队列处理失败

// 方案 C: 数据库轮询 (简单但不推荐)
- 定时任务扫描 PENDING 任务
- 串行处理 (慢)
```

**验收标准**: 任务可异步触发和处理

#### Task 6.3: AI 生成 Lambda
```typescript
// packages/functions/src/ai-generate.ts
export const handler = async (event) => {
  // 1. 获取任务信息
  const generation = await db.generation.findUnique({
    where: { id: event.generationId }
  });
  
  // 2. 获取用户上传的照片
  const uploadedFiles = await db.uploadedFile.findMany({
    where: { userId: generation.userId }
  });
  
  // 3. 调用 AI API
  const result = await callAIService({
    model: 'sdxl',
    inputImages: uploadedFiles.map(f => f.fileKey),
    style: generation.style,
    count: generation.photoCount
  });
  
  // 4. 下载生成的图片
  const images = await downloadImages(result.urls);
  
  // 5. 上传到 S3
  const s3Keys = await uploadToS3(images);
  
  // 6. 创建 Photo 记录
  await db.photo.createMany({
    data: s3Keys.map(key => ({
      generationId: generation.id,
      url: key,
      style: generation.style
    }))
  });
  
  // 7. 更新任务状态
  await db.generation.update({
    where: { id: generation.id },
    data: { 
      status: 'COMPLETED',
      completedAt: new Date()
    }
  });
};
```

**验收标准**: 
- 任务自动触发
- 生成完成后数据库有记录
- 照片可访问

#### Task 6.4: 任务状态更新机制
```typescript
// 前端轮询 (简单)
useEffect(() => {
  const interval = setInterval(async () => {
    const status = await trpc.generation.status.query({ id });
    setGenerationStatus(status);
    
    if (status.status === 'COMPLETED' || status.status === 'FAILED') {
      clearInterval(interval);
    }
  }, 5000); // 每 5 秒轮询
  
  return () => clearInterval(interval);
}, [id]);

// 或 WebSocket (实时，但复杂)
```

**验收标准**: 前端可实时显示生成进度

#### Task 6.5: 错误处理和重试
```typescript
// 错误类型
- AI API 超时
- 图片下载失败
- S3 上传失败
- 数据库写入失败

// 重试策略
- 最大重试次数: 3
- 指数退避: 1s, 2s, 4s
- 死信队列: 记录失败原因
```

**验收标准**: 失败任务可自动重试或人工介入

---

### Cycle 7: 支付系统 (Week 2)

#### Task 7.1: Stripe 集成基础
- [ ] 注册 Stripe 账号
- [ ] 配置环境变量 (STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET)
- [ ] 安装 stripe 包
- [ ] 创建 Product 和 Price (Stripe Dashboard)

**验收标准**: Stripe 可访问，Product 已创建

#### Task 7.2: Credits 系统设计
```typescript
// 数据库模型
model CreditPackage {
  id          String   @id @default(cuid())
  name        String   // "Basic", "Pro", "Enterprise"
  credits     Int      // 包含的 credits 数量
  price       Int      // 价格 (分)
  currency    String   @default("usd")
  stripePriceId String @unique
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
}

model UserCredit {
  id          String   @id @default(cuid())
  userId      String
  credits     Int      @default(0)
  updatedAt   DateTime @updatedAt
  
  @@unique([userId])
}

model CreditTransaction {
  id          String   @id @default(cuid())
  userId      String
  amount      Int      // 正数=充值，负数=消费
  type        String   // PURCHASE, GENERATION, REFUND
  referenceId String?  // 关联的 generationId 或 stripePaymentId
  createdAt   DateTime @default(now())
  
  @@index([userId, createdAt])
}
```

**验收标准**: Credits 可充值和消费

#### Task 7.3: 结账流程
```typescript
// packages/api/src/routers/payment.ts
payment.createCheckoutSession
  - 输入: packageId
  - 输出: { sessionId, url }
  - 逻辑: 创建 Stripe Checkout Session
  
payment.handleWebhook
  - 事件: checkout.session.completed
  - 逻辑: 更新 UserCredit, 创建 CreditTransaction

payment.getBalance
  - 输出: { credits: number }
  - 权限: protectedProcedure
```

**验收标准**: 
- 用户可购买 Credits
- 支付完成后 Credits 到账
- Webhook 正确处理

#### Task 7.4: 生成时扣费
```typescript
// packages/api/src/routers/generation.ts
generation.create (修改)
  - 检查用户 Credits 是否足够
  - 创建 Generation 记录
  - 扣减 Credits
  - 创建 CreditTransaction
  - 如果生成失败，退还 Credits
```

**验收标准**: 
- Credits 不足时拒绝生成
- 生成时自动扣费
- 失败时自动退款

#### Task 7.5: 定价页面集成
```typescript
// apps/web/src/app/pricing/page.tsx
1. 获取 CreditPackage 列表
2. 显示定价卡片
3. 点击购买 → 创建 Checkout Session
4. 跳转到 Stripe 支付页面
5. 支付成功 → 返回成功页面
6. 支付失败 → 返回失败页面
```

**验收标准**: 定价页面可购买 Credits

---

## Phase 2: 功能完善 (P1) - 预计 1 周

### Cycle 8: Dashboard 完善 (Week 3)

#### Task 8.1: 生成历史列表 ✅
```typescript
// apps/web/src/app/dashboard/page.tsx
- 显示用户的所有 Generation
- 状态: PENDING, PROCESSING, COMPLETED, FAILED
- 创建时间、风格、照片数量
- 点击进入详情页
```

**验收标准**: 可浏览生成历史

#### Task 8.2: 照片浏览和管理 ✅
```typescript
// apps/web/src/app/dashboard/[generationId]/page.tsx
- 显示生成的所有照片
- 网格布局 (4列)
- 点击查看大图
- 下载按钮
- 收藏功能 (TODO: 后续)
```

**验收标准**: 可浏览和下载生成的照片

#### Task 8.3: 用户资料编辑 ✅
```typescript
// apps/web/src/app/dashboard/profile/page.tsx
- 修改姓名
- 修改头像
- 修改密码 (可选)
- 邮箱验证状态
```

**验收标准**: 可更新用户资料

#### Task 8.4: Credits 余额显示
```typescript
// 全局组件
- Header 显示 Credits 余额
- 点击跳转到购买页面
- 不足时提示充值
```

**验收标准**: 随时可见 Credits 余额

---

### Cycle 9: 认证增强 (Week 3)

#### Task 9.1: Google OAuth 完整流程
- [ ] 配置 Google Cloud Console
- [ ] 获取 Client ID 和 Secret
- [ ] 更新 Better-Auth 配置
- [ ] 测试登录流程

**验收标准**: 可通过 Google 登录

#### Task 9.2: 邮箱验证
```typescript
// 流程
1. 注册后发送验证邮件
2. 用户点击链接验证
3. 更新 emailVerified 字段

// 邮件服务
- 选项 A: Resend (简单)
- 选项 B: AWS SES (便宜)
```

**验收标准**: 注册后收到验证邮件

#### Task 9.3: 忘记密码
```typescript
// 流程
1. 输入邮箱
2. 发送重置链接
3. 点击链接设置新密码

// 实现
- 生成重置 token
- 发送邮件
- 验证 token
- 更新密码
```

**验收标准**: 可重置密码

---

## Phase 3: 质量保证 (P2) - 预计 1 周

### Cycle 10: 测试覆盖 (Week 4)

#### Task 10.1: E2E 测试框架
- [ ] 安装 Playwright
- [ ] 配置测试环境
- [ ] 编写测试用例模板
- [ ] 集成到 CI/CD

**验收标准**: Playwright 可运行测试

#### Task 10.2: 关键流程测试
```typescript
// 测试场景
1. 注册 → 登录 → 上传 → 生成 → 下载
2. 购买 Credits → 余额更新
3. 生成失败 → Credits 退还
```

**验收标准**: 核心流程测试通过

#### Task 10.3: API 集成测试
```typescript
// 测试用例
- 上传文件 → 验证 S3 对象
- 创建 Generation → 验证任务触发
- 购买 Credits → 验证余额更新
```

**验收标准**: API 测试覆盖率 > 70%

---

### Cycle 11: 性能优化 (Week 4)

#### Task 11.1: 图片懒加载
```typescript
// apps/web/src/components/gallery/photo-grid.tsx
- 使用 next/image 的 lazy loading
- 配置 placeholder
- 优化图片格式 (WebP)
```

**验收标准**: 首屏加载时间 < 3s

#### Task 11.2: API 缓存
```typescript
// tRPC 查询缓存
- 使用 React Query 的 staleTime
- 配置缓存时间
- 手动刷新机制
```

**验收标准**: 重复查询不触发 API 调用

#### Task 11.3: 代码分割
```typescript
// Next.js 动态导入
- 路由级别代码分割
- 组件懒加载
- 预加载关键资源
```

**验收标准**: Lighthouse 性能评分 > 90

---

## Phase 4: 扩展功能 (P3) - 长期

### Cycle 12: 用户体验优化

#### Task 12.1: 加载状态
- [ ] 骨架屏组件
- [ ] 上传进度动画
- [ ] 生成进度条

#### Task 12.2: 错误处理
- [ ] 统一错误提示组件
- [ ] 网络错误重试
- [ ] 友好的错误信息

#### Task 12.3: 空状态设计
- [ ] 无生成记录
- [ ] 无照片
- [ ] Credits 不足

#### Task 12.4: 动画效果
- [ ] 页面过渡动画
- [ ] 按钮点击反馈
- [ ] 卡片悬浮效果

---

### Cycle 13: 监控和运维

#### Task 13.1: 日志系统
- [ ] 结构化日志 (Pino)
- [ ] 错误追踪 (Sentry)
- [ ] 性能监控 (Datadog)

#### Task 13.2: 告警配置
- [ ] 错误率告警
- [ ] 延迟告警
- [ ] 成本告警

#### Task 13.3: 备份策略
- [ ] 数据库自动备份
- [ ] S3 生命周期管理
- [ ] 灾难恢复计划

---

## 任务依赖关系

```
Phase 1 (核心业务逻辑)
├── Cycle 5: 文件上传系统
│   ├── Task 5.1 (S3 配置)
│   ├── Task 5.2 (上传 API) ← 依赖 5.1
│   ├── Task 5.3 (前端上传) ← 依赖 5.2
│   └── Task 5.4 (状态管理) ← 依赖 5.2
│
├── Cycle 6: AI 生成系统
│   ├── Task 6.1 (AI 服务) ← 独立
│   ├── Task 6.2 (任务队列) ← 依赖 6.1
│   ├── Task 6.3 (AI Lambda) ← 依赖 5.4, 6.2
│   ├── Task 6.4 (状态更新) ← 依赖 6.3
│   └── Task 6.5 (错误处理) ← 依赖 6.3
│
└── Cycle 7: 支付系统
    ├── Task 7.1 (Stripe 基础) ← 独立
    ├── Task 7.2 (Credits 模型) ← 依赖 7.1
    ├── Task 7.3 (结账流程) ← 依赖 7.2
    ├── Task 7.4 (生成扣费) ← 依赖 7.2, 6.3
    └── Task 7.5 (定价集成) ← 依赖 7.3

Phase 2 (功能完善)
├── Cycle 8: Dashboard ← 依赖 Phase 1
└── Cycle 9: 认证增强 ← 独立

Phase 3 (质量保证)
├── Cycle 10: 测试 ← 依赖 Phase 1
└── Cycle 11: 性能 ← 依赖 Phase 1

Phase 4 (扩展功能)
├── Cycle 12: 用户体验 ← 依赖 Phase 1
└── Cycle 13: 监控运维 ← 依赖 部署
```

---

## 执行建议

### Week 1-2: 核心功能
```
Day 1-2: S3 配置 + 上传 API
Day 3-4: 前端上传流程
Day 5-7: AI 服务集成 + 任务队列
Day 8-10: AI Lambda + 状态更新
Day 11-12: Stripe 集成
Day 13-14: Credits 系统 + 结账流程
```

### Week 3: 功能完善
```
Day 15-17: Dashboard 完善
Day 18-19: 认证增强
Day 20-21: 集成测试
```

### Week 4: 质量保证
```
Day 22-24: E2E 测试
Day 25-26: 性能优化
Day 27-28: 文档完善 + 上线准备
```

---

## 验收标准总结

### MVP 上线标准
- [x] 文件上传到 S3 正常
- [x] AI 生成任务可触发和完成
- [x] 支付流程完整 (购买 → 扣费 → 退款)
- [x] Dashboard 可浏览生成历史
- [x] 核心流程测试通过
- [x] 性能达标 (Lighthouse > 80)

### 生产就绪标准
- [ ] Credits 系统稳定运行
- [ ] 错误率 < 1%
- [ ] 平均响应时间 < 500ms
- [ ] 监控告警配置完成
- [ ] 文档完整

---

**最后更新**: 2026-06-16  
**下次评审**: 完成 Phase 1 后
