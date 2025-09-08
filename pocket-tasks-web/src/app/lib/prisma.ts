// lib/prisma.ts
import type { PrismaClient } from "@/generated/prisma";

let prisma: PrismaClient;

export async function getPrisma(): Promise<PrismaClient> {
  if (!prisma) {
    const { PrismaClient } = await import("@/generated/prisma/client"); // lazy import
    prisma = new PrismaClient({ log: ["query"] });
  }
  return prisma;
}
