import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import fr from '@/messages/fr.json';
import en from '@/messages/en.json';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const messages: { [key: string]: any } = { fr, en };

export const getTranslations = (locale?: string | null) => {
    const finalLocale = locale === 'en' || locale === 'fr' ? locale : 'fr';
    const dict = messages[finalLocale];

    return (key: string, params?: { [key: string]: string | number }) => {
        const keys = key.split('.');
        let result = dict;
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
        if (params && typeof text === 'string') {
            Object.keys(params).forEach(pKey => {
                text = text.replace(`{${pKey}}`, String(params[pKey]));
            });
        }

        return text;
    }
}
