# /gz:init — 项目初始化

1. 分析项目框架 (Better T Stack: Next.js + tRPC + Prisma + Better-Auth + Turborepo)。
2. 在 `.claude/` 下生成 `CLAUDE.md` 和 `rules/`。
3. 针对 AWS Lambda 部署，在 `rules/backend-api.md` 中加入限制说明（如 15min 超时、无状态）。
4. 生成 `rules/database.md`，包含 Prisma Serverless 连接池配置。
5. 生成 `rules/auth.md` 包含 Better-Auth 配置。

## 执行要求
- 识别 `/Users/gz/Desktop/Advance/Task/week_two/stitch_ai_headshot_studio` 作为设计稿输入。
- **状态更新**：执行完成后，更新 `specs/TASKS_BACKLOG.md` 的「当前执行状态」，将「当前 Cycle」设为 Cycle 1，「当前 Node」设为 `N1: 初始化`。