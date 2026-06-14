import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../index";

export const photoRouter = router({
  // List photos for a generation
  list: protectedProcedure
    .input(
      z.object({
        generationId: z.string(),
        cursor: z.string().optional(),
        limit: z.number().min(1).max(100).default(20),
      }),
    )
    .query(async ({ ctx, input }) => {
      // Verify generation belongs to user
      const generation = await ctx.db.generation.findFirst({
        where: {
          id: input.generationId,
          userId: ctx.session.user.id,
        },
      });

      if (!generation) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Generation not found",
        });
      }

      const photos = await ctx.db.photo.findMany({
        take: input.limit + 1,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        where: { generationId: input.generationId },
        orderBy: { createdAt: "desc" },
      });

      let nextCursor: string | undefined = undefined;
      if (photos.length > input.limit) {
        const nextItem = photos.pop();
        nextCursor = nextItem?.id;
      }

      return { photos, nextCursor };
    }),

  // Toggle favorite status
  toggleFavorite: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const photo = await ctx.db.photo.findFirst({
        where: {
          id: input.id,
          generation: {
            userId: ctx.session.user.id,
          },
        },
      });

      if (!photo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Photo not found",
        });
      }

      const updated = await ctx.db.photo.update({
        where: { id: input.id },
        data: { isFavorite: !photo.isFavorite },
      });

      return updated;
    }),

  // Get download URL (presigned URL from S3)
  download: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const photo = await ctx.db.photo.findFirst({
        where: {
          id: input.id,
          generation: {
            userId: ctx.session.user.id,
          },
        },
      });

      if (!photo) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Photo not found",
        });
      }

      // TODO: Generate presigned URL from S3
      // const url = await getPresignedUrl(photo.url);

      return {
        url: photo.url,
        expiresAt: new Date(Date.now() + 3600 * 1000), // 1 hour
      };
    }),
});
