'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useI18n } from '@/hooks/use-i18n';
import { Logo } from '../logo';

export function AppFooter() {
  const { t } = useI18n();
  const [year, setYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="bg-background border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-6 py-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 group">
            <Logo className="h-6 w-6 text-primary transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
            <span className="font-bold text-lg text-foreground">AdInsights</span>
          </div>
          <div className="text-center md:text-left text-sm text-muted-foreground">
            <p>&copy; {year} AdInsights. {t('Footer.rightsReserved')}</p>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t('Footer.terms')}
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              {t('Footer.privacy')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
