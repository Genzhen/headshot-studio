import { describe, it, expect } from "vitest";

import { createPrismaClient } from "../index";

describe("Prisma Client", () => {
  it("should create prisma client instance", () => {
    const prisma = createPrismaClient();

    expect(prisma).toBeDefined();
  });

  it("should have user model", () => {
    const prisma = createPrismaClient();

    expect(prisma.user).toBeDefined();
    expect(prisma.user.findMany).toBeDefined();
    expect(prisma.user.create).toBeDefined();
    expect(prisma.user.findFirst).toBeDefined();
  });

  it("should have session model", () => {
    const prisma = createPrismaClient();

    expect(prisma.session).toBeDefined();
    expect(prisma.session.findMany).toBeDefined();
    expect(prisma.session.create).toBeDefined();
  });

  it("should have account model", () => {
    const prisma = createPrismaClient();

    expect(prisma.account).toBeDefined();
    expect(prisma.account.findMany).toBeDefined();
  });

  it("should have generation model", () => {
    const prisma = createPrismaClient();

    expect(prisma.generation).toBeDefined();
    expect(prisma.generation.findMany).toBeDefined();
    expect(prisma.generation.create).toBeDefined();
  });

  it("should have photo model", () => {
    const prisma = createPrismaClient();

    expect(prisma.photo).toBeDefined();
    expect(prisma.photo.findMany).toBeDefined();
    expect(prisma.photo.create).toBeDefined();
  });

  it("should have verification model", () => {
    const prisma = createPrismaClient();

    expect(prisma.verification).toBeDefined();
    expect(prisma.verification.findMany).toBeDefined();
  });
});
