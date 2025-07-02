'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { getDashboardSummary } from '@/app/dashboard/actions';
import type { Stat, EngagementData } from '@/lib/types';
import { Skeleton } from '../ui/skeleton';
import { Lightbulb, Sparkles, AlertCircle } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';

type DashboardSummaryProps = {
    stats: Stat[];
    engagementData: EngagementData[];
};

export function DashboardSummary({ stats, engagementData }: DashboardSummaryProps) {
    const { t } = useI18n();
    const [summary, setSummary] = useState<string | null>(null);
    const [insights, setInsights] = useState<string[] | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSummary() {
            setLoading(true);
            setError(null);
            const result = await getDashboardSummary(stats, engagementData);
            if (result.data) {
                setSummary(result.data.summary);
                setInsights(result.data.insights);
            } else {
                setError(result.error || t('DashboardSummary.unknownError'));
            }
            setLoading(false);
        }
        fetchSummary();
    }, [stats, engagementData, t]);

    if (loading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-primary" />
                        <span>{t('DashboardSummary.loading.title')}</span>
                    </CardTitle>
                    <CardDescription>{t('DashboardSummary.loading.description')}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="pt-4 space-y-3">
                        <Skeleton className="h-8 w-full" />
                        <Skeleton className="h-8 w-full" />
                    </div>
                </CardContent>
            </Card>
        )
    }

    if (error) {
         return (
            <Card className="border-destructive">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <span>{t('DashboardSummary.error.title')}</span>
                    </CardTitle>
                    <CardDescription className="text-destructive/80">{t('DashboardSummary.error.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{error}</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="bg-primary/5 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <Sparkles className="h-6 w-6 text-primary" />
                    <span>{t('DashboardSummary.results.title')}</span>
                </CardTitle>
                <CardDescription>{summary}</CardDescription>
            </CardHeader>
            <CardContent>
                <h4 className="font-semibold mb-3">{t('DashboardSummary.results.strategicTips')}</h4>
                <ul className="space-y-2">
                    {insights?.map((insight, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <Lightbulb className="h-5 w-5 mt-0.5 text-yellow-400 shrink-0" />
                            <span className="text-sm text-muted-foreground">{insight}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    )
}
