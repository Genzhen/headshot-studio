# AIGEN Studio - 产品需求文档 (PRD)

## 1. 产品概述

### 1.1 产品名称
**AIGEN Studio** - Professional AI Headshot Generator

### 1.2 产品定位
面向全球专业人士的 AI 头像生成平台，提供工作室级别的专业肖像照片，无需实际摄影棚。

### 1.3 核心价值主张
- **省时**: 90 分钟内获得 40+ 张专业头像
- **省钱**: 替代数千美元的传统摄影棚费用
- **高质量**: 工作室级别的灯光和后期效果
- **多样性**: 多种风格、服装、背景选择

### 1.4 目标用户
- 企业高管和职场专业人士
- LinkedIn/简历需要更新照片的求职者
- 需要团队照片的企业
- 房地产经纪人等个人品牌依赖者
- 创意行业从业者

---

## 2. 设计系统

### 2.1 品牌色彩

| 角色 | 色值 | 用途 |
|------|------|------|
| Primary (Deep Navy) | `#000f22` | 品牌元素、导航栏、主要文字 |
| Primary Container | `#0a2540` | 深色背景区域 |
| Secondary (Electric Blue) | `#00d2fd` | 主要 CTA 按钮、活跃状态 |
| Secondary Container | `#00677e` | 次要强调色 |
| Background | `#f7f9fb` | 页面背景 |
| Surface | `#f7f9fb` | 卡片背景 |
| On-Surface | `#191c1e` | 主要文字 |
| On-Surface-Variant | `#43474d` | 次要文字 |
| Error | `#ba1a1a` | 错误状态 |

### 2.2 字体系统

| 用途 | 字体 | 大小 | 字重 | 行高 |
|------|------|------|------|------|
| Display (大标题) | Plus Jakarta Sans | 48px (桌面) / 32px (移动) | 700 | 1.1 |
| Headline | Plus Jakarta Sans | 24px | 600 | 1.3 |
| Body Large | Inter | 18px | 400 | 1.6 |
| Body Medium | Inter | 16px | 400 | 1.5 |
| Label Small | Inter | 14px | 600 | 1.2 |
| Label Extra Small | Inter | 12px | 500 | 1.2 |

### 2.3 间距系统
- Base: 8px
- Gutter: 24px
- Stack Small: 12px
- Stack Medium: 24px
- Stack Large: 48px
- Margin Mobile: 16px
- Margin Desktop: 40px
- Container Max: 1280px

### 2.4 圆角系统
- Small: 0.25rem (4px)
- Default: 0.5rem (8px) - 按钮、输入框
- Medium: 0.75rem (12px)
- Large: 1rem (16px) - 内容卡片
- Extra Large: 1.5rem (24px)
- Full: 9999px - 头像、标签

---

## 3. 功能模块

### 3.1 Landing Page (首页)

#### 页面结构
```
├── Top Navigation Bar
── Hero Section
├── Social Proof (As Seen On)
├── Before/After Comparison
├── How It Works (3 步骤)
├── Testimonials (Bento Grid)
├── Final CTA
└── Footer
```

#### 关键组件

**Hero Section**
- 标题: "Get the perfect professional headshot in 90 minutes."
- 副标题: 节省费用说明，100,000+ 用户信任
- CTA 按钮: "Get Your Photos" (主要) / "See Gallery" (次要)
- 社会证明: 用户头像堆叠 + 4.9/5 评分 (2000+ 评论)
- 视觉: AI 生成进度展示 (87% 进度条)

**Before/After 对比**
- 交互式滑块组件
- 左侧: 原始自拍 (Before: Casual Selfie)
- 右侧: AI 生成照片 (After: AI Studio)
- 支持触摸和鼠标拖拽

**How It Works**
1. Upload 10+ selfies (上传图标)
2. AI works its magic (魔法图标)
3. Download 40+ photos (下载图标)

**Testimonials**
- 3 列 Bento Grid 布局
- 包含用户头像、姓名、职位、评价内容
- 支持左右滑动浏览

---

### 3.2 Authentication (认证)

#### 页面布局
- 左侧: 品牌视觉 (7/12 宽度)
  - 标题: "Redefining Professional Identity with AI."
  - 描述文字
  - 用户头像堆叠 + "Trusted by 10,000+ professionals"
- 右侧: 认证表单 (5/12 宽度)

#### Sign In (登录)
- Google OAuth 登录按钮
- 邮箱/密码登录表单
- 忘记密码链接
- 创建账户切换

#### Sign Up (注册)
- Google OAuth 注册按钮
- 表单字段:
  - First Name / Last Name (并排)
  - Email Address
  - Password (最少 8 字符)
- 服务条款和隐私政策链接

#### 认证状态
- 未登录: 显示 "Sign In" / "Get Started"
- 已登录: 显示用户头像/姓名

---

### 3.3 Upload & Generate (上传与生成)

#### 页面布局
- 顶部: 步骤进度条 (3 步骤)
- 主体: 12 列网格布局
  - 左侧 (4 列): 照片指南
  - 右侧 (8 列): 上传区域 + 风格选择

#### 步骤进度条
1. **Upload** (活跃状态 - 蓝色填充)
2. **Select Style** (待完成 - 灰色)
3. **Payment** (待完成 - 灰色)

#### 照片指南 (Photo Guidelines)

**DO'S** ✓
- Clear Lighting (清晰光线示例)
- Different Angles (不同角度示例)

**DON'TS** ✗
- Sunglasses/Hats (墨镜/帽子 - 灰色显示 + 禁止图标)
- Group Photos (合照 - 灰色显示 + 群组图标)

#### 上传区域
- 拖拽上传支持
- 点击选择文件按钮
- 要求: 至少 10 张高质量照片
- 格式: JPEG 或 PNG，最大 20MB
- 上传后显示已选照片数量和状态

#### 风格选择 (Style Selector)

预设风格卡片:
1. **Executive Suite** - 高管商务风
2. **Creative Studio** - 创意工作室风
3. **Outdoor Casual** - 户外休闲风

每个风格:
- 4:3 比例预览图
- 标题文字覆盖
- 单选选中状态 (蓝色边框 + 对勾)
- "View all styles" 链接

---

### 3.4 Portrait Gallery (作品展示)

#### 页面结构
- Hero Section: 标题 + 描述
- 筛选器栏
- Bento Grid 画廊
- CTA Section
- Footer

#### 筛选器 (Filter Bar)
- All (默认活跃)
- Corporate
- Creative
- Outdoor
- Medical
- 更多行业筛选...

筛选样式:
- 活跃: Primary Container 背景色
- 未活跃: Surface Container 背景色
- 胶囊形状 (rounded-full)

#### 画廊网格
- 桌面: 4 列
- 平板: 3 列
- 移动: 2 列
- 照片比例: 4:5 (竖向)

照片卡片:
- 圆角 16px
- Hover 效果: 显示分类标签和标题
- 分类覆盖层: 渐变背景 + 文字

#### CTA Section
- 深色背景 (Primary)
- 标题: "Ready to upgrade your profile?"
- 两个按钮: "Get Started" (主要) / "View Pricing" (次要)

---

### 3.5 Pricing Plans (定价方案)

#### 定价策略
(根据设计稿推测)
- 基础方案: 适合个人使用
- 专业方案: 适合职场专业人士 (推荐)
- 企业方案: 适合团队使用

#### 定价卡片设计
- 3 列布局
- 推荐方案: 蓝色边框 (2px) + "Most Popular" 标签
- 包含: 方案名称、价格、功能列表、CTA 按钮

---

## 4. 用户流程

### 4.1 新用户流程
```
Landing Page → Sign Up → Upload Photos → Select Style → Payment → AI Processing → Download
```

### 4.2 老用户流程
```
Sign In → Dashboard → New Generation → Upload → Select Style → Payment → Download
```

### 4.3 浏览流程
```
Landing Page → Gallery → (可选) Pricing → Sign Up/In → Generate
```

---

## 5. 技术架构

### 5.1 前端技术栈
- **框架**: Next.js 15+ (App Router)
- **UI**: React 19 + Tailwind CSS 4
- **字体**: Plus Jakarta Sans (标题) + Inter (正文)
- **图标**: Material Symbols Outlined

### 5.2 后端技术栈
- **API**: tRPC (类型安全)
- **数据库**: PostgreSQL (Neon Serverless)
- **ORM**: Prisma 7.x
- **认证**: Better-Auth
- **文件存储**: AWS S3

### 5.3 部署架构
- **前端**: Vercel / AWS Lambda
- **后端**: AWS Lambda (15 分钟超时)
- **AI 处理**: 异步任务队列 (Step Functions / SQS)
- **CDN**: CloudFront

---

## 6. 数据模型

### 6.1 User (用户)
```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  emailVerified Boolean   @default(false)
  image         String?
  role          String    @default("USER")
  credits       Int       @default(0)
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  sessions      Session[]
  accounts      Account[]
  generations   Generation[]
}
```

### 6.2 Generation (生成任务)
```prisma
model Generation {
  id          String   @id @default(cuid())
  userId      String
  status      String   // PENDING, PROCESSING, COMPLETED, FAILED
  style       String   // EXECUTIVE, CREATIVE, OUTDOOR, MEDICAL
  photoCount  Int      // 生成的照片数量
  prompt      String?  // 用户自定义提示
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  completedAt DateTime?
  
  user        User     @relation(fields: [userId], references: [id])
  photos      Photo[]
}
```

### 6.3 Photo (生成照片)
```prisma
model Photo {
  id            String   @id @default(cuid())
  generationId  String
  url           String   // S3 URL
  thumbnailUrl  String
  style         String
  width         Int
  height        Int
  size          Int      // 文件大小 (bytes)
  isFavorite    Boolean  @default(false)
  createdAt     DateTime @default(now())
  
  generation    Generation @relation(fields: [generationId], references: [id])
}
```

### 6.4 Session & Account (认证)
```prisma
model Session {
  id        String   @id
  expiresAt DateTime
  token     String   @unique
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}

model Account {
  id           String @id
  providerId   String
  accountId    String
  userId       String
  accessToken  String?
  refreshToken String?
  user         User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
}
```

---

## 7. API 设计

### 7.1 认证 API
```typescript
// POST /api/auth/sign-up/email
{
  name: string,
  email: string,
  password: string
}

// POST /api/auth/sign-in/email
{
  email: string,
  password: string
}

// GET /api/auth/get-session
→ { user: User, session: Session }
```

### 7.2 生成 API (tRPC)
```typescript
// 创建生成任务
generation.create({
  input: {
    style: 'EXECUTIVE' | 'CREATIVE' | 'OUTDOOR',
    photos: string[]  // 上传后的照片 URL
  }
}) → { id: string, status: 'PENDING' }

// 获取生成状态
generation.status({
  input: { id: string }
}) → { status: string, progress: number, photos?: Photo[] }

// 获取用户生成历史
generation.list({
  input: { cursor?: string, limit?: number }
}) → { generations: Generation[], nextCursor?: string }
```

### 7.3 照片 API
```typescript
// 下载照片
photo.download({
  input: { id: string }
}) → { url: string, expiresAt: Date }

// 收藏/取消收藏
photo.favorite({
  input: { id: string }
}) → { isFavorite: boolean }
```

---

## 8. 非功能需求

### 8.1 性能要求
- 页面加载时间: < 3 秒 (首屏)
- API 响应时间: < 500ms (非 AI 处理)
- AI 生成时间: 90 分钟内完成 40+ 张照片

### 8.2 安全要求
- 密码加密存储 (bcrypt)
- JWT/Session 安全存储
- 上传文件病毒扫描
- 速率限制 (10 次/分钟)

### 8.3 可扩展性
- 支持并发用户数: 10,000+
- AI 处理队列: 自动扩展
- 文件存储: S3 无限扩展

### 8.4 可用性
- 服务可用性: 99.9%
- 数据备份: 每日自动备份
- 灾难恢复: 多区域部署

---

## 9. 验收标准

### 9.1 Landing Page
- [ ] 响应式设计 (桌面/平板/移动)
- [ ] Before/After 滑块功能正常
- [ ] 所有 CTA 按钮可点击并跳转
- [ ]  testimonials 支持滑动浏览

### 9.2 认证流程
- [ ] 邮箱注册/登录功能正常
- [ ] Google OAuth 集成
- [ ] 表单验证 (邮箱格式、密码长度)
- [ ] 忘记密码功能

### 9.3 上传与生成
- [ ] 拖拽上传功能
- [ ] 文件类型和大小验证
- [ ] 风格选择功能
- [ ] 进度条显示正确
- [ ] 照片指南展示

### 9.4 画廊展示
- [ ] 筛选器功能正常
- [ ] 图片懒加载
- [ ] Hover 效果显示
- [ ] 响应式网格布局

### 9.5 定价页面
- [ ] 定价卡片展示
- [ ] 推荐方案高亮
- [ ] 功能列表清晰

---

## 10. 里程碑计划

### Phase 1: MVP (4 周)
- [ ] 项目框架搭建
- [ ] 认证系统 (邮箱 + Google OAuth)
- [ ] Landing Page 实现
- [ ] 基础上传功能

### Phase 2: Core Features (4 周)
- [ ] AI 生成流程集成
- [ ] 风格选择系统
- [ ] 画廊展示页
- [ ] 定价页面

### Phase 3: Polish (2 周)
- [ ] 性能优化
- [ ] 移动端适配
- [ ] 动画效果
- [ ] 错误处理完善

### Phase 4: Launch (2 周)
- [ ] 生产环境部署
- [ ] 监控告警配置
- [ ] 用户反馈收集
- [ ] Bug 修复

---

## 11. 附录

### 11.1 竞品分析
| 产品 | 优势 | 劣势 |
|------|------|------|
| TryItOn | 便宜 | 质量一般 |
| HeadshotPro | 质量高 | 价格贵 |
| Aragon AI | 速度快 | 风格少 |
| **AIGEN Studio** | **质量+价格平衡** | **新品牌** |

### 11.2 关键指标 (KPIs)
- 注册用户数
- 付费转化率
- 平均生成完成率
- 用户满意度 (NPS)
- 照片下载率

### 11.3 术语表
| 术语 | 定义 |
|------|------|
| Headshot | 专业头像照片 |
| Generation | AI 生成任务 |
| Style | 照片风格模板 |
| Credit | 生成额度 |
