import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, LineChart, Sparkles, FileText, Bot } from "lucide-react";

export default function HomePage() {
  const features = [
    {
      href: '/analyze',
      title: 'Analyze Ad Performance',
      description: 'Predict engagement and get actionable feedback on your ad creatives before you launch. Upload an ad to get started.',
      icon: <Sparkles className="h-8 w-8 text-primary" />,
    },
    {
      href: '/generate',
      title: 'Generate Ad Copy & Visuals',
      description: 'Instantly craft high-converting copy and generate unique, compelling visuals that resonate with your target audience.',
      icon: <FileText className="h-8 w-8 text-primary" />,
    },
    {
      href: '/trends',
      title: 'Research Market Trends',
      description: 'Discover trending products, untapped opportunities, and potential risks in any market category or region.',
      icon: <LineChart className="h-8 w-8 text-primary" />,
    }
  ];

  return (
    <>
        <section className="w-full py-20 md:py-32 lg:py-40">
          <div className="container px-4 md:px-6 text-center">
            <div className="max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full font-medium">
                <Bot className="h-5 w-5" />
                <span>Your AI Marketing Co-Pilot</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-headline tracking-tighter">
                Unlock Marketing Superpowers with AI
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                AdInsights is your all-in-one platform to analyze competitors, generate high-converting ads, and uncover market trends before anyone else.
              </p>
              <div className="flex justify-center mt-6">
                 <Link href="/dashboard">
                    <Button size="lg">
                        Go to Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-16 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              {features.map((feature) => (
                <Link key={feature.href} href={feature.href} className="group">
                    <Card className="h-full flex flex-col transition-all duration-300 group-hover:border-primary group-hover:shadow-lg group-hover:-translate-y-2">
                        <CardHeader className="flex-row items-center gap-4">
                            {feature.icon}
                            <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <p className="text-muted-foreground">{feature.description}</p>
                        </CardContent>
                    </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
    </>
  );
}
