'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import type { Ad } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ZoomIn, Facebook, Instagram, MessageCircle, Share2, ThumbsUp } from 'lucide-react';
import { PinterestIcon, TikTokIcon } from '../icons';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

type AdTableProps = {
  ads: Ad[];
  t: (key: string) => string;
};

const platformIcons = {
  Facebook: <Facebook className="h-5 w-5 text-blue-400" />,
  Instagram: <Instagram className="h-5 w-5 text-pink-400" />,
  TikTok: <TikTokIcon className="h-5 w-5 text-cyan-300" />,
  Pinterest: <PinterestIcon className="h-5 w-5 text-red-400" />,
};

function AdRow({ ad, t }: { ad: Ad; t: (key: string) => string }) {
    const [formattedDate, setFormattedDate] = useState('');

    useEffect(() => {
        setFormattedDate(new Date(ad.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }));
    }, [ad.date]);

    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10 rounded-md">
                        <AvatarImage src={ad.imageUrl} alt={ad.title} data-ai-hint={ad.dataAiHint} />
                        <AvatarFallback className="rounded-md">{ad.title.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <p className="font-semibold line-clamp-1">{ad.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{ad.description}</p>
                    </div>
                </div>
            </TableCell>
            <TableCell>
                <Badge variant="outline" className="flex items-center justify-center gap-2 w-28">
                    {platformIcons[ad.platform]}
                    <span>{ad.platform}</span>
                </Badge>
            </TableCell>
             <TableCell className="text-center">
                <Badge variant="secondary">{ad.country}</Badge>
            </TableCell>
            <TableCell className="text-center font-bold text-primary">{ad.engagement.score}</TableCell>
            <TableCell className="text-muted-foreground">{formattedDate}</TableCell>
            <TableCell className="text-right">
                 <div className="flex items-center justify-end gap-2">
                    <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-muted-foreground">{t('AdCard.engagement')}</Button>
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
            </TableCell>
        </TableRow>
    );
}

export function AdTable({ ads, t }: AdTableProps) {
  return (
    <TooltipProvider>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead className="w-[350px]">{t('AdTable.product')}</TableHead>
                    <TableHead>{t('AdTable.platform')}</TableHead>
                    <TableHead className="text-center">{t('AdTable.country')}</TableHead>
                    <TableHead className="text-center">{t('AdTable.score')}</TableHead>
                    <TableHead>{t('AdTable.date')}</TableHead>
                    <TableHead className="text-right">{t('AdTable.actions')}</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {ads.map((ad) => (
                    <AdRow key={ad.id} ad={ad} t={t} />
                ))}
            </TableBody>
        </Table>
    </TooltipProvider>
  );
}
