'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { getWinningProductsAnalysis } from '@/app/finder/actions';
import type { FindWinningProductsOutput } from '@/ai/flows/find-winning-products';
import { Skeleton } from '../ui/skeleton';
import { AlertCircle, Bot } from 'lucide-react';
import { FinderResults } from './finder-results';
import { Button } from '../ui/button';
import { useI18n } from '@/hooks/use-i18n';

export function FinderAnalysis() {
    const { t, locale } = useI18n();
    const [result, setResult] = useState<FindWinningProductsOutput | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function runAnalysis() {
        setLoading(true);
        setError(null);
        setResult(null);
        const response = await getWinningProductsAnalysis(locale);
        if (response.data) {
            setResult(response.data);
        } else {
            setError(response.error || t('FinderAnalysis.unknownError'));
        }
        setLoading(false);
    }

    useEffect(() => {
        runAnalysis();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [locale]);

    const renderContent = () => {
        if (loading) {
            return (
                <Card className="bg-card/30 backdrop-blur-sm border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary animate-pulse" />
                            <span>{t('FinderAnalysis.loading.title')}</span>
                        </CardTitle>
                        <CardDescription>{t('FinderAnalysis.loading.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full bg-secondary/50" />
                        <Skeleton className="h-4 w-5/6 bg-secondary/50" />
                        <div className="pt-4 space-y-3">
                            <Skeleton className="h-24 w-full bg-secondary/50" />
                            <Skeleton className="h-24 w-full bg-secondary/50" />
                        </div>
                    </CardContent>
                </Card>
            )
        }

        if (error) {
            return (
                <Card className="bg-card/30 backdrop-blur-sm border-destructive/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-5 w-5" />
                            <span>{t('FinderAnalysis.error.title')}</span>
                        </CardTitle>
                        <CardDescription className="text-destructive/80">{t('FinderAnalysis.error.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{error}</p>
                        <Button onClick={runAnalysis}>{t('FinderAnalysis.error.retryButton')}</Button>
                    </CardContent>
                </Card>
            )
        }

        if (result) {
            return <FinderResults results={result} onRerun={runAnalysis} />;
        }

        return null;
    }

    return (
        <div>
           {renderContent()}
        </div>
    )
}
