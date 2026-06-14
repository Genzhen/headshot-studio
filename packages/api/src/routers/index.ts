import { protectedProcedure, publicProcedure, router } from "../index";
import { generationRouter } from "./generation";
import { photoRouter } from "./photo";

export const appRouter = router({
  healthCheck: publicProcedure.query(() => {
    return "OK";
  }),

  privateData: protectedProcedure.query(({ ctx }) => {
    return {
      message: "This is private",
      user: ctx.session?.user,
    };
  }),

  generation: generationRouter,
  photo: photoRouter,
});

export type AppRouter = typeof appRouter;
