import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy } from "lucide-react";
import { FinderAnalysis } from "@/components/finder/finder-analysis";
import { getTranslations } from "@/hooks/use-i18n";

export default async function FinderPage() {
    const t = await getTranslations();
    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <Trophy className="h-4 w-4" />
                        <span>{t('Shared.poweredByAi')}</span>
                    </div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight">{t('FinderPage.title')}</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        {t('FinderPage.description')}
                    </p>
                </header>
                <FinderAnalysis />
            </div>
        </div>
    );
}
