'use client';

import Image from 'next/image';
import type { GenerateAdCopyOutput } from '@/ai/flows/generate-ad-copy';
import { generateVariationImage, generateVariationAudio } from '@/app/generate/actions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { Copy, CopyCheck, AlertCircle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useI18n } from '@/hooks/use-i18n';

type CopyResultsProps = {
  variations: GenerateAdCopyOutput['variations'];
};

export function CopyResults({ variations }: CopyResultsProps) {
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
                    visualPrompt={variation.visualPrompt}
                />
            ))}
        </div>
    </div>
  );
}

function VariationCard({ headline, body, cta, visualPrompt }: { headline: string; body: string; cta: string, visualPrompt: string }) {
    const { t } = useI18n();
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(true);
    const [isGeneratingAudio, setIsGeneratingAudio] = useState(true);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        let isCancelled = false;

        const generateMedia = async () => {
            generateVariationImage(visualPrompt).then(result => {
                if (isCancelled) return;
                if (result.error || !result.data?.imageUrl) {
                    console.error("Image generation failed:", result.error);
                    setImageError(true);
                } else {
                    setImageUrl(result.data.imageUrl);
                }
                setIsGeneratingImage(false);
            });

            generateVariationAudio(body).then(result => {
                if (isCancelled) return;
                if (result.error || !result.data?.audioUrl) {
                    console.error("Audio generation failed:", result.error);
                } else {
                    setAudioUrl(result.data.audioUrl);
                }
                setIsGeneratingAudio(false);
            });
        };

        generateMedia();

        return () => {
            isCancelled = true;
        };
    }, [visualPrompt, body]);
    
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
        <Card className="flex flex-col bg-card/30 backdrop-blur-sm border-white/10 shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300">
            <div className="bg-muted/50 aspect-video w-full rounded-t-lg flex items-center justify-center overflow-hidden relative border-b border-white/10">
                {isGeneratingImage ? (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : imageError ? (
                    <div className='text-center text-destructive p-4 flex flex-col items-center gap-2'>
                        <AlertCircle className="h-8 w-8" />
                        <p className='text-sm font-semibold'>{t('CopyResults.imageFailed')}</p>
                    </div>
                ) : imageUrl ? (
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
                
                <div className="mt-4">
                    {isGeneratingAudio ? (
                        <Skeleton className="w-full h-10 rounded-md" />
                    ) : audioUrl ? (
                         <audio controls className="w-full h-10">
                            <source src={audioUrl} type="audio/wav" />
                            {t('CopyResults.audioNotSupported')}
                        </audio>
                    ) : null}
                </div>

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
