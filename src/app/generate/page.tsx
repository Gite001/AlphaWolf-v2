import { CopyGeneratorForm } from "@/components/generate/copy-generator-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "@/lib/utils";
import { FileText } from "lucide-react";
import { cookies } from "next/headers";

export default async function GenerateCopyPage() {
    const locale = cookies().get('locale')?.value;
    const t = getTranslations(locale);
    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <FileText className="h-4 w-4" />
                        <span>{t('Shared.poweredByAi')}</span>
                    </div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight">{t('GeneratePage.title')}</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        {t('GeneratePage.description')}
                    </p>
                </header>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>{t('GeneratePage.form.title')}</CardTitle>
                        <CardDescription>{t('GeneratePage.form.description')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CopyGeneratorForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
