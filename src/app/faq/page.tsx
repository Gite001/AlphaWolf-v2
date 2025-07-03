import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "@/lib/utils";
import { HelpCircle } from "lucide-react";
import { cookies } from "next/headers";

export default async function FaqPage() {
    const locale = cookies().get('locale')?.value;
    const t = getTranslations(locale);

    const generalFaq = [
        { id: "what-is-alphawolf", question: "FaqPage.general.q1.question", answer: "FaqPage.general.q1.answer" },
        { id: "how-does-ai-work", question: "FaqPage.general.q2.question", answer: "FaqPage.general.q2.answer" },
        { id: "is-data-private", question: "FaqPage.general.q3.question", answer: "FaqPage.general.q3.answer" },
    ];

    const featureFaq = [
        { id: "market-analysis", question: "FaqPage.features.q1.question", answer: "FaqPage.features.q1.answer" },
        { id: "competitor-deconstruction", question: "FaqPage.features.q2.question", answer: "FaqPage.features.q2.answer" },
        { id: "multi-format-ads", question: "FaqPage.features.q3.question", answer: "FaqPage.features.q3.answer" },
    ];

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <HelpCircle className="h-4 w-4" />
                        <span>{t('FaqPage.header')}</span>
                    </div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight">{t('FaqPage.title')}</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        {t('FaqPage.description')}
                    </p>
                </header>
                
                <Card className="bg-card/30 backdrop-blur-sm border-white/10 shadow-2xl shadow-primary/5 mb-8">
                    <CardHeader>
                        <CardTitle>{t('FaqPage.general.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {generalFaq.map(item => (
                                <AccordionItem key={item.id} value={item.id}>
                                    <AccordionTrigger>{t(item.question)}</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="whitespace-pre-line">{t(item.answer)}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>

                <Card className="bg-card/30 backdrop-blur-sm border-white/10 shadow-2xl shadow-primary/5">
                    <CardHeader>
                        <CardTitle>{t('FaqPage.features.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            {featureFaq.map(item => (
                                <AccordionItem key={item.id} value={item.id} id={item.id}>
                                    <AccordionTrigger>{t(item.question)}</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="whitespace-pre-line">{t(item.answer)}</p>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
