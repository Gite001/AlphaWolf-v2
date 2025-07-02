import { AnalysisForm } from "@/components/analyze/analysis-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function AnalyzePage() {
    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <Sparkles className="h-4 w-4" />
                        <span>Piloté par GenAI</span>
                    </div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight">Analyse de Performance Publicitaire</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Obtenez une analyse par IA de votre création publicitaire. Téléchargez votre visuel, fournissez les détails, et recevez un score d'engagement estimé ainsi que des retours exploitables.
                    </p>
                </header>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Analyser une Nouvelle Publicité</CardTitle>
                        <CardDescription>Fournissez les détails de votre publicité ci-dessous. L'IA analysera le texte, le visuel et le ciblage pour vous donner une estimation de performance et des suggestions d'amélioration.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AnalysisForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
