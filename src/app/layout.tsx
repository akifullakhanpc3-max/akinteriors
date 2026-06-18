import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ui/theme-provider';
import SessionProvider from '@/components/SessionProvider';
import { Toaster } from '@/components/ui/toaster';
import { getSEOSettings } from '@/lib/actions/cms-actions';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://akinteriors.com';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await getSEOSettings();
    const seo = res.success ? (res.data as Record<string, unknown>) : {};
    return {
      metadataBase: new URL(siteUrl),
      title: (seo.metaTitle as string) || 'AkInteriors | Luxury Interior Design Agency',
      description: (seo.metaDescription as string) || 'Transforming spaces into timeless experiences. Premium interior design solutions for residential and commercial spaces.',
      keywords: ((seo.keywords as string[]) || []).join(', ') || 'interior design, luxury interiors, home interiors, commercial interiors, modular kitchen, Bangalore interior designers',
      openGraph: {
        title: (seo.metaTitle as string) || 'AkInteriors | Luxury Interior Design Agency',
        description: (seo.metaDescription as string) || 'Transforming spaces into timeless experiences. Premium interior design solutions.',
        images: [(seo.ogImage as string) || '/og-image.jpg'],
      },
      twitter: {
        card: 'summary_large_image',
        title: (seo.metaTitle as string) || 'AkInteriors | Luxury Interior Design Agency',
        description: (seo.metaDescription as string) || 'Transforming spaces into timeless experiences.',
      },
      robots: 'index, follow',
    };
  } catch {
    return {
      metadataBase: new URL(siteUrl),
      title: 'AkInteriors | Luxury Interior Design Agency',
      description: 'Transforming spaces into timeless experiences. Premium interior design solutions.',
    };
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </head>
      <body className="antialiased">
        <SessionProvider>
          <ThemeProvider>
            <Toaster />
            {children}
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
