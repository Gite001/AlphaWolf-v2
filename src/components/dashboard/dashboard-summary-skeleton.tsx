'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';
import { Sparkles } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';

const CardWrapper = ({ children }: { children: React.ReactNode }) => (
    <Card className="bg-card/30 backdrop-blur-sm border-primary/20 shadow-lg shadow-primary/10">
        {children}
    </Card>
);

export function DashboardSummarySkeleton() {
    const { t } = useI18n();
    return (
        <CardWrapper>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    <span>{t('DashboardSummary.loading.title')}</span>
                </CardTitle>
                <CardDescription>{t('DashboardSummary.loading.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full bg-secondary/50" />
                <Skeleton className="h-4 w-5/6 bg-secondary/50" />
                <div className="pt-4 space-y-3">
                    <Skeleton className="h-8 w-full bg-secondary/50" />
                    <Skeleton className="h-8 w-full bg-secondary/50" />
                </div>
            </CardContent>
        </CardWrapper>
    )
}
