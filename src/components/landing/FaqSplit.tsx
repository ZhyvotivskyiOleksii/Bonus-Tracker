"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { HelpCircle, ChevronDown } from "lucide-react";

type FaqItem = { q: string; a: string };

type Props = {
  items?: FaqItem[];
  title?: string;
};

export function FaqSplit({
  items = [
    {
      q: "Is this a casino?",
      a: "No. Sweep Drop does not accept wagers. We only show you the bonuses available on other licensed sweepstakes casino sites.",
    },
    {
      q: "Do I have to pay?",
      a: "No, Sweep Drop is completely free to use. Just log in and collect your bonuses.",
    },
    {
      q: "Is this safe?",
      a: "Yes. We only work with licensed sweepstakes brands that are legally approved to operate in the United States.",
    },
  ],
  title = "Frequently Asked Questions",
}: Props) {
  const [active, setActive] = React.useState(0);
  const [openMobile, setOpenMobile] = React.useState<number | null>(0);

  const gradFor = (i: number) =>
    i % 4 === 0
      ? "linear-gradient(135deg,#9333EA,#4F46E5)"
      : i % 4 === 1
      ? "linear-gradient(135deg,#9333EA,#22C55E)"
      : i % 4 === 2
      ? "linear-gradient(135deg,#22C55E,#F59E0B)"
      : "linear-gradient(135deg,#F59E0B,#FDE047)";

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-[1100px] px-4 md:px-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-center">{title}</h2>

        {/* Mobile: stacked gradient accordion */}
        <div className="md:hidden mt-8 space-y-3">
          {items.map((it, i) => (
            <div key={it.q} className="relative">
              <div className="rounded-xl p-[1.4px]" style={{ background: gradFor(i) }}>
                <button
                  onClick={() => setOpenMobile(openMobile === i ? null : i)}
                  className="w-full rounded-[inherit] bg-card/70 backdrop-blur border border-white/10 px-4 py-3 flex items-center gap-3"
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/15 text-primary">
                    <HelpCircle className="h-4 w-4" />
                  </span>
                  <span className="flex-1 text-left font-medium">{it.q}</span>
                  <ChevronDown className={cn("h-4 w-4 transition", openMobile === i && "rotate-180")} />
                </button>
              </div>
              {openMobile === i && (
                <div className="mt-2 ml-4 pl-4 border-l border-white/10 text-sm text-muted-foreground">
                  {it.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Desktop/Tablet: split layout */}
        <div className="hidden md:grid relative mt-10 gap-6 lg:grid-cols-[360px_1fr]">
          {/* Left: questions with gradient rings */}
          <div className="space-y-3">
            {items.map((it, i) => (
              <div key={it.q} className="rounded-2xl p-[1.4px]" style={{ background: gradFor(i) }}>
                <button
                  onClick={() => setActive(i)}
                  className={cn(
                    "relative w-full text-left rounded-[inherit] px-4 py-3 flex items-center gap-3 border",
                    "bg-card/70 backdrop-blur border-white/10 hover:border-white/20",
                    i === active && "bg-white/[0.06] border-white/25"
                  )}
                >
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 ring-1 ring-white/15 text-primary">
                    <HelpCircle className="h-4 w-4" />
                  </span>
                  <span className="font-medium">{it.q}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Right: answer card with gradient border */}
          <div className="rounded-2xl p-[1.6px]" style={{ background: gradFor(active) }}>
            <div className="relative rounded-[inherit] bg-card/70 backdrop-blur border border-white/10 p-6 overflow-hidden">
              <div aria-hidden className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[radial-gradient(300px_200px_at_100%_0%,hsl(var(--primary)/0.16),transparent_62%)]" />
              <div className="flex items-center gap-2 text-primary font-semibold relative z-10">
                <HelpCircle className="h-5 w-5" />
                <span>{items[active]?.q}</span>
              </div>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed relative z-10">
                {items[active]?.a}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
