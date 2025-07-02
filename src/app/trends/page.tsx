import { TrendsForm } from "@/components/trends/trends-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, LineChart } from "lucide-react";

export default function TrendsPage() {
    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <LineChart className="h-4 w-4" />
                        <span>Piloté par GenAI</span>
                    </div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight">Analyse des Tendances du Marché</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Découvrez les produits les plus recherchés dans n'importe quelle catégorie. Saisissez une catégorie de produits et une région pour obtenir une analyse de marché pilotée par l'IA.
                    </p>
                </header>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Analyser les Tendances du Marché</CardTitle>
                        <CardDescription>Indiquez à l'IA la catégorie de produits et la région qui vous intéressent. Elle vous fournira un résumé du marché, les produits tendances et des conseils stratégiques.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TrendsForm />
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
                            L'IA s'appuie sur sa vaste formation sur les données publiques du web jusqu'à sa dernière mise à jour. En analysant d'innombrables articles, listes de produits et discussions de consommateurs, elle identifie des schémas et synthétise des informations pour fournir des aperçus stratégiques sur les tendances du marché, les produits populaires et les risques potentiels. Elle n'accède pas aux données de vente en temps réel.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
