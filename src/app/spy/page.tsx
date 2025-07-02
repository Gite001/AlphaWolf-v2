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
                        <span>Powered by GenAI</span>
                    </div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight">Competitor Spy</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Deconstruct your competitors' marketing strategies. Enter a URL to an ad or product page and get an AI-powered breakdown of their approach.
                    </p>
                </header>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Analyze Competitor URL</CardTitle>
                        <CardDescription>Provide a direct link to a competitor's ad or product page. The AI will deconstruct their strategy and give you ways to counter it.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CompetitorForm />
                    </CardContent>
                </Card>

                <Card className="mt-8 bg-secondary/50 border-dashed">
                    <CardHeader className="flex-row gap-4 items-center">
                        <Info className="h-6 w-6 text-primary" />
                        <div>
                            <CardTitle className="text-lg">How does this work?</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            The AI leverages its vast knowledge base of public web data to identify patterns, trends, and strategic insights. It analyzes the content, structure, and likely audience of the provided URL based on information learned during its training. It does not perform live browsing or access private data.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
