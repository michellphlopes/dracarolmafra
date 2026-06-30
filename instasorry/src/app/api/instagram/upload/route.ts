import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseFollowersFile, parseFollowingFile } from "@/services/instagram-parser";
import { computeAndSaveSnapshot } from "@/services/snapshot-diff";
import { sendUnfollowNotification, sendNewFollowerNotification } from "@/services/email";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  // Verifica assinatura ativa
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  if (!subscription || !["ACTIVE", "TRIALING"].includes(subscription.status)) {
    return NextResponse.json({ error: "Assinatura necessária" }, { status: 403 });
  }

  const formData = await req.formData();
  const followersFile = formData.get("followers") as File | null;
  const followingFile = formData.get("following") as File | null;
  const username = formData.get("username") as string | null;

  if (!followersFile || !followingFile) {
    return NextResponse.json(
      { error: "Envie os arquivos de seguidores e seguindo." },
      { status: 400 }
    );
  }

  const followersText = await followersFile.text();
  const followingText = await followingFile.text();

  const followers = parseFollowersFile(followersText, followersFile.name);
  const following = parseFollowingFile(followingText, followingFile.name);

  if (followers.length === 0 && following.length === 0) {
    return NextResponse.json(
      { error: "Nenhum dado encontrado nos arquivos. Verifique o formato." },
      { status: 400 }
    );
  }

  // Garante que a conta Instagram existe
  let instagramAccount = await prisma.instagramAccount.findUnique({
    where: { userId: session.user.id },
  });

  if (!instagramAccount) {
    if (!username) {
      return NextResponse.json(
        { error: "Informe seu username do Instagram na primeira importação." },
        { status: 400 }
      );
    }
    instagramAccount = await prisma.instagramAccount.create({
      data: {
        userId: session.user.id,
        username: username.replace("@", "").toLowerCase(),
      },
    });
  }

  const diff = await computeAndSaveSnapshot(
    instagramAccount.id,
    followers,
    following
  );

  // Envia notificações se configurado
  const prefs = await prisma.notificationPreference.findUnique({
    where: { userId: session.user.id },
  });

  if (prefs?.emailEnabled && session.user.email) {
    if (prefs.unfollowAlert && diff.unfollowed.length > 0) {
      sendUnfollowNotification(
        session.user.email,
        session.user.name ?? "usuário",
        diff.unfollowed.map((u) => u.username)
      ).catch(console.error);
    }
    if (prefs.newFollowerAlert && diff.newFollowers.length > 0) {
      sendNewFollowerNotification(
        session.user.email,
        session.user.name ?? "usuário",
        diff.newFollowers.map((u) => u.username)
      ).catch(console.error);
    }
  }

  return NextResponse.json({
    success: true,
    followerCount: diff.followerCount,
    followingCount: diff.followingCount,
    unfollowed: diff.unfollowed.length,
    newFollowers: diff.newFollowers.length,
    notFollowingBack: diff.notFollowingBack.length,
    userDoesNotFollowBack: diff.userDoesNotFollowBack.length,
  });
}
