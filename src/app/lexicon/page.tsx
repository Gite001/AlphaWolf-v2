import { LexiconForm } from "@/components/lexicon/lexicon-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "@/lib/utils";
import { BookMarked, Info } from "lucide-react";
import { cookies } from "next/headers";

export default async function LexiconPage() {
    const locale = cookies().get('locale')?.value;
    const t = getTranslations(locale);
    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <BookMarked className="h-4 w-4" />
                        <span>{t('Shared.poweredByAi')}</span>
                    </div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight">{t('LexiconPage.title')}</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        {t('LexiconPage.description')}
                    </p>
                </header>
                <Card className="bg-card/30 backdrop-blur-sm border-white/10 shadow-2xl shadow-primary/5">
                    <CardHeader>
                        <CardTitle>{t('LexiconPage.form.title')}</CardTitle>
                        <CardDescription>{t('LexiconPage.form.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LexiconForm />
                    </CardContent>
                </Card>

                <Card className="mt-8 bg-secondary/30 backdrop-blur-sm border-dashed border-white/20">
                    <CardHeader className="flex-row gap-4 items-center">
                        <Info className="h-6 w-6 text-primary" />
                        <div>
                            <CardTitle className="text-lg">{t('LexiconPage.howItWorks.title')}</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground whitespace-pre-line">
                            {t('LexiconPage.howItWorks.description')}
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
