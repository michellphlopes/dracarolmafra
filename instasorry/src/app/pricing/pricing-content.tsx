"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function PricingContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useSearchParams();
  const [loading, setLoading] = useState<string | null>(null);

  const isNew = params.get("new") === "1";

  async function handleCheckout(plan: "MONTHLY" | "ANNUAL", provider: "stripe" | "mercadopago") {
    if (!session) {
      router.push(`/register?plan=${plan}`);
      return;
    }

    setLoading(`${plan}-${provider}`);

    const res = await fetch("/api/billing/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, provider }),
    });

    const data = await res.json();
    setLoading(null);

    if (data.url) {
      window.location.href = data.url;
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 py-16 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-4">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
              <Heart className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-lg font-bold text-white">InstaSorry</span>
          </Link>

          {isNew && (
            <div className="mb-6 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-900/30 border border-green-700/50 text-green-400 text-sm">
              <CheckCircle className="h-4 w-4" />
              Conta criada com sucesso! Escolha seu plano para continuar.
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Escolha seu plano
          </h1>
          <p className="text-gray-400 text-lg">
            3 dias grátis em qualquer plano. Sem cartão de crédito agora.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-12 max-w-2xl mx-auto">
          {/* Plano Mensal */}
          <div className="p-6 rounded-2xl border border-gray-700 bg-gray-900/50">
            <h2 className="text-xl font-bold text-white mb-1">Mensal</h2>
            <div className="flex items-baseline gap-1 mb-6">
              <span className="text-4xl font-bold text-white">R$20</span>
              <span className="text-gray-400">/mês</span>
            </div>
            <ul className="space-y-3 mb-8 text-sm text-gray-300">
              {[
                "1 conta Instagram",
                "Histórico completo",
                "Alertas por e-mail",
                "Importação de dados",
                "Suporte via e-mail",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="space-y-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => handleCheckout("MONTHLY", "mercadopago")}
                loading={loading === "MONTHLY-mercadopago"}
              >
                Pagar com Pix / Boleto
              </Button>
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => handleCheckout("MONTHLY", "stripe")}
                loading={loading === "MONTHLY-stripe"}
              >
                Pagar com cartão
              </Button>
            </div>
          </div>

          {/* Plano Anual */}
          <div className="p-6 rounded-2xl border border-pink-500/50 bg-gradient-to-b from-pink-500/8 to-purple-500/8 relative">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white text-xs font-bold whitespace-nowrap">
              MELHOR VALOR — 2 MESES GRÁTIS
            </div>
            <h2 className="text-xl font-bold text-white mb-1">Anual</h2>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-4xl font-bold text-white">R$200</span>
              <span className="text-gray-400">/ano</span>
            </div>
            <p className="text-sm text-pink-400 mb-6">≈ R$16,67/mês • Economia de R$40</p>
            <ul className="space-y-3 mb-8 text-sm text-gray-300">
              {[
                "1 conta Instagram",
                "Histórico completo",
                "Alertas por e-mail",
                "Importação de dados",
                "Sincronização prioritária",
                "Suporte prioritário",
              ].map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>

            <div className="space-y-2">
              <Button
                className="w-full"
                onClick={() => handleCheckout("ANNUAL", "mercadopago")}
                loading={loading === "ANNUAL-mercadopago"}
              >
                <ArrowRight className="h-4 w-4" />
                Pagar com Pix / Boleto
              </Button>
              <Button
                className="w-full"
                variant="secondary"
                onClick={() => handleCheckout("ANNUAL", "stripe")}
                loading={loading === "ANNUAL-stripe"}
              >
                Pagar com cartão
              </Button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Cancele a qualquer momento. Não solicitamos sua senha do Instagram.
        </p>

        {session && (
          <div className="text-center mt-4">
            <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-300 underline">
              Continuar com trial gratuito →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
