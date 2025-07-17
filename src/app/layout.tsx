import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { Toaster } from '@/components/ui/toaster';
import { AppFooter } from '@/components/layout/footer';
import { AppHeader } from '@/components/layout/app-header';
import { I18nProvider } from '@/hooks/use-i18n';
import { cookies } from 'next/headers';
import { getTranslations, cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = cookies().get('locale')?.value;
  const t = getTranslations(locale);
  return {
    title: t('Metadata.title'),
    description: t('Metadata.description'),
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const locale = cookieStore.get('locale')?.value || 'fr';

  return (
    <html lang={locale} className={cn('dark', inter.variable)}>
      <body className={cn("font-body antialiased bg-transparent")}>
        <div className="fixed inset-0 -z-10 h-full w-full bg-slate-950">
          <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,165,0,0.15),rgba(255,255,255,0))]"></div>
          <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(128,0,128,0.15),rgba(255,255,255,0))]"></div>
        </div>

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