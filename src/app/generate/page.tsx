import { CopyGeneratorForm } from "@/components/generate/copy-generator-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function GenerateCopyPage() {
    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <FileText className="h-4 w-4" />
                        <span>Piloté par GenAI</span>
                    </div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight">Générateur de Concepts Publicitaires</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Créez des concepts publicitaires à haute conversion en quelques secondes. Fournissez les détails de votre produit et laissez notre IA générer des options convaincantes pour vous, avec visuels et audio.
                    </p>
                </header>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Générer de Nouveaux Concepts Publicitaires</CardTitle>
                        <CardDescription>Décrivez votre produit et votre audience cible. L'IA générera trois concepts publicitaires complets, chacun avec son propre texte, visuel et audio uniques.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CopyGeneratorForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
