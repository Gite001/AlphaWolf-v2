'use client';

import type { AnalyzeCompetitorAdOutput } from '@/ai/flows/analyze-competitor-ad';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Target, CheckCircle2, AlertTriangle, ShieldCheck, User, Megaphone } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useI18n } from '@/hooks/use-i18n';

type CompetitorResultsProps = {
  results: AnalyzeCompetitorAdOutput;
};

export function CompetitorResults({ results }: CompetitorResultsProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold font-headline text-center mb-4">{t('CompetitorResults.title', { productName: results.productName })}</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-6 w-6 text-primary" />
            <span>{t('CompetitorResults.estimatedPerformance.title')}</span>
          </CardTitle>
          <CardDescription>{results.estimatedPerformance.reasoning}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={results.estimatedPerformance.score} className="h-3 flex-1" />
            <span className="text-lg font-bold text-primary">{results.estimatedPerformance.score} / 100</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
            <CardHeader className="flex flex-row items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                <CardTitle>{t('CompetitorResults.targetAudience.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{results.targetAudience}</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center gap-2">
                <Megaphone className="h-6 w-6 text-primary" />
                <CardTitle>{t('CompetitorResults.marketingAngle.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{results.marketingAngle}</p>
            </CardContent>
        </Card>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <CardTitle>{t('CompetitorResults.strengths.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                {results.strengths.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            <CardTitle>{t('CompetitorResults.weaknesses.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5 text-sm text-muted-foreground">
                {results.weaknesses.map((item, index) => <li key={index}>{item}</li>)}
            </ul>
          </CardContent>
        </Card>
      </div>

       <Card>
        <CardHeader className="flex flex-row items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-blue-500" />
            <CardTitle>{t('CompetitorResults.counterStrategies.title')}</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-3">
            {results.counterStrategies.map((strategy, index) => (
                <div key={index} className="p-3 rounded-lg border bg-secondary/30 flex items-start gap-3">
                    <Target className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                    <p className="text-sm text-muted-foreground">{strategy}</p>
                </div>
            ))}
            </div>
        </CardContent>
      </Card>
    </div>
  );
}
