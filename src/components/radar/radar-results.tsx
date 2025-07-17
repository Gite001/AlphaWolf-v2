'use client';

import type { LiveAd } from '@/ai/flows/find-live-ads';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/hooks/use-i18n';

type RadarResultsProps = {
  ads: LiveAd[];
};

export function RadarResults({ ads }: RadarResultsProps) {
  const { t } = useI18n();
  
  if (ads.length === 0) {
    return (
        <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-semibold">{t('AdGallery.noAds.title')}</p>
            <p>{t('AdGallery.noAds.description')}</p>
        </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="text-center">
        <h2 className="text-3xl font-bold font-headline">{t('FinderResults.winningCategories.title')}</h2>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ads.map((ad, index) => (
            <Card key={index} className="flex flex-col bg-card/30 backdrop-blur-sm border-white/10 shadow-lg">
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <CardTitle className="pr-4">{ad.title}</CardTitle>
                        <Badge variant="secondary">{ad.platform}</Badge>
                    </div>
                    <CardDescription>
                        <Badge variant="default" className="bg-primary/80 backdrop-blur-sm text-primary-foreground font-bold">
                            Score: {ad.score}
                        </Badge>
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">{ad.description}</p>
                </CardContent>
            </Card>
        ))}
      </div>
    </div>
  );
}
