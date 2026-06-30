import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Sidebar } from "@/components/dashboard/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Verifica se há assinatura válida
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id },
  });

  const isTrialExpired =
    subscription?.status === "TRIALING" &&
    subscription.trialEndsAt &&
    new Date(subscription.trialEndsAt) < new Date();

  if (!subscription || isTrialExpired || subscription.status === "CANCELED") {
    redirect("/pricing");
  }

  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
