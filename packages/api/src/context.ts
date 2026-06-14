import { auth } from "@headshot-studio/auth";
import prisma from "@headshot-studio/db";
import type { NextRequest } from "next/server";

export async function createContext(req: NextRequest) {
  const session = await auth.api.getSession({
    headers: req.headers,
  });
  return {
    db: prisma,
    auth: session?.user ?? null,
    session,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
