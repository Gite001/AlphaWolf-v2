'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';
import type { EngagementData } from '@/lib/types';
import { useI18n } from '@/hooks/use-i18n';

const chartConfig = {
  Facebook: { label: 'Facebook', color: 'hsl(var(--chart-1))' },
  Instagram: { label: 'Instagram', color: 'hsl(var(--chart-2))' },
  TikTok: { label: 'TikTok', color: 'hsl(var(--chart-3))' },
  Pinterest: { label: 'Pinterest', color: 'hsl(var(--chart-4))' },
} satisfies ChartConfig;

type EngagementChartProps = {
  data: EngagementData[];
};

export function EngagementChart({ data }: EngagementChartProps) {
  const { t } = useI18n();
  return (
    <Card className="bg-card/30 backdrop-blur-sm border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle>{t('EngagementChart.title')}</CardTitle>
        <CardDescription>{t('EngagementChart.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis stroke="hsl(var(--muted-foreground))" />
            <ChartTooltip 
              cursor={{ fill: 'hsl(var(--accent) / 0.1)' }}
              content={<ChartTooltipContent />} 
            />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="Facebook" fill="var(--color-Facebook)" radius={4} />
            <Bar dataKey="Instagram" fill="var(--color-Instagram)" radius={4} />
            <Bar dataKey="TikTok" fill="var(--color-TikTok)" radius={4} />
            <Bar dataKey="Pinterest" fill="var(--color-Pinterest)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
