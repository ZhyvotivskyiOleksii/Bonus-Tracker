"use client";

import { cn } from "@/lib/utils";

type Props = {
  title: string;
  value: React.ReactNode;
  description?: string;
  icon: React.ReactNode;
  accent?: "primary" | "green" | "yellow" | "purple";
  className?: string;
};

const accentMap: Record<NonNullable<Props["accent"]>, { bg: string; ring: string; icon: string }> = {
  primary: { bg: "from-primary/20", ring: "ring-primary/40", icon: "text-primary" },
  green: { bg: "from-status-sc/25", ring: "ring-status-sc/40", icon: "text-status-sc" },
  yellow: { bg: "from-status-gc/25", ring: "ring-status-gc/40", icon: "text-status-gc" },
  purple: { bg: "from-status-not-registered/25", ring: "ring-status-not-registered/40", icon: "text-status-not-registered" },
};

export function AnalyticsStatCard({ title, value, description, icon, accent = "primary", className }: Props) {
  const a = accentMap[accent];
  return (
    <div className={cn("relative overflow-hidden rounded-lg border bg-card", className)}>
      {/* soft top gradient */}
      <div className={cn("pointer-events-none absolute -inset-x-px -top-px h-24 bg-gradient-to-br", a.bg, "via-transparent to-transparent")} />
      <div className="p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground/90">{title}</h3>
          <div className={cn("h-8 w-8 rounded-full bg-background/60 flex items-center justify-center ring-2", a.ring)}>
            <span className={cn("h-4 w-4", a.icon)}>{icon}</span>
          </div>
        </div>
        <div className="mt-2 text-2xl font-bold">{value}</div>
        {description && (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
    </div>
  );
}

