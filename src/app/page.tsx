import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Trophy, Binoculars, FileText } from 'lucide-react';
import Image from 'next/image';

export default function HomePage() {
  const features = [
    {
      icon: <Trophy className="h-8 w-8 text-primary" />,
      title: 'Winning Product Finder',
      description: 'Our AI wolf scours our ad database to pinpoint trending products and the strategies making them successful.',
      link: '/finder',
    },
    {
      icon: <Binoculars className="h-8 w-8 text-primary" />,
      title: 'Competitor Spy',
      description: "Deconstruct any competitor's ad or product page. Get their marketing angle, weaknesses, and counter-strategies.",
      link: '/spy',
    },
    {
      icon: <FileText className="h-8 w-8 text-primary" />,
      title: 'Instant Ad Concepts',
      description: 'Generate complete, high-converting ad concepts—compelling copy paired with custom AI visuals—in seconds.',
      link: '/generate',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-20 md:py-32 lg:py-40 bg-gradient-to-br from-background to-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                <h1 className="text-4xl font-bold font-headline tracking-tighter sm:text-5xl md:text-6xl text-foreground">
                  The Future of Ad Creation is Here
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  AdInsights combines cutting-edge AI with market analysis to help you create winning ad campaigns faster than ever before.
                </p>
                <Button asChild size="lg" className="mt-8 w-full sm:w-fit">
                  <Link href="/dashboard">
                    Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
              <Image
                src="https://placehold.co/600x400.png"
                width="600"
                height="400"
                alt="Hero"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last"
                data-ai-hint="dashboard analytics"
              />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-16 md:py-24 bg-background">
          <div className="container px-4 md:px-6">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 className="text-3xl font-bold font-headline tracking-tighter sm:text-4xl">All-in-One Marketing Intelligence</h2>
              <p className="mt-4 text-muted-foreground md:text-lg">
                From initial idea to performance analysis, AdInsights is your strategic partner.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="flex flex-col text-center items-center p-6 shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300">
                  <CardHeader>
                    {feature.icon}
                    <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                  <Button variant="outline" asChild>
                    <Link href={feature.link}>
                      Learn More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="w-full py-16 md:py-24 bg-muted/50">
            <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
                <div className="space-y-3">
                    <h2 className="text-3xl font-bold font-headline tracking-tighter md:text-4xl/tight">
                        Ready to Revolutionize Your Ads?
                    </h2>
                    <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                        Stop guessing and start creating data-driven, AI-powered campaigns that convert.
                    </p>
                </div>
                <div className="mx-auto w-full max-w-sm space-y-2">
                    <Button asChild size="lg" className="w-full">
                        <Link href="/dashboard">Get Started for Free</Link>
                    </Button>
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}
