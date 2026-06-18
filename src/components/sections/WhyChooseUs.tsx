'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Gem, Eye, Clock, Monitor, CheckCircle2 } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getHomepage } from '@/lib/actions/cms-actions';

const defaultIconMap: Record<string, React.ElementType> = {
  Star, Gem, Eye, Clock, Monitor, CheckCircle2,
};

interface Feature {
  icon: string;
  title: string;
  description: string;
}

export default function WhyChooseUs() {
  const { ref, isVisible } = useScrollAnimation();
  const [features, setFeatures] = useState<Feature[]>([]);

  useEffect(() => {
    getHomepage().then((res) => {
      if (res.success) {
        const sect = ((res.data as Record<string, unknown>)?.sections as Array<Record<string, unknown>>) || [];
        const wcu = sect.find((s) => s.type === 'why-choose-us');
        const raw = (wcu?.items as Array<{ icon: string; title: string; description: string }>) || [];
        if (raw.length > 0) setFeatures(raw);
      }
    }).catch(() => {});
  }, []);

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-[#F9F7F4]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[#C8A97E] text-sm tracking-[0.3em] uppercase font-medium">
            Why Choose Us
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#111827] mt-4 mb-6">
            What Sets Us{' '}
            <span className="text-[#C8A97E]">Apart</span>
          </h2>
          <p className="text-gray-600 text-lg">
            We combine creativity with craftsmanship to deliver interiors that exceed expectations.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = defaultIconMap[feature.icon] || Star;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-100">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[#C8A97E] to-[#8B7355] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-[#111827] mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#C8A97E] to-[#8B7355] scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl" />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


