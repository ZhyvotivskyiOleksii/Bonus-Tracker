'use client';

import { Progress } from '@/components/ui/progress';
import { Casino, CasinoStatus, UserCasino } from '@/lib/types';
import { computeBonusTotals, effectiveStatusForToday } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { GcCoinIcon, ScCoinIcon } from '../icons';

interface DailyTrackerHeaderProps {
    casinos: Casino[];
    userCasinos: UserCasino[];
}

export function DailyTrackerHeader({ casinos, userCasinos }: DailyTrackerHeaderProps) {
  const [timeLeft, setTimeLeft] = useState('--:--:--');
  const [liveCasinos, setLiveCasinos] = useState<Casino[]>(casinos);
  const [liveUserCasinos, setLiveUserCasinos] = useState<UserCasino[]>(userCasinos);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const newYorkTime = new Date(now.toLocaleString('en-US', { timeZone: 'America/New_York' }));
      const endOfDay = new Date(newYorkTime);
      endOfDay.setHours(24, 0, 0, 0);
      
      const diff = endOfDay.getTime() - newYorkTime.getTime();

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };

    setTimeLeft(calculateTimeLeft());
    
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Live sync: fetch + subscribe + react to local events
  useEffect(() => {
    const supabase = createClient();
    let mounted = true;
    const fetchData = async () => {
      const { data: casinoData } = await supabase.from('casinos').select('*');
      const { data: { user } } = await supabase.auth.getUser();
      const { data: userCasinoData } = user
        ? await supabase.from('user_casinos').select('*').eq('user_id', user.id)
        : { data: [] as UserCasino[] };
      if (!mounted) return;
      setLiveCasinos(casinoData || []);
      setLiveUserCasinos(userCasinoData || []);
    };
    fetchData();
    const ch1 = supabase
      .channel('dth-casinos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'casinos' }, fetchData)
      .subscribe();
    const ch2 = supabase
      .channel('dth-user-casinos')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'user_casinos' }, fetchData)
      .subscribe();
    const onLocal = () => fetchData();
    if (typeof window !== 'undefined') window.addEventListener('usercasinos:changed', onLocal);
    return () => {
      mounted = false;
      supabase.removeChannel(ch1);
      supabase.removeChannel(ch2);
      if (typeof window !== 'undefined') window.removeEventListener('usercasinos:changed', onLocal);
    };
  }, []);

  const {
    scCollected: collectedScToday,
    scTotal: totalScToday,
    gcCollected: collectedGcToday,
    gcTotal: totalGcToday,
    scCardsCollected: collectedScCards,
    scCardsTotal: totalScCards,
    gcCardsCollected: collectedGcCards,
    gcCardsTotal: totalGcCards,
  } = computeBonusTotals(liveCasinos, liveUserCasinos);


  const formatGc = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
  }

  // Progress should reflect how many cards are collected (count-based),
  // while keeping amounts for the numeric labels. This auto‑scales with the
  // number of casinos available today.
  // card-count totals now come from computeBonusTotals

  const scProgress = totalScCards > 0 ? (collectedScCards / totalScCards) * 100 : 0;
  const gcProgress = totalGcCards > 0 ? (collectedGcCards / totalGcCards) * 100 : 0;

  return (
    <div id="daily-tracker-header" className="bg-card p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Your Daily Bonus Tracker</h1>
          <p className="text-muted-foreground">All your daily bonuses in one place.</p>
        </div>
        <div className="text-center bg-background/50 border border-border p-3 rounded-lg">
          <p className="text-xs text-muted-foreground">Bonuses Reset In:</p>
          <p className="text-xl font-bold text-foreground">{timeLeft}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-muted-foreground">SC Collected Today:</span>
            <span className="text-sm font-bold text-status-sc">{collectedScToday.toFixed(2)} SC</span>
          </div>
          <div className="relative">
            <Progress value={scProgress} className="h-4 [&>div]:bg-status-sc" />
             <ScCoinIcon
              className="h-8 w-8 absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ease-out"
              style={{ left: `clamp(16px, ${scProgress}%, calc(100% - 16px))` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm font-medium text-muted-foreground">GC Collected Today:</span>
            <span className="text-sm font-bold text-status-gc">{formatGc(collectedGcToday)} GC</span>
          </div>
          <div className="relative">
            <Progress value={gcProgress} className="h-4 [&>div]:bg-status-gc" />
            <GcCoinIcon
                className="h-8 w-8 absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-all duration-500 ease-out"
                style={{ left: `clamp(16px, ${gcProgress}%, calc(100% - 16px))` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
