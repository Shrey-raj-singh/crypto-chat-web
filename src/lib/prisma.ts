import { PrismaClient } from "@prisma/client";

declare global {
  // Avoid redeclaration of global variables during hot reloads
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query", "warn", "error"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export default prisma;
