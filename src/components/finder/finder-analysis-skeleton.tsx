'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Bot } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';

export function FinderAnalysisSkeleton() {
    const { t } = useI18n();
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
