import { describe, it, expect } from "vitest";

import { createContext } from "../context";

describe("tRPC Context", () => {
  it("should create context with db and auth", async () => {
    const mockRequest = {
      headers: new Headers(),
    } as any;

    const context = await createContext(mockRequest);

    // Verify context structure
    expect(context).toBeDefined();
    expect(context.db).toBeDefined();
    expect(context.auth).toBeDefined();
    expect(context.session).toBeDefined();
  });

  it("should have null auth for unauthenticated requests", async () => {
    const mockRequest = {
      headers: new Headers(),
    } as any;

    const context = await createContext(mockRequest);

    // Unauthenticated request should have null auth
    expect(context.auth).toBeNull();
    expect(context.session).toBeNull();
  });

  it("should have db client available", async () => {
    const mockRequest = {
      headers: new Headers(),
    } as any;

    const context = await createContext(mockRequest);

    // Verify db client methods exist
    expect(context.db.user).toBeDefined();
    expect(context.db.session).toBeDefined();
    expect(context.db.account).toBeDefined();
    expect(context.db.generation).toBeDefined();
    expect(context.db.photo).toBeDefined();
  });
});
