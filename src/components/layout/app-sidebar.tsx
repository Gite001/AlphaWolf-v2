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
import { LayoutDashboard, Sparkles, FileText, Bot, LineChart, Home, Binoculars, Trophy } from 'lucide-react';

export function AppSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: '/', label: 'Accueil', icon: Home },
    { href: '/dashboard', label: 'Tableau de bord', icon: LayoutDashboard },
    { href: '/finder', label: 'Découverte Produits', icon: Trophy },
    { href: '/trends', label: 'Tendances Marché', icon: LineChart },
    { href: '/spy', label: 'Espion Concurrent', icon: Binoculars },
    { href: '/generate', label: 'Générer Publicité', icon: FileText },
    { href: '/analyze', label: 'Analyser Publicité', icon: Sparkles },
  ];

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <Link href="/" aria-label="Home">
          <Button variant="ghost" size="icon" className="h-10 w-10 shrink-0 rounded-full">
              <Bot className="size-5" />
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
