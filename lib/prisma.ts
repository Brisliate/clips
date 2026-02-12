import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
    })
  : null;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient(
    pool
      ? {
          adapter: {
            query: pool.query.bind(pool),
            execute: pool.query.bind(pool),
          },
          log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
        }
      : {
          log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
        }
  );

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
