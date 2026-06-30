import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatDate, formatCurrency } from "@/lib/utils";
import { CreditCard, CheckCircle, AlertCircle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

const planLabels: Record<string, string> = {
  MONTHLY: "Mensal",
  ANNUAL: "Anual",
};

const statusLabels: Record<string, { label: string; color: string; icon: React.ElementType }> = {
  ACTIVE: { label: "Ativa", color: "text-green-400", icon: CheckCircle },
  TRIALING: { label: "Trial", color: "text-yellow-400", icon: Clock },
  PAST_DUE: { label: "Pagamento pendente", color: "text-red-400", icon: AlertCircle },
  CANCELED: { label: "Cancelada", color: "text-gray-400", icon: AlertCircle },
  UNPAID: { label: "Não paga", color: "text-red-400", icon: AlertCircle },
};

export default async function BillingPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [subscription, payments] = await Promise.all([
    prisma.subscription.findUnique({ where: { userId: session.user.id } }),
    prisma.payment.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 10,
    }),
  ]);

  const statusInfo = subscription ? statusLabels[subscription.status] : null;
  const StatusIcon = statusInfo?.icon ?? AlertCircle;

  return (
    <div className="min-h-screen bg-gray-950 p-6 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-lg bg-purple-500/10 flex items-center justify-center">
            <CreditCard className="h-5 w-5 text-purple-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Assinatura</h1>
        </div>

        {/* Status da assinatura */}
        <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50 mb-6">
          {subscription ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-400">Plano atual</p>
                  <p className="text-lg font-semibold text-white mt-1">
                    {planLabels[subscription.plan]}
                    {subscription.plan === "MONTHLY" ? " — R$20/mês" : " — R$200/ano"}
                  </p>
                </div>
                <div className={`flex items-center gap-1.5 ${statusInfo?.color}`}>
                  <StatusIcon className="h-4 w-4" />
                  <span className="text-sm font-medium">{statusInfo?.label}</span>
                </div>
              </div>

              {subscription.status === "TRIALING" && subscription.trialEndsAt && (
                <p className="text-sm text-yellow-300">
                  ⏳ Trial termina em{" "}
                  <strong>{formatDate(subscription.trialEndsAt)}</strong>
                </p>
              )}

              {subscription.currentPeriodEnd && subscription.status === "ACTIVE" && (
                <p className="text-sm text-gray-400">
                  Próxima cobrança:{" "}
                  <strong className="text-gray-200">{formatDate(subscription.currentPeriodEnd)}</strong>
                </p>
              )}

              <div className="mt-4 flex gap-3">
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium hover:from-pink-600 hover:to-purple-700 transition-all"
                >
                  {subscription.status === "TRIALING" ? "Assinar agora" : "Mudar plano"}
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-400 mb-4">Você não tem uma assinatura ativa.</p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 to-purple-600 text-white text-sm font-medium"
              >
                Ver planos
              </Link>
            </div>
          )}
        </div>

        {/* Histórico de pagamentos */}
        <div className="p-6 rounded-xl border border-gray-800 bg-gray-900/50">
          <h2 className="text-base font-semibold text-white mb-4">Histórico de pagamentos</h2>

          {payments.length === 0 ? (
            <p className="text-sm text-gray-400">Nenhum pagamento registrado.</p>
          ) : (
            <div className="space-y-3">
              {payments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between py-2.5 border-b border-gray-800 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-white">
                      {formatCurrency(p.amount, p.currency)}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {formatDate(p.createdAt)} · {p.provider}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      p.status === "APPROVED"
                        ? "bg-green-900/50 text-green-400"
                        : p.status === "PENDING"
                        ? "bg-yellow-900/50 text-yellow-400"
                        : "bg-red-900/50 text-red-400"
                    }`}
                  >
                    {p.status === "APPROVED"
                      ? "Aprovado"
                      : p.status === "PENDING"
                      ? "Pendente"
                      : "Falhou"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
