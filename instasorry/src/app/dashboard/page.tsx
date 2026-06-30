import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDashboardStats } from "@/services/snapshot-diff";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Users, UserMinus, UserX, UserCheck, TrendingUp, RefreshCw } from "lucide-react";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const instagramAccount = await prisma.instagramAccount.findUnique({
    where: { userId },
  });

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  const isTrial = subscription?.status === "TRIALING";
  const trialEndsAt = subscription?.trialEndsAt;

  if (!instagramAccount) {
    return (
      <div className="p-6 sm:p-8 max-w-4xl">
        <h1 className="text-2xl font-bold text-white mb-2">
          Bem-vindo ao InstaSorry 👋
        </h1>
        <p className="text-gray-400 mb-8">
          Para começar, importe seus dados do Instagram.
        </p>

        {isTrial && trialEndsAt && (
          <div className="mb-6 p-4 rounded-xl border border-yellow-700/50 bg-yellow-900/20 text-yellow-300 text-sm">
            ⏳ Seu trial termina em{" "}
            <strong>{formatDate(trialEndsAt)}</strong>.{" "}
            <Link href="/pricing" className="underline hover:text-yellow-200">
              Assine agora
            </Link>{" "}
            para não perder o acesso.
          </div>
        )}

        <Link
          href="/dashboard/importar"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold hover:from-pink-600 hover:to-purple-700 transition-all shadow-lg shadow-pink-500/25"
        >
          <RefreshCw className="h-4 w-4" />
          Importar dados do Instagram
        </Link>
      </div>
    );
  }

  const stats = await getDashboardStats(instagramAccount.id);

  return (
    <div className="p-6 sm:p-8">
      <div className="mb-8 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            @{instagramAccount.username}
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {stats.lastSyncAt
              ? `Última sincronização: ${formatDate(stats.lastSyncAt)}`
              : "Nenhuma sincronização ainda"}
          </p>
        </div>
        <Link
          href="/dashboard/importar"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-700 text-gray-300 text-sm font-medium hover:bg-gray-800 hover:text-white transition-all"
        >
          <RefreshCw className="h-4 w-4" />
          Nova sincronização
        </Link>
      </div>

      {isTrial && trialEndsAt && (
        <div className="mb-6 p-4 rounded-xl border border-yellow-700/50 bg-yellow-900/20 text-yellow-300 text-sm">
          ⏳ Trial termina em <strong>{formatDate(trialEndsAt)}</strong>.{" "}
          <Link href="/pricing" className="underline hover:text-yellow-200">
            Escolher plano
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatsCard
          title="Seguidores"
          value={stats.followerCount}
          icon={Users}
          color="blue"
          description="Total de seguidores"
        />
        <StatsCard
          title="Seguindo"
          value={stats.followingCount}
          icon={Users}
          color="purple"
          description="Contas que você segue"
        />
        <StatsCard
          title="Não me seguem de volta"
          value={stats.notFollowingBack}
          icon={UserMinus}
          color="red"
          description="Você segue, mas eles não"
        />
        <StatsCard
          title="Eu não sigo de volta"
          value={stats.userDoesNotFollowBack}
          icon={UserX}
          color="yellow"
          description="Eles seguem, mas você não"
        />
        <StatsCard
          title="Deixaram de seguir"
          value={stats.unfollowed}
          icon={UserCheck}
          color="red"
          description="Detectados no histórico"
        />
        <StatsCard
          title="Novos seguidores"
          value={stats.newFollowers}
          icon={TrendingUp}
          color="green"
          description="Detectados no histórico"
        />
      </div>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/dashboard/nao-me-seguem"
          className="p-4 rounded-xl border border-gray-800 bg-gray-900/40 hover:bg-gray-900/70 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Não me seguem de volta</p>
              <p className="text-sm text-gray-400 mt-1">Ver lista completa</p>
            </div>
            <UserMinus className="h-5 w-5 text-red-400 group-hover:scale-110 transition-transform" />
          </div>
        </Link>

        <Link
          href="/dashboard/deixaram-de-seguir"
          className="p-4 rounded-xl border border-gray-800 bg-gray-900/40 hover:bg-gray-900/70 transition-all group"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-white">Deixaram de seguir</p>
              <p className="text-sm text-gray-400 mt-1">Ver histórico completo</p>
            </div>
            <UserCheck className="h-5 w-5 text-pink-400 group-hover:scale-110 transition-transform" />
          </div>
        </Link>
      </div>
    </div>
  );
}
