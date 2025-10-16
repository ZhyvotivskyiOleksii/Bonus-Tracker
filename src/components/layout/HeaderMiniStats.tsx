"use client";

import { createClient } from "@/lib/supabase/client";
import { Casino, CasinoStatus, UserCasino } from "@/lib/types";
import { useEffect, useMemo, useState } from "react";
import { GcCoinIcon, ScCoinIcon } from "../icons";
import { cn } from "@/lib/utils";

/**
 * Mobile-only compact stats that appear in the sticky header
 * once the large DailyTrackerHeader scrolls out of view.
 */
export function HeaderMiniStats() {
  const [visible, setVisible] = useState(false);
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [userCasinos, setUserCasinos] = useState<UserCasino[]>([]);

  useEffect(() => {
    // Observe the big tracker block to toggle mini stats visibility
    const target = document.getElementById("daily-tracker-header");

    // Fallback: show after small scroll if target is missing
    if (!target) {
      const onScroll = () => setVisible(window.scrollY > 80);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Show mini stats when the big block is mostly out of view
        setVisible(entry.intersectionRatio < 0.2);
      },
      { threshold: [0, 0.2, 1], rootMargin: "-8px 0px 0px 0px" }
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  // Lightweight live totals pulled directly in the header to avoid props plumbing
  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const fetchData = async () => {
      const { data: casinoData } = await supabase.from("casinos").select("*");
      if (mounted) setCasinos(casinoData || []);

      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: userCasinoData } = await supabase
          .from("user_casinos")
          .select("*")
          .eq("user_id", user.id);
        if (mounted) setUserCasinos(userCasinoData || []);
      }
    };

    fetchData();

    const casinoSub = supabase
      .channel("casinos-mini-stats")
      .on("postgres_changes", { event: "*", schema: "public", table: "casinos" }, fetchData)
      .subscribe();
    const userCasinoSub = supabase
      .channel("user-casinos-mini-stats")
      .on("postgres_changes", { event: "*", schema: "public", table: "user_casinos" }, fetchData)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(casinoSub);
      supabase.removeChannel(userCasinoSub);
    };
  }, []);

  const { scCollected, scTotal, gcCollected, gcTotal } = useMemo(() => {
    const scCollected = userCasinos
      .filter((uc) => uc.status === CasinoStatus.CollectedToday)
      .reduce((total, uc) => {
        const casino = casinos.find((c) => c.id === uc.casino_id);
        return total + (casino?.daily_sc ?? 0);
      }, 0);

    const scTotal = casinos.reduce((total, casino) => {
      const uc = userCasinos.find((x) => x.casino_id === casino.id);
      const status = uc?.status ?? CasinoStatus.NotRegistered;
      return total + (status === CasinoStatus.NotRegistered ? casino.welcome_sc ?? 0 : casino.daily_sc ?? 0);
    }, 0);

    const gcCollected = userCasinos
      .filter((uc) => uc.status === CasinoStatus.CollectedToday)
      .reduce((total, uc) => {
        const casino = casinos.find((c) => c.id === uc.casino_id);
        return total + (casino?.daily_gc ?? 0);
      }, 0);

    const gcTotal = casinos.reduce((total, casino) => {
      const uc = userCasinos.find((x) => x.casino_id === casino.id);
      const status = uc?.status ?? CasinoStatus.NotRegistered;
      return total + (status === CasinoStatus.NotRegistered ? casino.welcome_gc ?? 0 : casino.daily_gc ?? 0);
    }, 0);

    return { scCollected, scTotal, gcCollected, gcTotal };
  }, [casinos, userCasinos]);

  const formatNumber = (n: number) => new Intl.NumberFormat("en-US").format(n);
  const formatCompact = (n: number) => {
    const abs = Math.abs(n);
    if (abs >= 1_000_000) return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}m`;
    if (abs >= 1_000) return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}k`;
    return formatNumber(n);
  };

  const scLeft = Math.max(0, Number((scTotal - scCollected).toFixed(2)));
  const scCollectedFmt = (scCollected || 0).toFixed(2);
  const scTotalFmt = (scTotal || 0).toFixed(2);

  const gcLeft = Math.max(0, gcTotal - gcCollected);

  // Don’t render until we have some data; also skip when nothing to show
  const nothingToShow = casinos.length === 0;
  if (nothingToShow) return null;

  return (
    <div
      aria-live="polite"
      className={cn(
        "md:hidden pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
        "transition-all duration-300",
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95"
      )}
    >
      <div className="pointer-events-none flex flex-col items-center rounded-full bg-background/70 border border-border/60 px-3 py-1.5 shadow-md backdrop-blur-sm">
        {/* Top: labels with icons + collected */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-1.5" title={`SC collected: ${scCollectedFmt}`}>
            <ScCoinIcon className="h-3.5 w-3.5" />
            <span className="text-[12px] font-semibold text-status-sc">{scCollectedFmt}</span>
          </div>
          <div className="flex items-center gap-1.5" title={`GC collected: ${formatNumber(gcCollected)}`}>
            <GcCoinIcon className="h-3.5 w-3.5" />
            <span className="text-[12px] font-semibold text-status-gc">{formatCompact(gcCollected)}</span>
          </div>
        </div>
        {/* Bottom: amounts left */}
        <div className="mt-0.5 flex items-center justify-center gap-10 text-[11px] text-muted-foreground">
          <span>{scLeft.toFixed(2)}</span>
          <span>{formatCompact(gcLeft)}</span>
        </div>
      </div>
    </div>
  );
}
