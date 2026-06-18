import dynamic from 'next/dynamic';
import { Header } from '@/components/layout';

const Footer = dynamic(() => import('@/components/layout/Footer'));
const WhatsAppButton = dynamic(() => import('@/components/shared/WhatsAppButton'));
const BackToTop = dynamic(() => import('@/components/shared/BackToTop'));

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppButton />
      <BackToTop />
    </>
  );
}
