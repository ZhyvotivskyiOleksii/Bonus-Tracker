import { CasinoCard } from '@/components/dashboard/CasinoCard';
import { MassOpenButton } from '@/components/dashboard/MassOpenButton';
import { DailyTrackerHeader } from '@/components/dashboard/DailyTrackerHeader';
import { CasinoStatus, type Casino, type UserCasino } from '@/lib/types';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: casinos, error: casinosError } = await supabase
    .from('casinos')
    .select('*');

  const { data: userCasinos, error: userCasinosError } = user
    ? await supabase
      .from('user_casinos')
      .select('*')
      .eq('user_id', user.id)
    : { data: [], error: null };

  if (casinosError || userCasinosError) {
    console.error("Dashboard Error:", casinosError || userCasinosError);
    return (
        <div className="flex items-center justify-center h-full">
            <Alert variant="destructive" className="max-w-md">
                <Info className="h-4 w-4" />
                <AlertTitle>Error Loading Data</AlertTitle>
                <AlertDescription>
                    Could not load dashboard data. Please try again later.
                </AlertDescription>
            </Alert>
        </div>
    )
  }

  if (!casinos || casinos.length === 0) {
    return (
        <div className="space-y-6">
            <DailyTrackerHeader casinos={[]} userCasinos={[]} />
            <div className="flex items-center justify-center h-48">
                <Alert className="max-w-md">
                    <Info className="h-4 w-4" />
                    <AlertTitle>No Casino Offers Available</AlertTitle>
                    <AlertDescription>
                        There are currently no casino offers to display. An administrator can add new offers in the admin panel.
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    )
  }
  
  const statusOrder = {
    [CasinoStatus.Registered]: 1,
    [CasinoStatus.NotRegistered]: 2,
    [CasinoStatus.CollectedToday]: 3,
  };
  
  const sortedCasinos = [...casinos].sort((a, b) => {
    // Priority casinos first
    if (a.is_priority && !b.is_priority) return -1;
    if (!a.is_priority && b.is_priority) return 1;

    const statusA = userCasinos?.find(uc => uc.casino_id === a.id)?.status ?? CasinoStatus.NotRegistered;
    const statusB = userCasinos?.find(uc => uc.casino_id === b.id)?.status ?? CasinoStatus.NotRegistered;
    
    // Don't sort priority casinos against each other if their status is collected
    if (a.is_priority && b.is_priority) {
       if (statusA === CasinoStatus.CollectedToday && statusB !== CasinoStatus.CollectedToday) return 1;
       if (statusA !== CasinoStatus.CollectedToday && statusB === CasinoStatus.CollectedToday) return -1;
       return 0;
    }

    const orderA = statusOrder[statusA as CasinoStatus] ?? 99;
    const orderB = statusOrder[statusB as CasinoStatus] ?? 99;
    
    return orderA - orderB;
  });

  return (
    <div className="space-y-6">
      <DailyTrackerHeader casinos={casinos} userCasinos={userCasinos || []} />

      <div className="flex justify-end">
        <MassOpenButton casinos={casinos} userCasinos={userCasinos || []} />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 min-h-0">
        {sortedCasinos.map(casino => {
          const userCasino = userCasinos?.find(uc => uc.casino_id === casino.id);
          return <CasinoCard key={casino.id} casino={casino} userCasino={userCasino} />;
        })}
      </div>
    </div>
  );
}
