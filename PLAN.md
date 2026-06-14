# AIGEN Studio - Feature 开发计划

## Feature 优先级

### Phase 1: 核心基础 (Week 1-2)

#### F1: 项目框架搭建
- [ ] 完善 Turborepo 结构
- [ ] 配置 Tailwind CSS 设计系统
- [ ] 设置环境变量
- [ ] 配置 ESLint/Prettier

#### F2: 认证系统
- [ ] Better-Auth 配置
- [ ] Prisma Schema (User/Session/Account)
- [ ] Sign In / Sign Up 页面
- [ ] Session 管理中间件
- [ ] tRPC 认证上下文

#### F3: Landing Page
- [ ] Hero Section
- [ ] Before/After 滑块组件
- [ ] How It Works 组件
- [ ] Testimonials 组件
- [ ] Footer 组件

### Phase 2: 核心功能 (Week 3-4)

#### F4: 上传与生成流程
- [ ] 拖拽上传组件
- [ ] 照片指南侧边栏
- [ ] 风格选择器
- [ ] 步骤进度条
- [ ] Generation 数据模型
- [ ] tRPC Generation Router

#### F5: 画廊展示
- [ ] 筛选器组件
- [ ] 照片网格布局
- [ ] Hover 效果
- [ ] 分类筛选逻辑

#### F6: 定价页面
- [ ] 定价卡片组件
- [ ] 方案对比
- [ ] CTA 按钮

### Phase 3: 完善与优化 (Week 5-6)

#### F7: 用户仪表盘
- [ ] 生成历史
- [ ] 照片管理
- [ ] 下载功能

#### F8: 性能优化
- [ ] 图片懒加载
- [ ] 缓存策略
- [ ] Lambda 冷启动优化

#### F9: 部署配置
- [ ] AWS Lambda 配置
- [ ] CI/CD 流水线
- [ ] 监控告警

## 依赖关系

```
F1 (框架) → F2 (认证) → F4 (上传生成) → F7 (仪表盘)
F1 (框架) → F3 (Landing) → F5 (画廊) → F6 (定价)
F4 (上传生成) → F8 (性能优化) → F9 (部署)
```

## 并行策略
- F2 + F3 可并行开发 (无依赖)
- F5 + F6 可并行开发 (无依赖)
- F7 + F8 可并行开发 (无依赖)

## 技术约束
- Lambda 15 分钟超时限制
- 无状态设计
- Neon Serverless 连接池
- 类型安全 (tRPC + Prisma)
