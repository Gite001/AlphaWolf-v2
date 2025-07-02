'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { getWinningProductsAnalysis } from '@/app/finder/actions';
import type { FindWinningProductsOutput } from '@/ai/flows/find-winning-products';
import { Skeleton } from '../ui/skeleton';
import { AlertCircle, Bot } from 'lucide-react';
import { FinderResults } from './finder-results';
import { Button } from '../ui/button';

export function FinderAnalysis() {
    const [result, setResult] = useState<FindWinningProductsOutput | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    async function runAnalysis() {
        setLoading(true);
        setError(null);
        setResult(null);
        const response = await getWinningProductsAnalysis();
        if (response.data) {
            setResult(response.data);
        } else {
            setError(response.error || 'An unknown error occurred.');
        }
        setLoading(false);
    }

    useEffect(() => {
        runAnalysis();
    }, []);

    const renderContent = () => {
        if (loading) {
            return (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary animate-pulse" />
                            <span>Le loup IA est à la chasse...</span>
                        </CardTitle>
                        <CardDescription>Analyse de milliers de points de données pour trouver de l'or.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <div className="pt-4 space-y-3">
                            <Skeleton className="h-24 w-full" />
                            <Skeleton className="h-24 w-full" />
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
                            <span>L'analyse a échoué</span>
                        </CardTitle>
                        <CardDescription className="text-destructive/80">Impossible de générer l'analyse.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="text-sm text-muted-foreground">{error}</p>
                        <Button onClick={runAnalysis}>Réessayer</Button>
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
