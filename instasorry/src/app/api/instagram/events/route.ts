import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const page = parseInt(searchParams.get("page") ?? "1");
  const limit = 50;

  const instagramAccount = await prisma.instagramAccount.findUnique({
    where: { userId: session.user.id },
  });

  if (!instagramAccount) {
    return NextResponse.json({ events: [], total: 0 });
  }

  const where = {
    instagramAccountId: instagramAccount.id,
    ...(type ? { eventType: type } : {}),
  };

  const [events, total] = await Promise.all([
    prisma.instagramEvent.findMany({
      where,
      orderBy: { detectedAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.instagramEvent.count({ where }),
  ]);

  return NextResponse.json({ events, total, page, pages: Math.ceil(total / limit) });
}
