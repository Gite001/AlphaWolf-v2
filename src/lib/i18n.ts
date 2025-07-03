import fr from '@/messages/fr.json';
import en from '@/messages/en.json';

const messages = { fr, en };

export type Locale = keyof typeof messages;

export function translate(locale: Locale, key: string, params?: { [key: string]: string | number }): string {
    const keys = key.split('.');
    
    // 1. Try to get translation from current locale
    let text: any = keys.reduce((obj, k) => obj?.[k], messages[locale]);

    // 2. If not found, try to get from English (if not already English)
    if (text === undefined && locale !== 'en') {
        text = keys.reduce((obj, k) => obj?.[k], messages['en']);
    }

    // 3. If still not found, use the key itself as a last resort
    if (text === undefined) {
        text = key;
    }

    // Ensure we are working with a string before doing replacements
    let textString = String(text);

    if (params && typeof textString === 'string') {
        Object.keys(params).forEach(pKey => {
            textString = textString.replace(`{${pKey}}`, String(params[pKey]));
        });
    }

    return textString;
}
