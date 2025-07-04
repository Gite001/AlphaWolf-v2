'use client';

import Image from 'next/image';
import type { GenerateTakedownPlanOutput } from '@/ai/flows/generate-takedown-plan';
import { generateVariationImage } from '@/app/generate/actions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2, Target, User, Shield, ImageDown, Copy, CopyCheck } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

type TakedownResultsProps = {
  results: GenerateTakedownPlanOutput;
};

export function TakedownResults({ results }: TakedownResultsProps) {
  const { t } = useI18n();
  return (
    <TooltipProvider>
      <div className="space-y-8 animate-in fade-in duration-500">
        <header className="text-center">
            <h2 className="text-3xl font-bold font-headline">{t('TakedownResults.title')}</h2>
            <p className="text-muted-foreground mt-1 max-w-2xl mx-auto">{t('TakedownResults.description', { competitorProduct: results.competitorProduct, competitorBrand: results.competitorBrand })}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.takedownAngles.map((angle, index) => (
                <TakedownAngleCard key={index} angle={angle} />
            ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

function TakedownAngleCard({ angle }: { angle: GenerateTakedownPlanOutput['takedownAngles'][0] }) {
    const { t } = useI18n();
    const { toast } = useToast();
    const [copied, setCopied] = useState(false);
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [isGeneratingImage, setIsGeneratingImage] = useState(true);
    const [imageError, setImageError] = useState(false);
    
    useEffect(() => {
        let isCancelled = false;
        setIsGeneratingImage(true);
        generateVariationImage(angle.counterVisualPrompt).then(result => {
            if (isCancelled) return;
            if (result.error || !result.data?.imageUrl) {
                console.error("Image generation failed:", result.error);
                setImageError(true);
            } else {
                setImageUrl(result.data.imageUrl);
            }
            setIsGeneratingImage(false);
        });

        return () => { isCancelled = true; };
    }, [angle.counterVisualPrompt]);
    
    const fullText = `Angle: ${angle.angleName}\n\nHeadline: ${angle.counterHeadline}\n\nBody: ${angle.counterBody}`;

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
            <div className="bg-muted/50 aspect-video w-full flex items-center justify-center overflow-hidden relative border-b border-white/10">
                {isGeneratingImage ? (
                    <div className="w-full h-full flex items-center justify-center bg-secondary/30">
                        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                ) : imageError || !imageUrl ? (
                    <div className='text-center text-destructive p-4 flex flex-col items-center gap-2'>
                        <AlertCircle className="h-8 w-8" />
                        <p className='text-sm font-semibold'>{t('CopyResults.imageFailed')}</p>
                    </div>
                ) : (
                    <Image src={imageUrl} alt={angle.angleName} fill className="object-cover" />
                )}
            </div>
            <CardHeader className="pb-2">
                <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary"/>
                    <span>{angle.angleName}</span>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow space-y-4">
                <div className="p-3 rounded-md bg-secondary/30 border border-input">
                    <h4 className="font-semibold text-foreground">{angle.counterHeadline}</h4>
                    <p className="text-sm text-muted-foreground mt-1">{angle.counterBody}</p>
                </div>
                 <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4 mt-1 shrink-0 text-primary" />
                    <div>
                        <span className="font-semibold text-foreground">{t('TakedownResults.targetSegment')}:</span> {angle.targetAudienceSegment}
                    </div>
                 </div>
            </CardContent>
            <CardFooter className="gap-2">
                <Button variant="outline" className="w-full flex-1" onClick={handleCopy}>
                    {copied ? <CopyCheck className="mr-2 h-4 w-4 text-green-500" /> : <Copy className="mr-2 h-4 w-4" />}
                    {copied ? t('CopyResults.copyButton.copied') : t('CopyResults.copyButton.copy')}
                </Button>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button asChild variant="outline" size="icon" disabled={!imageUrl || isGeneratingImage || imageError}>
                            <a href={imageUrl!} download={`${angle.angleName.replace(/\s/g, '_')}_visual.png`}>
                                <ImageDown className="h-4 w-4" />
                                <span className="sr-only">{t('CopyResults.downloadImage')}</span>
                            </a>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{t('CopyResults.downloadImage')}</p>
                    </TooltipContent>
                </Tooltip>
            </CardFooter>
        </Card>
    );
}
