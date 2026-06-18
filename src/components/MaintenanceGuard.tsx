import { headers } from 'next/headers';
import { auth } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/connect';
import Settings from '@/models/Settings';

export default async function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  try {
    const headersList = await headers();
    const pathname = headersList.get('x-invoke-path') || headersList.get('next-url') || '';

    // Always allow admin routes so admins can log in and work
    if (pathname.startsWith('/admin/') || pathname === '/admin') {
      return <>{children}</>;
    }

    await connectDB();
    const settings = await Settings.findOne().lean();
    if (settings?.maintenanceMode) {
      const session = await auth();
      const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'admin';
      if (!isAdmin) {
        return (
          <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center p-4">
            <div className="text-center max-w-md">
              <div className="w-20 h-20 rounded-full bg-[#C8A97E]/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">🔧</span>
              </div>
              <h1 className="text-3xl font-bold text-[#111827] mb-3">Under Maintenance</h1>
              <p className="text-gray-500 mb-6">
                We&apos;re currently performing scheduled maintenance to improve your experience.
                Please check back shortly.
              </p>
              <div className="w-16 h-1 bg-[#C8A97E] mx-auto rounded-full" />
            </div>
          </div>
        );
      }
    }
  } catch {
    // If DB check fails, allow access
  }
  return <>{children}</>;
}
