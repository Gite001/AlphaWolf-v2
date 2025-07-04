import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getTranslations } from "@/lib/utils";
import { BookOpen } from "lucide-react";
import { cookies } from "next/headers";

export default async function GuidePage() {
    const locale = cookies().get('locale')?.value;
    const t = getTranslations(locale);

    const tools = [
        { id: "dashboard", title: t('GuidePage.tools.dashboard.title'), content: t('GuidePage.tools.dashboard.content') },
        { id: "plan", title: t('GuidePage.tools.plan.title'), content: t('GuidePage.tools.plan.content') },
        { id: "finder", title: t('GuidePage.tools.finder.title'), content: t('GuidePage.tools.finder.content') },
        { id: "trends", title: t('GuidePage.tools.trends.title'), content: t('GuidePage.tools.trends.content') },
        { id: "pulse", title: t('GuidePage.tools.pulse.title'), content: t('GuidePage.tools.pulse.content') },
        { id: "spy", title: t('GuidePage.tools.spy.title'), content: t('GuidePage.tools.spy.content') },
        { id: "generate", title: t('GuidePage.tools.generate.title'), content: t('GuidePage.tools.generate.content') },
        { id: "video", title: t('GuidePage.tools.video.title'), content: t('GuidePage.tools.video.content') },
        { id: "analyze", title: t('GuidePage.tools.analyze.title'), content: t('GuidePage.tools.analyze.content') },
        { id: "lexicon", title: t('GuidePage.tools.lexicon.title'), content: t('GuidePage.tools.lexicon.content') }
    ];

    const generalFaq = [
        { id: "what-is-alphawolf", question: t("FaqPage.general.q1.question"), answer: t("FaqPage.general.q1.answer") },
        { id: "how-does-ai-work", question: t("FaqPage.general.q2.question"), answer: t("FaqPage.general.q2.answer") },
        { id: "is-data-private", question: t("FaqPage.general.q3.question"), answer: t("FaqPage.general.q3.answer") },
    ];

    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                <header className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <BookOpen className="h-4 w-4" />
                        <span>{t('GuidePage.header')}</span>
                    </div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight">{t('GuidePage.title')}</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        {t('GuidePage.description')}
                    </p>
                </header>
                
                <Card id="philosophy" className="bg-card/30 backdrop-blur-sm border-white/10 shadow-lg">
                    <CardHeader>
                        <CardTitle>{t('GuidePage.philosophy.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="whitespace-pre-line text-muted-foreground">{t('GuidePage.philosophy.content')}</p>
                    </CardContent>
                </Card>

                <Card id="how-it-works" className="bg-card/30 backdrop-blur-sm border-white/10 shadow-lg">
                    <CardHeader>
                        <CardTitle>{t('GuidePage.howAiThinks.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                         <p className="whitespace-pre-line text-muted-foreground">{t('GuidePage.howAiThinks.content')}</p>
                    </CardContent>
                </Card>
                
                <Card id="tools" className="bg-card/30 backdrop-blur-sm border-white/10 shadow-lg scroll-mt-20">
                    <CardHeader>
                        <CardTitle>{t('GuidePage.tools.title')}</CardTitle>
                        <CardDescription>{t('GuidePage.tools.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {tools.map(tool => (
                             <Card key={tool.id} className="bg-secondary/30">
                                <CardHeader>
                                    <CardTitle className="text-xl font-headline">{tool.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="whitespace-pre-line text-muted-foreground">{tool.content}</p>
                                </CardContent>
                             </Card>
                        ))}
                    </CardContent>
                </Card>

                <Card id="faq" className="bg-card/30 backdrop-blur-sm border-white/10 shadow-lg scroll-mt-20">
                    <CardHeader>
                        <CardTitle>{t('FaqPage.general.title')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {generalFaq.map(item => (
                                <details key={item.id} className="group border-b pb-2">
                                    <summary className="font-medium cursor-pointer list-none flex justify-between items-center">
                                        {item.question}
                                        <span className="group-open:rotate-180 transition-transform duration-200">+</span>
                                    </summary>
                                    <p className="text-muted-foreground pt-2">{item.answer}</p>
                                </details>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                 <Card id="getting-started" className="bg-card/30 backdrop-blur-sm border-white/10 shadow-lg">
                    <CardHeader>
                        <CardTitle>{t('GuidePage.gettingStarted.title')}</CardTitle>
                    </CardHeader>
                    <CardContent className="prose prose-invert max-w-none text-muted-foreground">
                        <p>{t('GuidePage.gettingStarted.intro')}</p>
                        <p className="font-bold text-foreground">{t('GuidePage.gettingStarted.important')}</p>
                        <h4 className="text-foreground">{t('GuidePage.gettingStarted.step1.title')}</h4>
                        <p dangerouslySetInnerHTML={{ __html: t('GuidePage.gettingStarted.step1.content') }} />
                        <pre className="bg-slate-900 rounded-md p-4 overflow-x-auto"><code className="text-white">npm install</code></pre>
                        <h4 className="text-foreground">{t('GuidePage.gettingStarted.step2.title')}</h4>
                        <p>{t('GuidePage.gettingStarted.step2.content')}</p>
                        <pre className="bg-slate-900 rounded-md p-4 overflow-x-auto"><code className="text-white">npm run dev</code></pre>
                        <p>{t('GuidePage.gettingStarted.outro')}</p>
                    </CardContent>
                </Card>

            </div>
        </div>
    );
}
