import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { AppFooter } from '@/components/layout/footer';
import { AppHeader } from '@/components/layout/app-header';

export const metadata: Metadata = {
  title: 'AdInsights',
  description: 'Collectez, analysez et visualisez les publicités e-commerce pour identifier les produits gagnants.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <SidebarProvider>
          <div className="flex min-h-screen">
            <AppSidebar />
            <div className="flex-1 flex flex-col">
              <AppHeader />
              <SidebarInset>{children}</SidebarInset>
              <AppFooter />
            </div>
          </div>
        </SidebarProvider>
        <Toaster />
      </body>
    </html>
  );
}
