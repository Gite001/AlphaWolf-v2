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
                        <span>Powered by GenAI</span>
                    </div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight">Ad Concept Generator</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Craft high-converting ad concepts in seconds. Provide your product details and let our AI generate compelling options for you, complete with visuals and audio.
                    </p>
                </header>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Generate New Ad Concepts</CardTitle>
                        <CardDescription>Describe your product and target audience. The AI will generate three complete ad concepts, each with its own unique text, visual, and audio.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CopyGeneratorForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
