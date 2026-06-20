# /gz:payments — 支付系统集成专家

你现在是 GZ 支付系统集成专家，负责实现完整的支付流程、Credits 系统和订阅管理。

## 执行前置

执行前先确认：

1. 读取 `docs/PRD.md` 了解定价策略
2. 读取 `packages/db/prisma/schema.prisma` 了解数据模型
3. 读取 `apps/web/src/app/pricing/page.tsx` 了解前端页面
4. 确认支付服务选型 (Stripe / Polar / LemonSqueezy)

## 输入约定

用户需要提供：

1. **支付服务选择**:
   - Stripe (推荐，功能最全)
   - Polar (开源，自托管)
   - LemonSqueezy (简单，MoR 模式)

2. **环境变量**:
   ```bash
   # Stripe
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   
   # 通用
   CURRENCY=usd
   SUCCESS_URL=https://app.example.com/dashboard?success=true
   CANCEL_URL=https://app.example.com/pricing?canceled=true
   ```

3. **定价方案**:
   ```typescript
   const packages = [
     { name: "Basic", credits: 50, price: 999 },    // $9.99
     { name: "Pro", credits: 150, price: 2499 },    // $24.99
     { name: "Enterprise", credits: 500, price: 7999 } // $79.99
   ];
   ```

## 执行节点

### N1: 支付选型

**任务**: 选择支付服务商

**比较**:
```markdown
## Stripe
优点: 功能最全、文档完善、全球支持、订阅管理
缺点: 手续费较高 (2.9% + 30¢)、需要自己处理合规
推荐: 大多数场景

## Polar
优点: 开源免费、自托管、完全控制
缺点: 需要自己维护、需要处理合规
推荐: 需要完全控制

## LemonSqueezy
优点: 简单、MoR 模式、内置税务处理
缺点: 手续费较高 (5% + 50¢)、功能较少
推荐: 快速启动
```

**决策**: 默认使用 Stripe

### N2: 数据模型

**任务**: 更新数据库 Schema

```prisma
// packages/db/prisma/schema/payment.prisma

model CreditPackage {
  id            String   @id @default(cuid())
  name          String   // "Basic", "Pro", "Enterprise"
  credits       Int      // 包含的 credits 数量
  price         Int      // 价格 (分)
  currency      String   @default("usd")
  stripePriceId String   @unique
  isActive      Boolean  @default(true)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  @@index([stripePriceId])
  @@map("credit_package")
}

model UserCredit {
  id        String   @id @default(cuid())
  userId    String   @unique
  credits   Int      @default(0)
  updatedAt DateTime @updatedAt
  
  @@map("user_credit")
}

model CreditTransaction {
  id          String   @id @default(cuid())
  userId      String
  amount      Int      // 正数=充值，负数=消费
  type        String   // PURCHASE, GENERATION, REFUND, BONUS
  referenceId String?  // 关联的 generationId 或 stripePaymentId
  description String?
  createdAt   DateTime @default(now())
  
  @@index([userId, createdAt])
  @@map("credit_transaction")
}

model Payment {
  id                String   @id @default(cuid())
  userId            String
  stripePaymentId   String   @unique
  stripeSessionId   String?  @unique
  packageId         String
  credits           Int
  amount            Int      // 金额 (分)
  currency          String   @default("usd")
  status            String   // PENDING, COMPLETED, FAILED, REFUNDED
  createdAt         DateTime @default(now())
  completedAt       DateTime?
  
  @@index([userId, status])
  @@index([stripePaymentId])
  @@map("payment")
}
```

**执行**:
```bash
pnpm db:generate
pnpm db:push
```

### N3: 结账流程

**任务**: 实现 Stripe 集成

**安装依赖**:
```bash
pnpm add stripe
```

**实现支付 API**:
```typescript
// packages/api/src/routers/payment.ts
import { z } from 'zod';
import Stripe from 'stripe';
import { protectedProcedure, publicProcedure, router } from '../index';
import { TRPCError } from '@trpc/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export const paymentRouter = router({
  // 获取所有套餐
  getPackages: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.creditPackage.findMany({
      where: { isActive: true },
      orderBy: { price: 'asc' },
    });
  }),
  
  // 创建结账会话
  createCheckoutSession: protectedProcedure
    .input(z.object({ packageId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const package_ = await ctx.db.creditPackage.findUnique({
        where: { id: input.packageId },
      });
      
      if (!package_) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Package not found',
        });
      }
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [{
          price: package_.stripePriceId,
          quantity: 1,
        }],
        mode: 'payment',
        success_url: process.env.SUCCESS_URL!,
        cancel_url: process.env.CANCEL_URL!,
        customer_email: ctx.session.user.email,
        client_reference_id: ctx.session.user.id,
        metadata: {
          userId: ctx.session.user.id,
          packageId: package_.id,
          credits: package_.credits.toString(),
        },
      });
      
      await ctx.db.payment.create({
        data: {
          userId: ctx.session.user.id,
          stripePaymentId: session.id,
          packageId: package_.id,
          credits: package_.credits,
          amount: package_.price,
          status: 'PENDING',
        },
      });
      
      return { sessionId: session.id, url: session.url };
    }),
  
  // 获取用户余额
  getBalance: protectedProcedure.query(async ({ ctx }) => {
    const credit = await ctx.db.userCredit.findUnique({
      where: { userId: ctx.session.user.id },
    });
    
    return { credits: credit?.credits || 0 };
  }),
  
  // 获取交易历史
  getTransactions: protectedProcedure
    .input(z.object({
      cursor: z.string().optional(),
      limit: z.number().min(1).max(100).default(20),
    }))
    .query(async ({ ctx, input }) => {
      const transactions = await ctx.db.creditTransaction.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: { userId: ctx.session.user.id },
        orderBy: { createdAt: 'desc' },
      });
      
      let nextCursor: string | undefined = undefined;
      if (transactions.length > input.limit) {
        const nextItem = transactions.pop();
        nextCursor = nextItem?.id;
      }
      
      return { transactions, nextCursor };
    }),
});
```

### N4: Webhook 处理

**任务**: 实现 Stripe Webhook

```typescript
// apps/web/src/app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import prisma from '@headshot-studio/db';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;
  
  let event: Stripe.Event;
  
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }
  
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
      break;
    case 'payment_intent.payment_failed':
      await handlePaymentFailed(event.data.object as Stripe.PaymentIntent);
      break;
    case 'charge.refunded':
      await handleChargeRefunded(event.data.object as Stripe.Charge);
      break;
  }
  
  return NextResponse.json({ received: true });
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const { userId, packageId, credits } = session.metadata!;
  
  await prisma.$transaction(async (tx) => {
    // 1. 更新 Payment 状态
    await tx.payment.update({
      where: { stripePaymentId: session.payment_intent as string },
      data: { status: 'COMPLETED', completedAt: new Date() },
    });
    
    // 2. 更新 UserCredit
    await tx.userCredit.upsert({
      where: { userId },
      update: { credits: { increment: parseInt(credits) } },
      create: { userId, credits: parseInt(credits) },
    });
    
    // 3. 创建交易记录
    await tx.creditTransaction.create({
      data: {
        userId,
        amount: parseInt(credits),
        type: 'PURCHASE',
        referenceId: session.payment_intent as string,
        description: `Purchased ${credits} credits`,
      },
    });
  });
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  await prisma.payment.update({
    where: { stripePaymentId: paymentIntent.id },
    data: { status: 'FAILED' },
  });
}

async function handleChargeRefunded(charge: Stripe.Charge) {
  const payment = await prisma.payment.findUnique({
    where: { stripePaymentId: charge.payment_intent as string },
  });
  
  if (!payment) return;
  
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: { status: 'REFUNDED' },
    });
    
    await tx.userCredit.update({
      where: { userId: payment.userId },
      data: { credits: { decrement: payment.credits } },
    });
    
    await tx.creditTransaction.create({
      data: {
        userId: payment.userId,
        amount: -payment.credits,
        type: 'REFUND',
        referenceId: payment.id,
        description: 'Refund for payment',
      },
    });
  });
}
```

### N5: Credits 系统

**任务**: 实现 Credits 消费逻辑

```typescript
// packages/api/src/routers/generation.ts (修改 create 方法)
create: protectedProcedure
  .input(z.object({
    style: z.enum(['EXECUTIVE', 'CREATIVE', 'OUTDOOR']),
    photoCount: z.number().min(10).max(100).default(40),
    prompt: z.string().optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    const creditsRequired = input.photoCount; // 1 photo = 1 credit
    
    const result = await ctx.db.$transaction(async (tx) => {
      // 1. 检查用户余额
      const credit = await tx.userCredit.findUnique({
        where: { userId: ctx.session.user.id },
      });
      
      const currentBalance = credit?.credits || 0;
      
      if (currentBalance < creditsRequired) {
        throw new TRPCError({
          code: 'PAYMENT_REQUIRED',
          message: `Insufficient credits. Required: ${creditsRequired}, Available: ${currentBalance}`,
        });
      }
      
      // 2. 扣减 Credits
      await tx.userCredit.update({
        where: { userId: ctx.session.user.id },
        data: { credits: { decrement: creditsRequired } },
      });
      
      // 3. 创建交易记录
      await tx.creditTransaction.create({
        data: {
          userId: ctx.session.user.id,
          amount: -creditsRequired,
          type: 'GENERATION',
          description: `Generate ${input.photoCount} photos`,
        },
      });
      
      // 4. 创建 Generation 记录
      const generation = await tx.generation.create({
        data: {
          userId: ctx.session.user.id,
          style: input.style,
          photoCount: input.photoCount,
          prompt: input.prompt,
          status: 'PENDING',
        },
      });
      
      return generation;
    });
    
    // 5. 触发 AI 生成 (异步)
    try {
      await triggerAIGeneration(result.id);
    } catch (error) {
      // 如果触发失败，退还 Credits
      await ctx.db.$transaction(async (tx) => {
        await tx.userCredit.update({
          where: { userId: ctx.session.user.id },
          data: { credits: { increment: creditsRequired } },
        });
        
        await tx.creditTransaction.create({
          data: {
            userId: ctx.session.user.id,
            amount: creditsRequired,
            type: 'REFUND',
            description: 'Refund for failed generation',
          },
        });
        
        await tx.generation.update({
          where: { id: result.id },
          data: { status: 'FAILED' },
        });
      });
      
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to trigger AI generation',
      });
    }
    
    return result;
  }),
```

### N6: 退款处理

**任务**: 实现自动退款机制

```typescript
// packages/functions/src/refund-on-failure.ts
export async function handleGenerationFailure(generationId: string) {
  const generation = await prisma.generation.findUnique({
    where: { id: generationId },
    include: { user: true },
  });
  
  if (!generation) return;
  
  const creditsToRefund = generation.photoCount;
  
  await prisma.$transaction(async (tx) => {
    // 1. 退还 Credits
    await tx.userCredit.update({
      where: { userId: generation.userId },
      data: { credits: { increment: creditsToRefund } },
    });
    
    // 2. 创建交易记录
    await tx.creditTransaction.create({
      data: {
        userId: generation.userId,
        amount: creditsToRefund,
        type: 'REFUND',
        referenceId: generation.id,
        description: 'Refund for failed generation',
      },
    });
    
    // 3. 更新 Generation 状态
    await tx.generation.update({
      where: { id: generationId },
      data: { status: 'FAILED' },
    });
  });
  
  // 4. 发送退款通知邮件
  await sendRefundEmail(generation.user.email, creditsToRefund);
}
```

### N7: 对账系统

**任务**: 实现对账功能

```typescript
// packages/api/src/routers/admin.ts
import { adminProcedure, router } from '../index';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const adminRouter = router({
  reconcile: adminProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
    }))
    .query(async ({ ctx, input }) => {
      const start = new Date(input.startDate);
      const end = new Date(input.endDate);
      
      // 1. 获取 Stripe 收入
      const stripeTransactions = await stripe.balanceTransactions.list({
        created: {
          gte: Math.floor(start.getTime() / 1000),
          lte: Math.floor(end.getTime() / 1000),
        },
      });
      
      const stripeTotal = stripeTransactions.data
        .filter(t => t.type === 'payment')
        .reduce((sum, t) => sum + t.amount, 0);
      
      // 2. 获取本地收入
      const localPayments = await ctx.db.payment.findMany({
        where: {
          status: 'COMPLETED',
          createdAt: { gte: start, lte: end },
        },
      });
      
      const localTotal = localPayments.reduce((sum, p) => sum + p.amount, 0);
      
      // 3. 对比
      const difference = stripeTotal - localTotal;
      
      return {
        stripeTotal,
        localTotal,
        difference,
        matched: difference === 0,
        transactions: localPayments.length,
      };
    }),
});
```

### N8: 合规检查

**任务**: 确保符合支付合规要求

```markdown
## PCI DSS 合规检查清单

### 必须做的:
- [x] 使用 Stripe.js (不接触信用卡数据)
- [x] HTTPS 全站加密
- [x] 环境变量安全存储
- [x] Webhook 签名验证
- [ ] 定期安全扫描
- [ ] 访问日志记录

### 不需要做的:
- [x] 存储信用卡数据 (Stripe 处理)
- [x] 处理退款争议 (Stripe 处理)
- [x] 税务计算 (Stripe 处理)
```

```typescript
// packages/functions/src/compliance-check.ts
export async function runComplianceCheck() {
  const checks = [
    {
      name: 'HTTPS Enabled',
      check: () => process.env.NODE_ENV === 'production',
    },
    {
      name: 'Webhook Secret Configured',
      check: () => !!process.env.STRIPE_WEBHOOK_SECRET,
    },
  ];
  
  const results = await Promise.all(
    checks.map(async (check) => ({
      name: check.name,
      passed: await check.check(),
    }))
  );
  
  const allPassed = results.every(r => r.passed);
  
  if (!allPassed) {
    throw new Error('Compliance check failed');
  }
  
  return results;
}
```

## 强制规则

- **必须使用幂等性**: 防止重复扣费
- **必须实现 Webhook 签名验证**: 确保请求来自 Stripe
- **必须记录所有交易**: 每笔交易都必须有记录
- **必须支持退款**: 生成失败必须自动退款
- **必须使用事务**: Credits 操作必须是原子的
- **必须符合 PCI DSS**: 不存储信用卡数据

## 失败处理

### 支付失败
1. 检查 Stripe 账户状态
2. 检查 API Key 是否正确
3. 检查 Webhook 配置
4. 查看 Stripe 日志

### Credits 不同步
1. 检查事务是否完整
2. 手动对账
3. 修复数据
4. 分析原因

### Webhook 失败
1. 检查 Webhook URL 是否可访问
2. 检查签名验证
3. 查看 Webhook 日志
4. 手动重试

## 触发命令

运行 `/gz:payments` 开始支付系统集成。
