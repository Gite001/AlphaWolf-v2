'use client';

import type { DefineAdTermOutput } from '@/ai/flows/define-ad-term';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, BookOpen } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';

type LexiconResultsProps = {
  results: DefineAdTermOutput & { term: string };
};

export function LexiconResults({ results }: LexiconResultsProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <header className="text-center">
        <h2 className="text-3xl font-bold font-headline capitalize">{results.term}</h2>
      </header>
      <div className="grid grid-cols-1 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <CardTitle>{t('LexiconResults.definition.title')}</CardTitle>
          </CardHeader>
          <CardContent>
              <p className="text-base text-muted-foreground">{results.definition}</p>
          </CardContent>
        </Card>
        <Card className="border-accent bg-accent/5">
          <CardHeader className="flex flex-row items-center gap-2 text-accent">
              <Lightbulb className="h-6 w-6" />
              <CardTitle>{t('LexiconResults.strategicTip.title')}</CardTitle>
          </CardHeader>
          <CardContent>
              <p className="text-base text-accent-foreground">{results.strategicTip}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
