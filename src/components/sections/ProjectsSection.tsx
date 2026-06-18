'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, MapPin } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPublishedProjects } from '@/lib/actions/data';

interface ProjectItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  categories: string[];
  coverImage: string;
  location?: string;
  featured: boolean;
}

export default function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const { ref, isVisible } = useScrollAnimation();

  useEffect(() => {
    getPublishedProjects().then((data) => {
      if (data && data.length > 0) {
        setProjects(data);
      }
    }).catch(() => {});
  }, []);

  const categories = ['All', ...new Set(projects.map((p) => p.categories).flat())];

  const filtered = activeCategory === 'All'
    ? projects
    : projects.filter((p) => p.categories.includes(activeCategory));

  return (
    <section ref={ref} id="projects" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <span className="text-[#C8A97E] text-sm tracking-[0.3em] uppercase font-medium">
            Our Portfolio
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold text-[#111827] mt-4 mb-6">
            Featured{' '}
            <span className="text-[#C8A97E]">Projects</span>
          </h2>
          <p className="text-gray-600 text-lg">
            Explore our curated collection of premium interior design projects.
          </p>
        </motion.div>

        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === cat
                    ? 'bg-[#111827] text-white shadow-lg'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.slice(0, 6).map((project, index) => (
              <motion.div
                key={project._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-2xl bg-gray-100"
              >
                <Link href={`/projects/${project.slug}`}>
                  <div className="relative h-80 overflow-hidden">
                    <Image
                      src={project.coverImage || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=60'}
                      alt={project.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    
                    <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-y-2 group-hover:translate-y-0">
                      <Badge variant="default">{project.categories[0]}</Badge>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                      {project.location && (
                        <div className="flex items-center gap-1 text-white/70 text-sm">
                          <MapPin className="w-4 h-4" />
                          {project.location}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ delay: 0.8 }}
          className="text-center mt-12"
        >
          <Link href="/projects">
            <Button variant="outline" size="lg" className="rounded-full">
              View All Projects
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}


