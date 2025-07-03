import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { getDashboardSummary } from '@/app/dashboard/actions';
import type { Stat, EngagementData } from '@/lib/types';
import { Lightbulb, Sparkles, AlertCircle } from 'lucide-react';
import { getTranslations } from '@/lib/utils';
import { cookies } from 'next/headers';

type DashboardSummaryProps = {
    stats: Stat[];
    engagementData: EngagementData[];
};

const CardWrapper = ({ children, isError = false }: { children: React.ReactNode, isError?: boolean }) => (
    <Card className={`bg-card/30 backdrop-blur-sm shadow-lg ${isError ? 'border-destructive/50' : 'border-primary/20 shadow-primary/10'}`}>
        {children}
    </Card>
);

export async function DashboardSummary({ stats, engagementData }: DashboardSummaryProps) {
    const locale = cookies().get('locale')?.value as 'en' | 'fr' | undefined || 'en';
    const t = getTranslations(locale);
    
    const result = await getDashboardSummary(stats, engagementData, locale);

    if (result.error || !result.data) {
         return (
            <CardWrapper isError>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <span>{t('DashboardSummary.error.title')}</span>
                    </CardTitle>
                    <CardDescription className="text-destructive/80">{t('DashboardSummary.error.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{result.error || t('DashboardSummary.unknownError')}</p>
                </CardContent>
            </CardWrapper>
        )
    }

    return (
        <CardWrapper>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span>{t('DashboardSummary.results.title')}</span>
                </CardTitle>
                <CardDescription>{result.data.summary}</CardDescription>
            </CardHeader>
            <CardContent>
                <h4 className="font-semibold mb-3">{t('DashboardSummary.results.strategicTips')}</h4>
                <ul className="space-y-2">
                    {result.data.insights?.map((insight, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <Lightbulb className="h-5 w-5 mt-0.5 text-primary shrink-0" />
                            <span className="text-sm text-muted-foreground">{insight}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </CardWrapper>
    )
}
