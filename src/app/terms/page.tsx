'use client';

import { useState, useEffect } from 'react';
import { useI18n } from '@/hooks/use-i18n';

export default function TermsPage() {
    const { t, locale } = useI18n();
    const [date, setDate] = useState('');

    useEffect(() => {
        setDate(new Date().toLocaleDateString(locale));
    }, [locale]);

    return (
        <div className="container mx-auto py-12 px-4 md:px-6">
            <h1 className="text-4xl font-bold font-headline mb-4">{t('TermsPage.title')}</h1>
            <div className="prose prose-invert max-w-none text-muted-foreground space-y-4">
                <p>{t('TermsPage.lastUpdated')} {date}</p>
                
                <p>{t('TermsPage.intro')}</p>

                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">{t('TermsPage.interpretation.title')}</h2>
                <h3 className="text-xl font-bold font-headline mt-4 mb-2 text-foreground">{t('TermsPage.interpretation.subtitle')}</h3>
                <p>{t('TermsPage.interpretation.content')}</p>
                
                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">{t('TermsPage.acknowledgement.title')}</h2>
                <p>{t('TermsPage.acknowledgement.content1')}</p>
                <p>{t('TermsPage.acknowledgement.content2')}</p>
                
                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">{t('TermsPage.links.title')}</h2>
                <p>{t('TermsPage.links.content1')}</p>
                <p>{t('TermsPage.links.content2')}</p>
                
                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">{t('TermsPage.disclaimer.title')}</h2>
                <p>{t('TermsPage.disclaimer.content')}</p>

                <h2 className="text-2xl font-bold font-headline mt-6 mb-2 text-foreground">{t('TermsPage.contact.title')}</h2>
                <p>{t('TermsPage.contact.content')}</p>
            </div>
        </div>
    );
}
