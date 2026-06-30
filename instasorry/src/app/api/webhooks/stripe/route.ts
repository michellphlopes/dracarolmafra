import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2026-05-27.dahlia",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET ?? ""
    );
  } catch {
    return NextResponse.json({ error: "Webhook inválido" }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const subscription = event.data.object as Stripe.Subscription;

  switch (event.type) {
    case "checkout.session.completed": {
      const userId = session.client_reference_id ?? session.metadata?.userId;
      const plan = (session.metadata?.plan ?? "MONTHLY") as "MONTHLY" | "ANNUAL";

      if (!userId) break;

      await prisma.subscription.upsert({
        where: { userId },
        create: {
          userId,
          plan,
          status: "ACTIVE",
          stripeSubscriptionId: session.subscription as string,
          stripeCustomerId: session.customer as string,
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(
            Date.now() + (plan === "ANNUAL" ? 365 : 30) * 24 * 60 * 60 * 1000
          ),
        },
        update: {
          status: "ACTIVE",
          plan,
          stripeSubscriptionId: session.subscription as string,
          stripeCustomerId: session.customer as string,
        },
      });

      await prisma.payment.create({
        data: {
          userId,
          amount: (session.amount_total ?? 0) / 100,
          currency: session.currency?.toUpperCase() ?? "BRL",
          status: "APPROVED",
          provider: "stripe",
          externalId: session.id,
        },
      });
      break;
    }

    case "customer.subscription.deleted": {
      await prisma.subscription.updateMany({
        where: { stripeSubscriptionId: subscription.id },
        data: { status: "CANCELED" },
      });
      break;
    }

    case "invoice.payment_failed": {
      const inv = event.data.object as Stripe.Invoice & { subscription?: string };
      if (inv.subscription) {
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId: inv.subscription },
          data: { status: "PAST_DUE" },
        });
      }
      break;
    }
  }

  return NextResponse.json({ received: true });
}
