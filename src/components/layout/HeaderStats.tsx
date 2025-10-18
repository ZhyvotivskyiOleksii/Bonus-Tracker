'use client';

import { createClient } from '@/lib/supabase/client';
import { Casino, UserCasino } from '@/lib/types';
import { computeBonusTotals } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function HeaderStats() {
  const [timeLeft, setTimeLeft] = useState('--:--:--');
  const [casinos, setCasinos] = useState<Casino[]>([]);
  const [userCasinos, setUserCasinos] = useState<UserCasino[]>([]);

  useEffect(() => {
    const supabase = createClient();
    const fetchInitialData = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        const { data: casinoData } = await supabase.from('casinos').select('*');
        setCasinos(casinoData || []);

        if (user) {
            const { data: userCasinoData } = await supabase.from('user_casinos').select('*').eq('user_id', user.id);
            setUserCasinos(userCasinoData || []);
        }
    };
    
    fetchInitialData();
    
    const casinoSub = supabase.channel('casinos-channel').on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'casinos' },
        () => fetchInitialData()
    ).subscribe();

    const userCasinoSub = supabase.channel('user-casinos-channel').on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_casinos' },
        () => fetchInitialData()
    ).subscribe();

    // Fallback: also refresh when any component dispatches a local event
    const onLocalChanged = () => fetchInitialData();
    if (typeof window !== 'undefined') {
      window.addEventListener('usercasinos:changed', onLocalChanged);
    }

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

    return () => {
        clearInterval(interval);
        supabase.removeChannel(casinoSub);
        supabase.removeChannel(userCasinoSub);
        if (typeof window !== 'undefined') {
          window.removeEventListener('usercasinos:changed', onLocalChanged);
        }
    };
  }, []);

  if (!casinos.length) return null;

  const {
    scCollected: collectedScToday,
    scTotal: totalScToday,
    gcCollected: collectedGcToday,
    gcTotal: totalGcToday,
  } = computeBonusTotals(casinos, userCasinos);

  const formatCoins = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
  };

  return (
    <div className="flex items-center justify-center gap-4 sm:gap-8 text-center w-full">
      <div className="hidden sm:block">
        <div className="text-xs sm:text-sm text-muted-foreground">SC Collected</div>
        <div className="text-base sm:text-lg font-bold text-status-sc">
          {collectedScToday.toFixed(2)} / <span className="text-foreground/80">{totalScToday.toFixed(2)}</span>
        </div>
      </div>
      <div className="hidden sm:block">
        <div className="text-xs sm:text-sm text-muted-foreground">GC Collected</div>
        <div className="text-base sm:text-lg font-bold text-status-gc">
          {formatCoins(collectedGcToday)} / <span className="text-foreground/80">{formatCoins(totalGcToday)}</span>
        </div>
      </div>
      <div>
        <div className="text-xs sm:text-sm text-muted-foreground">New Bonuses In</div>
        <div className="text-base sm:text-lg font-bold text-primary">{timeLeft}</div>
      </div>
    </div>
  );
}
