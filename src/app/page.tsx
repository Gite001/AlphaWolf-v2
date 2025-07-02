import { AdGallery } from "@/components/dashboard/ad-gallery";
import { EngagementChart } from "@/components/dashboard/engagement-chart";
import { StatsCards } from "@/components/dashboard/stats-cards";
import { ads, engagementData, stats } from "@/lib/data";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      <header>
        <h1 className="text-3xl font-bold font-headline tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back to your AdInsights dashboard.</p>
      </header>
      
      <StatsCards stats={stats} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
          <EngagementChart data={engagementData} />
        </div>
      </div>
      
      <AdGallery ads={ads} />
    </div>
  );
}
