'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Ad } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Facebook, Instagram, MessageCircle, Share2, ThumbsUp } from 'lucide-react';
import { PinterestIcon, TikTokIcon } from '../icons';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

type AdCardProps = {
  ad: Ad;
};

const platformIcons = {
  Facebook: <Facebook className="h-4 w-4 text-blue-600" />,
  Instagram: <Instagram className="h-4 w-4 text-pink-500" />,
  TikTok: <TikTokIcon className="h-4 w-4" />,
  Pinterest: <PinterestIcon className="h-4 w-4 text-red-600" />,
};

export function AdCard({ ad }: AdCardProps) {
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    // This runs only on the client, after hydration, avoiding the mismatch.
    setFormattedDate(new Date(ad.date).toLocaleDateString());
  }, [ad.date]);

  return (
    <Card className="overflow-hidden group transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="relative">
        <Image
          src={ad.imageUrl}
          alt={ad.title}
          width={400}
          height={400}
          className="object-cover w-full h-64"
          data-ai-hint={ad.dataAiHint}
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm">
            {platformIcons[ad.platform]}
            <span className="ml-2">{ad.platform}</span>
          </Badge>
        </div>
        <div className="absolute bottom-2 left-2">
            <Badge variant="default" className="bg-primary/80 backdrop-blur-sm">
              Score: {ad.engagement.score}
            </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold font-headline truncate">{ad.title}</h3>
        <p className="text-sm text-muted-foreground h-5">{formattedDate}</p>
        
        <div className="flex justify-between items-center mt-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="sm" className="text-muted-foreground">Engagement</Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto">
              <div className="text-sm space-y-2">
                <div className="flex items-center gap-2"><ThumbsUp className="h-4 w-4 text-primary" /> Likes: {(ad.engagement.likes / 1000).toFixed(1)}k</div>
                <div className="flex items-center gap-2"><MessageCircle className="h-4 w-4 text-primary" /> Comments: {(ad.engagement.comments / 1000).toFixed(1)}k</div>
                <div className="flex items-center gap-2"><Share2 className="h-4 w-4 text-primary" /> Shares: {(ad.engagement.shares / 1000).toFixed(1)}k</div>
              </div>
            </PopoverContent>
          </Popover>
          <Button variant="outline" size="sm" asChild>
            <a href={ad.productLink} target="_blank" rel="noopener noreferrer">
              <Download className="mr-2 h-4 w-4" />
              Media
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
