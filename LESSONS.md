# AIGEN Studio - Lessons Learned

## 经验记录

### 架构决策
_记录重要的架构决策和原因_

### Lambda 优化
_记录 Lambda 部署相关的优化经验_

### 性能优化
_记录性能优化的方法和效果_

### 常见问题
_记录开发过程中遇到的问题和解决方案_

---

## 2026-06-14 - Tailwind CSS 4 设计系统配置

**问题**: Tailwind CSS 4 使用新的 `@import "tailwindcss"` 语法，与 v3 的 `tailwind.config.js` 配置方式不同。

**解决方案**:
1. 使用 `@theme inline` 在 CSS 中直接定义主题变量
2. 颜色系统通过 CSS 变量 (`--primary`, `--secondary`, etc.) 管理
3. 字体系统通过 `@font-face` + CSS 变量 (`--font-display`, `--font-body`) 管理
4. 间距和圆角通过 `--spacing-*` 和 `--radius-*` 变量定义

**效果**: 设计系统与 AIGEN Studio 品牌规范完全对齐，支持 Light/Dark 模式切换。

**建议**: 后续组件开发直接使用 Tailwind 类名 (如 `bg-primary`, `text-secondary-container`)，无需额外配置。

---

## 2026-06-14 - Cycle 2: F2/F3 并行开发

**问题**: 如何高效并行开发认证系统和 Landing Page？

**解决方案**:
1. F2 (认证系统): 扩展现有 Better-Auth 配置，添加 Generation/Photo 模型
2. F3 (Landing Page): 创建独立的组件目录 `components/landing/`
3. 使用 Turborepo 的并行任务能力同时检查类型

**效果**:
- F2: 完成 Prisma Schema 扩展、API Routers (generation/photo)
- F3: 完成 5 个 Landing Page 组件 (Hero/Slider/HowItWorks/Testimonials/CTA)
- 类型检查通过

**建议**: 后续开发继续使用并行策略，F4+F5 可同时进行。

---

## 2026-06-14 - Cycle 3: F4/F5 并行开发

**问题**: 如何高效实现上传流程和画廊展示？

**解决方案**:
1. F4 (上传生成): 创建独立的 `components/upload/` 目录
   - StepProgress: 步骤进度条组件
   - PhotoGuidelines: DO'S/DON'TS 指南
   - UploadZone: 拖拽上传 + 文件验证
   - StyleSelector: 风格选择器
2. F5 (画廊展示): 创建独立的 `components/gallery/` 目录
   - FilterBar: 分类筛选器
   - PhotoCard: 照片卡片 (Hover 效果)
   - PhotoGrid: 响应式网格布局

**效果**:
- F4: 完成上传流程 UI (缺 AI 处理集成)
- F5: 完成画廊展示 (客户端筛选)
- 总进度: 17/22 Tasks (77%)

**建议**: F6 (定价页面) 可参考 F3 Landing Page 的组件结构。

---

## 2026-06-14 - Cycle 4: F6 定价页面

**问题**: 如何设计清晰透明的定价页面？

**解决方案**:
1. 创建 PricingCard 组件支持推荐方案高亮
2. 3 列布局: Starter/Professional/Enterprise
3. 功能对比表使用 HTML table 实现
4. FAQ 部分使用简洁的问答列表

**效果**:
- F6: 完成定价页面 (2/2 tasks)
- 总进度: 19/22 Tasks (86%)

**建议**: 所有核心功能已完成，可进入最终审查和部署准备。

---

## 2026-06-14 - 认证测试配置

**问题**: 如何为 monorepo 项目配置测试？

**解决方案**:
1. 在每个 package 中添加 vitest 依赖
2. 创建 vitest.config.ts 配置环境变量和路径别名
3. 使用 `process.env || default` 模式处理环境变量
4. 配置路径别名解析 workspace 包

**效果**:
- packages/db: 7 tests passing
- packages/auth: 6 tests passing
- packages/api: 7 tests passing
- Total: 20 tests passing

**建议**: 后续可为前端组件添加 React Testing Library 测试。

---

## 模板

### [日期] - [主题]
**问题**: _描述问题_
**解决方案**: _描述解决方案_
**效果**: _描述效果_
**建议**: _给后续开发的建议_
