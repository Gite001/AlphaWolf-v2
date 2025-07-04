'use client';

import { Line, LineChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { AnalyzeMarketplaceTrendsOutput } from '@/ai/flows/analyze-marketplace-trends';
import { useI18n } from '@/hooks/use-i18n';

const chartConfig = {
  demandScore: {
    label: 'Demand Score',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

type DemandTrendChartProps = {
  data: AnalyzeMarketplaceTrendsOutput['demandTrend'];
  analysis: string;
};

export function DemandTrendChart({ data, analysis }: DemandTrendChartProps) {
  const { t } = useI18n();
  return (
    <Card className="bg-card/30 backdrop-blur-sm border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle>{t('DemandTrendChart.title')}</CardTitle>
        <CardDescription>{analysis}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
          <LineChart
            data={data}
            accessibilityLayer
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="hsl(var(--muted-foreground))"
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              stroke="hsl(var(--muted-foreground))"
              domain={[0, 100]}
            />
            <Tooltip
              cursor={{ strokeDasharray: '3 3' }}
              content={<ChartTooltipContent indicator="dot" />}
            />
            <Line
              dataKey="demandScore"
              type="monotone"
              stroke="var(--color-demandScore)"
              strokeWidth={2}
              dot={true}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
