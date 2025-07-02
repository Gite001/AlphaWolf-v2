import type { Metadata, Viewport } from 'next';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { AppFooter } from '@/components/layout/footer';
import { AppHeader } from '@/components/layout/app-header';
import { I18nProvider } from '@/hooks/use-i18n';
import { cookies } from 'next/headers';

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations();
  return {
    title: t('Metadata.title'),
    description: t('Metadata.description'),
  };
}

const getTranslations = async () => {
    // This is a simplified server-side fetcher for metadata
    const cookieStore = cookies();
    const locale = cookieStore.get('locale')?.value || 'fr';
    const messages = locale === 'en' ? await import('@/messages/en.json') : await import('@/messages/fr.json');
    
    return (key: string) => {
        const keys = key.split('.');
        let result = messages.default;
        for (const k of keys) {
            result = result?.[k];
            if (result === undefined) return key;
        }
        return result || key;
    };
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const locale = cookieStore.get('locale')?.value || 'fr';

  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=PT+Sans:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <I18nProvider initialLocale={locale as 'fr' | 'en'}>
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
        </I18nProvider>
      </body>
    </html>
  );
}
