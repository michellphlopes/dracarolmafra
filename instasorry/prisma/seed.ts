import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import bcrypt from "bcryptjs";
import "dotenv/config";

const url = process.env.DATABASE_URL ?? "file:./prisma/dev.db";
const adapter = new PrismaLibSql({ url });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...");

  // Usuário de teste
  const passwordHash = await bcrypt.hash("teste1234", 12);

  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 3);

  const user = await prisma.user.upsert({
    where: { email: "teste@instasorry.com" },
    update: {},
    create: {
      name: "Usuário Teste",
      email: "teste@instasorry.com",
      passwordHash,
      subscription: {
        create: {
          plan: "MONTHLY",
          status: "TRIALING",
          trialEndsAt,
        },
      },
      notificationPrefs: {
        create: {},
      },
      instagramAccount: {
        create: {
          username: "usuario_teste",
          fullName: "Usuário Teste",
          followerCount: 500,
          followingCount: 450,
          lastSyncAt: new Date(),
        },
      },
    },
    include: { instagramAccount: true },
  });

  // Cria snapshot de teste
  const account = user.instagramAccount!;

  const followers = Array.from({ length: 500 }, (_, i) => ({
    username: `follower_${i + 1}`,
    fullName: `Seguidor ${i + 1}`,
    profileUrl: `https://instagram.com/follower_${i + 1}/`,
  }));

  const following = Array.from({ length: 450 }, (_, i) => ({
    username: i < 400 ? `follower_${i + 1}` : `only_following_${i + 1}`,
    fullName: `Conta ${i + 1}`,
    profileUrl: `https://instagram.com/conta_${i + 1}/`,
  }));

  const snapshot = await prisma.instagramSnapshot.create({
    data: {
      instagramAccountId: account.id,
      followerCount: followers.length,
      followingCount: following.length,
      followers: { create: followers },
      following: { create: following },
    },
  });

  // Cria alguns eventos de teste
  const eventos = [
    { eventType: "UNFOLLOWED", targetUsername: "ex_seguidor_1", detectedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
    { eventType: "UNFOLLOWED", targetUsername: "ex_seguidor_2", detectedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
    { eventType: "NEW_FOLLOWER", targetUsername: "novo_seguidor_1", detectedAt: new Date() },
  ];
  for (const evt of eventos) {
    await prisma.instagramEvent.create({
      data: { instagramAccountId: account.id, ...evt },
    });
  }

  console.log("✅ Seed completo!");
  console.log("📧 Login: teste@instasorry.com");
  console.log("🔑 Senha: teste1234");
  console.log(`📸 Snapshot ID: ${snapshot.id}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
