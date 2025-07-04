'use client';

import type { GenerateMarketingPlanOutput } from '@/ai/flows/generate-marketing-plan';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Tally3, Globe, MessageSquare, Compass, Check } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';

type PlanResultsProps = {
  results: GenerateMarketingPlanOutput;
};

export function PlanResults({ results }: PlanResultsProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="text-center">
        <h2 className="text-3xl font-bold font-headline">{t('PlanResults.title')}</h2>
        <p className="text-muted-foreground mt-1">{t('PlanResults.description')}</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle>{t('PlanResults.audienceInsight.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{results.audienceInsight}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
                <Globe className="h-6 w-6 text-primary" />
                <CardTitle>{t('PlanResults.platformStrategy.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{results.platformStrategy}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
                <MessageSquare className="h-6 w-6 text-primary" />
                <CardTitle>{t('PlanResults.keyMessaging.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2">
                    {results.keyMessaging.map((message, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <Tally3 className="h-4 w-4 mt-1 shrink-0 text-primary"/>
                            <span>{message}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle>{t('PlanResults.influencerStrategy.title')}</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{results.influencerStrategy}</p>
            </CardContent>
          </Card>
      </div>
      
      <Card>
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Compass className="h-6 w-6 text-primary" />
                <span>{t('PlanResults.phasedRoadmap.title')}</span>
            </CardTitle>
            <CardDescription>{t('PlanResults.phasedRoadmap.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            {results.phasedRoadmap.map((phase, index) => (
                 <Card key={index} className="bg-secondary/30">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <span className="flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground font-bold text-lg">{index + 1}</span>
                            <div>
                                <h3 className="text-xl font-headline">{phase.phaseName}</h3>
                                <p className="text-sm font-normal text-muted-foreground">{phase.duration}</p>
                            </div>
                        </CardTitle>
                        <CardDescription className="pt-2">{phase.focus}</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <h4 className="font-semibold mb-2 text-foreground">{t('PlanResults.phasedRoadmap.actions')}</h4>
                        <ul className="space-y-2">
                            {phase.actions.map((action, actionIndex) => (
                                <li key={actionIndex} className="flex items-start gap-2 text-sm text-muted-foreground">
                                    <Check className="h-4 w-4 mt-1 shrink-0 text-green-500"/>
                                    <span>{action}</span>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                 </Card>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
