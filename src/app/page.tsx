import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Sparkles, Binoculars, Compass, FileText, Trophy, Clapperboard } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from '@/lib/utils';
import { cookies } from 'next/headers';

export default async function HomePage() {
  const locale = cookies().get('locale')?.value;
  const t = getTranslations(locale);

  const features = [
    {
      icon: Compass,
      title: t('HomePage.features.strategicPlanning.title'),
      description: t('HomePage.features.strategicPlanning.description'),
      link: '/plan',
    },
    {
      icon: Binoculars,
      title: t('HomePage.features.competitorAnalysis.title'),
      description: t('HomePage.features.competitorAnalysis.description'),
      link: '/spy',
    },
    {
      icon: FileText,
      title: t('HomePage.features.creativeGeneration.title'),
      description: t('HomePage.features.creativeGeneration.description'),
      link: '/generate',
    },
    {
      icon: Trophy,
      title: t('HomePage.features.adSpy.title'),
      description: t('HomePage.features.adSpy.description'),
      link: '/finder',
    },
    {
      icon: Sparkles,
      title: t('HomePage.features.adAnalysis.title'),
      description: t('HomePage.features.adAnalysis.description'),
      link: '/analyze',
    },
    {
      icon: Clapperboard,
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
            <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
              <div className="flex flex-col justify-center space-y-6 text-center lg:text-left">
                <div className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium self-center lg:self-start">
                    {t('HomePage.hero.badge')}
                </div>
                <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-foreground">
                  {t('HomePage.hero.title')}
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto lg:mx-0">
                  {t('HomePage.hero.subtitle')}
                </p>
                <Button asChild size="lg" className="mt-8 w-full sm:w-fit shadow-lg shadow-primary/20 hover:scale-105 transition-transform duration-300 self-center lg:self-start">
                  <Link href="/dashboard">
                    {t('HomePage.hero.cta')} <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
               <div className="flex items-center justify-center">
                    <Image
                        src="https://placehold.co/600x400.png"
                        width="600"
                        height="400"
                        alt="Hero"
                        data-ai-hint="futuristic dashboard"
                        className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full border border-white/10 shadow-2xl shadow-primary/10"
                    />
               </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24 bg-secondary/20">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">{t('HomePage.features.title')}</h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                {t('HomePage.features.subtitle')}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="flex flex-col bg-card/50 backdrop-blur-sm border-white/10 shadow-lg hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-300">
                  <CardHeader>
                    <feature.icon className="h-8 w-8 text-primary mb-2" />
                    <CardTitle className="text-xl font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                  <CardFooter>
                     <Button asChild variant="ghost" className="text-primary hover:text-primary p-0 h-auto">
                        <Link href={feature.link} className="flex items-center gap-2">
                            {t('HomePage.features.exploreTool')} <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
