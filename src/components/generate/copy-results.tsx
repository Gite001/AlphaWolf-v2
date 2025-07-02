'use client';

import Image from 'next/image';
import type { GenerateAdCopyOutput } from '@/ai/flows/generate-ad-copy';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, CopyCheck, Sparkles, Loader2, ImageIcon, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { handleVisualGeneration } from '@/app/generate/actions';

type CopyResultsProps = {
  variations: GenerateAdCopyOutput['variations'];
  productName: string;
  productDescription: string;
};

export function CopyResults({ variations, productName, productDescription }: CopyResultsProps) {
    
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold font-headline text-center">Generated Copy & Visuals</h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {variations.map((variation, index) => (
                <VariationCard 
                    key={index} 
                    headline={variation.headline} 
                    body={variation.body} 
                    cta={variation.cta}
                    productName={productName}
                    productDescription={productDescription}
                />
            ))}
        </div>
    </div>
  );
}

function VariationCard({ headline, body, cta, productName, productDescription }: { headline: string; body: string; cta: string, productName: string, productDescription: string }) {
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const [visualState, setVisualState] = useState<{loading: boolean; imageUrl: string | null; error: string | null}>({
        loading: false,
        imageUrl: null,
        error: null,
    });
    
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

    const generateVisual = async () => {
        setVisualState({ loading: true, imageUrl: null, error: null });
        try {
            const result = await handleVisualGeneration({ 
                headline, 
                body, 
                productName,
                productDescription
            });
            if (result.imageUrl) {
                setVisualState({ loading: false, imageUrl: result.imageUrl, error: null });
                toast({ title: "Visual generated successfully!" });
            } else {
                throw new Error(result.error || 'Failed to generate visual.');
            }
        } catch (e: any) {
            const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
            setVisualState({ loading: false, imageUrl: null, error: errorMessage });
            toast({ variant: 'destructive', title: "Visual Generation Failed", description: errorMessage });
        }
    };


    return (
        <Card className="flex flex-col">
            <div className="bg-muted aspect-video w-full rounded-t-lg flex items-center justify-center overflow-hidden relative">
                {visualState.loading && <Loader2 className="h-8 w-8 animate-spin text-primary" />}
                {visualState.imageUrl && <Image src={visualState.imageUrl} alt={`AI generated visual for ${headline}`} fill className="object-cover" />}
                {!visualState.loading && !visualState.imageUrl && !visualState.error && <ImageIcon className="h-12 w-12 text-muted-foreground/50" />}
                {visualState.error && (
                    <div className='text-center text-destructive p-4 flex flex-col items-center gap-2'>
                        <AlertCircle className="h-8 w-8" />
                        <p className='text-sm font-semibold'>Generation Failed</p>
                        <p className='text-xs'>{visualState.error}</p>
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
            <CardFooter className="gap-2">
                <Button variant="outline" className="w-full" onClick={handleCopy}>
                    {copied ? <CopyCheck className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? 'Copied!' : 'Copy Text'}
                </Button>
                <Button variant="secondary" className="w-full" onClick={generateVisual} disabled={visualState.loading}>
                    {visualState.loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                    Generate Visual
                </Button>
            </CardFooter>
        </Card>
    )
}
