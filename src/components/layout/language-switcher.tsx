'use client';

import { useI18n } from '@/hooks/use-i18n';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
    const { setLocale, t } = useI18n();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Languages className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">{t('LanguageSwitcher.toggle')}</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLocale('en')}>
                    English
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLocale('fr')}>
                    Français
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
