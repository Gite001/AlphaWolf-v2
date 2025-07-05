'use client';

import Image from 'next/image';
import type { GenerateAdCopyOutput } from '@/ai/flows/generate-ad-copy';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Copy, CopyCheck, AlertCircle, ImageDown, FileAudio } from 'lucide-react';
import { useState } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import { Tooltip, TooltipProvider, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type CopyResultsProps = {
  variations: GenerateAdCopyOutput['variations'];
};

export function CopyResults({ variations }: CopyResultsProps) {
    const { t } = useI18n();
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
        <h2 className="text-2xl font-bold font-headline text-center">{t('CopyResults.title')}</h2>
        <div className="grid md:grid-cols-1 lg:grid-cols-2 gap-6">
            <TooltipProvider>
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
            </TooltipProvider>
        </div>
    </div>
  );
}

// Simplified VariationCard
function VariationCard({ headline, body, cta, imageUrl, audioUrl }: { 
    headline: string; 
    body: string; 
    cta: string;
    imageUrl: string | null;
    audioUrl: string | null;
}) {
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
        <Card className="flex flex-col bg-card/30 backdrop-blur-sm border-white/10 shadow-lg hover:shadow-primary/20 hover:-translate-y-1 transition-all duration-300">
            <div className="bg-muted/50 aspect-video w-full rounded-t-lg flex items-center justify-center overflow-hidden relative border-b border-white/10">
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
                
                <div className="mt-4">
                    {audioUrl ? (
                         <audio controls className="w-full h-10">
                            <source src={audioUrl} type="audio/wav" />
                            {t('CopyResults.audioNotSupported')}
                        </audio>
                    ) : (
                        <div className="w-full h-10 flex items-center justify-center bg-secondary/30 rounded-md">
                            <p className="text-sm text-destructive flex items-center gap-2"><AlertCircle className="h-4 w-4"/> {t('VideoResults.audioFailed')}</p>
                        </div>
                    )}
                </div>

                <p className="text-primary font-semibold mt-4">{cta}</p>
            </CardContent>
            <CardFooter className="flex-col sm:flex-row gap-2">
                <Button variant="outline" className="w-full flex-1" onClick={handleCopy}>
                    {copied ? <CopyCheck className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? t('CopyResults.copyButton.copied') : t('CopyResults.copyButton.copy')}
                </Button>
                <div className="flex w-full sm:w-auto gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button asChild variant="outline" size="icon" className="flex-1 sm:flex-none" disabled={!imageUrl}>
                                <a href={imageUrl!} download={`${headline.replace(/\s/g, '_')}_visual.png`}>
                                    <ImageDown className="h-4 w-4" />
                                    <span className="sr-only">{t('CopyResults.downloadImage')}</span>
                                </a>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t('CopyResults.downloadImage')}</p>
                        </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                        <TooltipTrigger asChild>
                             <Button asChild variant="outline" size="icon" className="flex-1 sm:flex-none" disabled={!audioUrl}>
                                <a href={audioUrl!} download={`${headline.replace(/\s/g, '_')}_audio.wav`}>
                                    <FileAudio className="h-4 w-4" />
                                    <span className="sr-only">{t('CopyResults.downloadAudio')}</span>
                                </a>
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{t('CopyResults.downloadAudio')}</p>
                        </TooltipContent>
                    </Tooltip>
                </div>
            </CardFooter>
        </Card>
    )
}
