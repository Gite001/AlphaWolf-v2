import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { translate, type Locale } from '@/lib/i18n';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const getTranslations = (locale?: string | null) => {
    const finalLocale = (locale === 'en' || locale === 'fr' ? locale : 'fr') as Locale;

    return (key: string, params?: { [key: string]: string | number }) => {
        return translate(finalLocale, key, params);
    }
}
