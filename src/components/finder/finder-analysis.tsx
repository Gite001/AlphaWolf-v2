'use client';

import { useState, useMemo, useActionState, useRef, useEffect } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import type { Ad } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Slider } from '@/components/ui/slider';
import { AdCard } from '@/components/dashboard/ad-card';
import { Search, Calendar as CalendarIcon, Bot, Loader2 } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { format, subDays } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { getWinningProductsAnalysis } from '@/app/finder/actions';
import { useToast } from '@/hooks/use-toast';
import { FinderResults } from './finder-results';
import { Skeleton } from '../ui/skeleton';
import { Label } from '../ui/label';

const initialState = {
  data: null,
  error: null,
  errors: null,
};

function AnalyzeButton({ resultCount, isPending }: { resultCount: number; isPending: boolean; }) {
  const { t } = useI18n();
  return (
    <Button type="submit" disabled={isPending || resultCount === 0} className="w-full md:w-auto" size="lg">
      {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (
        <Bot className="mr-2 h-5 w-5" />
      )}
      {t('WinningProductFinder.analyzeButton', { count: resultCount })}
    </Button>
  );
}

export function FinderAnalysis({ ads, allPlatforms, allCountries }: { ads: Ad[], allPlatforms: string[], allCountries: string[] }) {
  const { t, locale } = useI18n();
  const { toast } = useToast();
  const [state, formAction, isPending] = useActionState(getWinningProductsAnalysis, initialState);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [platform, setPlatform] = useState('all');
  const [country, setCountry] = useState('all');
  const [scoreRange, setScoreRange] = useState([60, 100]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 365),
    to: new Date(),
  });

  const dateLocale = locale === 'fr' ? fr : enUS;

  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      const adDate = new Date(ad.date);
      const searchTermLower = searchTerm.toLowerCase();
      const searchMatch = !searchTermLower || 
                          ad.title.toLowerCase().includes(searchTermLower) || 
                          ad.description.toLowerCase().includes(searchTermLower);
      const platformMatch = platform === 'all' || ad.platform === platform;
      const countryMatch = country === 'all' || ad.country === country;
      const scoreMatch = ad.engagement.score >= scoreRange[0] && ad.engagement.score <= scoreRange[1];
      const dateMatch = !dateRange?.from || (adDate >= dateRange.from && adDate <= (dateRange.to || new Date()));
      return searchMatch && platformMatch && countryMatch && scoreMatch && dateMatch;
    });
  }, [ads, searchTerm, platform, country, scoreRange, dateRange]);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.error) {
      toast({
        variant: 'destructive',
        title: t('Toast.errorTitle'),
        description: state.error,
      });
    }
  }, [state, toast, t]);

  return (
    <div className="space-y-8">
      <Card className="bg-card/30 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>{t('WinningProductFinder.filters.title')}</CardTitle>
          <CardDescription>{t('WinningProductFinder.filters.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('WinningProductFinder.filters.keywordPlaceholder')}
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={platform} onValueChange={setPlatform}>
              <SelectTrigger>
                <SelectValue placeholder={t('WinningProductFinder.filters.platformPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('WinningProductFinder.filters.allPlatforms')}</SelectItem>
                {allPlatforms.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={country} onValueChange={setCountry}>
              <SelectTrigger>
                <SelectValue placeholder={t('WinningProductFinder.filters.countryPlaceholder')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('WinningProductFinder.filters.allCountries')}</SelectItem>
                {allCountries.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateRange?.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, 'LLL dd, y', { locale: dateLocale })} - {format(dateRange.to, 'LLL dd, y', { locale: dateLocale })}
                      </>
                    ) : (
                      format(dateRange.from, 'LLL dd, y', { locale: dateLocale })
                    )
                  ) : (
                    <span>{t('AdGallery.pickDate')}</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange}
                  onSelect={setDateRange}
                  initialFocus
                  locale={dateLocale}
                  defaultMonth={dateRange?.from}
                />
              </PopoverContent>
            </Popover>
            <div className="space-y-2">
              <Label className="text-sm">{t('WinningProductFinder.filters.scoreRangeLabel')}: {scoreRange[0]} - {scoreRange[1]}</Label>
              <Slider
                value={scoreRange}
                onValueChange={setScoreRange}
                max={100}
                min={0}
                step={1}
                minStepsBetweenThumbs={5}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="space-y-6">
        <form ref={formRef} action={formAction} className="p-4 border-y border-dashed flex flex-col md:flex-row items-center justify-between gap-4 sticky top-16 z-10 bg-background/80 backdrop-blur-sm">
            <input type="hidden" name="locale" value={locale} />
            <input type="hidden" name="adIds" value={filteredAds.map(ad => ad.id).join(',')} />
            <div className="text-lg font-semibold">
                {t('WinningProductFinder.resultsCount', { count: filteredAds.length, total: ads.length })}
            </div>
            <AnalyzeButton resultCount={filteredAds.length} isPending={isPending} />
        </form>
        
        {state.data ? (
             <FinderResults results={state.data} />
        ) : isPending ? (
            <div className="space-y-8 animate-in fade-in duration-500">
                <Card className="bg-card/30 backdrop-blur-sm border-white/10">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bot className="h-5 w-5 text-primary animate-pulse" />
                            <span>{t('FinderAnalysis.loading.title')}</span>
                        </CardTitle>
                        <CardDescription>{t('FinderAnalysis.loading.description')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Skeleton className="h-4 w-full bg-secondary/50" />
                        <Skeleton className="h-4 w-5/6 bg-secondary/50" />
                        <div className="pt-4 space-y-3">
                            <Skeleton className="h-24 w-full bg-secondary/50" />
                            <Skeleton className="h-24 w-full bg-secondary/50" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        ): (
            filteredAds.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAds.map((ad) => (
                <AdCard key={ad.id} ad={ad} t={t} />
                ))}
            </div>
            ) : (
            <div className="text-center py-16 text-muted-foreground">
                <p className="text-lg font-semibold">{t('AdGallery.noAds.title')}</p>
                <p>{t('AdGallery.noAds.description')}</p>
            </div>
            )
        )}
      </div>
    </div>
  );
}
