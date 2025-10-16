'use client';

import { Progress } from '@/components/ui/progress';
import { Casino, CasinoStatus, UserCasino } from '@/lib/types';
import { useEffect, useState } from 'react';
import { GcCoinIcon, ScCoinIcon } from '../icons';

interface DailyTrackerHeaderProps {
    casinos: Casino[];
    userCasinos: UserCasino[];
}

export function DailyTrackerHeader({ casinos, userCasinos }: DailyTrackerHeaderProps) {
  const [timeLeft, setTimeLeft] = useState('--:--:--');

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

  const collectedScToday = userCasinos
    .filter(uc => uc.status === CasinoStatus.CollectedToday)
    .reduce((total, uc) => {
      const casino = casinos.find(c => c.id === uc.casino_id);
      return total + (casino?.daily_sc ?? 0);
    }, 0);

  const totalScToday = casinos.reduce((total, casino) => {
    const userCasino = userCasinos.find(uc => uc.casino_id === casino.id);
    const status = userCasino?.status ?? CasinoStatus.NotRegistered;
    
    if (status === CasinoStatus.NotRegistered) {
      return total + (casino.welcome_sc ?? 0);
    }
    return total + (casino.daily_sc ?? 0);
  }, 0);


  const collectedGcToday = userCasinos
    .filter(uc => uc.status === CasinoStatus.CollectedToday)
    .reduce((total, uc) => {
      const casino = casinos.find(c => c.id === uc.casino_id);
      return total + (casino?.daily_gc ?? 0);
    }, 0);

  const totalGcToday = casinos.reduce((total, casino) => {
    const userCasino = userCasinos.find(uc => uc.casino_id === casino.id);
    const status = userCasino?.status ?? CasinoStatus.NotRegistered;

    if (status === CasinoStatus.NotRegistered) {
        return total + (casino.welcome_gc ?? 0);
    }
    return total + (casino.daily_gc ?? 0);
  }, 0);


  const formatGc = (amount: number) => {
    return new Intl.NumberFormat('en-US').format(amount);
  }

  const scProgress = totalScToday > 0 ? (collectedScToday / totalScToday) * 100 : 0;
  const gcProgress = totalGcToday > 0 ? (collectedGcToday / totalGcToday) * 100 : 0;

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
