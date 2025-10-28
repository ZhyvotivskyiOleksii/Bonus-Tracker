"use client";

import React from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowRight } from "lucide-react"; // Убрал X и Check как отдельные иконки, заменил на соответствующие
import { cn } from "@/lib/utils";

function useInViewOnce<T extends HTMLElement>(options?: IntersectionObserverInit) {
  const ref = React.useRef<T | null>(null);
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current || visible) return;
    const io = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, ...options }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [options, visible]);
  return { ref, visible } as const;
}

export function BeforeAfterSection() {
  const { ref, visible } = useInViewOnce<HTMLDivElement>();

  return (
    <section className="py-16 md:py-24 relative overflow-hidden" ref={ref}>
      <div className="container max-w-[1120px] px-4 md:px-6 mx-auto relative z-10">

        {/* Heading */}
        <div
          className={cn(
            "text-center max-w-4xl mx-auto",
            visible &&
              "motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-top-10 duration-1000"
          )}
        >
          <h2 className="text-[32px] sm:text-[42px] md:text-[52px] leading-tight font-extrabold tracking-[-0.02em] text-white">
            Tired of hunting for bonuses across all casinos?
          </h2>
          <p className="mt-4 text-white/80 text-base sm:text-lg font-medium">
            Discover daily rewards from top sweepstake brands—automated, updated, and one-click ready.
          </p>
        </div>

        {/* Compare */}
        <div
          className={cn(
            "relative mt-12 grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-12 items-start max-w-[980px] mx-auto",
            visible && "motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-10 duration-1000"
          )}
        >
          {/* Center Divider with shimmer animation */}
          <div aria-hidden className="hidden sm:block absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-white/15 overflow-hidden rounded">
            <div className="absolute inset-x-[-6px] top-[-40%] h-1/2 bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.7),transparent)] vs-connector opacity-70" />
          </div>
          <div aria-hidden className="hidden sm:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center justify-center">
            <div className="relative inline-flex h-10 px-4 items-center justify-center rounded-full bg-white/10 border border-white/15 text-sm font-medium text-white/85 backdrop-blur-md shadow-sm overflow-hidden">
              {/* thin line continues through badge without filling it */}
              <span aria-hidden className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[-160%] bottom-[-160%] w-px bg-white/20" />
              <span aria-hidden className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-[-160%] h-[360%] w-px bg-[linear-gradient(180deg,transparent,rgba(255,255,255,0.8),transparent)] vs-connector opacity-60" />
              VS
            </div>
          </div>

          {/* BEFORE */}
          <div className="sm:pr-6 text-center sm:text-left relative group">
            <div className="flex sm:flex-row-reverse justify-center sm:justify-end items-center gap-2 text-white/90 font-bold mb-4 uppercase tracking-wide">
              <XCircle className="h-6 w-6 text-purple-400 group-hover:text-purple-300 transition-colors" /> Before
            </div>
            <div
              className="relative rounded-2xl p-[1.6px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_60px_-22px_rgba(147,51,234,0.5)]"
              style={{ background: "linear-gradient(135deg, rgba(147,51,234,0.55), rgba(79,70,229,0.40))" }}
            >
              <div className="relative rounded-[inherit] bg-gradient-to-br from-white/[0.03] via-purple-500/5 to-transparent backdrop-blur-md border border-white/10 p-6">
                <div aria-hidden className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-[radial-gradient(220px_140px_at_100%_0%,rgba(147,51,234,0.20),transparent_60%)]" />
                <ul className="space-y-3 text-white/80 text-left">
                  {[
                    "Manually searching for bonuses",
                    "Visiting dozens of sites",
                    "Trying to remember every bonus",
                    "Missing out on new bonus updates",
                  ].map((t, i) => (
                    <li
                      key={t}
                      className={cn(
                        "grid grid-cols-[1.5rem_1fr] items-center gap-3",
                        visible &&
                          "motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-left-5 duration-700",
                        i === 1 && "delay-100",
                        i === 2 && "delay-200",
                        i === 3 && "delay-300"
                      )}
                    >
                      <span className="inline-flex mt-1 h-6 w-6 items-center justify-center rounded-full bg-purple-500/15 ring-1 ring-purple-400/30 text-purple-300 group-hover:bg-purple-500/20 transition-colors">
                        <XCircle className="h-4 w-4" /> {/* Заменил X на XCircle */}
                      </span>
                      <span className="group-hover:text-white transition-colors text-left">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* AFTER */}
          <div className="sm:pl-6 text-center sm:text-left relative group">
            <div className="flex justify-center sm:justify-start items-center gap-2 text-white/90 font-bold mb-4 uppercase tracking-wide">
              <CheckCircle2 className="h-6 w-6 text-emerald-400 group-hover:text-emerald-300 transition-colors" /> After
            </div>
            <div
              className="relative rounded-2xl p-[1.6px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_60px_-22px_rgba(34,197,94,0.5)]"
              style={{ background: "linear-gradient(135deg, rgba(34,197,94,0.55), rgba(245,158,11,0.45))" }}
            >
              <div className="relative rounded-[inherit] bg-gradient-to-br from-white/[0.03] via-emerald-500/5 to-transparent backdrop-blur-md border border-white/10 p-6">
                <div aria-hidden className="pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full bg-[radial-gradient(220px_140px_at_0%_0%,rgba(34,197,94,0.20),transparent_60%)]" />
                <ul className="space-y-3 text-white/80 text-left">
                  {[
                    "All bonuses collected for you",
                    "Everything in one place",
                    "Get bonuses in 1 click",
                    "Daily updates of new brands",
                  ].map((t, i) => (
                    <li
                      key={t}
                      className={cn(
                        "grid grid-cols-[1.5rem_1fr] items-center gap-3",
                        visible &&
                          "motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-right-5 duration-700",
                        i === 1 && "delay-100",
                        i === 2 && "delay-200",
                        i === 3 && "delay-300"
                      )}
                    >
                      <span className="inline-flex mt-1 h-6 w-6 items-center justify-center rounded-full bg-emerald-500/15 ring-1 ring-emerald-400/30 text-emerald-300 group-hover:bg-emerald-500/20 transition-colors">
                        <CheckCircle2 className="h-4 w-4" /> {/* Заменил Check на CheckCircle2 */}
                      </span>
                      <span className="group-hover:text-white transition-colors text-left">{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div
          className={cn(
            "mt-12 flex justify-center",
            visible &&
              "motion-safe:animate-in motion-safe:fade-in-50 motion-safe:slide-in-from-bottom-10 duration-1000 delay-400"
          )}
        >
          <Link href="/login" className="cta-sweeps">
            <span role="img" aria-label="gift">🎁</span>
            <span>Start Collecting Bonuses</span>
            <ArrowRight className="ml-1 h-4 w-4 icon" />
          </Link>
        </div>
      </div>
    </section>
  );
}
