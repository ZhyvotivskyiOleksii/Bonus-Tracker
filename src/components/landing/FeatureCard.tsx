import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type IconType = React.ComponentType<{ className?: string }>;

type FeatureCardProps = {
  icon: IconType;
  title: string;
  text: string;
  variant?: "badge" | "ghost" | "stripe" | "rightPill" | "panorama" | "topbar" | "leftBadge" | "tile" | "leftCut" | "center" | "cornerTL";
};

export function FeatureCard({ icon: Icon, title, text, variant = "badge" }: FeatureCardProps) {
  if (variant === "ghost") {
    return (
      <Card className="relative overflow-hidden border-white/10 bg-white/[0.03] backdrop-blur-sm group transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">
        {/* soft right gradient */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-1/3 sm:w-[45%] bg-gradient-to-l from-primary/20 to-transparent" />
        {/* big ghost icon */}
        <Icon aria-hidden className="hidden sm:block absolute right-6 bottom-4 h-16 w-16 text-primary/15 group-hover:text-primary/25 transition-colors" />
        <CardContent className="relative z-10 p-6 pr-24 space-y-2">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{text}</p>
        </CardContent>
      </Card>
    );
  }

  if (variant === "stripe") {
    return (
      <Card className="relative overflow-hidden border-white/10 bg-white/[0.03] backdrop-blur-sm group transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">
        {/* right stripe with icon */}
        <div className="absolute inset-y-3 right-3 w-12 rounded-xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <CardContent className="relative z-10 p-6 pr-24 space-y-2">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{text}</p>
        </CardContent>
      </Card>
    );
  }

  if (variant === "rightPill") {
    return (
      <Card className="relative overflow-hidden border-white/10 bg-white/[0.03] backdrop-blur-sm group transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">
        {/* subtle right gradient */}
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-1/3 sm:w-1/2 bg-gradient-to-l from-primary/15 to-transparent" />
        {/* faint big icon only */}
        <Icon aria-hidden className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2 h-24 w-24 text-primary/10" />
        <CardContent className="relative z-10 p-6 pr-16 space-y-2">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{text}</p>
        </CardContent>
      </Card>
    );
  }

  if (variant === "topbar") {
    return (
      <Card className="relative overflow-hidden border-white/10 bg-white/[0.04] backdrop-blur-sm group transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-30px_rgba(0,0,0,0.55)]">
        {/* Top gradient bar */}
        <div aria-hidden className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary/30 via-primary/60 to-primary/30" />
        {/* faint background gradient */}
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_60%_at_85%_50%,rgba(59,130,246,0.14),transparent_70%)]" />
        {/* ghost icon */}
        <Icon aria-hidden className="hidden sm:block absolute right-6 bottom-5 h-16 w-16 text-primary/12" />
        {/* small corner badge */}
        <div aria-hidden className="absolute -top-3 -left-3">
          <div className="h-10 w-10 rounded-xl bg-primary/15 text-primary ring-1 ring-primary/30 flex items-center justify-center">
            <Icon className="h-5 w-5" />
          </div>
        </div>
        <CardContent className="relative z-10 p-6 pr-24 space-y-2">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{text}</p>
        </CardContent>
      </Card>
    );
  }

  if (variant === "leftBadge") {
    return (
      <Card className="relative overflow-hidden border-white/12 bg-white/[0.03] backdrop-blur-sm group transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-30px_rgba(0,0,0,0.55)]">
        {/* left accent column */}
        <div aria-hidden className="absolute inset-y-0 left-0 w-14 sm:w-16 bg-gradient-to-r from-primary/15 to-transparent" />
        {/* circular badge overlapping border */}
        <div aria-hidden className="absolute -left-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-primary/20 ring-2 ring-primary/40 text-primary flex items-center justify-center shadow-[0_12px_40px_-20px_rgba(59,130,246,0.8)]">
          <Icon className="h-6 w-6" />
        </div>
        <CardContent className="relative z-10 pl-20 pr-6 py-6 space-y-1.5">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{text}</p>
        </CardContent>
      </Card>
    );
  }

  if (variant === "tile") {
    return (
      <Card className="relative overflow-hidden border-white/10 bg-white/[0.04] backdrop-blur-sm group transition-transform duration-300 hover:-translate-y-1 hover:shadow-[0_26px_80px_-30px_rgba(0,0,0,0.6)]">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="h-11 w-11 rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/25 flex items-center justify-center">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="font-semibold">{title}</h3>
            <p className="text-sm text-muted-foreground">{text}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === "leftCut") {
    return (
      <Card className="relative overflow-hidden border-white/12 bg-white/[0.03] backdrop-blur-sm group transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-30px_rgba(0,0,0,0.55)]">
        {/* left to right soft gradient */}
        <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-white/[0.06] to-transparent" />
        {/* cut circle clipped on the left edge */}
        <div aria-hidden className="absolute -left-10 top-1/2 -translate-y-1/2 h-20 w-20 rounded-full bg-primary/18 ring-1 ring-primary/30" />
        <div aria-hidden className="absolute -left-10 top-1/2 -translate-y-1/2 h-20 w-20 rounded-full flex items-center justify-center text-primary">
          <div className="absolute inset-2 rounded-full ring-1 ring-primary/25" />
          <Icon className="h-6 w-6" />
        </div>
        <CardContent className="relative py-6 pr-6 pl-16 sm:pl-24 space-y-2">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{text}</p>
        </CardContent>
      </Card>
    );
  }

  if (variant === "center") {
    return (
      <Card className="relative overflow-visible border-white/12 bg-white/[0.04] backdrop-blur-sm group transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_26px_80px_-30px_rgba(0,0,0,0.6)]">
        {/* top centered circular badge */}
        <div aria-hidden className="absolute -top-6 left-1/2 -translate-x-1/2">
          <div className="relative h-14 w-14 rounded-full bg-primary/15 ring-1 ring-white/15 shadow-[0_10px_30px_-10px_rgba(59,130,246,0.6)] flex items-center justify-center text-primary">
            <div className="absolute inset-1 rounded-full ring-1 ring-primary/30" />
            <Icon className="h-6 w-6 relative" />
          </div>
        </div>
        <CardContent className="relative z-10 pt-12 pb-6 px-6 text-center space-y-2">
          <h3 className="font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground">{text}</p>
        </CardContent>
      </Card>
    );
  }

  if (variant === "cornerTL") {
    return (
      <Card className="relative overflow-hidden border-white/10 bg-white/[0.04] backdrop-blur-sm group transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-30px_rgba(0,0,0,0.55)]">
        {/* unified inner gradient overlay */}
        <div aria-hidden className="pointer-events-none absolute inset-0 z-0 bg-[linear-gradient(120deg,rgba(59,130,246,0.12),transparent_55%)]" />
        {/* small badge in the top-right corner */}
        <div aria-hidden className="pointer-events-none absolute top-4 right-4 h-10 w-10 rounded-xl border border-white/12 bg-white/10 flex items-center justify-center text-primary z-10">
          <Icon className="h-5 w-5" />
        </div>
        <CardContent className="relative z-10 p-4 sm:p-6 space-y-1">
          <h3 className="font-semibold text-[15px] sm:text-base leading-snug text-left pr-16 sm:pr-20">{title}</h3>
          <p className="text-[12px] sm:text-sm leading-snug text-muted-foreground text-left pr-0 sm:pr-20">{text}</p>
        </CardContent>
      </Card>
    );
  }

  // default: badge
  return (
    <Card className="relative overflow-hidden border-white/10 bg-white/[0.03] backdrop-blur-sm group transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_20px_60px_-20px_rgba(0,0,0,0.5)]">
      {/* right accent */}
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-[38%] bg-gradient-to-l from-primary/15 to-transparent" />
      <CardContent className="relative z-10 p-6 pr-20 space-y-2">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{text}</p>
        <div className="absolute right-5 top-5 h-10 w-10 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center text-primary transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:border-primary/30 group-hover:bg-primary/10">
          <Icon className="h-5 w-5" />
        </div>
      </CardContent>
    </Card>
  );
}

// Panorama — large, two-column style card with corner badge and big ghost icon
export function FeatureCardPanorama({ icon: Icon, title, text }: Omit<FeatureCardProps, 'variant'>) {
  return (
    <Card className="relative overflow-hidden rounded-3xl border-white/10 bg-white/[0.04] backdrop-blur-md group transition-transform duration-300 hover:-translate-y-0.5 hover:shadow-[0_30px_80px_-30px_rgba(0,0,0,0.6)]">
      {/* diagonal glow */}
      <div aria-hidden className="absolute inset-0 bg-[linear-gradient(120deg,rgba(59,130,246,0.14),transparent_35%,transparent_65%,rgba(59,130,246,0.12))]" />
      {/* corner badge */}
      <div aria-hidden className="absolute -top-4 -left-4 z-10">
        <div className="h-12 w-12 rounded-2xl bg-primary/15 text-primary ring-1 ring-primary/30 shadow-[0_8px_24px_-8px_rgba(59,130,246,0.6)] backdrop-blur flex items-center justify-center">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      {/* big ghost icon on right */}
      <Icon aria-hidden className="hidden sm:block absolute -right-6 top-1/2 -translate-y-1/2 h-28 w-28 text-primary/12" />
      <CardContent className="relative p-7 pr-28 space-y-2">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  );
}
