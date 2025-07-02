import { AnalysisForm } from "@/components/analyze/analysis-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "@/hooks/use-i18n";
import { Sparkles } from "lucide-react";

export default async function AnalyzePage() {
    const t = await getTranslations();
    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <Sparkles className="h-4 w-4" />
                        <span>{t('Shared.poweredByAi')}</span>
                    </div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight">{t('AnalyzePage.title')}</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        {t('AnalyzePage.description')}
                    </p>
                </header>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>{t('AnalyzePage.form.title')}</CardTitle>
                        <CardDescription>{t('AnalyzePage.form.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AnalysisForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
