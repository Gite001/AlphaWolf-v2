import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, Binoculars, Trophy } from 'lucide-react';

export function QuickActions() {
    const actions = [
        {
            href: '/finder',
            label: 'Find Winning Products',
            description: 'Let AI analyze our ad database for hot products.',
            icon: Trophy
        },
        {
            href: '/spy',
            label: 'Spy on Competitors',
            description: "Deconstruct a competitor's ad or product page.",
            icon: Binoculars
        },
        {
            href: '/generate',
            label: 'Generate Ad Concepts',
            description: 'Instantly create complete ad copy and visuals.',
            icon: FileText
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Wolf Pack Actions</CardTitle>
                <CardDescription>Launch your next hunt for winning products.</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {actions.map((action) => (
                    <Link key={action.href} href={action.href} passHref>
                        <Button variant="outline" className="h-auto w-full justify-start p-4 text-left">
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
