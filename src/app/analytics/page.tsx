
import { getAnalyticsDashboardData } from "@/lib/actions/analytics-actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, BookUser, Handshake, BarChart } from "lucide-react";
import { AnalyticsStatCard } from "./components/AnalyticsStatCard";
import { CasinoPopularityChart } from "./components/CasinoPopularityChart";
import { DailyBonusCollectionsChart } from "./components/DailyBonusCollectionsChart";
import { SectionHeader } from "@/components/layout/SectionHeader";

export default async function AnalyticsPage() {
  const {
    totalUsers,
    totalCasinos,
    totalRegistrations,
    totalReferrals,
    casinoPopularity,
    dailyCollections,
  } = await getAnalyticsDashboardData();

  return (
    <div className="space-y-6">
      <SectionHeader
        title="Analytics"
        description="Overview of your application's data and user activity."
        icon={<BarChart className="h-4 w-4 text-primary" />}
        className="sticky-under-header"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <AnalyticsStatCard
          title="Total Users"
          value={totalUsers}
          description="Total registered users in the system."
          icon={<Users className="h-4 w-4" />}
          accent="primary"
        />
        <AnalyticsStatCard
          title="Total Casinos"
          value={totalCasinos}
          description="Total casinos available for tracking."
          icon={<Shield className="h-4 w-4" />}
          accent="purple"
        />
        <AnalyticsStatCard
          title="Casino Registrations"
          value={totalRegistrations}
          description="User-to-casino tracking relationships."
          icon={<BookUser className="h-4 w-4" />}
          accent="green"
        />
        <AnalyticsStatCard
          title="Total Referrals"
          value={totalReferrals}
          description="Users registered via referral links."
          icon={<Handshake className="h-4 w-4" />}
          accent="yellow"
        />
      </div>
      
      <div className="grid gap-6 lg:grid-cols-2">
        <CasinoPopularityChart data={casinoPopularity} />
        <DailyBonusCollectionsChart data={dailyCollections} />
      </div>
    </div>
  );
}
export const dynamic = 'force-dynamic';
export const revalidate = 0;
