import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDashboardStats } from "@/services/snapshot-diff";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const instagramAccount = await prisma.instagramAccount.findUnique({
    where: { userId: session.user.id },
  });

  if (!instagramAccount) {
    return NextResponse.json({ hasAccount: false });
  }

  const stats = await getDashboardStats(instagramAccount.id);

  return NextResponse.json({ hasAccount: true, ...stats });
}
