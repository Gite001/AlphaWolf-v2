'use client';

import type { GenerateAdCopyOutput } from '@/ai/flows/generate-ad-copy';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, CopyCheck } from 'lucide-react';
import { useState } from 'react';

type CopyResultsProps = {
  results: GenerateAdCopyOutput;
};

export function CopyResults({ results }: CopyResultsProps) {
    
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold font-headline text-center">Generated Copy Variations</h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {results.variations.map((variation, index) => (
                <VariationCard key={index} headline={variation.headline} body={variation.body} cta={variation.cta} />
            ))}
        </div>
    </div>
  );
}

function VariationCard({ headline, body, cta }: { headline: string; body: string; cta: string}) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const fullText = `Headline: ${headline}\n\nBody: ${body}\n\nCTA: ${cta}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(fullText).then(() => {
            setCopied(true);
            toast({ title: "Copied to clipboard!" });
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            toast({ variant: 'destructive', title: "Failed to copy", description: "Could not copy text to clipboard." });
            console.error('Failed to copy text: ', err);
        });
    };

    return (
        <Card className="flex flex-col">
            <CardHeader>
                <CardTitle>{headline}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground whitespace-pre-wrap">{body}</p>
                <p className="text-primary font-semibold mt-4">{cta}</p>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleCopy}>
                    {copied ? <CopyCheck className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy Text'}
                </Button>
            </CardFooter>
        </Card>
    )
}
