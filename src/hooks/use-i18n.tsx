'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { setCookie } from 'cookies-next';
import { translate, type Locale } from '@/lib/i18n';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: { [key: string]: string | number }) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider = ({ children, initialLocale }: { children: ReactNode; initialLocale: Locale }) => {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    setCookie('locale', newLocale, { maxAge: 60 * 60 * 24 * 365, path: '/' });
    // We need to reload to apply the new locale to Server Components
    window.location.reload();
  };

  const t = (key: string, params?: { [key: string]: string | number }) => {
    return translate(locale, key, params);
  };
  
  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
