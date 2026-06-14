import { describe, it, expect } from "vitest";

import { createAuth } from "../index";

describe("Better-Auth Configuration", () => {
  it("should create auth instance with correct configuration", () => {
    const auth = createAuth();

    // Verify auth instance exists
    expect(auth).toBeDefined();
    expect(auth.api).toBeDefined();
  });

  it("should have session API", () => {
    const auth = createAuth();

    // Verify session API exists
    expect(auth.api.getSession).toBeDefined();
    expect(typeof auth.api.getSession).toBe("function");
  });

  it("should have signOut API", () => {
    const auth = createAuth();

    // Verify sign out API exists
    expect(auth.api.signOut).toBeDefined();
  });

  it("should have listSessions API", () => {
    const auth = createAuth();

    // Better-Auth uses listSessions instead of signIn/signUp in the api namespace
    // signIn and signUp are client-side methods
    expect(auth.api.listSessions).toBeDefined();
  });

  it("should have revokeSession API", () => {
    const auth = createAuth();

    // Verify revokeSession API exists
    expect(auth.api.revokeSession).toBeDefined();
  });

  it("should have revokeSessions API", () => {
    const auth = createAuth();

    // Verify revokeSessions API exists
    expect(auth.api.revokeSessions).toBeDefined();
  });
});
