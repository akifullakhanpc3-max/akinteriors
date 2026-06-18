'use client';

import { useState, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { getContactPage } from '@/lib/actions/cms-actions';

export default function WhatsAppButton() {
  const [waUrl, setWaUrl] = useState('https://wa.me/919999999999');

  useEffect(() => {
    getContactPage().then((res) => {
      if (res.success) {
        const d = res.data as Record<string, unknown>;
        const branches = (d?.branches as Array<Record<string, unknown>>) || [];
        const primary = branches.find((b) => b.isPrimary) || branches[0];
        if (primary?.whatsapp) {
          const num = (primary.whatsapp as string).replace(/[^0-9]/g, '');
          setWaUrl(`https://wa.me/${num}`);
        }
      }
    }).catch(() => {});
  }, []);

  return (
    <motion.a
      href={waUrl}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ delay: 1, type: 'spring' }}
      className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-green-500 text-white shadow-lg hover:bg-green-600 hover:shadow-xl transition-all flex items-center justify-center"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-7 h-7" />
    </motion.a>
  );
}
