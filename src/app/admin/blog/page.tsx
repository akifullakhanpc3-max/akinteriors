'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getAdminBlogPosts, deleteBlogPost } from '@/lib/actions/admin-actions';

interface BlogPost {
  _id: string;
  title: string;
  category: string;
  status: 'draft' | 'published';
  publishedAt: string;
}

export default function AdminBlog() {
  const [search, setSearch] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    getAdminBlogPosts().then((data) => {
      if (data.success) setPosts(data.posts);
    });
  }, []);

  const handleDelete = async (id: string) => {
    const data = await deleteBlogPost(id);
    if (data.success) {
      setPosts((prev) => prev.filter((p) => p._id !== id));
    }
  };

  const filtered = posts.filter((p) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">Blog</h1>
          <p className="text-gray-500 mt-1">Manage blog posts.</p>
        </div>
        <Button variant="gold" className="rounded-full">
          <Plus className="w-4 h-4 mr-2" />
          New Post
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input placeholder="Search posts..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Title</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((post) => (
                  <motion.tr key={post._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 font-medium text-[#111827]">{post.title}</td>
                    <td className="py-3 px-4 text-sm text-gray-500">{post.category}</td>
                    <td className="py-3 px-4">
                      <Badge variant={post.status === 'published' ? 'default' : 'secondary'}>{post.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-500">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg"><Eye className="w-4 h-4 text-gray-500" /></button>
                        <button className="p-2 hover:bg-gray-100 rounded-lg"><Edit className="w-4 h-4 text-gray-500" /></button>
                        <button onClick={() => handleDelete(post._id)} className="p-2 hover:bg-red-50 rounded-lg"><Trash2 className="w-4 h-4 text-red-500" /></button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
