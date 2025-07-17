'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Ad } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ZoomIn, Facebook, Instagram, MessageCircle, Share2, ThumbsUp } from 'lucide-react';
import { PinterestIcon, TikTokIcon } from '../icons';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

type AdCardProps = {
  ad: Ad;
  t: (key: string) => string;
};

const platformIcons = {
  Facebook: <Facebook className="h-4 w-4 text-blue-400" />,
  Instagram: <Instagram className="h-4 w-4 text-pink-400" />,
  TikTok: <TikTokIcon className="h-4 w-4 text-cyan-300" />,
  Pinterest: <PinterestIcon className="h-4 w-4 text-red-400" />,
};

export function AdCard({ ad, t }: AdCardProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // This runs only on the client, after hydration, avoiding the mismatch.
    setFormattedDate(new Date(ad.date).toLocaleDateString());
  }, [ad.date]);

  return (
    <Card className="flex flex-col overflow-hidden group transition-all duration-300 bg-card/30 backdrop-blur-sm border-white/10 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/50">
      <div className="relative">
        <Image
          src={ad.imageUrl}
          alt={ad.title}
          width={400}
          height={400}
          className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={ad.dataAiHint}
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {platformIcons[ad.platform]}
            <span className="ml-2">{ad.platform}</span>
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2">
            <Badge variant="default" className="bg-primary/80 backdrop-blur-sm text-primary-foreground font-bold">
              Score: {ad.engagement.score}
            </Badge>
        </div>
      </div>
      <CardContent className="p-4 flex flex-col flex-grow">
        <h3 className="font-semibold font-headline truncate">{ad.title}</h3>
        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{ad.description}</p>
        
        <div className="mt-auto pt-4">
          <p className="text-xs text-muted-foreground mb-2">{formattedDate}</p>
          <div className="flex justify-between items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground -ml-3">{t('AdCard.engagement')}</Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto">
                <div className="text-sm space-y-2">
                  <div className="flex items-center gap-2"><ThumbsUp className="h-4 w-4 text-primary" /> {t('AdCard.likes')}: {(ad.engagement.likes / 1000).toFixed(1)}k</div>
                  <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-primary" /> {t('AdCard.comments')}: {(ad.engagement.comments / 1000).toFixed(1)}k</div>
                  <div className="flex items-center gap-2"><Share2 className="h-4 w-4 text-primary" /> {t('AdCard.shares')}: {(ad.engagement.shares / 1000).toFixed(1)}k</div>
                </div>
              </PopoverContent>
            </Popover>
            <Dialog>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon">
                      <ZoomIn className="h-4 w-4" />
                      <span className="sr-only">{t('AdCard.media')}</span>
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('AdCard.media')}</p>
                </TooltipContent>
              </Tooltip>
              <DialogContent className="max-w-3xl p-0 border-0">
                <DialogHeader>
                  <DialogTitle className="sr-only">{ad.title}</DialogTitle>
                </DialogHeader>
                <Image
                  src={ad.imageUrl.replace('400x400', '800x800')}
                  alt={ad.title}
                  width={800}
                  height={800}
                  className="object-contain w-full h-auto rounded-lg"
                  data-ai-hint={ad.dataAiHint}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
