'use client';

import Image from 'next/image';
import type { GenerateAdCopyOutput } from '@/ai/flows/generate-ad-copy';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, CopyCheck, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/hooks/use-i18n';

type CopyResultsProps = {
  variations: GenerateAdCopyOutput['variations'];
  productName: string;
  productDescription: string;
};

export function CopyResults({ variations, productName, productDescription }: CopyResultsProps) {
    const { t } = useI18n();
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold font-headline text-center">{t('CopyResults.title')}</h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            {variations.map((variation, index) => (
                <VariationCard 
                    key={index} 
                    headline={variation.headline} 
                    body={variation.body} 
                    cta={variation.cta}
                    imageUrl={variation.imageUrl}
                    audioUrl={variation.audioUrl}
                />
            ))}
        </div>
    </div>
  );
}

function VariationCard({ headline, body, cta, imageUrl, audioUrl }: { headline: string; body: string; cta: string, imageUrl: string | null, audioUrl: string | null }) {
    const { t } = useI18n();
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    
    const fullText = `Headline: ${headline}\n\nBody: ${body}\n\nCTA: ${cta}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(fullText).then(() => {
            setCopied(true);
            toast({ title: t('CopyResults.toast.copied') });
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            toast({ variant: 'destructive', title: t('CopyResults.toast.copyFailedTitle'), description: t('CopyResults.toast.copyFailedDescription') });
            console.error('Failed to copy text: ', err);
        });
    };

    return (
        <Card className="flex flex-col">
            <div className="bg-muted aspect-video w-full rounded-t-lg flex items-center justify-center overflow-hidden relative">
                {imageUrl ? (
                    <Image src={imageUrl} alt={t('CopyResults.imageAlt', { headline })} fill className="object-cover" />
                ) : (
                    <div className='text-center text-destructive p-4 flex flex-col items-center gap-2'>
                        <AlertCircle className="h-8 w-8" />
                        <p className='text-sm font-semibold'>{t('CopyResults.imageFailed')}</p>
                    </div>
                )}
            </div>
            <CardHeader>
                <CardTitle>{headline}</CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
                <p className="text-muted-foreground whitespace-pre-wrap">{body}</p>
                
                {audioUrl && (
                    <div className="mt-4">
                        <audio controls className="w-full h-10">
                            <source src={audioUrl} type="audio/wav" />
                            {t('CopyResults.audioNotSupported')}
                        </audio>
                    </div>
                )}

                <p className="text-primary font-semibold mt-4">{cta}</p>
            </CardContent>
            <CardFooter>
                <Button variant="outline" className="w-full" onClick={handleCopy}>
                    {copied ? <CopyCheck className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? t('CopyResults.copyButton.copied') : t('CopyResults.copyButton.copy')}
                </Button>
            </CardFooter>
        </Card>
    )
}
