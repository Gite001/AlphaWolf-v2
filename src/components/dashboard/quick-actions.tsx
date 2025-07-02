import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowRight, Binoculars, Trophy } from 'lucide-react';

export function QuickActions() {
    const actions = [
        {
            href: '/finder',
            label: 'Trouver des Produits Gagnants',
            description: 'Laissez l\'IA analyser notre base de données publicitaires.',
            icon: Trophy
        },
        {
            href: '/spy',
            label: 'Espionner les Concurrents',
            description: "Déconstruisez la page d'un concurrent.",
            icon: Binoculars
        },
        {
            href: '/generate',
            label: 'Générer des Concepts Publicitaires',
            description: 'Créez instantanément des textes et visuels complets.',
            icon: FileText
        },
    ];

    return (
        <Card>
            <CardHeader>
                <CardTitle>Actions de la Meute</CardTitle>
                <CardDescription>Lancez votre prochaine chasse aux produits gagnants.</CardDescription>
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
