"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Upload,
  UserMinus,
  UserX,
  UserCheck,
  Bell,
  CreditCard,
  Settings,
  LogOut,
  Heart,
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Painel", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/importar", label: "Importar Dados", icon: Upload },
  { href: "/dashboard/nao-me-seguem", label: "Não me seguem", icon: UserMinus },
  { href: "/dashboard/eu-nao-sigo", label: "Eu não sigo de volta", icon: UserX },
  { href: "/dashboard/deixaram-de-seguir", label: "Deixaram de seguir", icon: UserCheck },
  { href: "/dashboard/configuracoes", label: "Notificações", icon: Bell },
  { href: "/billing", label: "Assinatura", icon: CreditCard },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-gray-950 border-r border-gray-800 min-h-screen">
      <div className="p-6 border-b border-gray-800">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center">
            <Heart className="w-4 h-4 text-white fill-white" />
          </div>
          <span className="text-lg font-bold text-white">InstaSorry</span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon, exact }) => {
          const active = exact ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-pink-500/10 text-pink-400 border border-pink-500/20"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 w-full transition-all"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
