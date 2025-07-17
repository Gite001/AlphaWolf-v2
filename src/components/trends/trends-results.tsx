'use client';

import type { AnalyzeMarketTrendsOutput } from '@/ai/flows/analyze-market-trends';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Target, ShieldAlert, TrendingUp, Users, Megaphone, BarChart3, PackagePlus, Gauge } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { GeoTrendChart } from './geo-trend-chart';
import { Progress } from '../ui/progress';

type TrendsResultsProps = {
  results: AnalyzeMarketTrendsOutput;
};

export function TrendsResults({ results }: TrendsResultsProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold font-headline text-center mb-2">{t('TrendsResults.title')}</h2>
        <p className="text-center text-muted-foreground">{results.marketSummary}</p>
      </div>

      {results.geoTrend && results.geoTrend.length > 0 && (
        <GeoTrendChart data={results.geoTrend} analysis={results.geoTrendAnalysis} />
      )}

      {results.nicheOpportunities && results.nicheOpportunities.length > 0 && (
        <Card>
            <CardHeader className="flex flex-row items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                <CardTitle>{t('TrendsResults.nicheOpportunities.title')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {results.nicheOpportunities.map((niche, index) => (
                    <div key={index} className="p-4 rounded-lg border bg-secondary/30">
                        <h4 className="font-semibold text-lg">{niche.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{niche.description}</p>
                        <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                             <div className="flex items-start gap-2">
                                <Users className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                                <div>
                                    <h5 className="font-semibold text-foreground">{t('TrendsResults.targetAudience.title')}</h5>
                                    <p className="text-muted-foreground">{niche.targetAudience}</p>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <h5 className="font-semibold text-foreground flex items-center gap-2">
                                    <Gauge className="h-5 w-5 text-primary shrink-0" />
                                    <span>{t('TrendsResults.nicheOpportunities.potential')}</span>
                                </h5>
                                <div className="flex items-center gap-2">
                                    <Progress value={niche.potentialScore} className="h-2 flex-1" />
                                    <span className="text-xs font-bold">{niche.potentialScore} / 100</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <CardTitle>{t('TrendsResults.trendingProducts.title')}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            {results.trendingProducts.map((product, index) => (
                <div key={index} className="p-4 rounded-lg border bg-secondary/30">
                    <h4 className="font-semibold text-lg">{product.name}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{product.description}</p>
                    <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
                        <div className="flex items-start gap-2">
                            <Users className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                            <div>
                                <h5 className="font-semibold text-foreground">{t('TrendsResults.targetAudience.title')}</h5>
                                <p className="text-muted-foreground">{product.targetAudience}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-2">
                            <Megaphone className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                            <div>
                                <h5 className="font-semibold text-foreground">{t('TrendsResults.marketingAngle.title')}</h5>
                                <p className="text-muted-foreground">{product.marketingAngle}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-2">
                            <BarChart3 className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                            <div>
                                <h5 className="font-semibold text-foreground">{t('TrendsResults.competitionLevel.title')}</h5>
                                <p className="text-muted-foreground">{t(`TrendsResults.competitionLevel.${product.competitionLevel}`)}</p>
                            </div>
                        </div>
                         <div className="flex items-start gap-2">
                            <PackagePlus className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                            <div>
                                <h5 className="font-semibold text-foreground">{t('TrendsResults.exampleProductIdeas.title')}</h5>
                                <ul className="text-muted-foreground list-disc pl-4">
                                    {product.exampleProductIdeas.map((idea, i) => <li key={i}>{idea}</li>)}
                                </ul>
                            </div>
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
            <Target className="h-6 w-6 text-green-500" />
            <CardTitle>{t('TrendsResults.opportunities.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{results.opportunities}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-yellow-500" />
            <CardTitle>{t('TrendsResults.risks.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{results.risks}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
