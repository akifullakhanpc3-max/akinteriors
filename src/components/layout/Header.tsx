'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { Menu, X, Moon, Sun, Diamond } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/ui/theme-provider';
import { cn } from '@/lib/utils/cn';
import { getNavigation, getBranding } from '@/lib/actions/cms-actions';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [navLinks, setNavLinks] = useState<{ label: string; href: string }[]>([]);
  const [ctaText, setCtaText] = useState('Get Free Quote');
  const [ctaLink, setCtaLink] = useState('/contact');
  const [siteName, setSiteName] = useState('AkInteriors');
  const [logo, setLogo] = useState('');
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    Promise.all([getNavigation(), getBranding()]).then(([navRes, brandRes]) => {
      if (navRes.success) {
        const nd = navRes.data as Record<string, unknown>;
        if (nd?.links) setNavLinks(nd.links as { label: string; href: string }[]);
        if (nd?.ctaText) setCtaText(nd.ctaText as string);
        if (nd?.ctaLink) setCtaLink(nd.ctaLink as string);
      }
      if (brandRes.success) {
        const bd = brandRes.data as Record<string, string>;
        if (bd?.logo) setLogo(bd.logo);
        if (bd?.siteName) setSiteName(bd.siteName);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // mobile menu closes via Link click handlers instead

  const isHome = pathname === '/';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100/50'
          : isHome
          ? 'bg-transparent'
          : 'bg-white/80 backdrop-blur-xl shadow-sm'
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-2 group">
            {logo ? (
              <Image src={logo} alt={siteName} width={120} height={32} className="h-8 w-auto" />
            ) : (
              <Diamond className="w-6 h-6 text-[#C8A97E] group-hover:rotate-180 transition-transform duration-500" />
            )}
            <span className={cn(
              'text-2xl font-bold tracking-tight transition-colors',
              isScrolled || !isHome ? 'text-[#111827]' : 'text-white'
            )}>
              {siteName.split(/(?=[A-Z])/).length > 1 ? (
                <>
                  {siteName.split(/(?=[A-Z])/)[0]}
                  <span className="text-[#C8A97E]">{siteName.split(/(?=[A-Z])/).slice(1).join('')}</span>
                </>
              ) : (
                siteName
              )}
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-8">
            {(navLinks.length > 0 ? navLinks : [
              { label: 'Home', href: '/' },
              { label: 'Projects', href: '/projects' },
              { label: 'Services', href: '/services' },
              { label: 'About', href: '/about' },
              { label: 'Contact', href: '/contact' },
            ]).map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-sm font-medium tracking-wide transition-colors duration-300 hover:text-[#C8A97E]',
                  pathname === link.href
                    ? 'text-[#C8A97E]'
                    : isScrolled || !isHome
                    ? 'text-gray-700'
                    : 'text-white/90'
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <motion.span
                    layoutId="underline"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#C8A97E]"
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={cn(
                'p-2 rounded-full transition-colors',
                isScrolled || !isHome ? 'text-gray-700 hover:bg-gray-100' : 'text-white/90 hover:bg-white/10'
              )}
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <Link href={ctaLink} className="hidden lg:block">
              <Button variant="gold" size="sm" className="rounded-full">
                {ctaText}
              </Button>
            </Link>

            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className={cn(
                'lg:hidden p-2 rounded-full transition-colors',
                isScrolled || !isHome ? 'text-gray-700' : 'text-white'
              )}
            >
              {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white/95 backdrop-blur-xl border-t border-gray-100"
          >
            <div className="px-4 py-6 space-y-4">
              {(navLinks.length > 0 ? navLinks : [
                { label: 'Home', href: '/' },
                { label: 'Projects', href: '/projects' },
                { label: 'Services', href: '/services' },
                { label: 'About', href: '/about' },
                { label: 'Contact', href: '/contact' },
              ]).map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block py-3 text-base font-medium transition-colors',
                    pathname === link.href
                      ? 'text-[#C8A97E]'
                      : 'text-gray-700 hover:text-[#C8A97E]'
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <Link href={ctaLink} className="block">
                <Button variant="gold" className="w-full rounded-full">
                  {ctaText}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
