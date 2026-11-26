import { PrismaClient } from "@prisma/client";
import path from "path";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | null };

function createPrismaClient(): PrismaClient | null {
  try {
    const dbPath = path.join(process.cwd(), "prisma", "dev.db");
    const url = `file:${dbPath}`;

    return new PrismaClient({
      datasources: {
        db: {
          url,
        },
      },
      log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
    });
  } catch (e) {
    console.error("Gagal menginisialisasi PrismaClient:", e);
    return null;
  }
}

// Gunakan Proxy agar pemanggilan prisma tidak pernah melempar fatal exception di level runtime modul
export const prisma: any = new Proxy(
  {},
  {
    get(target, prop) {
      if (!globalForPrisma.prisma) {
        globalForPrisma.prisma = createPrismaClient();
      }
      if (globalForPrisma.prisma && prop in globalForPrisma.prisma) {
        const val = (globalForPrisma.prisma as any)[prop];
        if (typeof val === "function") {
          return val.bind(globalForPrisma.prisma);
        }
        return val;
      }
      // Kembalikan proxy model dummy yang selalu return promise reject tertangkap try-catch
      return new Proxy(
        {},
        {
          get(targetModel, modelMethod) {
            return async () => {
              throw new Error(`Prisma unavailable in serverless environment for ${String(prop)}.${String(modelMethod)}`);
            };
          },
        }
      );
    },
  }
);
