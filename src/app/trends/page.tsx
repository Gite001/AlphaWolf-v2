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
                        <CardDescription>Tell the AI what product category and region you're interested in. It will return a market summary, trending products, and strategic advice.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TrendsForm />
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
                            The AI leverages its vast training on public web data up to its last update. By analyzing countless articles, product listings, and consumer discussions, it identifies patterns and synthesizes information to provide strategic insights on market trends, popular products, and potential risks. It does not access real-time sales data.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
