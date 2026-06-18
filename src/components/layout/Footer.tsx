'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Diamond, Mail, Phone, MapPin, ArrowRight, Globe, Camera, Briefcase, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { getFooter, getSocialLinks, getContactPage } from '@/lib/actions/cms-actions';

const iconMap: Record<string, React.ElementType> = {
  Globe, Camera, Briefcase, Play,
};

export default function Footer() {
  const [description, setDescription] = useState('Transforming spaces into timeless experiences. We create luxury interiors that reflect your personality and elevate your lifestyle.');
  const [quickLinks, setQuickLinks] = useState<{ label: string; href: string }[]>([]);
  const [serviceLinks, setServiceLinks] = useState<{ label: string; href: string }[]>([]);
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string; icon: string }[]>([]);
  const [newsletterTitle, setNewsletterTitle] = useState('Subscribe to our newsletter');
  const [copyright, setCopyright] = useState('');
  const [siteName, setSiteName] = useState('AkInteriors');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactAddress, setContactAddress] = useState('');

  useEffect(() => {
    Promise.all([getFooter(), getSocialLinks(), getContactPage()]).then(([fRes, sRes, cRes]) => {
      if (fRes.success) {
        const fd = fRes.data as Record<string, unknown>;
        if (fd?.description) setDescription(fd.description as string);
        if (fd?.quickLinks) setQuickLinks(fd.quickLinks as { label: string; href: string }[]);
        if (fd?.serviceLinks) setServiceLinks(fd.serviceLinks as { label: string; href: string }[]);
        if (fd?.newsletterTitle) setNewsletterTitle(fd.newsletterTitle as string);
        if (fd?.copyright) setCopyright(fd.copyright as string);
      }
      if (sRes.success) {
        const sd = sRes.data as Record<string, unknown>;
        if (sd?.links) setSocialLinks(sd.links as { platform: string; url: string; icon: string }[]);
      }
      if (cRes.success) {
        const cd = cRes.data as Record<string, unknown>;
        const branch = (cd?.branches as Array<Record<string, unknown>>)?.[0];
        if (branch?.email) setContactEmail(branch.email as string);
        if (branch?.phone) setContactPhone(branch.phone as string);
        if (branch?.address) {
          const parts = [branch.address as string, branch.city as string, branch.state as string].filter(Boolean);
          setContactAddress(parts.join(', '));
        }
      }
    }).catch(() => {});
  }, []);

  const defaultQuickLinks = [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Projects', href: '/projects' },
    { label: 'Contact', href: '/contact' },
    { label: 'FAQ', href: '/#faq' },
  ];

  const defaultServiceLinks = [
    { label: 'Residential Interiors', href: '/services' },
    { label: 'Commercial Interiors', href: '/services' },
    { label: 'Modular Kitchens', href: '/services' },
  ];

  const defaultSocialLinks = [
    { platform: 'Facebook', url: '#', icon: 'Globe' },
    { platform: 'Instagram', url: '#', icon: 'Camera' },
    { platform: 'LinkedIn', url: '#', icon: 'Briefcase' },
    { platform: 'YouTube', url: '#', icon: 'Play' },
  ];

  const qLinks = quickLinks.length > 0 ? quickLinks : defaultQuickLinks;
  const sLinks = serviceLinks.length > 0 ? serviceLinks : defaultServiceLinks;
  const socLinks = socialLinks.length > 0 ? socialLinks : defaultSocialLinks;

  return (
    <footer className="bg-[#111827] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16">
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
              <Diamond className="w-6 h-6 text-[#C8A97E] group-hover:rotate-180 transition-transform duration-500" />
              <span className="text-2xl font-bold">
                {siteName.split(' ')[0] || 'Ak'}
                <span className="text-[#C8A97E]">
                  {siteName.includes(' ') ? siteName.split(' ').slice(1).join(' ') : 'Interiors'}
                </span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
            <div className="flex gap-3">
              {socLinks.map((social) => {
                const Icon = iconMap[social.icon] || Globe;
                return (
                  <a
                    key={social.platform}
                    href={social.url}
                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#C8A97E] transition-all duration-300 group"
                    aria-label={social.platform}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#C8A97E] mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {qLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#C8A97E] transition-colors text-sm flex items-center gap-2 group"
                  >
                    <ArrowRight className="w-3 h-0 group-hover:h-3 transition-all duration-300" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#C8A97E] mb-6">Services</h3>
            <ul className="space-y-3">
              {sLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#C8A97E] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="text-sm font-semibold tracking-wider uppercase text-[#C8A97E] mb-6">Contact Us</h3>
            <div className="space-y-4">
              {contactAddress && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#C8A97E] shrink-0 mt-0.5" />
                  <span className="text-gray-400 text-sm">{contactAddress}</span>
                </div>
              )}
              {contactEmail && (
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-[#C8A97E] shrink-0" />
                  <a href={`mailto:${contactEmail}`} className="text-gray-400 hover:text-[#C8A97E] transition-colors text-sm">{contactEmail}</a>
                </div>
              )}
              {contactPhone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-[#C8A97E] shrink-0" />
                  <a href={`tel:${contactPhone}`} className="text-gray-400 hover:text-[#C8A97E] transition-colors text-sm">{contactPhone}</a>
                </div>
              )}
            </div>

            <div className="pt-4">
              <h4 className="text-sm font-medium text-white mb-3">{newsletterTitle}</h4>
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 h-10 text-sm"
                />
                <Button variant="gold" size="sm" className="shrink-0">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-white/10" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} {copyright || `${siteName}. All rights reserved.`}
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-gray-500 hover:text-[#C8A97E] transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-gray-500 hover:text-[#C8A97E] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
