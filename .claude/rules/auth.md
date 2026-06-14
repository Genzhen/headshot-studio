# 认证开发规则

## Better-Auth 配置

### 核心配置

```typescript
// packages/auth/src/index.ts
import { createPrismaClient } from '@headshot-studio/db';
import { env } from '@headshot-studio/env/server';
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';

export function createAuth() {
  const prisma = createPrismaClient();

  return betterAuth({
    // 数据库配置
    database: prismaAdapter(prisma, {
      provider: 'postgresql',
    }),

    // 安全配置
    trustedOrigins: [env.CORS_ORIGIN],
    secret: env.BETTER_AUTH_SECRET, // 至少 32 字符
    baseURL: env.BETTER_AUTH_URL,

    // 认证方式
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // 生产环境建议开启
    },

    // Next.js 集成
    plugins: [nextCookies()],
  });
}

export const auth = createAuth();
```

### 环境变量

```bash
# 必需
BETTER_AUTH_SECRET=your-secure-random-secret-at-least-32-chars-long
BETTER_AUTH_URL=https://api.headshot-studio.com
CORS_ORIGIN=https://headshot-studio.com

# 可选 (OAuth)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
```

## API 使用

### 会话管理

```typescript
// 获取当前会话
import { auth } from '@headshot-studio/auth';

const session = await auth.api.getSession({
  headers: request.headers,
});

if (!session) {
  // 未认证
  throw new Error('Not authenticated');
}

// 会话包含 user 和 session 信息
const { user, session: sessionData } = session;
```

### tRPC 上下文集成

```typescript
// packages/api/src/context.ts
import { auth } from '@headshot-studio/auth';
import type { NextRequest } from 'next/server';
import prisma from '@headshot-studio/db';

export async function createContext(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });

  return {
    db: prisma,
    auth: session?.user ?? null,
    session: session ?? null,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
```

### 受保护路由

```typescript
// packages/api/src/trpc.ts
import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';

export const t = initTRPC.context<Context>().create();
export const router = t.router;
export const publicProcedure = t.procedure;

// 受保护路由 - 需要认证
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.session) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'Authentication required',
      cause: 'No session',
    });
  }

  return next({
    ctx: {
      ...ctx,
      session: ctx.session, // 类型安全
    },
  });
});

// 管理员路由 - 需要管理员权限
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.auth.role !== 'ADMIN') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required',
    });
  }

  return next({ ctx });
});
```

## 路由处理

### Next.js API 路由

```typescript
// apps/web/src/app/api/auth/[...all]/route.ts
import { auth } from '@headshot-studio/auth';
import { toNextJsHandler } from 'better-auth/next-js';

export const { GET, POST } = toNextJsHandler(auth);
```

### 认证端点

```
POST /api/auth/sign-up/email    # 注册
POST /api/auth/sign-in/email    # 登录
POST /api/auth/sign-out         # 登出
GET  /api/auth/get-session      # 获取会话
POST /api/auth/verify-email     # 验证邮箱
POST /api/auth/reset-password   # 重置密码
```

## 前端使用

### 客户端认证

```typescript
// apps/web/src/lib/auth-client.ts
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// 导出常用 hooks
export const {
  signIn,
  signUp,
  signOut,
  useSession,
} = authClient;
```

### React 组件使用

```typescript
'use client';

import { useSession, signIn, signOut } from '@/lib/auth-client';

export function AuthButton() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return (
      <button onClick={() => signIn.email({
        email: 'user@example.com',
        password: 'password',
      })}>
        Sign In
      </button>
    );
  }

  return (
    <div>
      <span>Welcome, {session.user.name}</span>
      <button onClick={() => signOut()}>Sign Out</button>
    </div>
  );
}
```

### Server Component 使用

```typescript
// apps/web/src/app/page.tsx
import { auth } from '@headshot-studio/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function HomePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in');
  }

  return <div>Welcome, {session.user.name}!</div>;
}
```

## 数据模型

### User 模型

```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String
  emailVerified Boolean   @default(false)
  image         String?
  role          String    @default('USER') // USER | ADMIN
  banned        Boolean   @default(false)
  banReason     String?
  banExpires    DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  @@unique([email])
  @@map("user")
}
```

### 自定义用户字段

```typescript
// 扩展用户模型时，同时更新 auth 配置
export function createAuth() {
  return betterAuth({
    // ...
    user: {
      additionalFields: {
        role: {
          type: 'string',
          required: false,
          defaultValue: 'USER',
        },
        credits: {
          type: 'number',
          required: false,
          defaultValue: 0,
        },
      },
    },
  });
}
```

## OAuth 配置

### Google OAuth

```typescript
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  // ...
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
});
```

### GitHub OAuth

```typescript
export const auth = betterAuth({
  // ...
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
```

### 前端 OAuth 登录

```typescript
import { authClient } from '@/lib/auth-client';

// Google 登录
authClient.signIn.social({
  provider: 'google',
  callbackURL: '/dashboard',
});

// GitHub 登录
authClient.signIn.social({
  provider: 'github',
  callbackURL: '/dashboard',
});
```

## 安全最佳实践

### 1. 密钥生成

```bash
# 生成安全的密钥 (至少 32 字符)
openssl rand -base64 32

# 或使用 Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### 2. 会话配置

```typescript
export const auth = betterAuth({
  // ...
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 天
    updateAge: 60 * 60 * 24, // 每天更新
    freshAge: 60 * 60, // 1 小时内视为新鲜会话
  },
});
```

### 3. 速率限制

```typescript
export const auth = betterAuth({
  // ...
  rateLimit: {
    enabled: true,
    window: '1m',
    max: 10, // 每分钟最多 10 次
  },
});
```

### 4. CSRF 保护

Better-Auth 默认启用 CSRF 保护，确保：
- `trustedOrigins` 正确配置
- 生产环境使用 HTTPS

## 调试技巧

```typescript
// 启用调试日志
export const auth = betterAuth({
  // ...
  logger: {
    level: 'debug',
  },
});

// 手动检查会话
const session = await auth.api.getSession({ headers });
console.log('Session:', JSON.stringify(session, null, 2));
```
