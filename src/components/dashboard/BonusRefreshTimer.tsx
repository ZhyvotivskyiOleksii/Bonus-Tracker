'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimerIcon } from 'lucide-react';

export function BonusRefreshTimer() {
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

    // Set initial time
    setTimeLeft(calculateTimeLeft());
    
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Bonus Refresh</CardTitle>
        <TimerIcon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{timeLeft}</div>
        <p className="text-xs text-muted-foreground">until bonuses reset (NY Time)</p>
      </CardContent>
    </Card>
  );
}
