import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import path from "path";

// Instância local de Prisma para auth (não usa o singleton global)
function getAuthPrisma() {
  const url = process.env.DATABASE_URL ?? `file:${path.resolve(process.cwd(), "prisma/dev.db")}`;
  const resolvedUrl = url.startsWith("file:./")
    ? `file:${path.resolve(process.cwd(), url.replace("file:./", ""))}`
    : url;
  const adapter = new PrismaLibSql({ url: resolvedUrl });
  return new PrismaClient({ adapter });
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  // JWT puro — sem banco para sessões (mais simples e robusto)
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET ?? "fallback-secret-change-in-production",
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const prisma = getAuthPrisma();
        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user?.passwordHash) return null;

          const valid = await bcrypt.compare(
            credentials.password as string,
            user.passwordHash
          );

          if (!valid) return null;

          return { id: user.id, email: user.email, name: user.name, image: user.image };
        } catch {
          return null;
        } finally {
          await prisma.$disconnect();
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token?.id) session.user.id = token.id as string;
      return session;
    },
  },
});
