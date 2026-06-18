'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getHomepage } from '@/lib/actions/cms-actions';

interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export default function ProcessSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [steps, setSteps] = useState<ProcessStep[]>([]);

  useEffect(() => {
    getHomepage().then((res) => {
      if (res.success) {
        const sect = ((res.data as Record<string, unknown>)?.sections as Array<Record<string, unknown>>) || [];
        const proc = sect.find((s) => s.type === 'process');
        const raw = (proc?.steps as Array<{ step: number; title: string; description: string }>) || [];
        if (raw.length > 0) setSteps(raw);
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
            Our Process
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#111827] mt-4 mb-6">
            How We{' '}
            <span className="text-[#C8A97E]">Work</span>
          </h2>
          <p className="text-gray-600 text-lg">
            A streamlined approach that ensures every project is delivered with excellence.
          </p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-[#C8A97E] via-[#C8A97E]/50 to-transparent hidden lg:block" />

          <div className="space-y-12 lg:space-y-0">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, x: -30 }}
                animate={isVisible ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={`relative lg:flex items-start gap-8 ${
                  index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                }`}
              >
                <div className="hidden lg:flex w-1/2 justify-center">
                  <div className="w-16 h-16 rounded-full bg-[#111827] border-4 border-[#C8A97E] flex items-center justify-center z-10">
                    <span className="text-[#C8A97E] text-xl font-bold">{step.step}</span>
                  </div>
                </div>

                <div className="lg:w-1/2 bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-shadow duration-300 ml-16 lg:ml-0">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="lg:hidden w-12 h-12 rounded-full bg-[#111827] border-2 border-[#C8A97E] flex items-center justify-center">
                      <span className="text-[#C8A97E] font-bold">{step.step}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-[#111827]">{step.title}</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


