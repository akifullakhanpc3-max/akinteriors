'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Search, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { getPublishedBlogPosts } from '@/lib/actions/data';

interface BlogPost {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  coverImage: string;
  publishedAt: string;
  author: string;
}

export default function BlogPage() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getPublishedBlogPosts().then((data) => {
      setPosts(data || []);
      const cats = [...new Set((data || []).map((p: { category: string }) => p.category))] as string[];
      setCategories(cats);
      setLoaded(true);
    }).catch(() => setLoaded(true));
  }, []);

  const filtered = posts.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = category === 'All' || p.category === category;
    return matchSearch && matchCategory;
  });

  return (
    <div className="pt-20">
      <section className="bg-[#111827] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Our Blog</h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Insights, trends, and expert advice on interior design.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4 mb-12">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-12" />
            </div>
            <div className="flex gap-2 flex-wrap">
              {['All', ...categories].map((cat) => (
                <button key={cat} onClick={() => setCategory(cat)} className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${category === cat ? 'bg-[#111827] text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {filtered.map((post, index) => (
              <motion.div key={post._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                <Link href={`/blog/${post.slug}`} className="group flex flex-col sm:flex-row gap-6 bg-[#F9F7F4] rounded-2xl p-4 hover:shadow-lg transition-shadow">
                  <div className="relative h-48 sm:h-40 sm:w-48 rounded-xl overflow-hidden shrink-0">
                    <Image src={post.coverImage || 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=60'} alt={post.title} fill sizes="(max-width: 640px) 100vw, 192px" className="object-cover transition-transform duration-500 group-hover:scale-110" />
                  </div>
                  <div className="flex-1">
                    <Badge variant="default" className="mb-2">{post.category}</Badge>
                    <h3 className="text-xl font-bold text-[#111827] group-hover:text-[#C8A97E] transition-colors mb-2">{post.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2 mb-3">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />
                      {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filtered.length === 0 && loaded && (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">No articles found.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
