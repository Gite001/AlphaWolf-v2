import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, Binoculars, Trophy, Store, Compass, BookMarked, Swords, LineChart, Search } from 'lucide-react';

type QuickActionsProps = {
    t: (key: string) => string;
};

export function QuickActions({ t }: QuickActionsProps) {
    const actions = [
        {
            href: '/plan',
            label: t('QuickActions.plan.label'),
            description: t('QuickActions.plan.description'),
            icon: Compass
        },
        {
            href: '/finder',
            label: t('QuickActions.discovery.label'),
            description: t('QuickActions.discovery.description'),
            icon: Trophy
        },
        {
            href: '/ad-radar',
            label: t('QuickActions.radar.label'),
            description: t('QuickActions.radar.description'),
            icon: Search
        },
        {
            href: '/spy',
            label: t('QuickActions.spy.label'),
            description: t('QuickActions.spy.description'),
            icon: Binoculars
        },
        {
            href: '/takedown',
            label: t('QuickActions.takedown.label'),
            description: t('QuickActions.takedown.description'),
            icon: Swords
        },
        {
            href: '/generate',
            label: t('QuickActions.generate.label'),
            description: t('QuickActions.generate.description'),
            icon: FileText
        },
    ];

    return (
        <Card className="bg-card/30 backdrop-blur-sm border-white/10 shadow-lg">
            <CardHeader>
                <CardTitle>{t('QuickActions.title')}</CardTitle>
                <CardDescription>{t('QuickActions.description')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {actions.map((action) => (
                    <Link key={action.href} href={action.href} passHref>
                        <Button variant="outline" className="h-auto w-full justify-start p-4 text-left whitespace-normal transition-colors hover:border-primary/50 hover:bg-primary/10">
                           <action.icon className="mr-4 h-6 w-6 text-primary shrink-0" />
                           <div className="flex-1 min-w-0">
                             <p className="font-semibold">{action.label}</p>
                             <p className="text-xs text-muted-foreground">{action.description}</p>
                           </div>
                           <ArrowRight className="h-4 w-4 text-muted-foreground ml-2 shrink-0" />
                        </Button>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}
