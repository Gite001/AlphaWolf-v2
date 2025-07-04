'use client';

import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, Sparkles, FileText, LineChart, Binoculars, Trophy, BookOpen, Clapperboard, Store, Compass, BookMarked, Swords } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { Logo } from '../logo';

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const menuItems = [
    { href: '/dashboard', label: t('AppSidebar.dashboard'), icon: LayoutDashboard },
    { href: '/plan', label: t('AppSidebar.marketingPlan'), icon: Compass },
    { href: '/trends', label: t('AppSidebar.marketTrends'), icon: LineChart },
    { href: '/pulse', label: t('AppSidebar.marketplacePulse'), icon: Store },
    { href: '/finder', label: t('AppSidebar.productFinder'), icon: Trophy },
    { href: '/spy', label: t('AppSidebar.competitorSpy'), icon: Binoculars },
    { href: '/takedown', label: t('AppSidebar.campaignTakedown'), icon: Swords },
    { href: '/generate', label: t('AppSidebar.generateAd'), icon: FileText },
    { href: '/video', label: t('AppSidebar.generateVideo'), icon: Clapperboard },
    { href: '/analyze', label: t('AppSidebar.analyzeAd'), icon: Sparkles },
    { href: '/lexicon', label: t('AppSidebar.lexicon'), icon: BookMarked },
    { href: '/guide', label: t('AppSidebar.guide'), icon: BookOpen },
  ];

  return (
    <Sidebar>
      <SidebarHeader className="h-16 flex items-center justify-center">
        <Link href="/" aria-label="Home" className="group">
          <Button variant="ghost" size="icon" className="h-12 w-12 shrink-0 rounded-full">
              <Logo className="size-10 transition-transform duration-300 group-hover:scale-110" />
          </Button>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                  }}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarTrigger />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
