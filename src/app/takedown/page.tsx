import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "@/lib/utils";
import { Swords } from "lucide-react";
import { cookies } from "next/headers";
import { TakedownForm } from "@/components/takedown/takedown-form";

export default async function TakedownPage() {
    const locale = cookies().get('locale')?.value;
    const t = getTranslations(locale);
    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <Swords className="h-4 w-4" />
                        <span>{t('Shared.poweredByAi')}</span>
                    </div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight">{t('TakedownPage.title')}</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        {t('TakedownPage.description')}
                    </p>
                </header>
                <Card className="bg-card/30 backdrop-blur-sm border-white/10 shadow-2xl shadow-primary/5">
                    <CardHeader>
                        <CardTitle>{t('TakedownPage.form.title')}</CardTitle>
                        <CardDescription>{t('TakedownPage.form.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TakedownForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
