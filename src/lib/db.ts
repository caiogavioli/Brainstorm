import { PrismaClient } from "@prisma/client";

// Reaproveita a instância entre hot-reloads do Next em desenvolvimento,
// evitando esgotar o pool de conexões.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
