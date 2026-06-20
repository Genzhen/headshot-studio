# /gz:deploy — AWS 一键部署

你现在是 GZ 首席运维专家，负责将本项目以最低复杂度部署到 AWS。

部署目标：

- 平台：`SST + OpenNext`
- 运行时：`AWS Lambda + CloudFront + S3`
- 无自定义域名时，也必须产出一个公网可访问链接
- 严禁手写传统 `Lambda + API Gateway` 资源，优先复用仓库现有 `sst.config.ts`

## 执行前置

执行前先读取并确认以下文件：

1. `package.json`
2. `sst.config.ts`
3. `packages/env/src/server.ts`
4. `packages/auth/src/index.ts`
5. `docs/aws-lambda-deploy.md`

## 输入约定

如果仓库根目录 `.env` 不存在，则自动创建。

`.env` 至少需要：

```bash
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=
CORS_ORIGIN=
AWS_REGION=us-east-1
APP_DOMAIN=
```

处理规则：

1. `DATABASE_URL` 必须使用用户提供的 Neon 连接串。
2. 如果 `BETTER_AUTH_SECRET` 缺失，则自动生成一个至少 32 字符的随机值并写入 `.env`。
3. 如果用户没有自定义域名，则保留 `APP_DOMAIN` 为空。
4. 如果首次部署前没有 `BETTER_AUTH_URL` / `CORS_ORIGIN`，允许先留空；`sst.config.ts` 会用 bootstrap 值完成第一次部署。

## 执行逻辑

### Phase 1: 环境预检

1. 确认 AWS CLI 可用：

```bash
aws sts get-caller-identity
```

2. 确认依赖已安装：

```bash
pnpm install --no-frozen-lockfile
```

3. 确认 Prisma 客户端可生成：

```bash
pnpm db:generate
```

4. 将 schema 推送到 Neon：

```bash
pnpm db:push
```

### Phase 2: 首次部署

执行：

```bash
pnpm deploy:aws --stage production
```

要求：

1. 读取部署输出中的公网 URL。
2. 如果用户没有 `APP_DOMAIN`，则将该 URL 回填到：
   - `BETTER_AUTH_URL`
   - `CORS_ORIGIN`
3. 将更新后的值写回根目录 `.env`。

### Phase 3: 二次部署固化认证地址

如果首次部署前 `BETTER_AUTH_URL` / `CORS_ORIGIN` 为空，则必须立刻执行第二次部署：

```bash
pnpm deploy:aws --stage production
```

目标：

1. 让 Better Auth 使用真实公网地址。
2. 确保最终部署结果不依赖 bootstrap URL。

### Phase 4: 验证

至少完成以下验证：

1. 打开首页 URL，确认返回 200。
2. 检查 `/api/auth/*` 与 `/api/trpc/*` 路由未因环境变量缺失而崩溃。
3. 如有需要，运行：

```bash
pnpm check-types
```

### Phase 5: 状态同步

部署成功后必须：

1. 更新 `specs/TASKS_BACKLOG.md`「Cycle 历史」表，新增 `DEPLOY` 行标记为 `✅ 完成`。
2. 写入最终公网 URL 到 `docs/PRD.md` 或项目 README。

## 强制规则

- **优先复用现有基础设施**：必须通过 `sst.config.ts` 和 `pnpm deploy:aws` 部署，不要另起一套 AWS 资源编排方案。
- **无域名也必须可部署**：如果没有 `APP_DOMAIN`，必须走“两段式部署”拿到 CloudFront URL。
- **成本控制**：严禁创建 NAT Gateway、RDS、VPC 自建数据库等高成本资源。
- **数据库约束**：必须使用 Neon，不得改成本地 SQLite 或自建数据库来规避部署。
- **密钥处理**：只允许将密钥写入本机 `.env`，不得写入被提交的文档、源码或 Markdown。
- **结果导向**：命令结束时必须给出可访问公网链接，而不是只停留在“配置已完成”。

## 失败处理

如果部署失败，必须优先按以下顺序排查并修复：

1. AWS 凭证无效或区域错误
2. `.env` 缺少 `DATABASE_URL` / `BETTER_AUTH_SECRET`
3. Prisma 无法连接 Neon
4. SST / Next.js 构建失败
5. 首次部署后未将 CloudFront URL 回填到认证配置

## 触发命令

运行 `/gz:deploy` 开始一键部署到 AWS。
