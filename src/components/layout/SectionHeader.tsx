"use client";

import { cn } from "@/lib/utils";

type Props = {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
};

export function SectionHeader({ title, description, icon, className }: Props) {
  return (
    <div className={cn("relative overflow-hidden rounded-xl border bg-card mt-4 sm:mt-6", className)}>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_60%_at_0%_0%,hsl(var(--primary)/0.10),transparent_55%)]" />
      <div className="relative p-4 sm:p-6">
        <div className="flex items-center gap-3">
          {icon && (
            <div className="h-9 w-9 rounded-lg bg-background/60 flex items-center justify-center ring-1 ring-primary/30">
              {icon}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold leading-tight">{title}</h1>
            {description && (
              <p className="text-muted-foreground mt-1 max-w-prose text-sm">{description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
