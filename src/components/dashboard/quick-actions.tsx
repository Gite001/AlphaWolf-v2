import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, Binoculars, Trophy, Store, Compass } from 'lucide-react';
import { getTranslations } from '@/lib/utils';
import { cookies } from 'next/headers';

export async function QuickActions() {
    const locale = cookies().get('locale')?.value;
    const t = getTranslations(locale);
    const actions = [
        {
            href: '/plan',
            label: t('QuickActions.plan.label'),
            description: t('QuickActions.plan.description'),
            icon: Compass
        },
        {
            href: '/pulse',
            label: t('QuickActions.pulse.label'),
            description: t('QuickActions.pulse.description'),
            icon: Store
        },
        {
            href: '/finder',
            label: t('QuickActions.finder.label'),
            description: t('QuickActions.finder.description'),
            icon: Trophy
        },
        {
            href: '/spy',
            label: t('QuickActions.spy.label'),
            description: t('QuickActions.spy.description'),
            icon: Binoculars
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
                        <Button variant="outline" className="h-auto w-full justify-start p-4 text-left transition-colors hover:border-primary/50 hover:bg-primary/10">
                           <action.icon className="mr-4 h-6 w-6 text-primary" />
                           <div className="flex-1">
                             <p className="font-semibold">{action.label}</p>
                             <p className="text-xs text-muted-foreground">{action.description}</p>
                           </div>
                           <ArrowRight className="h-4 w-4 text-muted-foreground ml-2" />
                        </Button>
                    </Link>
                ))}
            </CardContent>
        </Card>
    );
}
