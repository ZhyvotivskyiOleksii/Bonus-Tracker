
'use server';

import { createClient } from '@/lib/supabase/server';
import { startOfToday, subDays, format } from 'date-fns';

type CasinoPopularityData = {
  name: string;
  count: number;
};

export type DailyCollectionData = {
  date: string;
  count: number;
};

type AnalyticsDashboardData = {
  totalUsers: number;
  totalCasinos: number;
  totalRegistrations: number;
  totalReferrals: number;
  casinoPopularity: CasinoPopularityData[];
  dailyCollections: DailyCollectionData[];
};

export async function getAnalyticsDashboardData(): Promise<AnalyticsDashboardData> {
  const supabase = createClient();
  const today = startOfToday();

  try {
    // 1. Get total users
    const { count: totalUsers, error: usersError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    if (usersError) throw new Error(`Users count error: ${usersError.message}`);

    // 2. Get total casinos
    const { count: totalCasinos, error: casinosError } = await supabase
      .from('casinos')
      .select('*', { count: 'exact', head: true });
    if (casinosError) throw new Error(`Casinos count error: ${casinosError.message}`);
    
    // 3. Get total user-casino registrations
    const { count: totalRegistrations, error: registrationsError } = await supabase
        .from('user_casinos')
        .select('*', { count: 'exact', head: true })
        .in('status', ['registered', 'collected_today']);
    if(registrationsError) throw new Error(`Registrations count error: ${registrationsError.message}`);

    // 4. Get total referrals
    const { count: totalReferrals, error: referralsError } = await supabase
      .from('referrals')
      .select('*', { count: 'exact', head: true });
    if (referralsError) throw new Error(`Referrals count error: ${referralsError.message}`);

    // 5. Get casino popularity
    const { data: casinoPopularityData, error: popularityError } = await supabase
        .from('user_casinos')
        .select('casinos ( name ), user_id')
        .in('status', ['registered', 'collected_today']);

    if(popularityError) throw new Error(`Popularity error: ${popularityError.message}`);

    const popularityMap = new Map<string, number>();
    casinoPopularityData.forEach(item => {
        const casinoName = (item.casinos as any)?.name;
        if(casinoName) {
            popularityMap.set(casinoName, (popularityMap.get(casinoName) || 0) + 1);
        }
    });
    
    const casinoPopularity: CasinoPopularityData[] = Array.from(popularityMap.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); // Take only the top 10


    // 6. Get daily collections for the last 7 days
    const sevenDaysAgo = subDays(today, 6); // including today
    const { data: dailyCollectionsData, error: collectionsError } = await supabase
      .from('user_casinos')
      .select('last_collected_at')
      .gte('last_collected_at', sevenDaysAgo.toISOString());
    
    if (collectionsError) throw new Error(`Daily collections error: ${collectionsError.message}`);

    const collectionsByDay = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
        const date = format(subDays(today, i), 'yyyy-MM-dd');
        collectionsByDay.set(date, 0);
    }
    
    dailyCollectionsData.forEach(item => {
        if(item.last_collected_at) {
            const date = format(new Date(item.last_collected_at), 'yyyy-MM-dd');
            if (collectionsByDay.has(date)) {
                collectionsByDay.set(date, (collectionsByDay.get(date) || 0) + 1);
            }
        }
    });

    const dailyCollections: DailyCollectionData[] = Array.from(collectionsByDay.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    

    return {
      totalUsers: totalUsers ?? 0,
      totalCasinos: totalCasinos ?? 0,
      totalRegistrations: totalRegistrations ?? 0,
      totalReferrals: totalReferrals ?? 0,
      casinoPopularity,
      dailyCollections
    };
  } catch (error) {
    console.error('Failed to get analytics dashboard data:', error);
    // Return empty/zero state on error
    return {
      totalUsers: 0,
      totalCasinos: 0,
      totalRegistrations: 0,
      totalReferrals: 0,
      casinoPopularity: [],
      dailyCollections: [],
    };
  }
}
