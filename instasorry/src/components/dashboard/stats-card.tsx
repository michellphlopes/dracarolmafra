import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: LucideIcon;
  description?: string;
  color?: "pink" | "purple" | "red" | "green" | "yellow" | "blue";
  trend?: "up" | "down" | "neutral";
}

const colorMap = {
  pink: { bg: "bg-pink-500/10", icon: "text-pink-400", border: "border-pink-500/20" },
  purple: { bg: "bg-purple-500/10", icon: "text-purple-400", border: "border-purple-500/20" },
  red: { bg: "bg-red-500/10", icon: "text-red-400", border: "border-red-500/20" },
  green: { bg: "bg-green-500/10", icon: "text-green-400", border: "border-green-500/20" },
  yellow: { bg: "bg-yellow-500/10", icon: "text-yellow-400", border: "border-yellow-500/20" },
  blue: { bg: "bg-blue-500/10", icon: "text-blue-400", border: "border-blue-500/20" },
};

export function StatsCard({ title, value, icon: Icon, description, color = "pink", trend }: StatsCardProps) {
  const colors = colorMap[color];

  return (
    <div className={cn("rounded-xl border p-5 bg-gray-900/60 backdrop-blur-sm transition-all hover:bg-gray-900/80", colors.border)}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">
            {typeof value === "number" ? value.toLocaleString("pt-BR") : value}
          </p>
          {description && (
            <p className="mt-1 text-xs text-gray-500">{description}</p>
          )}
        </div>
        <div className={cn("rounded-lg p-2.5", colors.bg)}>
          <Icon className={cn("h-5 w-5", colors.icon)} />
        </div>
      </div>
    </div>
  );
}
