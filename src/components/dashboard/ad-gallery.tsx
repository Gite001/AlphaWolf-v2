'use client';

import { useState, useMemo } from 'react';
import type { Ad } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { AdCard } from './ad-card';
import { Search, Calendar as CalendarIcon } from 'lucide-react';
import type { DateRange } from 'react-day-picker';
import { format } from 'date-fns';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '../ui/card';

type AdGalleryProps = {
  ads: Ad[];
};

export function AdGallery({ ads }: AdGalleryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [platform, setPlatform] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const filteredAds = useMemo(() => {
    return ads.filter((ad) => {
      const searchMatch = ad.title.toLowerCase().includes(searchTerm.toLowerCase());
      const platformMatch = platform === 'all' || ad.platform === platform;
      const dateMatch = !dateRange || (
        new Date(ad.date) >= (dateRange.from || new Date(0)) &&
        new Date(ad.date) <= (dateRange.to || new Date())
      );
      return searchMatch && platformMatch && dateMatch;
    });
  }, [ads, searchTerm, platform, dateRange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Bibliothèque de Publicités</CardTitle>
        <CardDescription>Parcourez des publicités à succès pour vous inspirer et analyser la concurrence.</CardDescription>
        <div className="flex flex-col md:flex-row gap-2 pt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par mot-clé..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select value={platform} onValueChange={setPlatform}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Plateforme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Toutes les plateformes</SelectItem>
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
                      {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Choisir une date</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </CardHeader>
      <CardContent>
        {filteredAds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {filteredAds.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted-foreground">
            <p className="text-lg font-semibold">Aucune publicité trouvée</p>
            <p>Essayez d'ajuster vos filtres de recherche.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
