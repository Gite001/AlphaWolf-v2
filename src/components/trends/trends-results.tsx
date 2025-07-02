import type { AnalyzeMarketTrendsOutput } from '@/ai/flows/analyze-market-trends';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Target, ShieldAlert, TrendingUp } from 'lucide-react';

type TrendsResultsProps = {
  results: AnalyzeMarketTrendsOutput;
};

export function TrendsResults({ results }: TrendsResultsProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-bold font-headline text-center mb-2">Market Analysis Results</h2>
        <p className="text-center text-muted-foreground">{results.marketSummary}</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            <CardTitle>Trending Products</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
            {results.trendingProducts.map((product, index) => (
                <div key={index} className="p-4 rounded-lg border bg-secondary/30">
                    <h4 className="font-semibold">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">{product.description}</p>
                </div>
            ))}
            </div>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Target className="h-6 w-6 text-green-500" />
            <CardTitle>Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{results.opportunities}</p>

          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-yellow-500" />
            <CardTitle>Risks & Considerations</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{results.risks}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
