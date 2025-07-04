'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { useI18n } from '@/hooks/use-i18n';
import type { GeoData } from '@/lib/types';

const chartConfig = {
  marketStrength: {
    label: 'Market Strength',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

type GeoChartProps = {
  data: GeoData[];
};

export function GeoChart({ data }: GeoChartProps) {
    const { t } = useI18n();

    const localizedChartConfig = {
        ...chartConfig,
        marketStrength: {
            ...chartConfig.marketStrength,
            label: t('GeoChart.marketStrength')
        }
    }

  return (
    <Card className="bg-card/30 backdrop-blur-sm border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle>{t('GeoChart.title')}</CardTitle>
        <CardDescription>{t('GeoChart.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={localizedChartConfig} className="min-h-[300px] w-full">
          <BarChart 
            data={data} 
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
            <XAxis dataKey="marketStrength" type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
            <Tooltip cursor={{ fill: 'hsl(var(--accent) / 0.1)' }} content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="marketStrength" fill="var(--color-marketStrength)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
