'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { Quote, Star } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getActiveTestimonials } from '@/lib/actions/data';
import 'swiper/css';
import 'swiper/css/pagination';

interface TestimonialItem {
  _id: string;
  clientName: string;
  clientTitle?: string;
  company?: string;
  content: string;
  rating: number;
}

export default function TestimonialsSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);

  useEffect(() => {
    getActiveTestimonials().then((data) => {
      if (data && data.length > 0) {
        setTestimonials(data);
      }
    }).catch(() => {});
  }, []);

  return (
    <section ref={ref} className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="text-[#C8A97E] text-sm tracking-[0.3em] uppercase font-medium">
            Testimonials
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#111827] mt-4 mb-6">
            What Our Clients{' '}
            <span className="text-[#C8A97E]">Say</span>
          </h2>
        </motion.div>

        <Swiper
          modules={[Autoplay, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          className="pb-14"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial._id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                className="bg-[#F9F7F4] rounded-2xl p-8 h-full"
              >
                <Quote className="w-8 h-8 text-[#C8A97E]/30 mb-4" />
                <p className="text-gray-600 leading-relaxed mb-6 line-clamp-4">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#C8A97E] text-[#C8A97E]" />
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold text-[#111827]">{testimonial.clientName}</h4>
                  <p className="text-sm text-gray-500">{testimonial.clientTitle || testimonial.company || ''}</p>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}


