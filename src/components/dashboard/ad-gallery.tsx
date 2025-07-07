'use client';

import { useState, useMemo } from 'react';
import type { Ad } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AdCard } from './ad-card';
import { Search, Calendar as CalendarIcon, LayoutGrid, List } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { fr, enUS } from 'date-fns/locale';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';
import { useI18n } from '@/hooks/use-i18n';
import { AdTable } from './ad-table';

type AdGalleryProps = {
  ads: Ad[];
};

export function AdGallery({ ads }: AdGalleryProps) {
  const { t, locale } = useI18n();
  const [searchTerm, setSearchTerm] = useState('');
  const [platform, setPlatform] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');

  const dateLocale = locale === 'fr' ? fr : enUS;

  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      const searchMatch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) || ad.description.toLowerCase().includes(searchTerm.toLowerCase());
      const platformMatch = platform === 'all' || ad.platform === platform;
      const dateMatch = !dateRange || (
        new Date(ad.date) >= (dateRange.from || new Date(0)) &&
        new Date(ad.date) <= (dateRange.to || new Date())
      );
      return searchMatch && platformMatch && dateMatch;
    });
  }, [ads, searchTerm, platform, dateRange]);

  return (
    <Card className="bg-card/30 backdrop-blur-sm border-white/10 shadow-lg">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="font-headline">{t('AdGallery.title')}</CardTitle>
                <CardDescription>{t('AdGallery.description')}</CardDescription>
            </div>
            <div className="flex items-center gap-1 bg-muted p-1 rounded-md">
                <Button variant={viewMode === 'card' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('card')}>
                    <LayoutGrid className="h-4 w-4" />
                    <span className="sr-only">{t('AdGallery.cardView')}</span>
                </Button>
                <Button variant={viewMode === 'table' ? 'secondary' : 'ghost'} size="icon" onClick={() => setViewMode('table')}>
                    <List className="h-4 w-4" />
                    <span className="sr-only">{t('AdGallery.tableView')}</span>
                </Button>
            </div>
        </div>
        <div className="flex flex-col md:flex-row gap-2 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t('AdGallery.searchPlaceholder')}
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={t('AdGallery.platform')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('AdGallery.allPlatforms')}</SelectItem>
              <SelectItem value="Facebook">Facebook</SelectItem>
              <SelectItem value="Instagram">Instagram</SelectItem>
              <SelectItem value="TikTok">TikTok</SelectItem>
              <SelectItem value="Pinterest">Pinterest</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto justify-start text-left font-normal">
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
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        {filteredAds.length > 0 ? (
          viewMode === 'card' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {filteredAds.map((ad) => (
                  <AdCard key={ad.id} ad={ad} t={t} />
                ))}
              </div>
          ) : (
              <AdTable ads={filteredAds} t={t} />
          )
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-semibold">{t('AdGallery.noAds.title')}</p>
            <p>{t('AdGallery.noAds.description')}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
