import type { FindWinningProductsOutput } from '@/ai/flows/find-winning-products';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Lightbulb, Package, BarChart, RefreshCw } from 'lucide-react';
import { Button } from '../ui/button';

type FinderResultsProps = {
  results: FindWinningProductsOutput;
  onRerun: () => void;
};

export function FinderResults({ results, onRerun }: FinderResultsProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <BarChart className="h-6 w-6 text-primary" />
                <span>Market Overview</span>
            </CardTitle>
            <CardDescription className="text-base">{results.marketOverview}</CardDescription>
        </CardHeader>
      </Card>

      <div>
        <h2 className="text-2xl font-bold font-headline text-center mb-4">Top Winning Categories</h2>
      </div>

      <div className="space-y-6">
        {results.winningCategories.map((category, index) => (
            <Card key={index} className="shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center gap-3">
                        <Package className="h-7 w-7 text-primary" />
                        <span className="text-2xl font-headline">{category.categoryName}</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <h4 className="font-semibold mb-1 text-muted-foreground">Analysis:</h4>
                        <p className="text-sm">{category.analysis}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold mb-1 text-yellow-400 flex items-center gap-2">
                            <Lightbulb className="h-5 w-5" />
                            <span>Actionable Advice</span>
                        </h4>
                        <p className="text-sm">{category.actionableAdvice}</p>
                    </div>
                </CardContent>
            </Card>
        ))}
      </div>
      
      <div className="text-center pt-4">
        <Button variant="outline" onClick={onRerun}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Rerun Analysis
        </Button>
      </div>

    </div>
  );
}
