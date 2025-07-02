import { TrendsForm } from "@/components/trends/trends-form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart } from "lucide-react";

export default function TrendsPage() {
    return (
        <div className="p-4 md:p-8">
            <div className="max-w-4xl mx-auto">
                <header className="mb-8 text-center">
                    <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                        <LineChart className="h-4 w-4" />
                        <span>Powered by GenAI</span>
                    </div>
                    <h1 className="text-4xl font-bold font-headline tracking-tight">Market Trend Analysis</h1>
                    <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
                        Discover the most sought-after products in any category. Enter a product category and region to get an AI-powered market analysis.
                    </p>
                </header>
                <Card className="shadow-lg">
                    <CardHeader>
                        <CardTitle>Analyze Market Trends</CardTitle>
                        <CardDescription>Fill out the form below to discover winning products.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TrendsForm />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
