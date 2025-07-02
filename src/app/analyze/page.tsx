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
                        <span>Powered by GenAI</span>
                    </div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight">Ad Performance Analysis</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Get an AI-powered analysis of your ad creative. Upload your visual, provide the details, and receive an estimated engagement score along with actionable feedback.
                    </p>
                </header>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Analyze New Ad</CardTitle>
                        <CardDescription>Provide the details of your ad below. The AI will analyze the text, visual, and targeting to give you a performance estimate and improvement suggestions.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AnalysisForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
