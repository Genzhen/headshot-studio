import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../index";

export const generationRouter = router({
  // List user's generations
  list: protectedProcedure
    .input(
      z.object({
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      const generations = await ctx.db.generation.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: { userId: ctx.session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
          _count: { select: { photos: true } },
        },
      });

      let nextCursor: string | undefined = undefined;
      if (generations.length > input.limit) {
        const nextItem = generations.pop();
        nextCursor = nextItem?.id;
      }

      return { generations, nextCursor };
    }),

  // Get generation by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const generation = await ctx.db.generation.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          photos: true,
        },
      });

      if (!generation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Generation not found",
        });
      }

      return generation;
    }),

  // Create new generation
  create: protectedProcedure
    .input(
      z.object({
        style: z.enum(["EXECUTIVE", "CREATIVE", "OUTDOOR"]).default("EXECUTIVE"),
        photoCount: z.number().min(10).max(100).default(40),
        prompt: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const generation = await ctx.db.generation.create({
        data: {
          userId: ctx.session.user.id,
          style: input.style,
          photoCount: input.photoCount,
          prompt: input.prompt,
          status: "PENDING",
        },
      });

      // TODO: Trigger AI generation job
      // await triggerAIGeneration(generation.id);

      return generation;
    }),

  // Get generation status
  status: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const generation = await ctx.db.generation.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
          status: true,
          photoCount: true,
          createdAt: true,
          completedAt: true,
          _count: { select: { photos: true } },
        },
      });

      if (!generation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Generation not found",
        });
      }

      return generation;
    }),
});
