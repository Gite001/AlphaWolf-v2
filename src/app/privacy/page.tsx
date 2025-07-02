'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/hooks/use-i18n';

export default function PrivacyPage() {
    const [date, setDate] = useState('');
    const { t, locale } = useI18n();

    useEffect(() => {
        setDate(new Date().toLocaleDateString(locale));
    }, [locale]);

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <h1 className="text-4xl font-bold font-headline mb-4">{t('PrivacyPage.title')}</h1>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
                <p>{t('PrivacyPage.lastUpdated')} {date}</p>
                
                <p>{t('PrivacyPage.intro')}</p>

                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">{t('PrivacyPage.collection.title')}</h2>
                <h3 className="text-xl font-bold font-headline mt-4 mb-2 text-foreground">{t('PrivacyPage.collection.types.title')}</h3>
                <p>{t('PrivacyPage.collection.types.content')}</p>
                
                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">{t('PrivacyPage.usage.title')}</h2>
                <p>{t('PrivacyPage.usage.content')}</p>

                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">{t('PrivacyPage.security.title')}</h2>
                <p>{t('PrivacyPage.security.content')}</p>
                
                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">{t('PrivacyPage.contact.title')}</h2>
                <p>{t('PrivacyPage.contact.content')}</p>
            </div>
        </div>
    );
}
