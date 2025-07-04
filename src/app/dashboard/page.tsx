import { AdGallery } from "@/components/dashboard/ad-gallery";
import { EngagementChart } from "@/components/dashboard/engagement-chart";
import { MarketSnapshot } from "@/components/dashboard/market-snapshot";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { getAds, getEngagementData, getStats, geoData } from "@/lib/data";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";
import { getTranslations } from "@/lib/utils";
import { cookies } from "next/headers";
import { PlatformDistributionChart } from "@/components/dashboard/platform-distribution-chart";
import { Suspense } from "react";
import { DashboardSummarySkeleton } from "@/components/dashboard/dashboard-summary-skeleton";
import { GeoChart } from "@/components/dashboard/geo-chart";

export default async function DashboardPage() {
  const locale = cookies().get('locale')?.value;
  const t = getTranslations(locale);
  const stats = getStats();
  const engagementData = getEngagementData();
  const ads = getAds();

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">{t('DashboardPage.title')}</h1>
        <p className="text-muted-foreground">{t('DashboardPage.description')}</p>
      </header>
      
      <Suspense fallback={<DashboardSummarySkeleton />}>
        <DashboardSummary stats={stats} engagementData={engagementData} />
      </Suspense>
      
      <StatsCards stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 flex flex-col gap-8">
            <EngagementChart data={engagementData} />
            <AdGallery ads={ads} />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-8">
            <QuickActions t={t} />
            <PlatformDistributionChart data={engagementData} />
            <GeoChart data={geoData} />
            <MarketSnapshot />
        </div>
      </div>
      
    </div>
  );
}
