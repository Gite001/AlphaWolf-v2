import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Stat } from "@/lib/types";
import { ArrowDown, ArrowUp } from "lucide-react";
import { getTranslations } from "@/lib/utils";
import { cookies } from "next/headers";

type StatsCardsProps = {
  stats: Stat[];
};

export async function StatsCards({ stats }: StatsCardsProps) {
  const locale = cookies().get('locale')?.value;
  const t = getTranslations(locale);
  
  const translatedStats: Stat[] = [
    { ...stats[0], title: t('Stats.trackedAds') },
    { ...stats[1], title: t('Stats.winningProducts') },
    { ...stats[2], title: t('Stats.topEngagement') },
    { ...stats[3], title: t('Stats.newCompetitors'), change: t('Stats.changeText', { count: 5 }) },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {translatedStats.map((stat) => (
        <Card key={stat.title} className="bg-card/30 backdrop-blur-sm border-white/10 shadow-lg hover:shadow-primary/10 hover:-translate-y-1 transition-transform duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className={cn(
                "flex items-center gap-1",
                stat.changeType === 'increase' ? 'text-green-400' : 'text-red-400'
              )}>
                {stat.changeType === 'increase' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
                {stat.change}
              </span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
