import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { protectedProcedure, router } from "../index";

export const userRouter = router({
  getProfile: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        emailVerified: true,
        image: true,
        credits: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new TRPCError({ code: "NOT_FOUND", message: "User not found" });
    }

    return user;
  }),

  updateProfile: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name cannot be empty").max(100).trim(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { name: input.name },
        select: {
          id: true,
          name: true,
          email: true,
          emailVerified: true,
          image: true,
          credits: true,
        },
      });

      return updated;
    }),
});
