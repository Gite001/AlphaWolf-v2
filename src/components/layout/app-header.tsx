'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Logo } from '../logo';
import { LanguageSwitcher } from './language-switcher';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between border-b bg-background px-4 sm:px-6">
      {/* Mobile-only Header content */}
      <div className="flex items-center gap-4 md:hidden">
        <SidebarTrigger />
        <Link href="/" className="flex items-center gap-2 font-semibold group">
            <Logo className="h-10 w-10 text-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="">AdInsights</span>
        </Link>
      </div>

      {/* Spacer for desktop to push switcher to the right */}
      <div className="hidden flex-1 md:block"></div>
      
      {/* Right-aligned content for all screen sizes */}
      <div className="flex items-center">
        <LanguageSwitcher />
      </div>
    </header>
  );
}
