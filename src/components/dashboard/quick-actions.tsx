import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, FileText, LineChart, ArrowRight } from 'lucide-react';

export function QuickActions() {
    const actions = [
        {
            href: '/analyze',
            label: 'Analyze Ad Performance',
            description: 'Get an AI-powered analysis of your ad creative.',
            icon: Sparkles
        },
        {
            href: '/generate',
            label: 'Generate Ad Copy',
            description: 'Craft high-converting ad copy in seconds.',
            icon: FileText
        },
        {
            href: '/trends',
            label: 'Research Market Trends',
            description: 'Discover trending products and opportunities.',
            icon: LineChart
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Jumpstart your next winning campaign.</CardDescription>
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
