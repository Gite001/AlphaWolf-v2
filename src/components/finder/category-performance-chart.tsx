'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { useI18n } from '@/hooks/use-i18n';

type ChartData = {
    categoryName: string;
    averageScore: number;
}[];

const chartConfig = {
  averageScore: {
    label: 'Average Score',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig;

type CategoryPerformanceChartProps = {
  data: ChartData;
};

export function CategoryPerformanceChart({ data }: CategoryPerformanceChartProps) {
    const { t } = useI18n();

  return (
    <Card className="bg-card/30 backdrop-blur-sm border-white/10 shadow-lg">
      <CardHeader>
        <CardTitle>{t('CategoryPerformanceChart.title')}</CardTitle>
        <CardDescription>{t('CategoryPerformanceChart.description')}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
          <BarChart 
            data={data} 
            accessibilityLayer
            layout="vertical"
            margin={{
              left: 20,
            }}
          >
            <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="hsl(var(--border) / 0.5)" />
            <YAxis
                dataKey="categoryName"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tick={{ fill: 'hsl(var(--foreground))', fontSize: 12 }}
                width={120}
                className="truncate"
            />
            <XAxis dataKey="averageScore" type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" />
            <ChartTooltip cursor={{ fill: 'hsl(var(--accent) / 0.1)' }} content={<ChartTooltipContent indicator="dot" />} />
            <Bar dataKey="averageScore" fill="var(--color-averageScore)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
