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
import { LayoutDashboard, Sparkles, FileText, LineChart, Home, Binoculars, Trophy } from 'lucide-react';
import { useI18n } from '@/hooks/use-i18n';
import { Logo } from '../logo';

export function AppSidebar() {
  const pathname = usePathname();
  const { t } = useI18n();

  const menuItems = [
    { href: '/', label: t('AppSidebar.home'), icon: Home },
    { href: '/dashboard', label: t('AppSidebar.dashboard'), icon: LayoutDashboard },
    { href: '/finder', label: t('AppSidebar.productFinder'), icon: Trophy },
    { href: '/trends', label: t('AppSidebar.marketTrends'), icon: LineChart },
    { href: '/spy', label: t('AppSidebar.competitorSpy'), icon: Binoculars },
    { href: '/generate', label: t('AppSidebar.generateAd'), icon: FileText },
    { href: '/analyze', label: t('AppSidebar.analyzeAd'), icon: Sparkles },
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
