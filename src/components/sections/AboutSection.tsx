'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Award, Target, Eye, Users, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { getAboutPage, getHomepage } from '@/lib/actions/cms-actions';

const defaultIconMap: Record<string, React.ElementType> = {
  Award, Target, Eye, Users,
};

export default function AboutSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [heading, setHeading] = useState('');
  const [paragraphs, setParagraphs] = useState<string[]>([]);
  const [image, setImage] = useState('');
  const [highlights, setHighlights] = useState<{ icon: string; label: string; description: string }[]>([]);
  const [yearsExp, setYearsExp] = useState('');
  const [projectsDelivered, setProjectsDelivered] = useState('');

  useEffect(() => {
    Promise.all([getAboutPage(), getHomepage()]).then(([apRes, hpRes]) => {
      let hpHeading = '';
      let hpContent = '';
      let hpImage = '';

      if (hpRes.success) {
        const hpSections = ((hpRes.data as Record<string, unknown>)?.sections as Array<Record<string, unknown>>) || [];
        const aboutSection = hpSections.find((s) => s.type === 'about');
        if (aboutSection?.heading) hpHeading = aboutSection.heading as string;
        if (aboutSection?.content) hpContent = aboutSection.content as string;
        if (aboutSection?.image) hpImage = aboutSection.image as string;
      }

      if (apRes.success) {
        const d = apRes.data as Record<string, unknown>;
        setHeading(hpHeading || (d?.heading as string) || '');
        setParagraphs((hpContent || (d?.content as string) || '').split('\n').filter(Boolean));
        setImage(hpImage || (d?.image as string) || '');
        if (d?.highlights) setHighlights(d.highlights as { icon: string; label: string; description: string }[]);
        const st = d?.stats as Array<{ icon: string; value: string; label: string }> | undefined;
        if (st?.length) {
          const exp = st.find((s) => s.label.toLowerCase().includes('year') || s.label.toLowerCase().includes('experience'));
          if (exp) setYearsExp(exp.value.replace(/\D/g, ''));
          const proj = st.find((s) => s.label.toLowerCase().includes('project') || s.label.toLowerCase().includes('delivered'));
          if (proj) setProjectsDelivered(proj.value.replace(/\D/g, ''));
        }
      }
    }).catch(() => {});
  }, []);

  return (
    <section ref={ref} id="about" className="py-24 lg:py-32 bg-[#F9F7F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="text-[#C8A97E] text-sm tracking-[0.3em] uppercase font-medium">
              About Us
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#111827] mt-4 mb-6 leading-tight">
              {heading.split(' ').slice(0, -1).join(' ') || heading}{' '}
              {heading.includes(' ') && <span className="text-[#C8A97E]">{heading.split(' ').pop()}</span>}
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>

            {highlights.length > 0 && (
              <div className="grid grid-cols-2 gap-6 mt-10">
                {highlights.map((item) => {
                  const Icon = defaultIconMap[item.icon] || Award;
                  return (
                    <div key={item.label} className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#C8A97E]/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-[#C8A97E]" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-[#111827] text-sm">{item.label}</h4>
                        <p className="text-gray-500 text-xs mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="mt-10">
              <Link href="/about">
                <Button variant="gold" className="rounded-full">
                  Learn More About Us
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="relative h-[600px] rounded-2xl overflow-hidden">
              {image ? (
                <Image
                  src={image}
                  alt="Luxury Interior Design"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-[#C8A97E]/20 to-[#C8A97E]/5 flex items-center justify-center">
                  <span className="text-[#C8A97E]/40 text-lg">No image</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl">
              <div className="text-4xl font-bold text-[#C8A97E]">{yearsExp}+</div>
              <div className="text-sm text-gray-600">Years of Excellence</div>
            </div>
            <div className="absolute -top-6 -right-6 bg-[#C8A97E] rounded-2xl p-6 shadow-xl">
              <div className="text-4xl font-bold text-white">{projectsDelivered}+</div>
              <div className="text-sm text-white/80">Projects Delivered</div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}


