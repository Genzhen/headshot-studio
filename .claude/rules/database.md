# 数据库开发规则

## Neon Serverless + Prisma

### 配置概览

```
数据库: PostgreSQL (Neon Serverless)
ORM: Prisma 7.x
适配器: @prisma/adapter-neon
连接池: Neon Serverless Driver
```

### 客户端初始化

```typescript
// packages/db/src/index.ts
import { env } from '@headshot-studio/env/server';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '../prisma/generated/client';

export function createPrismaClient() {
  const adapter = new PrismaNeon({
    connectionString: env.DATABASE_URL,
  });

  return new PrismaClient({
    adapter,
    // 日志配置 (开发环境)
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'info', 'warn', 'error']
      : ['error'],
  });
}

// 单例模式 - 避免开发环境热重载时创建多个客户端
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient>;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;
```

### 连接池配置

Neon Serverless 使用 HTTP 协议，自动管理连接：

```typescript
// @prisma/adapter-neon 自动处理：
// - 连接池管理
// - 自动重连
// - 连接复用
// - 无状态连接

// 连接字符串格式
// postgresql://user:password@host.neon.tech/database?sslmode=require
```

### 环境变量

```bash
# .env
DATABASE_URL=postgresql://user:password@ep-xxx-xxx.region.aws.neon.tech/headshot_studio?sslmode=require
```

## Schema 设计

### 目录结构

```
packages/db/prisma/
├── schema/
│   ├── schema.prisma    # 主配置
│   ├── auth.prisma      # 认证模型
│   └── [feature].prisma # 按功能拆分
└── generated/           # 生成的客户端
```

### 基础配置

```prisma
// schema/schema.prisma
generator client {
  provider = "prisma-client"
  output   = "../generated"
  moduleFormat = "esm"
}

datasource db {
  provider = "postgresql"
}
```

### 认证模型 (Better-Auth)

```prisma
// schema/auth.prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  sessions      Session[]
  accounts      Account[]

  @@unique([email])
  @@map("user")
}

model Session {
  id        String   @id @default(cuid())
  expiresAt DateTime
  token     String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([token])
  @@index([userId])
  @@map("session")
}

model Account {
  id                    String    @id @default(cuid())
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt

  @@index([userId])
  @@map("account")
}

model Verification {
  id         String   @id @default(cuid())
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt

  @@index([identifier])
  @@map("verification")
}
```

## 开发规范

### 查询优化

```typescript
// ❌ 错误：N+1 查询
const users = await prisma.user.findMany();
for (const user of users) {
  const sessions = await prisma.session.findMany({
    where: { userId: user.id }
  });
}

// ✅ 正确：使用 include
const users = await prisma.user.findMany({
  include: {
    sessions: true,
  }
});
```

### 事务处理

```typescript
// 顺序事务 - 自动重试
const result = await prisma.$transaction(async (tx) => {
  const user = await tx.user.create({
    data: { email: 'user@example.com', name: 'User' }
  });

  const session = await tx.session.create({
    data: {
      userId: user.id,
      token: generateToken(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    }
  });

  return { user, session };
});
```

### 分页查询

```typescript
// 游标分页 - 性能更好
const PAGE_SIZE = 20;

export const listImages = protectedProcedure
  .input(z.object({
    cursor: z.string().optional(),
    limit: z.number().min(1).max(100).default(20),
  }))
  .query(async ({ input, ctx }) => {
    const images = await ctx.db.image.findMany({
      take: input.limit + 1, // 多取一条判断是否有下一页
      cursor: input.cursor ? { id: input.cursor } : undefined,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, image: true } } },
    });

    let nextCursor: string | undefined = undefined;
    if (images.length > input.limit) {
      const nextItem = images.pop();
      nextCursor = nextItem?.id;
    }

    return { images, nextCursor };
  });
```

### 软删除

```prisma
model Image {
  id        String    @id @default(cuid())
  userId    String
  url       String
  prompt    String
  deletedAt DateTime? // 软删除字段
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([userId, deletedAt])
}
```

```typescript
// 软删除查询
const activeImages = await prisma.image.findMany({
  where: { deletedAt: null }
});

// 软删除操作
await prisma.image.update({
  where: { id: imageId },
  data: { deletedAt: new Date() }
});
```

## 数据库命令

```bash
# 生成客户端 (schema 变更后)
pnpm db:generate

# 推送 schema 变更到数据库 (开发环境)
pnpm db:push

# 创建迁移文件
pnpm db:migrate

# 打开 Prisma Studio
pnpm db:studio
```

## 生产环境注意事项

### 连接限制

- Neon Serverless 自动管理连接池
- 无需担心连接数限制
- 适合 Lambda 等无状态环境

### 备份

- Neon 自动备份 (Point-in-time recovery)
- 生产环境建议开启 PITR

### 监控

```typescript
// 查询性能监控
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();

  const duration = after - before;
  if (duration > 1000) {
    console.warn(`Slow query: ${params.model}.${params.action} took ${duration}ms`);
  }

  return result;
});
```

### 索引策略

```prisma
// 常用查询模式需要索引
model Image {
  userId    String
  status    String   // PENDING, PROCESSING, COMPLETED, FAILED
  createdAt DateTime

  // 复合索引
  @@index([userId, status])
  @@index([status, createdAt])
}
```
