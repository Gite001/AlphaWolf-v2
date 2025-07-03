import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { getWinningProductsAnalysis } from '@/app/finder/actions';
import { AlertCircle } from 'lucide-react';
import { FinderResults } from './finder-results';
import { getTranslations } from '@/lib/utils';
import { cookies } from 'next/headers';

export async function FinderAnalysis() {
    const locale = cookies().get('locale')?.value as 'en' | 'fr' | undefined || 'en';
    const t = getTranslations(locale);
    
    const response = await getWinningProductsAnalysis(locale);

    if (response.error || !response.data) {
        return (
            <Card className="bg-card/30 backdrop-blur-sm border-destructive/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                        <AlertCircle className="h-5 w-5" />
                        <span>{t('FinderAnalysis.error.title')}</span>
                    </CardTitle>
                    <CardDescription className="text-destructive/80">{t('FinderAnalysis.error.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{response.error || t('FinderAnalysis.unknownError')}</p>
                    <a href="/finder" className="mt-4 inline-block text-primary underline">
                        {t('FinderAnalysis.error.retryButton')}
                    </a>
                </CardContent>
            </Card>
        )
    }

    return <FinderResults results={response.data} />;
}
