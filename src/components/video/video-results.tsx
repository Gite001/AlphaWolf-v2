'use client';

import Image from 'next/image';
import type { GenerateVideoStoryboardOutput } from '@/ai/flows/generate-video-storyboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, FileText, Timer, Download } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Button } from '../ui/button';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../ui/tooltip';

type VideoResultsProps = {
  results: GenerateVideoStoryboardOutput;
};

export function VideoResults({ results }: VideoResultsProps) {
  const { t } = useI18n();
  const totalDuration = results.scenesWithImages?.reduce((acc, scene) => acc + scene.duration_seconds, 0) || 0;

  return (
    <TooltipProvider>
        <div className="space-y-6 animate-in fade-in duration-500">
        <header className="text-center">
            <h2 className="text-3xl font-bold font-headline">{t('VideoResults.title')}</h2>
            <p className="text-xl text-muted-foreground mt-1">&ldquo;{results.title}&rdquo;</p>
        </header>
        
        <Card>
            <CardHeader>
                <CardTitle>Full Script & Audio</CardTitle>
                <CardDescription>Total duration: {totalDuration} seconds</CardDescription>
            </CardHeader>
            <CardContent>
                {results.audioUrl ? (
                    <div className="flex items-center gap-2">
                        <audio controls className="w-full h-10 flex-1">
                            <source src={results.audioUrl} type="audio/wav" />
                            {t('VideoResults.audioNotSupported')}
                        </audio>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" asChild>
                                    <a href={results.audioUrl} download="storyboard_audio.wav">
                                        <Download className="h-4 w-4" />
                                        <span className="sr-only">{t('VideoResults.downloadAudio')}</span>
                                    </a>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('VideoResults.downloadAudio')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                ) : (
                    <Skeleton className="w-full h-10 rounded-md" />
                )}
                <Accordion type="single" collapsible className="w-full mt-4">
                <AccordionItem value="item-1">
                    <AccordionTrigger>
                    <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        <span>View Full Script</span>
                    </div>
                    </AccordionTrigger>
                    <AccordionContent>
                    <p className="whitespace-pre-line text-sm text-muted-foreground p-4 bg-secondary/30 rounded-md">{results.fullScript}</p>
                    </AccordionContent>
                </AccordionItem>
                </Accordion>
            </CardContent>
        </Card>


        <div className="space-y-8">
            {results.scenesWithImages?.map((scene, index) => (
            <Card key={index} className="shadow-lg flex flex-col md:flex-row bg-card/30 backdrop-blur-sm border-white/10 overflow-hidden">
                <div className="md:w-1/3 aspect-video md:aspect-auto bg-muted/50 flex items-center justify-center overflow-hidden relative border-b md:border-b-0 md:border-r border-white/10">
                {scene.imageUrl ? (
                    <>
                        <Image src={scene.imageUrl} alt={t('VideoResults.imageAlt', { sceneNumber: scene.sceneNumber })} fill className="object-cover" />
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="outline" size="icon" asChild className="absolute bottom-2 right-2 z-10 bg-background/50 hover:bg-background/80">
                                    <a href={scene.imageUrl} download={`scene_${scene.sceneNumber}_visual.png`}>
                                        <Download className="h-4 w-4" />
                                        <span className="sr-only">{t('VideoResults.downloadImage')}</span>
                                    </a>
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>{t('VideoResults.downloadImage')}</p>
                            </TooltipContent>
                        </Tooltip>
                    </>
                ) : (
                    <div className='text-center text-destructive p-4 flex flex-col items-center gap-2'>
                    <AlertCircle className="h-8 w-8" />
                    <p className='text-sm font-semibold'>{t('VideoResults.imageFailed')}</p>
                    </div>
                )}
                </div>
                <div className="md:w-2/3">
                    <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                            <span>{t('VideoResults.scene')} {scene.sceneNumber}</span>
                            <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
                                <Timer className="h-4 w-4"/>
                                {scene.duration_seconds}s
                            </span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground italic">&ldquo;{scene.script_narration}&rdquo;</p>

                        <Accordion type="single" collapsible className="w-full mt-4">
                        <AccordionItem value="item-1">
                            <AccordionTrigger className="text-xs py-2">{t('VideoResults.visualPrompt')}</AccordionTrigger>
                            <AccordionContent>
                            <p className="text-xs text-muted-foreground pt-2">{scene.visual_description}</p>
                            </AccordionContent>
                        </AccordionItem>
                        </Accordion>
                    </CardContent>
                </div>
            </Card>
            ))}
        </div>
        </div>
    </TooltipProvider>
  );
}
