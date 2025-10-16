'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { Casino } from '@/lib/types';
import { UserCasino, CasinoStatus } from '@/lib/types';
import { Check, Loader2 } from 'lucide-react';
import { getAffiliateLink } from '@/lib/actions';
import { useState } from 'react';

type CasinoCardProps = {
  casino: Casino;
  userCasino: UserCasino | undefined;
};

export function CasinoCard({ casino, userCasino }: CasinoCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const status = userCasino?.status as CasinoStatus ?? CasinoStatus.NotRegistered;

  const handleActionClick = async () => {
    if (status === CasinoStatus.CollectedToday || !casino.casino_url) return;
    setIsLoading(true);
    try {
        const link = await getAffiliateLink(casino.id, casino.casino_url);
        window.open(link, '_blank');
    } catch(e) {
        console.error(e);
    } finally {
        setIsLoading(false);
    }
  };

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

  const isNotRegistered = status === CasinoStatus.NotRegistered;
  const isCollected = status === CasinoStatus.CollectedToday;

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
        )
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

    switch (status) {
      case CasinoStatus.CollectedToday:
        return (
          <Button variant="ghost" className={cn(commonProps.className, "bg-status-collected-button hover:bg-status-collected-button/90 text-white")} disabled>
            <Check className="mr-2 h-5 w-5" />
            Bonus Claimed
          </Button>
        );
      case CasinoStatus.NotRegistered:
        return (
          <Button {...commonProps} variant="default" className="bg-status-not-registered hover:bg-status-not-registered/90 text-white">
            {buttonContent(null, 'Register Now')}
          </Button>
        );
      case CasinoStatus.Registered:
        return (
          <Button {...commonProps}>
            {buttonContent(null, 'Get Bonus')}
          </Button>
        );
      default:
        return null;
    }
  };

  const getCardClasses = () => {
    switch (status) {
      case CasinoStatus.NotRegistered:
        return 'border-status-not-registered';
      case CasinoStatus.CollectedToday:
        return 'border-status-collected-border';
      default:
        return 'border-border';
    }
  }

  return (
    <Card className={cn(
        'flex flex-col justify-between transition-all duration-300 border shadow-lg hover:shadow-2xl hover:scale-[1.02] relative overflow-hidden group p-4 rounded-2xl',
         getCardClasses()
    )}>
       {isCollected && (
          <div className="absolute top-3 right-3 h-8 w-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
            <Check className="h-6 w-6 text-status-collected-button" />
          </div>
        )}
      <CardHeader className="flex-grow-0 flex items-center justify-center p-0 h-24">
        <div className={cn("relative flex items-center justify-center h-full w-full")}>
            {casino.logo_url ? (
              <Image
                  src={casino.logo_url}
                  alt={`${casino.name} logo`}
                  width={150}
                  height={64}
                  className="object-contain h-16 w-auto"
              />
            ) : (
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
