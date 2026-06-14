# AIGEN Studio - Specs 概览

## 项目信息
- **产品名称**: AIGEN Studio
- **类型**: AI 头像生成 SaaS 平台
- **技术栈**: Next.js + tRPC + Prisma + Better-Auth + Turborepo
- **部署目标**: AWS Lambda

## 设计稿路径
```
/Users/gz/Desktop/Advance/Task/week_two/stitch_ai_headshot_studio/
├── aigen_studio_landing_page/
├── aigen_studio_portrait_gallery/
├── aigen_studio_pricing_plans/
├── aigen_studio_sign_in_sign_up/
├── aigen_studio_upload_generate/
└── professional_identity_system/
```

## 核心功能模块

### 1. Landing Page
- Hero Section (标题 + CTA)
- Before/After 对比滑块
- How It Works (3 步骤)
- Testimonials (Bento Grid)
- Social Proof (As Seen On)

### 2. Authentication
- Sign In (邮箱 + Google OAuth)
- Sign Up (邮箱 + Google OAuth)
- Session 管理

### 3. Upload & Generate
- 拖拽上传 (至少 10 张照片)
- 照片指南 (DO'S / DON'TS)
- 风格选择 (Executive/Creative/Outdoor)
- 3 步进度条 (Upload → Style → Payment)

### 4. Portrait Gallery
- 筛选器 (All/Corporate/Creative/Outdoor/Medical)
- Bento Grid 展示
- Hover 效果

### 5. Pricing Plans
- 3 级定价方案
- 推荐方案高亮

## 数据模型
- User (用户)
- Session (会话)
- Account (OAuth 账号)
- Generation (生成任务)
- Photo (生成照片)

## 设计系统
- **主色**: Deep Navy (#000f22)
- **强调色**: Electric Blue (#00d2fd)
- **字体**: Plus Jakarta Sans (标题) + Inter (正文)
- **圆角**: 0.5rem (按钮) / 1rem (卡片)

## API 架构
- **tRPC Routers**: auth, generation, photo, user
- **认证**: Better-Auth with Prisma Adapter
- **数据库**: Neon Serverless PostgreSQL
