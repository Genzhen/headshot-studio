import { protectedProcedure, publicProcedure, router } from "../index";
import { generationRouter } from "./generation";
import { photoRouter } from "./photo";
import { uploadRouter } from "./upload";
import { userRouter } from "./user";

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
  upload: uploadRouter,
  user: userRouter,
});

export type AppRouter = typeof appRouter;
