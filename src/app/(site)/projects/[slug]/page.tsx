'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, Maximize2, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getProjectBySlug } from '@/lib/actions/data';

interface ProjectData {
  title?: string;
  category?: string;
  categories?: string[];
  location?: string;
  area?: string;
  duration?: string;
  clientName?: string;
  description?: string;
  content?: string;
  coverImage?: string;
  images?: string[];
  featuredImage?: string;
}

export default function ProjectDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [project, setProject] = useState<ProjectData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  useEffect(() => {
    if (!slug) return;
    getProjectBySlug(slug).then((data) => {
      if (data) {
        setProject(data);
      } else {
        setProject(defaultProject);
      }
      setLoaded(true);
    }).catch(() => {
      setProject(defaultProject);
      setLoaded(true);
    });
  }, [slug]);

  if (!loaded) {
    return (
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-48" />
            <div className="h-[60vh] bg-gray-200 rounded-3xl" />
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2 space-y-4">
                <div className="h-8 bg-gray-200 rounded w-64" />
                <div className="h-4 bg-gray-200 rounded w-full" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
              </div>
              <div className="h-96 bg-gray-200 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-[#111827] mb-4">Project Not Found</h1>
          <Link href="/projects" className="text-[#C8A97E] hover:underline">Back to Projects</Link>
        </div>
      </div>
    );
  }

  const images = project.images && project.images.length > 0 ? project.images : [project.coverImage || 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&q=60'];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <div className="pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link href="/projects" className="inline-flex items-center text-gray-600 hover:text-[#C8A97E] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Projects
        </Link>
      </div>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative h-[60vh] rounded-3xl overflow-hidden mb-12">
          <Image
            src={project.coverImage || defaultProject.featuredImage}
            alt={project.title || ''}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-8 left-8">
            <Badge variant="default" className="mb-3">{project.categories?.[0] || 'Residential'}</Badge>
            <h1 className="text-4xl sm:text-5xl font-bold text-white">{project.title || ''}</h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-[#111827] mb-4">Project Overview</h2>
            <p className="text-gray-600 leading-relaxed text-lg">{project.content || project.description}</p>

            {images.length > 1 && (
              <>
                <Separator className="my-8" />
                <h3 className="text-xl font-bold text-[#111827] mb-6">Gallery</h3>
                <div className="grid grid-cols-2 gap-4">
                  {images.map((img: string, i: number) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="relative h-48 rounded-xl overflow-hidden cursor-pointer group"
                      onClick={() => openLightbox(i)}
                    >
                      <Image src={img} alt={`Gallery ${i + 1}`} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Maximize2 className="w-6 h-6 text-white" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </div>

          <div className="bg-[#F9F7F4] rounded-2xl p-8 h-fit">
            <h3 className="text-lg font-bold text-[#111827] mb-6">Project Details</h3>
            <div className="space-y-4">
              {project.location && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-[#C8A97E]" />
                  <div>
                    <p className="text-xs text-gray-500">Location</p>
                    <p className="font-medium text-[#111827]">{project.location}</p>
                  </div>
                </div>
              )}
              {project.area && (
                <div className="flex items-center gap-3">
                  <Maximize2 className="w-5 h-5 text-[#C8A97E]" />
                  <div>
                    <p className="text-xs text-gray-500">Area</p>
                    <p className="font-medium text-[#111827]">{project.area}</p>
                  </div>
                </div>
              )}
              {project.duration && (
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-[#C8A97E]" />
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-medium text-[#111827]">{project.duration}</p>
                  </div>
                </div>
              )}
              {project.clientName && (
                <>
                  <Separator className="my-4" />
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Client</p>
                    <p className="font-medium text-[#111827]">{project.clientName}</p>
                  </div>
                </>
              )}
            </div>
            <Link href="/contact" className="block mt-6">
              <Button variant="gold" className="w-full rounded-full">
                Start Similar Project
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {lightboxOpen && images.length > 0 && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" onClick={() => setLightboxOpen(false)}>
          <button className="absolute top-4 right-4 text-white/80 hover:text-white" onClick={() => setLightboxOpen(false)}>
            <X className="w-8 h-8" />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white" onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i - 1 + images.length) % images.length); }}>
            <ChevronLeft className="w-8 h-8" />
          </button>
          <div className="relative w-full max-w-4xl aspect-video mx-4" onClick={(e) => e.stopPropagation()}>
            <Image src={images[lightboxIndex]} alt="" fill sizes="80vw" className="object-contain" />
          </div>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white/80 hover:text-white" onClick={(e) => { e.stopPropagation(); setLightboxIndex((i) => (i + 1) % images.length); }}>
            <ChevronRight className="w-8 h-8" />
          </button>
        </div>
      )}
    </div>
  );
}

const defaultProject = {
  title: 'Modern Villa',
  category: 'Residential',
  categories: ['Residential'],
  location: 'Bangalore',
  area: '4500 sq ft',
  duration: '6 months',
  clientName: 'Mr. & Mrs. Sharma',
  description: 'A stunning modern villa that blends contemporary design with warm, inviting spaces. Every room has been carefully curated to create a harmonious living experience.',
  content: 'A stunning modern villa that blends contemporary design with warm, inviting spaces. Every room has been carefully curated to create a harmonious living experience.',
  coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=60',
  images: [
    'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=600&q=60',
    'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=60',
    'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=600&q=60',
    'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&q=60',
  ],
  featuredImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&q=60',
};
