'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Award, Target, Eye, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getAboutPage } from '@/lib/actions/cms-actions';

const iconMap: Record<string, React.ElementType> = {
  Award, Target, Eye, Users,
};

export default function AboutPage() {
  const [heading, setHeading] = useState('About AkInteriors');
  const [subtitle, setSubtitle] = useState('Crafting exceptional spaces that inspire, delight, and endure.');
  const [image, setImage] = useState('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=60');
  const [paragraphs, setParagraphs] = useState<string[]>(defaultParagraphs);
  const [values, setValues] = useState<{ icon: string; title: string; description: string }[]>(defaultValues);
  const [timelineEvents, setTimelineEvents] = useState<{ year: string; event: string }[]>([]);
  const [valuesHeading, setValuesHeading] = useState('Our Values');
  const [valuesSubtitle, setValuesSubtitle] = useState('What We Stand For');
  const [timelineHeading, setTimelineHeading] = useState('Our Journey');
  const [timelineSubtitle, setTimelineSubtitle] = useState('Milestones & Achievements');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getAboutPage().then((res) => {
      if (res.success) {
        const d = res.data as Record<string, unknown>;
        if (d?.heading) setHeading(d.heading as string);
        if (d?.subtitle) setSubtitle(d.subtitle as string);
        if (d?.image) setImage(d.image as string);
        if (d?.content) setParagraphs((d.content as string).split('\n').filter(Boolean));
        if (d?.valuesHeading) setValuesHeading(d.valuesHeading as string);
        if (d?.valuesSubtitle) setValuesSubtitle(d.valuesSubtitle as string);
        if (d?.timelineHeading) setTimelineHeading(d.timelineHeading as string);
        if (d?.timelineSubtitle) setTimelineSubtitle(d.timelineSubtitle as string);
        const raw = (d?.highlights as Array<{ icon: string; label: string; description: string }>) || [];
        setValues(raw.length > 0 ? raw.map((h) => ({ icon: h.icon || 'Award', title: h.label, description: h.description })) : defaultValues);
        const rawTimeline = (d?.timeline as Array<{ year: string; event: string }>) || [];
        setTimelineEvents(rawTimeline);
      } else {
        setValues(defaultValues);
      }
      setLoaded(true);
    }).catch(() => {
      setValues(defaultValues);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  const displayValues = values.length > 0 ? values : defaultValues;

  return (
    <div className="pt-20">
      <section className="bg-[#111827] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">{heading}</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">{subtitle}</p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative h-[500px] rounded-2xl overflow-hidden">
              <Image src={image} alt="About AkInteriors" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
            </div>
            <div>
              <span className="text-[#C8A97E] text-sm tracking-[0.3em] uppercase font-medium">Our Story</span>
              <h2 className="text-4xl font-bold text-[#111827] mt-4 mb-6">A Legacy of <span className="text-[#C8A97E]">Design Excellence</span></h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#F9F7F4]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#C8A97E] text-sm tracking-[0.3em] uppercase font-medium">{valuesHeading}</span>
            <h2 className="text-4xl font-bold text-[#111827] mt-4">{valuesSubtitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayValues.map((value, index) => {
              const Icon = iconMap[value.icon] || Award;
              return (
                <motion.div key={value.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl p-8 shadow-sm text-center">
                  <div className="w-14 h-14 rounded-full bg-[#C8A97E]/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-[#C8A97E]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#111827] mb-2">{value.title}</h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-[#C8A97E] text-sm tracking-[0.3em] uppercase font-medium">{timelineHeading}</span>
            <h2 className="text-4xl font-bold text-[#111827] mt-4">{timelineSubtitle}</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            {timelineEvents.map((m, i) => (
              <div key={m.year + i} className="flex gap-6 pb-8 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-full bg-[#111827] border-2 border-[#C8A97E] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-[#C8A97E]" />
                  </div>
                  {i < timelineEvents.length - 1 && <div className="w-px flex-1 bg-gradient-to-b from-[#C8A97E] to-transparent" />}
                </div>
                <div className="pb-4">
                  <span className="text-[#C8A97E] font-bold text-lg">{m.year}</span>
                  <p className="text-gray-600">{m.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#C8A97E]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Space?</h2>
          <p className="text-white/80 text-lg mb-8">Let&apos;s create something beautiful together.</p>
          <Link href="/contact">
            <Button variant="secondary" size="lg" className="rounded-full">
              Get Free Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

const defaultValues = [
  { icon: 'Award', title: 'Excellence', description: 'We strive for perfection in every project, no matter the scale.' },
  { icon: 'Target', title: 'Innovation', description: 'We embrace new ideas and technologies to deliver cutting-edge designs.' },
  { icon: 'Users', title: 'Collaboration', description: 'We work closely with clients to bring their vision to life.' },
  { icon: 'Eye', title: 'Integrity', description: 'We maintain transparency and honesty in all our dealings.' },
];

const defaultParagraphs = [
  'Founded in 2009, AkInteriors has grown from a small design studio into one of India\'s most respected interior design firms. Our journey has been defined by a relentless pursuit of excellence and a passion for creating spaces that transform lives.',
  'With a team of 25+ talented designers, architects, and craftsmen, we have delivered over 500 projects across residential, commercial, and hospitality sectors. Our work has been featured in leading design publications and recognized with numerous industry awards.',
  'At the heart of our philosophy is the belief that great design is not just about aesthetics—it\'s about understanding people, their lifestyles, and their aspirations. Every project we undertake is a collaborative journey that results in a space that is uniquely yours.',
];
