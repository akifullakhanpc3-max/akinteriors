'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Home, Building2, CookingPot, Sofa, BedDouble,
  Briefcase, Hammer, Armchair, ClipboardCheck, Ruler,
  ArrowRight,
} from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getActiveServices } from '@/lib/actions/data';

const iconMap: Record<string, React.ElementType> = {
  Home, Building2, CookingPot, Sofa, BedDouble,
  Briefcase, Hammer, Armchair, ClipboardCheck, Ruler,
};

interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  icon: string;
  displayOrder: number;
}

export default function ServicesSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [services, setServices] = useState<ServiceItem[]>([]);

  useEffect(() => {
    getActiveServices().then((data) => {
      if (data && data.length > 0) {
        setServices(data);
      }
    }).catch(() => {});
  }, []);

  return (
    <section ref={ref} id="services" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[#C8A97E] text-sm tracking-[0.3em] uppercase font-medium">
            Our Services
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#111827] mt-4 mb-6">
            Comprehensive Design{' '}
            <span className="text-[#C8A97E]">Solutions</span>
          </h2>
          <p className="text-gray-600 text-lg">
            From concept to completion, we offer end-to-end interior design services 
            tailored to your unique style and requirements.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {services.map((service, index) => {
            const isSvgIcon = service.icon.startsWith('http') || service.icon.startsWith('/');
            const Icon = isSvgIcon ? null : (iconMap[service.icon] || Home);
            return (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="group h-full hover:shadow-xl hover:-translate-y-1 transition-all duration-500 cursor-pointer border-0 bg-gray-50">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 rounded-xl bg-[#C8A97E]/10 flex items-center justify-center mb-6 group-hover:bg-[#C8A97E] transition-all duration-500">
                      {Icon ? (
                        <Icon className="w-7 h-7 text-[#C8A97E] group-hover:text-white transition-colors duration-500" />
                      ) : (
                        <img src={service.icon} alt="" className="w-7 h-7 text-[#C8A97E] group-hover:brightness-0 group-hover:invert transition-all duration-500" />
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-[#111827] mb-3 group-hover:text-[#C8A97E] transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <Link
                      href={`/services?service=${service.title.toLowerCase().replace(/\s+/g, '-')}`}
                      className="inline-flex items-center text-sm font-medium text-[#C8A97E] group-hover:gap-2 transition-all"
                    >
                      Learn More <ArrowRight className="ml-1 w-4 h-4" />
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link href="/services">
            <Button variant="outline" size="lg" className="rounded-full">
              View All Services
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}


