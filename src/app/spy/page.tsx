import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Binoculars, Info } from "lucide-react";
import { CompetitorForm } from "@/components/spy/competitor-form";

export default function SpyPage() {
    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <Binoculars className="h-4 w-4" />
                        <span>Piloté par GenAI</span>
                    </div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight">Espion Concurrent</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Déconstruisez les stratégies marketing de vos concurrents. Saisissez l'URL d'une publicité ou d'une page produit et obtenez une analyse détaillée de leur approche, pilotée par l'IA.
                    </p>
                </header>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Analyser l'URL d'un Concurrent</CardTitle>
                        <CardDescription>Fournissez un lien direct vers la publicité ou la page produit d'un concurrent. L'IA déconstruira sa stratégie et vous proposera des moyens de la contrer.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CompetitorForm />
                    </CardContent>
                </Card>

                <Card className="mt-8 bg-secondary/50 border-dashed">
                    <CardHeader className="flex-row gap-4 items-center">
                        <Info className="h-6 w-6 text-primary" />
                        <div>
                            <CardTitle className="text-lg">Comment ça marche ?</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            L'IA s'appuie sur sa vaste base de connaissances de données publiques du web pour identifier des schémas, des tendances et des perspectives stratégiques. Elle analyse le contenu, la structure et l'audience probable de l'URL fournie en se basant sur les informations apprises lors de sa formation. Elle n'effectue pas de navigation en direct ni n'accède à des données privées.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
