# CLAUDE.md - Headshot Studio

## 项目概述

**Headshot Studio** - AI 头像生成工作室，基于 Better T Stack 构建的全栈应用。

### 技术栈

- **框架**: Next.js 15+ (App Router)
- **API 层**: tRPC (类型安全 API)
- **数据库**: PostgreSQL (Neon Serverless)
- **ORM**: Prisma 7.x
- **认证**: Better-Auth
- **Monorepo**: Turborepo + pnpm workspaces
- **UI**: React 19 + Tailwind CSS 4
- **部署目标**: AWS Lambda (Vercel 备选)

### 项目结构

```
headshot-studio/
├── apps/
│   └── web/              # Next.js 前端应用 (port 3001)
├── packages/
│   ├── api/              # tRPC routers 和上下文
│   ├── auth/             # Better-Auth 配置
│   ├── db/               # Prisma schema 和客户端
│   ├── env/              # 环境变量验证 (t3-env)
│   ├── ui/               # 共享 UI 组件
│   └── config/           # 共享配置 (TypeScript, ESLint)
└── .claude/
    ├── CLAUDE.md         # 本文件
    └── rules/            # 开发规则
        ├── backend-api.md
        ├── database.md
        └── auth.md
```

## 开发命令

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev              # 所有服务
pnpm dev:web          # 仅前端

# 数据库操作
pnpm db:generate      # 生成 Prisma 客户端
pnpm db:push          # 推送 schema 变更
pnpm db:migrate       # 运行迁移
pnpm db:studio        # Prisma Studio

# 类型检查
pnpm check-types
```

## 环境变量

必需的环境变量 (定义在 `packages/env/src/server.ts`):

```bash
# 数据库
DATABASE_URL=          # PostgreSQL 连接字符串 (Neon)

# 认证
BETTER_AUTH_SECRET=    # 至少 32 字符的密钥
BETTER_AUTH_URL=       # 认证服务 URL
CORS_ORIGIN=           # 允许的 CORS 源

# 可选
NODE_ENV=              # development | production | test
```

## 开发规则

详见 `.claude/rules/` 目录:

- **[backend-api.md](rules/backend-api.md)** - AWS Lambda 部署约束和 API 开发规范
- **[database.md](rules/database.md)** - Prisma Serverless 数据库配置
- **[auth.md](rules/auth.md)** - Better-Auth 认证配置

## 设计稿输入

设计稿位于: `/Users/gz/Desktop/Advance/Task/week_two/stitch_ai_headshot_studio`

包含以下页面设计:
- Landing Page
- Portrait Gallery
- Pricing Plans
- Sign In / Sign Up
- Upload & Generate

## 代码规范

- 使用 TypeScript strict mode
- 组件使用函数式组件 + Hooks
- API 使用 tRPC routers
- 数据库操作通过 Prisma Client
- 环境变量通过 `@headshot-studio/env` 验证
