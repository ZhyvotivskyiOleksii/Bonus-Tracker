'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn, effectiveStatusForToday, getLogoScaleFromUrl, isCollectedTodayNY, openInBackground, preOpenBackground } from '@/lib/utils';
import type { Casino } from '@/lib/types';
import { UserCasino, CasinoStatus } from '@/lib/types';
import { Check, Loader2 } from 'lucide-react';
import { getAffiliateLink, markCollectedToday } from '@/lib/actions';
import { registerCasinoForUser } from '@/lib/actions/user-actions';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

type CasinoCardProps = {
  casino: Casino;
  userCasino: UserCasino | undefined;
};

export function CasinoCard({ casino, userCasino }: CasinoCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const initialStatusRaw = (userCasino?.status as CasinoStatus) ?? CasinoStatus.NotRegistered;
  const initialStatus = userCasino ? effectiveStatusForToday(initialStatusRaw, userCasino.last_collected_at) : initialStatusRaw;
  const [currentStatus, setCurrentStatus] = useState<CasinoStatus>(initialStatus);
  const [rawStatus, setRawStatus] = useState<CasinoStatus>(initialStatusRaw);
  const [lastCollectedAt, setLastCollectedAt] = useState<string | null | undefined>(userCasino?.last_collected_at);

  // Subscribe to realtime changes for this user's row to keep card in sync
  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    const refresh = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: fresh } = await supabase
          .from('user_casinos')
          .select('status,last_collected_at')
          .eq('user_id', user.id)
          .eq('casino_id', casino.id)
          .maybeSingle();
        if (fresh && isMounted) {
          const eff = effectiveStatusForToday(fresh.status as CasinoStatus, fresh.last_collected_at);
          setCurrentStatus(eff);
          setRawStatus(fresh.status as CasinoStatus);
          setLastCollectedAt(fresh.last_collected_at);
        }
      } catch {}
    };

    // Initial hydration
    refresh();

    // Listen for Supabase realtime updates
    let channelRef: any = null;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const channel = supabase
        .channel(`user-casino-card-${casino.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'user_casinos', filter: `user_id=eq.${user.id}` },
          (payload: any) => {
            const row = (payload.new || payload.old);
            if (row?.casino_id === casino.id && isMounted) {
              const eff = effectiveStatusForToday(row.status as CasinoStatus, row.last_collected_at);
              setCurrentStatus(eff);
              setRawStatus(row.status as CasinoStatus);
              setLastCollectedAt(row.last_collected_at);
            }
          }
        )
        .subscribe();
      channelRef = channel;
      // Attach event fallback for environments without realtime
      try {
        window.addEventListener('user_casinos_changed', refresh);
      } catch {}
      return;
    })();

    return () => {
      isMounted = false;
      try { window.removeEventListener('user_casinos_changed', refresh as any); } catch {}
      try { if (channelRef) supabase.removeChannel(channelRef); } catch {}
    };
  }, [casino.id]);

  const handleActionClick = async () => {
    if (currentStatus === CasinoStatus.CollectedToday || !casino.casino_url) return;
    setIsLoading(true);
    try {
        // Pre-open background tab synchronously to keep focus
        const pre = preOpenBackground();
        const link = await getAffiliateLink(casino.id, casino.casino_url);
        if (pre) {
          try { pre.location.href = link; } catch { try { pre.location.assign(link); } catch {} }
        } else {
          // Fallback if popup blocked
          openInBackground(link);
        }
        // Persist on the server using service role (bypass RLS edge cases)
        let persisted = false;
        const res = await markCollectedToday(casino.id);
        if (res?.success) {
          persisted = true;
        } else {
          // Fallback: persist from client (no service role available in env)
          try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              const newStatus = currentStatus === CasinoStatus.NotRegistered ? CasinoStatus.Registered : CasinoStatus.CollectedToday;
              const nowIso = new Date().toISOString();
              const { data: existing } = await supabase
                .from('user_casinos')
                .select('id,status')
                .eq('user_id', user.id)
                .eq('casino_id', casino.id)
                .maybeSingle();
              if (existing) {
                await supabase
                  .from('user_casinos')
                  .update({ status: newStatus, last_collected_at: nowIso })
                  .eq('id', existing.id);
              } else {
                await supabase
                  .from('user_casinos')
                  .insert({ user_id: user.id, casino_id: casino.id, status: newStatus, last_collected_at: nowIso });
              }
              persisted = true;
            }
          } catch (e) {
            console.warn('Client fallback persist failed:', e);
          }
        }

        const nowIso = new Date().toISOString();
        const newStatus = currentStatus === CasinoStatus.NotRegistered ? CasinoStatus.Registered : CasinoStatus.CollectedToday;
        setCurrentStatus(effectiveStatusForToday(newStatus, nowIso));
        setRawStatus(newStatus);
        setLastCollectedAt(nowIso);
        if (persisted && typeof window !== 'undefined') window.dispatchEvent(new Event('usercasinos:changed'));
    } catch(e) {
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

  const handleMarkRegistered = async () => {
    setIsLoading(true);
    try {
      const res = await registerCasinoForUser(casino.id);
      if (res.success) {
        setRawStatus(CasinoStatus.Registered);
        setCurrentStatus(CasinoStatus.Registered);
        setLastCollectedAt(null);
        try { window.dispatchEvent(new CustomEvent('user_casinos_changed')); } catch {}
      }
    } finally {
      setIsLoading(false);
    }
  };

  // At NY midnight, if previously collected, flip back to Registered automatically
  useEffect(() => {
    const id = setInterval(() => {
      if (currentStatus === CasinoStatus.CollectedToday && lastCollectedAt && !isCollectedTodayNY(lastCollectedAt)) {
        setCurrentStatus(CasinoStatus.Registered);
      }
    }, 60 * 1000);
    return () => clearInterval(id);
  }, [currentStatus, lastCollectedAt]);

  const formatCoins = (amount: number | null) => {
    if (amount === null || amount === undefined) return '0';
    return new Intl.NumberFormat('en-US').format(amount);
  };

  const formatSC = (amount: number | null) => {
    if (amount === null || amount === undefined) return '0.00';
    // check if it's a whole number
    if (amount % 1 === 0) {
      return amount.toFixed(2);
    }
    return amount.toFixed(2);
  }

  const isNotRegistered = currentStatus === CasinoStatus.NotRegistered;
  const isCollectedDaily = rawStatus === CasinoStatus.CollectedToday && currentStatus === CasinoStatus.CollectedToday;
  const isRegistrationLock = rawStatus === CasinoStatus.Registered && currentStatus === CasinoStatus.CollectedToday;

  const renderContent = () => {
    if (isNotRegistered) {
      return (
        <div className="space-y-4 text-center">
          <div className="bg-foreground/5 rounded-lg p-3">
            <p className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Sign up offer</p>
            <p className="text-2xl font-bold leading-tight">
              <span className="text-status-sc">{formatSC(casino.welcome_sc)} SC</span>
              <span className="text-white/80 mx-1"> + </span>
              <span className="text-status-gc">{formatCoins(casino.welcome_gc)} GC</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground px-4 mb-2">
            Register to add its <span className="font-bold text-foreground">{formatSC(casino.daily_sc)} SC daily bonus</span> to your tracker!
          </p>
        </div>
      );
    }

    // Highlight for Get Bonus (Registered state): show a pill with label DAILY BONUS
    if (currentStatus === CasinoStatus.Registered) {
      return (
        <div className="space-y-3 text-center">
          <div className="bg-foreground/5 rounded-lg p-3">
            <p className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Daily Bonus</p>
            <p className="text-2xl font-bold leading-tight">
              <span className={cn("text-status-sc")}>{formatSC(casino.daily_sc)} SC</span>
              <span className="text-white/80 mx-1"> + </span>
              <span className={cn("text-status-gc")}>{formatCoins(casino.daily_gc)} GC</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Available once per day</p>
        </div>
      );
    }

    if (currentStatus === CasinoStatus.CollectedToday) {
      return (
        <div className="space-y-3 text-center">
          <div className="bg-foreground/5 rounded-lg p-3">
            <p className="text-xs uppercase text-muted-foreground font-semibold tracking-wider">Daily Bonus</p>
            <p className="text-2xl font-bold leading-tight">
              <span className={cn("text-status-sc")}>{formatSC(casino.daily_sc)} SC</span>
              <span className="text-white/80 mx-1"> + </span>
              <span className={cn("text-status-gc")}>{formatCoins(casino.daily_gc)} GC</span>
            </p>
          </div>
          <p className="text-xs text-muted-foreground">Available once per day</p>
        </div>
      );
    }

    return (
      <div className="text-center space-y-2">
        <p className="text-3xl font-bold">
          <span className={cn("text-status-sc")}>{formatSC(casino.daily_sc)} SC</span>
          <span className="text-muted-foreground mx-1"> + </span>
          <span className={cn("text-status-gc")}>{formatCoins(casino.daily_gc)} GC</span>
        </p>
      </div>
    );
  }

  const renderButton = () => {
    const commonProps = {
      className: 'w-full font-bold text-base h-12 rounded-md',
      onClick: handleActionClick,
      disabled: isLoading || !casino.casino_url,
    };

    const buttonContent = (icon: React.ReactNode, text: string) => (
      <>
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : icon}
        {text}
      </>
    );

    if (isRegistrationLock) {
      return (
        <div className="w-[86%] sm:w-3/4 md:w-2/3 mx-auto">
          <Button
            {...commonProps}
            disabled
            className="w-full bg-blue-600/40 text-white/80 cursor-not-allowed border border-white/10"
          >
            {buttonContent(null, 'Get Bonus')}
          </Button>
        </div>
      );
    }
    switch (currentStatus) {
      case CasinoStatus.CollectedToday:
        return (
          <div className="w-[86%] sm:w-3/4 md:w-2/3 mx-auto">
            <Button variant="ghost" className={cn("w-full", "bg-status-collected-button hover:bg-status-collected-button/90 text-white")} disabled>
              <Check className="mr-2 h-5 w-5" />
              Bonus Claimed
            </Button>
          </div>
        );
      case CasinoStatus.NotRegistered:
        return (
          <div className="w-[90%] sm:w-4/5 md:w-2/3 mx-auto flex flex-col gap-2">
            <Button
              {...commonProps}
              variant="default"
              className="w-full bg-status-not-registered hover:bg-status-not-registered/90 text-white"
            >
              {buttonContent(null, 'Register Now')}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full h-9 text-sm border-blue-500/40 text-blue-200 bg-blue-500/10 hover:bg-blue-500/20"
              onClick={handleMarkRegistered}
              disabled={isLoading}
            >
              I already have an account
            </Button>
          </div>
        );
      case CasinoStatus.Registered:
        return (
          <div className="w-[86%] sm:w-3/4 md:w-2/3 mx-auto">
            <Button
              {...commonProps}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.7)]"
            >
              {buttonContent(null, 'Get Bonus')}
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  const getCardClasses = () => {
    switch (currentStatus) {
      case CasinoStatus.NotRegistered:
        return 'border-status-not-registered bg-muted/20';
      case CasinoStatus.CollectedToday:
        return isCollectedDaily ? 'border-status-collected-border bg-card/70' : 'border-border bg-card/70';
      default:
        return 'border-border bg-card/90';
    }
  }

  return (
    <Card className={cn(
        'flex flex-col justify-between transition-all duration-300 border shadow-lg hover:shadow-2xl hover:scale-[1.02] relative overflow-hidden group p-4 rounded-2xl',
         getCardClasses()
    )}>
      {/* Decorative icons removed by request */}
       {isCollectedDaily && (
          <div className="absolute top-3 right-3 h-8 w-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Check className="h-6 w-6 text-status-collected-button" />
          </div>
        )}
      <CardHeader className="flex-grow-0 flex items-center justify-center p-0 h-24">
        <div className={cn("relative flex items-center justify-center h-full w-full")}> 
            {casino.logo_url ? (() => { const s = getLogoScaleFromUrl(casino.logo_url); return (
              <Image
                  src={casino.logo_url}
                  alt={`${casino.name} logo`}
                  width={Math.round(150 * s)}
                  height={Math.round(64 * s)}
                  className="object-contain"
              />)} )() : (
              <div className="text-muted-foreground">{casino.name}</div>
            )}
        </div>
      </CardHeader>
      <CardContent className={cn("flex-grow flex flex-col justify-center p-0 mt-4")}>
        {renderContent()}
      </CardContent>
      <CardFooter className="p-0 mt-4 flex-grow-0 flex justify-center">
        {renderButton()}
      </CardFooter>
    </Card>
  );
}
