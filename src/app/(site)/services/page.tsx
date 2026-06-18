'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getActiveServices } from '@/lib/actions/data';

interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  content: string;
  icon: string;
  displayOrder: number;
}

export default function ServicesPage() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getActiveServices().then((data) => {
      if (data && data.length > 0) {
        setServices(data);
      } else {
        setServices(defaultServices);
      }
      setLoaded(true);
    }).catch(() => {
      setServices(defaultServices);
      setLoaded(true);
    });
  }, []);

  if (!loaded) return null;

  const displayServices = services.length > 0 ? services : defaultServices;

  return (
    <div className="pt-20">
      <section className="bg-[#111827] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Our Services</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Comprehensive interior design solutions tailored to your needs.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {displayServices.map((service, index) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`grid lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
            >
              <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                <span className="text-[#C8A97E] text-sm tracking-[0.3em] uppercase font-medium">0{index + 1}</span>
                <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mt-2 mb-4">{service.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{service.content || service.description}</p>
                <div className="grid grid-cols-2 gap-3 mb-8">
                  {[service.description].map((feature, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-[#C8A97E]" />
                      <span className="text-sm text-gray-600">{feature}</span>
                    </div>
                  ))}
                </div>
                <Link href="/contact">
                  <Button variant="gold" className="rounded-full">
                    Get a Quote
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </div>
              <div className={`relative h-[400px] rounded-2xl overflow-hidden ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <Image src={`https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=60`} alt={service.title} fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}

const defaultServices: ServiceItem[] = [
  { _id: '1', title: 'Residential Interiors', description: 'Custom-designed homes that blend luxury with comfort. We create living spaces that reflect your personality and lifestyle.', content: 'From concept to completion, our residential interior design service covers every aspect of your home. We create spaces that are both beautiful and functional.', icon: 'Home', displayOrder: 1 },
  { _id: '2', title: 'Commercial Interiors', description: 'Professional spaces that enhance productivity and brand identity. From offices to retail, we design for success.', content: 'Our commercial interior design solutions transform workplaces into inspiring environments that boost productivity and reflect your brand identity.', icon: 'Building2', displayOrder: 2 },
  { _id: '3', title: 'Modular Kitchens', description: 'Functional and stylish kitchens designed for modern living. Premium materials and smart layouts for the heart of your home.', content: 'We design and install custom modular kitchens that combine aesthetics with functionality. Premium materials, smart storage solutions, and ergonomic designs.', icon: 'CookingPot', displayOrder: 3 },
  { _id: '4', title: 'Renovation Services', description: 'Transform your existing space with our renovation expertise. We breathe new life into old spaces.', content: 'Our renovation services cover everything from minor updates to complete transformations. We work with your existing layout to create a fresh new look.', icon: 'Hammer', displayOrder: 4 },
];
