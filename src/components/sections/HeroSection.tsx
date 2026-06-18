'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getHomepage } from '@/lib/actions/cms-actions';

interface HeroSlide {
  image: string;
  imageLg: string;
  headline: string;
  subheadline: string;
  ctaText?: string;
  ctaLink?: string;
}

interface HeroStat {
  value: string;
  label: string;
}

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [stats, setStats] = useState<HeroStat[]>([]);

  useEffect(() => {
    getHomepage().then((res) => {
      if (res.success) {
        const sect = ((res.data as Record<string, unknown>)?.sections as Array<Record<string, unknown>>) || [];
        const hero = sect.find((s) => s.type === 'hero');
        const rawSlides = (hero?.slides as Array<Record<string, string>>) || [];
        if (rawSlides.length > 0) {
          setSlides(rawSlides.map((s) => ({
            image: s.image || 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&q=60',
            imageLg: s.imageLg || s.image || 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1920&q=60',
            headline: s.headline || 'Transforming Spaces Into Timeless Experiences',
            subheadline: s.subheadline || 'Luxury Interior Design Solutions For Modern Living',
            ctaText: s.ctaText,
            ctaLink: s.ctaLink,
          })));
        }
        const rawStats = (hero?.stats as Array<{ value: number; suffix: string; label: string }>) || [];
        if (rawStats.length > 0) {
          setStats(rawStats.map((s) => ({ value: `${s.value}${s.suffix || ''}`, label: s.label || '' })));
        }
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) {
    return (
      <section className="relative h-screen min-h-[700px] overflow-hidden bg-[#111827]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        <div className="relative h-full flex items-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="w-24 h-6 bg-white/10 rounded mb-6 animate-pulse" />
            <div className="w-full h-20 bg-white/10 rounded mb-4 animate-pulse" />
            <div className="w-3/4 h-20 bg-white/10 rounded mb-8 animate-pulse" />
            <div className="w-1/2 h-6 bg-white/10 rounded mb-10 animate-pulse" />
            <div className="flex gap-4">
              <div className="w-40 h-12 bg-white/10 rounded-full animate-pulse" />
              <div className="w-52 h-12 bg-white/10 rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{ backgroundImage: `url(${slides[current].image})` }}
          />
          <div className="hidden sm:block absolute inset-0 bg-cover bg-center will-change-transform"
            style={{ backgroundImage: `url(${slides[current].imageLg})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="inline-block text-[#C8A97E] text-sm tracking-[0.3em] uppercase font-medium mb-6">
              AkInteriors
            </span>
          </motion.div>

          <motion.h1
            key={`h1-${current}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-6"
          >
            {slides[current].headline}
          </motion.h1>

          <motion.p
            key={`p-${current}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-base sm:text-lg text-white/70 max-w-2xl mb-8 leading-relaxed"
          >
            {slides[current].subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap gap-4"
          >
            <Link href={slides[current].ctaLink || '/projects'}>
              <Button variant="gold" size="lg" className="rounded-full text-base">
                {slides[current].ctaText || 'View Projects'}
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="rounded-full text-base border-white/30 text-white hover:bg-white hover:text-[#111827]">
                <Play className="mr-2 w-5 h-5" />
                Get Free Consultation
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>

      {stats.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-8 sm:gap-12">
              {stats.map((stat) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.4 }}
                >
                  <div className="text-2xl sm:text-3xl font-bold text-[#C8A97E]">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-white/60 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ delay: 1, duration: 2, repeat: Infinity }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/50 hover:text-white transition-colors"
        onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
      >
        <ChevronDown className="w-6 h-6" />
      </motion.button>

      <div className="absolute right-6 top-1/2 -translate-y-1/2 flex flex-col gap-3">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-500 ${
              i === current ? 'bg-[#C8A97E] h-6' : 'bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}


