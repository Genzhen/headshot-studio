import { describe, it, expect } from "vitest";

import { appRouter } from "../routers/index";

describe("tRPC App Router", () => {
  it("should have healthCheck procedure", () => {
    expect(appRouter.healthCheck).toBeDefined();
  });

  it("should have generation router", () => {
    expect(appRouter.generation).toBeDefined();
    expect(appRouter.generation.list).toBeDefined();
    expect(appRouter.generation.getById).toBeDefined();
    expect(appRouter.generation.create).toBeDefined();
    expect(appRouter.generation.status).toBeDefined();
  });

  it("should have photo router", () => {
    expect(appRouter.photo).toBeDefined();
    expect(appRouter.photo.list).toBeDefined();
    expect(appRouter.photo.toggleFavorite).toBeDefined();
    expect(appRouter.photo.download).toBeDefined();
  });

  it("should execute healthCheck query", async () => {
    const caller = appRouter.createCaller({
      db: {} as any,
      auth: null,
      session: null,
    });

    const result = await caller.healthCheck();
    expect(result).toBe("OK");
  });
});
