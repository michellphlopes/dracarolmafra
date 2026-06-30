import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { z } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-05-27.dahlia",
});

const checkoutSchema = z.object({
  plan: z.enum(["MONTHLY", "ANNUAL"]),
  provider: z.enum(["stripe", "mercadopago"]).default("stripe"),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado" }, { status: 401 });
  }

  const body = await req.json();
  const { plan, provider } = checkoutSchema.parse(body);

  if (provider === "stripe") {
    const priceId =
      plan === "MONTHLY"
        ? process.env.STRIPE_MONTHLY_PRICE_ID
        : process.env.STRIPE_ANNUAL_PRICE_ID;

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancel`,
      client_reference_id: session.user.id,
      customer_email: session.user.email ?? undefined,
      metadata: { userId: session.user.id, plan },
    });

    return NextResponse.json({ url: checkoutSession.url });
  }

  // Mercado Pago — cria preferência de pagamento
  const amount = plan === "MONTHLY" ? 20 : 200;

  const mpResponse = await fetch("https://api.mercadopago.com/checkout/preferences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          title: `InstaSorry — Plano ${plan === "MONTHLY" ? "Mensal" : "Anual"}`,
          quantity: 1,
          currency_id: "BRL",
          unit_price: amount,
        },
      ],
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
        failure: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=cancel`,
      },
      auto_return: "approved",
      external_reference: `${session.user.id}:${plan}`,
      notification_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/webhooks/mercadopago`,
    }),
  });

  const mpData = await mpResponse.json();

  if (!mpResponse.ok) {
    return NextResponse.json({ error: "Erro ao criar pagamento" }, { status: 500 });
  }

  return NextResponse.json({ url: mpData.init_point });
}
