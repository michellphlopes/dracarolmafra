import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  // type: "followers" | "following" | "not-following-back" | "user-not-following-back"
  const type = searchParams.get("type") ?? "followers";
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 50;

  const instagramAccount = await prisma.instagramAccount.findUnique({
    where: { userId: session.user.id },
  });

  if (!instagramAccount) {
    return NextResponse.json({ items: [], total: 0 });
  }

  const latestSnapshot = await prisma.instagramSnapshot.findFirst({
    where: { instagramAccountId: instagramAccount.id },
    orderBy: { takenAt: "desc" },
  });

  if (!latestSnapshot) {
    return NextResponse.json({ items: [], total: 0 });
  }

  if (type === "followers") {
    const [items, total] = await Promise.all([
      prisma.instagramFollower.findMany({
        where: { snapshotId: latestSnapshot.id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { username: "asc" },
      }),
      prisma.instagramFollower.count({ where: { snapshotId: latestSnapshot.id } }),
    ]);
    return NextResponse.json({ items, total });
  }

  if (type === "following") {
    const [items, total] = await Promise.all([
      prisma.instagramFollowing.findMany({
        where: { snapshotId: latestSnapshot.id },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { username: "asc" },
      }),
      prisma.instagramFollowing.count({ where: { snapshotId: latestSnapshot.id } }),
    ]);
    return NextResponse.json({ items, total });
  }

  // Listas derivadas requerem busca de ambos e comparação em memória
  const [followers, following] = await Promise.all([
    prisma.instagramFollower.findMany({ where: { snapshotId: latestSnapshot.id } }),
    prisma.instagramFollowing.findMany({ where: { snapshotId: latestSnapshot.id } }),
  ]);

  const followerSet = new Set(followers.map((f) => f.username));
  const followingSet = new Set(following.map((f) => f.username));

  let filtered: typeof followers | typeof following = [];

  if (type === "not-following-back") {
    filtered = following.filter((f) => !followerSet.has(f.username));
  } else if (type === "user-not-following-back") {
    filtered = followers.filter((f) => !followingSet.has(f.username));
  }

  const total = filtered.length;
  const items = filtered.slice((page - 1) * limit, page * limit);

  return NextResponse.json({ items, total });
}
