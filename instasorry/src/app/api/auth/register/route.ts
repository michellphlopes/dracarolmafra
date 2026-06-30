import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendWelcomeEmail } from "@/services/email";

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Este e-mail já está em uso." },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const trialDays = parseInt(process.env.TRIAL_DAYS ?? "3");
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + trialDays);

    const user = await prisma.user.create({
      data: {
        name,
        email,
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
      },
    });

    // Envia e-mail de boas-vindas (sem bloquear a resposta)
    sendWelcomeEmail(email, name).catch(console.error);

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    console.error(err);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
