'use client';

import type { FindWinningProductsOutput } from '@/ai/flows/find-winning-products';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Lightbulb, Package, BarChart, RefreshCw, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import Link from 'next/link';
import { useI18n } from '@/hooks/use-i18n';
import { CategoryPerformanceChart } from './category-performance-chart';

type FinderResultsProps = {
  results: FindWinningProductsOutput;
  onRerun: () => void;
};

export function FinderResults({ results, onRerun }: FinderResultsProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BarChart className="h-6 w-6 text-primary" />
                <span>{t('FinderResults.marketOverview.title')}</span>
            </CardTitle>
            <CardDescription className="text-base">{results.marketOverview}</CardDescription>
        </CardHeader>
      </Card>

      <CategoryPerformanceChart data={results.winningCategories} />

      <div>
        <h2 className="text-2xl font-bold font-headline text-center mb-4">{t('FinderResults.winningCategories.title')}</h2>
      </div>

      <div className="space-y-6">
        {results.winningCategories.map((category, index) => (
            <Card key={index} className="shadow-md flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Package className="h-7 w-7 text-primary" />
                        <span className="text-2xl font-headline">{category.categoryName}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 flex-grow">
                    <div>
                        <h4 className="font-semibold mb-1 text-muted-foreground">{t('FinderResults.analysis.title')}</h4>
                        <p className="text-sm">{category.analysis}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-1 text-yellow-400 flex items-center gap-2">
                            <Lightbulb className="h-5 w-5" />
                            <span>{t('FinderResults.strategicTip.title')}</span>
                        </h4>
                        <p className="text-sm">{category.actionableAdvice}</p>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href={`/generate?productName=${encodeURIComponent(category.categoryName)}&productDescription=${encodeURIComponent(category.analysis)}&keywords=${encodeURIComponent(category.categoryName)}`}>
                            <FileText className="mr-2 h-4 w-4" />
                            {t('FinderResults.generateAdButton')}
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
      
      <div className="text-center pt-4">
        <Button variant="outline" onClick={onRerun}>
            <RefreshCw className="mr-2 h-4 w-4" />
            {t('FinderResults.rerunButton')}
        </Button>
      </div>

    </div>
  );
}
