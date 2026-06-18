'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getActiveFAQs } from '@/lib/actions/data';

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  order: number;
}

export default function FAQSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [faqs, setFaqs] = useState<FAQItem[]>([]);

  useEffect(() => {
    getActiveFAQs().then((data) => {
      if (data && data.length > 0) {
        setFaqs(data);
      }
    }).catch(() => {});
  }, []);

  return (
    <section ref={ref} id="faq" className="py-24 lg:py-32 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#C8A97E] text-sm tracking-[0.3em] uppercase font-medium">
            FAQ
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#111827] mt-4 mb-6">
            Frequently Asked{' '}
            <span className="text-[#C8A97E]">Questions</span>
          </h2>
        </motion.div>

        <Accordion type="single" collapsible className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq._id}
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.05 }}
            >
              <AccordionItem value={`item-${index}`} className="border border-gray-100 rounded-xl px-6">
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}


