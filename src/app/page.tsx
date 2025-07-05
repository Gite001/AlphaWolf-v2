
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Sparkles, Binoculars, Compass, FileText, Trophy, Clapperboard } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from '@/lib/utils';
import { cookies } from 'next/headers';
import { Logo } from '@/components/logo';

export default async function HomePage() {
  const locale = cookies().get('locale')?.value;
  const t = getTranslations(locale);

  const features = [
    {
      icon: <Compass className="h-8 w-8 text-primary" />,
      title: t('HomePage.features.strategicPlanning.title'),
      description: t('HomePage.features.strategicPlanning.description'),
      link: '/plan',
    },
    {
      icon: <Binoculars className="h-8 w-8 text-primary" />,
      title: t('HomePage.features.competitorAnalysis.title'),
      description: t('HomePage.features.competitorAnalysis.description'),
      link: '/spy',
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: t('HomePage.features.creativeGeneration.title'),
      description: t('HomePage.features.creativeGeneration.description'),
      link: '/generate',
    },
    {
      icon: <Trophy className="h-8 w-8 text-primary" />,
      title: t('HomePage.features.adSpy.title'),
      description: t('HomePage.features.adSpy.description'),
      link: '/finder',
    },
    {
      icon: <Sparkles className="h-8 w-8 text-primary" />,
      title: t('HomePage.features.adAnalysis.title'),
      description: t('HomePage.features.adAnalysis.description'),
      link: '/analyze',
    },
    {
      icon: <Clapperboard className="h-8 w-8 text-primary" />,
      title: t('HomePage.features.videoGeneration.title'),
      description: t('HomePage.features.videoGeneration.description'),
      link: '/video',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 relative overflow-hidden">
          <div className="container px-4 md:px-6 relative z-10">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                  {t('HomePage.hero.title')}
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  {t('HomePage.hero.subtitle')}
                </p>
                <Button asChild size="lg" className="mt-8 w-full sm:w-fit shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300">
                  <Link href="/dashboard">
                    {t('HomePage.hero.cta')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <Image
                src="/images/hero-image.png"
                width="600"
                height="400"
                alt="Hero"
                data-ai-hint="futuristic dashboard"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last border border-white/10 shadow-2xl shadow-primary/10"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">{t('HomePage.features.title')}</h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                {t('HomePage.features.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="flex flex-col text-center items-center p-6 bg-card/30 backdrop-blur-sm border-white/10 shadow-lg hover:shadow-primary/20 hover:-translate-y-2 transition-all duration-300">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                  <Button variant="outline" asChild>
                    <Link href={feature.link}>
                      {t('HomePage.features.learnMore')} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-secondary/20">
            <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl/tight">
                        {t('HomePage.cta.title')}
                    </h2>
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        {t('HomePage.cta.subtitle')}
                    </p>
                </div>
                <div className="mx-auto w-full max-w-sm space-y-2">
                    <Button asChild size="lg" className="w-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300">
                        <Link href="/dashboard">{t('HomePage.cta.button')}</Link>
                    </Button>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
