import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "@/lib/utils";
import { Compass } from "lucide-react";
import { cookies } from "next/headers";
import { PlanForm } from "@/components/plan/plan-form";

export default async function PlanPage() {
    const locale = cookies().get('locale')?.value;
    const t = getTranslations(locale);
    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <Compass className="h-4 w-4" />
                        <span>{t('Shared.poweredByAi')}</span>
                    </div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight">{t('PlanPage.title')}</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        {t('PlanPage.description')}
                    </p>
                </header>
                <Card className="bg-card/30 backdrop-blur-sm border-white/10 shadow-2xl shadow-primary/5">
                    <CardHeader>
                        <CardTitle>{t('PlanPage.form.title')}</CardTitle>
                        <CardDescription>{t('PlanPage.form.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PlanForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
