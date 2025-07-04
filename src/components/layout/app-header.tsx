'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Logo } from '../logo';
import { LanguageSwitcher } from './language-switcher';
import { Home } from 'lucide-react';
import { Button } from '../ui/button';
import { useI18n } from '@/hooks/use-i18n';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

export function AppHeader() {
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/10 bg-background/50 backdrop-blur-sm px-4 sm:px-6">
      {/* Mobile-only Header content */}
      <div className="flex items-center gap-4 md:hidden">
        <SidebarTrigger />
        <Link href="/" className="flex items-center gap-2 font-semibold group">
            <Logo className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="">AlphaWolf</span>
        </Link>
      </div>

      {/* Centered title for desktop */}
      <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <h2 className="text-lg font-bold font-headline tracking-wider uppercase text-primary/80">{t('AppHeader.title')}</h2>
      </div>

      {/* Spacer for desktop to push other content to the right. The centered title is absolutely positioned, so this is needed. */}
      <div className="hidden flex-1 md:block"></div>
      
      {/* Right-aligned content for all screen sizes */}
      <div className="flex items-center gap-2">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/">
                            <Home className="h-5 w-5" />
                            <span className="sr-only">{t('AppHeader.homeTooltip')}</span>
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>{t('AppHeader.homeTooltip')}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
        <LanguageSwitcher />
      </div>
    </header>
  );
}
