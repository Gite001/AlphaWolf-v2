'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { useI18n } from '@/hooks/use-i18n';
import type { AnalyzeMarketTrendsOutput } from '@/ai/flows/analyze-market-trends';

const chartConfig = {
  demandScore: {
    label: 'Demand Score',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

type GeoTrendChartProps = {
  data: NonNullable<AnalyzeMarketTrendsOutput['geoTrend']>;
  analysis: string;
};

export function GeoTrendChart({ data, analysis }: GeoTrendChartProps) {
    const { t } = useI18n();
    const localizedChartConfig = {
        ...chartConfig,
        demandScore: {
            ...chartConfig.demandScore,
            label: t('GeoTrendChart.demandScore')
        }
    }

  return (
    <Card className="bg-card/30 backdrop-blur-sm border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle>{t('GeoTrendChart.title')}</CardTitle>
        <CardDescription>{analysis}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={localizedChartConfig} className="min-h-[300px] w-full">
          <BarChart 
            data={data.sort((a, b) => a.demandScore - b.demandScore)} 
            accessibilityLayer
            layout="vertical"
            margin={{
              left: 20,
              right: 20,
            }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <YAxis
                dataKey="country"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                width={100}
                interval={0}
            />
            <XAxis dataKey="demandScore" type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
            <ChartTooltip cursor={{ fill: 'hsl(var(--accent) / 0.1)' }} content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="demandScore" fill="var(--color-demandScore)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
