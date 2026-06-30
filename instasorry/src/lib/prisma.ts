import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

function getDbUrl(): string {
  const url = process.env.DATABASE_URL;
  if (url && !url.startsWith("file:./")) return url;

  // Para SQLite local, converte caminho relativo em absoluto
  // para garantir que funcione independente do cwd do processo Next.js
  if (url && url.startsWith("file:./")) {
    const relativePath = url.replace("file:./", "");
    const absolutePath = path.resolve(process.cwd(), relativePath);
    return `file:${absolutePath}`;
  }

  const absolutePath = path.resolve(process.cwd(), "prisma/dev.db");
  return `file:${absolutePath}`;
}

function createPrismaClient() {
  const url = getDbUrl();
  const adapter = new PrismaLibSql({ url });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
