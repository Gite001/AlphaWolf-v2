'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { setCookie } from 'cookies-next';
import fr from '@/messages/fr.json';
import en from '@/messages/en.json';

const messages: { [key: string]: any } = { fr, en };

type Locale = 'fr' | 'en';

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
    const keys = key.split('.');
    let result = messages[locale];
    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if key not found in current locale
        let fallbackResult = messages['en'];
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
             if (fallbackResult === undefined) return key;
        }
        result = fallbackResult;
        break;
      }
    }
    
    let text = result || key;
    if (params) {
        Object.keys(params).forEach(pKey => {
            text = text.replace(`{${pKey}}`, String(params[pKey]));
        });
    }

    return text;
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
