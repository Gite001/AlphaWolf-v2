'use client';

import type { AnalyzeMarketplaceTrendsOutput } from '@/ai/flows/analyze-marketplace-trends';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Handshake, AlertTriangle, TrendingUp, Sparkles } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { DemandTrendChart } from './demand-trend-chart';

type PulseResultsProps = {
  results: AnalyzeMarketplaceTrendsOutput;
};

export function PulseResults({ results }: PulseResultsProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold font-headline text-center mb-2">{t('PulseResults.title')}</h2>
        <p className="text-center text-muted-foreground">{results.marketplaceSummary}</p>
      </div>

      {results.demandTrend && results.demandTrend.length > 0 && (
        <DemandTrendChart data={results.demandTrend} analysis={results.trendAnalysis} />
      )}

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <CardTitle>{t('PulseResults.trendingProducts.title')}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            {results.trendingProducts.map((product, index) => (
                <div key={index} className="p-4 rounded-lg border bg-secondary/30">
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                    <div className="mt-2 pt-2 border-t border-white/10 flex items-start gap-2 text-xs text-primary/80">
                      <Sparkles className="h-4 w-4 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold">{t('PulseResults.marketingAngle')}: </span>
                        <span>{product.marketingAngle}</span>
                      </div>
                    </div>
                </div>
            ))}
            </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Handshake className="h-6 w-6 text-green-500" />
            <CardTitle>{t('PulseResults.platformSpecificAdvice.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{results.platformSpecificAdvice}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            <CardTitle>{t('PulseResults.commonPitfalls.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{results.commonPitfalls}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
