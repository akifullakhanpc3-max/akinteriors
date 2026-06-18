'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Database, FolderOpen, Loader2, Star, MessageSquare, TrendingUp, Users, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getAdminDashboardStats, seedDefaultContent } from '@/lib/actions/admin-actions';
import { toast } from '@/hooks/use-toast';

interface DashboardStats {
  totalProjects: number;
  totalServices: number;
  totalTestimonials: number;
  totalTeamMembers: number;
  totalInquiries: number;
  unreadInquiries: number;
}

interface RecentInquiry {
  _id: string;
  name: string;
  email: string;
  service?: string;
  status: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([]);
  useEffect(() => {
    getAdminDashboardStats().then((data: Record<string, unknown>) => {
      if (data.success) {
        setStats(data.stats as DashboardStats);
        setRecentInquiries((data.recentInquiries || []) as RecentInquiry[]);
      }
    });
  }, []);

  const statCards = stats ? [
    { label: 'Total Projects', value: String(stats.totalProjects), icon: FolderOpen, change: '', color: 'bg-blue-500', href: '/admin/projects' },
    { label: 'Total Services', value: String(stats.totalServices), icon: Wrench, change: '', color: 'bg-orange-500', href: '/admin/services' },
    { label: 'Testimonials', value: String(stats.totalTestimonials), icon: Star, change: '', color: 'bg-[#C8A97E]', href: '/admin/testimonials' },
    { label: 'Inquiries', value: String(stats.totalInquiries), icon: MessageSquare, change: `${stats.unreadInquiries} unread`, color: 'bg-green-500', href: '/admin/inquiries' },
  ] : [];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here&apos;s your overview.</p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link href={stat.href}>
                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-xl ${stat.color} bg-opacity-10 flex items-center justify-center`}>
                        <Icon className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`} />
                      </div>
                      {stat.change && <span className="text-sm text-green-600 font-medium">{stat.change}</span>}
                    </div>
                    <div className="text-3xl font-bold text-[#111827]">{stat.value}</div>
                    <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <SeedSection />
      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Leads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-lg">
              <TrendingUp className="w-8 h-8 mr-2" />
              Chart Placeholder
            </div>
          </CardContent>
        </Card>

        <div>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Inquiries</CardTitle>
              <Link href="/admin/inquiries" className="text-sm text-[#C8A97E] hover:underline">View all</Link>
            </CardHeader>
            <CardContent>
              {recentInquiries.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No inquiries yet.</p>
              ) : (
                <div className="space-y-4">
                  {recentInquiries.map((inquiry) => (
                    <div key={inquiry._id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-[#C8A97E]/10 flex items-center justify-center">
                        <Users className="w-5 h-5 text-[#C8A97E]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#111827]">{inquiry.name}</p>
                        <p className="text-xs text-gray-500">{inquiry.service || 'N/A'} &bull; {new Date(inquiry.createdAt).toLocaleDateString()}</p>
                      </div>
                      {inquiry.status === 'unread' && <span className="w-2 h-2 rounded-full bg-[#C8A97E]" />}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function SeedSection() {
  const [seeding, setSeeding] = useState(false);
  const [seeded, setSeeded] = useState<string[] | null>(null);

  async function handleSeed() {
    setSeeding(true);
    try {
      const res = await seedDefaultContent();
      if (res.success) {
        if (res.seeded && res.seeded.length > 0) {
          setSeeded(res.seeded);
          toast({ title: 'Default content seeded', description: `Inserted: ${res.seeded.join(', ')}` });
        } else {
          toast({ title: 'Already seeded', description: 'All collections already have content.' });
        }
      } else {
        toast({ title: 'Error', description: 'Failed to seed content', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Seed failed', variant: 'destructive' });
    } finally {
      setSeeding(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Default Content
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-500 mb-4">
          Populate the database with default services, projects, testimonials, team members, and FAQs.
          Only inserts data if the collection is empty.
        </p>
        {seeded ? (
          <p className="text-sm text-green-600 mb-4">Seeded: {seeded.join(', ')}</p>
        ) : null}
        <Button type="button" onClick={handleSeed} disabled={seeding} variant="outline">
          {seeding ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Database className="w-4 h-4 mr-2" />}
          {seeding ? 'Seeding...' : 'Seed Default Content'}
        </Button>
      </CardContent>
    </Card>
  );
}
