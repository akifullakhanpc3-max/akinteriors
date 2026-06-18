'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Briefcase, AtSign, Camera } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { getActiveTeamMembers } from '@/lib/actions/data';

interface TeamMemberItem {
  _id: string;
  name: string;
  role: string;
  bio: string;
  avatar: string;
  socialLinks?: { linkedin?: string; twitter?: string; instagram?: string };
}

const socialIconMap: Record<string, React.ElementType> = { Briefcase, AtSign, Camera };

export default function TeamSection() {
  const { ref, isVisible } = useScrollAnimation();
  const [members, setMembers] = useState<TeamMemberItem[]>([]);

  useEffect(() => {
    getActiveTeamMembers().then((data) => {
      if (data && data.length > 0) {
        setMembers(data);
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
            Our Team
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#111827] mt-4 mb-6">
            Meet The{' '}
            <span className="text-[#C8A97E]">Experts</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Talented professionals dedicated to creating extraordinary spaces.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <motion.div
              key={member._id}
              initial={{ opacity: 0, y: 30 }}
              animate={isVisible ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="relative h-80 rounded-2xl overflow-hidden mb-4">
                <Image
                  src={member.avatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=350&q=60'}
                  alt={member.name}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                  {['Briefcase', 'AtSign', 'Camera'].map((social) => {
                    const Icon = socialIconMap[social];
                    return (
                      <a
                        key={social}
                        href="#"
                        className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-[#C8A97E] transition-colors"
                      >
                        <Icon className="w-4 h-4 text-white" />
                      </a>
                    );
                  })}
                </div>
              </div>
              <h3 className="text-lg font-bold text-[#111827]">{member.name}</h3>
              <p className="text-[#C8A97E] text-sm font-medium">{member.role}</p>
              <p className="text-gray-500 text-sm mt-2">{member.bio}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


