'use client';

import { useMemo } from 'react';
import { Pie, PieChart, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { EngagementData } from '@/lib/types';
import { useI18n } from '@/hooks/use-i18n';

const chartConfig = {
  Facebook: { label: 'Facebook', color: 'hsl(var(--chart-1))' },
  Instagram: { label: 'Instagram', color: 'hsl(var(--chart-2))' },
  TikTok: { label: 'TikTok', color: 'hsl(var(--chart-3))' },
  Pinterest: { label: 'Pinterest', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

type PlatformDistributionChartProps = {
  data: EngagementData[];
};

export function PlatformDistributionChart({ data }: PlatformDistributionChartProps) {
  const { t } = useI18n();

  const chartData = useMemo(() => {
    const totals = { Facebook: 0, Instagram: 0, TikTok: 0, Pinterest: 0 };
    data.forEach(day => {
      totals.Facebook += day.Facebook;
      totals.Instagram += day.Instagram;
      totals.TikTok += day.TikTok;
      totals.Pinterest += day.Pinterest;
    });

    return Object.entries(totals).map(([platform, value]) => ({
      platform,
      value,
      fill: chartConfig[platform as keyof typeof chartConfig].color,
    }));
  }, [data]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('PlatformDistributionChart.title')}</CardTitle>
        <CardDescription>{t('PlatformDistributionChart.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="platform"
              innerRadius={60}
              strokeWidth={5}
            >
                {chartData.map((entry) => (
                    <Cell key={`cell-${entry.platform}`} fill={entry.fill} />
                ))}
            </Pie>
            <ChartLegend
              content={<ChartLegendContent nameKey="platform" />}
              className="-translate-y-[2px]"
              verticalAlign="bottom"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
