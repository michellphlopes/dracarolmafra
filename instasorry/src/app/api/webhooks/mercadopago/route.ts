import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verifica tipo de notificação
    if (body.type !== "payment") {
      return NextResponse.json({ received: true });
    }

    const paymentId = body.data?.id;
    if (!paymentId) return NextResponse.json({ received: true });

    // Busca detalhes do pagamento na API do MP
    const mpResponse = await fetch(
      `https://api.mercadopago.com/v1/payments/${paymentId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
        },
      }
    );

    if (!mpResponse.ok) {
      return NextResponse.json({ error: "Erro ao buscar pagamento" }, { status: 500 });
    }

    const payment = await mpResponse.json();

    if (payment.status !== "approved") {
      return NextResponse.json({ received: true });
    }

    // external_reference = "userId:PLAN"
    const [userId, plan] = (payment.external_reference ?? "").split(":");

    if (!userId) return NextResponse.json({ received: true });

    const planType = (plan ?? "MONTHLY") as "MONTHLY" | "ANNUAL";

    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        plan: planType,
        status: "ACTIVE",
        mpSubscriptionId: String(paymentId),
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(
          Date.now() + (planType === "ANNUAL" ? 365 : 30) * 24 * 60 * 60 * 1000
        ),
      },
      update: {
        status: "ACTIVE",
        plan: planType,
        mpSubscriptionId: String(paymentId),
      },
    });

    await prisma.payment.create({
      data: {
        userId,
        amount: payment.transaction_amount,
        currency: "BRL",
        status: "APPROVED",
        provider: "mercadopago",
        externalId: String(paymentId),
      },
    });

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("MP webhook error:", err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
