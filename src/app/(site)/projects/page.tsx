'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, MapPin } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getPublishedProjects } from '@/lib/actions/data';

interface ProjectItem {
  _id: string;
  title: string;
  slug: string;
  description: string;
  categories: string[];
  coverImage: string;
  location?: string;
  area?: string;
  clientName?: string;
}

export default function ProjectsPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getPublishedProjects().then((data) => {
      setProjects(data || []);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  const allCategories = ['All', ...new Set(projects.map((p) => p.categories).flat())];

  const filtered = projects.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
      (p.location?.toLowerCase().includes(search.toLowerCase()) ?? false);
    const matchCategory = category === 'All' || p.categories.includes(category);
    return matchSearch && matchCategory;
  });

  return (
    <div className="pt-20">
      <section className="bg-[#111827] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Our Projects</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Explore our portfolio of premium interior design projects.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search projects or location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-12"
              />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {allCategories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/projects/${project.slug}`} className="group block">
                  <div className="relative h-64 rounded-2xl overflow-hidden mb-4">
                    <Image
                      src={project.coverImage || 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=60'}
                      alt={project.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <Badge className="absolute top-4 left-4">{project.categories[0]}</Badge>
                  </div>
                  <h3 className="text-xl font-bold text-[#111827] group-hover:text-[#C8A97E] transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                    <MapPin className="w-4 h-4" />
                    {project.location || 'Location TBD'}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && loaded && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">No projects found matching your criteria.</p>
            </div>
          )}

          {!loaded && (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-64 rounded-2xl bg-gray-200 mb-4" />
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
