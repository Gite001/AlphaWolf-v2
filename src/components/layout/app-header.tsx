

'use client';

import { SidebarTrigger } from '@/components/ui/sidebar';
import Link from 'next/link';
import { Logo } from '../logo';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background px-4 md:hidden">
        <SidebarTrigger />
        <Link href="/" className="flex items-center gap-2 font-semibold group">
            <Logo className="h-6 w-6 text-primary transition-transform duration-300 group-hover:scale-110" />
            <span className="">AdInsights</span>
        </Link>
    </header>
  );
}
