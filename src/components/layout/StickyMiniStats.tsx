"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Casino, CasinoStatus, UserCasino } from "@/lib/types";
import { GcCoinIcon, ScCoinIcon } from "../icons";
import { cn } from "@/lib/utils";

// Slim bar under the header that appears when the big tracker
// reaches the screen midpoint while scrolling down.
export function StickyMiniStats() {
  const [visible, setVisible] = useState(false);
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [userCasinos, setUserCasinos] = useState<UserCasino[]>([]);

  // Fetch data (lightweight) and subscribe to changes
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
      .channel("casinos-sticky-mini")
      .on("postgres_changes", { event: "*", schema: "public", table: "casinos" }, fetchData)
      .subscribe();
    const userCasinoSub = supabase
      .channel("user-casinos-sticky-mini")
      .on("postgres_changes", { event: "*", schema: "public", table: "user_casinos" }, fetchData)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(casinoSub);
      supabase.removeChannel(userCasinoSub);
    };
  }, []);

  // Show when the center of the main tracker passes above the header
  useEffect(() => {
    const HEADER_H = 56; // h-14
    const onScroll = () => {
      const el = document.getElementById("daily-tracker-header");
      if (!el) return setVisible(false);
      const r = el.getBoundingClientRect();
      const centerY = r.top + r.height / 2;
      // Appear when center of the block is above the header plus small margin
      setVisible(centerY <= HEADER_H + 8);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
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

  const fmt = new Intl.NumberFormat("en-US");
  const scCollectedFmt = (scCollected || 0).toFixed(2);
  const scTotalFmt = (scTotal || 0).toFixed(2);

  if (!casinos.length) return null;

  return (
    <div
      className={cn(
        // Fixed under header, centered
        "md:hidden fixed left-0 right-0 top-14 z-20 flex justify-center pointer-events-none",
        "transition-all duration-300",
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      )}
    >
      <div className="pointer-events-none w-full max-w-2xl px-4">
        <div className="flex items-center justify-center gap-6 rounded-full bg-background/75 border border-border/60 px-3 py-1 shadow-md backdrop-blur-sm">
          {/* SC: collected / total */}
          <div className="flex items-baseline gap-1">
            <ScCoinIcon className="h-3.5 w-3.5" />
            <span className="text-[10px] text-muted-foreground">SC Collected</span>
            <span className="text-[12px] font-semibold text-status-sc">{scCollectedFmt}</span>
            <span className="text-[12px] text-muted-foreground">/ {scTotalFmt}</span>
          </div>
          <span className="h-3 w-px bg-border/60" />
          {/* GC: collected / total */}
          <div className="flex items-baseline gap-1">
            <GcCoinIcon className="h-3.5 w-3.5" />
            <span className="text-[10px] text-muted-foreground">GC Collected</span>
            <span className="text-[12px] font-semibold text-status-gc">{fmt.format(gcCollected)}</span>
            <span className="text-[12px] text-muted-foreground">/ {fmt.format(gcTotal)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

