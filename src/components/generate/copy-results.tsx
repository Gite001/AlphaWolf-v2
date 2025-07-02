'use client';

import Image from 'next/image';
import type { GenerateAdCopyOutput } from '@/ai/flows/generate-ad-copy';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, CopyCheck, AlertCircle } from 'lucide-react';
import { useState } from 'react';

type CopyResultsProps = {
  variations: GenerateAdCopyOutput['variations'];
};

export function CopyResults({ variations }: CopyResultsProps) {
    
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold font-headline text-center">Generated Ad Concepts</h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {variations.map((variation, index) => (
                <VariationCard 
                    key={index} 
                    headline={variation.headline} 
                    body={variation.body} 
                    cta={variation.cta}
                    imageUrl={variation.imageUrl}
                />
            ))}
        </div>
    </div>
  );
}

function VariationCard({ headline, body, cta, imageUrl }: { headline: string; body: string; cta: string, imageUrl: string | null }) {
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
            <div className="bg-muted aspect-video w-full rounded-t-lg flex items-center justify-center overflow-hidden relative">
                {imageUrl ? (
                    <Image src={imageUrl} alt={`AI generated visual for ${headline}`} fill className="object-cover" />
                ) : (
                    <div className='text-center text-destructive p-4 flex flex-col items-center gap-2'>
                        <AlertCircle className="h-8 w-8" />
                        <p className='text-sm font-semibold'>Visual Generation Failed</p>
                    </div>
                )}
            </div>
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
