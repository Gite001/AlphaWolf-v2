import type { AnalyzeAdPerformanceOutput } from '@/ai/flows/analyze-ad-performance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Lightbulb, AlertTriangle } from 'lucide-react';

type AnalysisResultsProps = {
  results: AnalyzeAdPerformanceOutput;
};

export function AnalysisResults({ results }: AnalysisResultsProps) {
    const engagementPercentage = Math.round(results.engagementEstimate * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold font-headline text-center">Résultats de l'Analyse</h2>
      <Card>
        <CardHeader>
          <CardTitle>Estimation de l'Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={engagementPercentage} className="h-4 flex-1" />
            <span className="text-xl font-bold text-primary">{engagementPercentage}%</span>
          </div>
          <p className="text-sm text-muted-foreground mt-2">{results.predictedPerformance}</p>
        </CardContent>
      </Card>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <CardTitle>Forces</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{results.strengths}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-yellow-500" />
            <CardTitle>Faiblesses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{results.weaknesses}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center gap-2">
            <Lightbulb className="h-6 w-6 text-blue-500" />
            <CardTitle>Suggestions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{results.suggestions}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
