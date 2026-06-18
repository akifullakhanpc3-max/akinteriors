'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import { checkWeeklyBackup } from '@/lib/actions/backup-actions';
import {
  Diamond, LayoutDashboard, FolderOpen, Grid3X3, Star, Users,
  HelpCircle, FileText, MessageSquare, LogOut, Menu, X, ExternalLink, ImageIcon, Globe, Loader2, Settings, Shield, User,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

const sidebarLinks = [
  { label: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { label: 'Projects', href: '/admin/projects', icon: FolderOpen },
  { label: 'Services', href: '/admin/services', icon: Grid3X3 },
  { label: 'Testimonials', href: '/admin/testimonials', icon: Star },
  { label: 'Team', href: '/admin/team', icon: Users },
  { label: 'FAQs', href: '/admin/faqs', icon: HelpCircle },
  { label: 'Blog', href: '/admin/blog', icon: FileText },
  { label: 'CMS', href: '/admin/cms', icon: Globe },
  { label: 'Images', href: '/admin/images', icon: ImageIcon },
  { label: 'Inquiries', href: '/admin/inquiries', icon: MessageSquare },
  { label: 'Profile', href: '/admin/profile', icon: User },
  { label: 'Settings', href: '/admin/settings', icon: Settings },
  { label: 'Backup', href: '/admin/backup', icon: Shield },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    checkWeeklyBackup();
  }, []);

  const isPublicPage = pathname === '/admin/login' || pathname === '/admin/setup' || pathname === '/admin/register';
  if (isPublicPage) return <>{children}</>;

  if (status === 'loading' || status === 'unauthenticated') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8A97E]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-64 bg-[#111827] text-white flex flex-col transition-transform duration-300 lg:translate-x-0',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex-shrink-0 p-6 border-b border-white/10">
          <Link href="/admin/dashboard" className="flex items-center gap-2">
            <Diamond className="w-7 h-7 text-[#C8A97E] shrink-0" />
            <span className="text-lg font-bold whitespace-nowrap">Ak<span className="text-[#C8A97E]">Interiors</span></span>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all',
                  pathname === link.href
                    ? 'bg-[#C8A97E]/10 text-[#C8A97E]'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="flex-shrink-0 p-4 border-t border-white/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-[#C8A97E] flex items-center justify-center text-sm font-bold shrink-0">
              {session?.user?.name?.[0] || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium truncate">{session?.user?.name || 'Admin'}</p>
              <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-3 w-full px-4 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main content area */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-100 h-16 flex items-center gap-3 px-4 sm:px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-gray-100 shrink-0"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Logo in header - always visible */}
          <Link
            href="/admin/dashboard"
            className="hidden sm:flex items-center gap-2 shrink-0 mr-auto"
          >
            <Diamond className="w-6 h-6 text-[#C8A97E]" />
            <span className="text-base font-bold text-[#111827]">
              Ak<span className="text-[#C8A97E]">Interiors</span>
              <span className="ml-2 text-xs font-normal text-gray-400 hidden md:inline">Admin</span>
            </span>
          </Link>

          <div className="flex-1 min-w-0" />

          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-sm text-gray-500 hover:text-[#C8A97E] hover:bg-gray-50 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline">View Site</span>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
