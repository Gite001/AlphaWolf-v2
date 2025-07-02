import { AdGallery } from "@/components/dashboard/ad-gallery";
import { EngagementChart } from "@/components/dashboard/engagement-chart";
import { MarketSnapshot } from "@/components/dashboard/market-snapshot";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ads, engagementData, stats } from "@/lib/data";
import { DashboardSummary } from "@/components/dashboard/dashboard-summary";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Centre de Commande</h1>
        <p className="text-muted-foreground">Votre tableau de bord marketing piloté par l'IA.</p>
      </header>
      
      <DashboardSummary stats={stats} engagementData={engagementData} />
      
      <StatsCards stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 flex flex-col gap-8">
            <EngagementChart data={engagementData} />
            <AdGallery ads={ads} />
        </div>
        <div className="lg:col-span-2 flex flex-col gap-8">
            <QuickActions />
            <MarketSnapshot />
        </div>
      </div>
      
    </div>
  );
}
