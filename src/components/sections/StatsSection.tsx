'use client';

import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getAboutPage } from '@/lib/actions/cms-actions';

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          const duration = 2000;
          const steps = 60;
          const increment = value / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= value) {
              setCount(value);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="text-5xl sm:text-6xl font-bold text-white">
      {count}{suffix}
    </div>
  );
}

export default function StatsSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [stats, setStats] = useState<StatItem[]>([]);

  useEffect(() => {
    getAboutPage().then((res) => {
      if (res.success) {
        const d = res.data as Record<string, unknown>;
        const raw = (d?.stats as Array<Record<string, unknown>>) || [];
        if (raw.length > 0) {
          const mapped: StatItem[] = raw.map((s) => {
            const v = (s.value as string) || '0';
            const match = v.match(/^(\d+)(.*)$/);
            return { value: parseInt(match?.[1] || '0', 10), suffix: match?.[2] || '+', label: (s.label as string) || '' };
          });
          setStats(mapped);
        }
      }
    }).catch(() => {});
  }, []);

  return (
    <section ref={ref} className="relative py-24 lg:py-32 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1400&q=50)' }}
      />
      <div className="absolute inset-0 bg-[#111827]/90" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#C8A97E] text-sm tracking-[0.3em] uppercase font-medium">
            Our Impact
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4">
            Numbers That{' '}
            <span className="text-[#C8A97E]">Speak</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-16">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="text-center"
            >
              <AnimatedCounter value={stat.value} suffix={stat.suffix} />
              <div className="text-white/60 text-sm mt-2 tracking-wide uppercase">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


