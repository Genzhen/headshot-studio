# AWS Lambda 部署指南

本项目使用 `SST + OpenNext` 将 `apps/web` 部署到 AWS，运行形态是：

- CloudFront
- S3 静态资源
- Lambda 处理 Next.js SSR / Route Handlers / tRPC / Better Auth

## 先决条件

1. 已安装并配置 AWS CLI
2. AWS 凭证可用
3. 已在仓库根目录准备 `.env`
4. 已有可用的 Neon `DATABASE_URL`
5. 部署 IAM 用户至少要有 `CloudFormation / IAM / Lambda / S3 / CloudFront / Logs / SSM` 权限

推荐在部署前确认：

- `BETTER_AUTH_SECRET` 至少 32 位
- 如果有自定义域名，`BETTER_AUTH_URL` 与 `CORS_ORIGIN` 指向最终访问域名
- 如果没有自定义域名，可以先留空，首次部署后回填 CloudFront URL
- 如果想直接使用正式域名，设置 `APP_DOMAIN`

## 环境变量

最少需要：

```bash
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=your-secure-random-secret-at-least-32-chars-long
BETTER_AUTH_URL=
CORS_ORIGIN=
AWS_REGION=us-east-1
APP_DOMAIN=
```

说明：

- `APP_DOMAIN` 是可选的
- 设置了 `APP_DOMAIN` 后，`sst.config.ts` 会自动把认证 URL 和 CORS 默认到这个域名
- 如果 `APP_DOMAIN`、`BETTER_AUTH_URL`、`CORS_ORIGIN` 都为空，当前配置会先使用 bootstrap 值完成第一次部署

## 部署步骤

1. 安装依赖

```bash
pnpm install
```

2. 生成 Prisma Client

```bash
pnpm db:generate
```

3. 推送数据库 schema

```bash
pnpm db:push
```

4. 首次部署到 AWS

```bash
pnpm deploy:aws --stage production
```

5. 记录 SST 输出的公网 URL

如果没有自定义域名，把这个 URL 回填到根目录 `.env`：

```bash
BETTER_AUTH_URL=https://你的-cloudfront-url
CORS_ORIGIN=https://你的-cloudfront-url
```

6. 第二次部署，固化 Better Auth 地址

```bash
pnpm deploy:aws --stage production
```

7. 查看最终 URL

SST 部署完成后会输出 `url`。没有自定义域名时，这里通常就是 CloudFront 公网地址。

## IAM 策略

如果部署用户权限还没收敛好，可以直接参考：

- [aws-iam-deployer-policy.json](/Users/gz/Desktop/Advance/Task/week_two/headshot-studio/docs/aws-iam-deployer-policy.json)

当前项目已确认 `SST` 首次部署至少需要读取 `SSM` 下的 `/sst/bootstrap` 参数。

## 本地联调 AWS 基础设施

```bash
pnpm dev:aws
```

这会通过 SST 启动云资源代理，并在本地运行 Next.js。

## 删除非生产环境

```bash
pnpm remove:aws --stage dev
```

生产环境在 `sst.config.ts` 中配置为 `retain`，避免误删。

## 当前部署配置

当前 `sst.config.ts` 做了这些约束：

- 部署路径固定为 `apps/web`
- Lambda Runtime 使用 `nodejs22.x`
- Server Lambda: `1024 MB / 30 seconds`
- Image Optimization Lambda: `1024 MB`
- `production` 阶段等待 CloudFront invalidation 完成

## 注意事项

- 这个项目使用 Neon Serverless + Prisma，适合 Lambda 的无状态运行方式
- Better Auth 依赖 `BETTER_AUTH_URL` / `CORS_ORIGIN`，无域名部署时要在首次部署后回填真实 CloudFront URL
- 如果后续要做大文件上传，不建议直接穿过 Next.js Route Handler，优先改成 S3 presigned URL
