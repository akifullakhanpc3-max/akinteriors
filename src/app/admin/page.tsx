import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { checkAdminExists } from '@/lib/actions/setup-actions';

export default async function AdminPage() {
  const { exists } = await checkAdminExists();

  if (!exists) {
    redirect('/admin/setup');
  }

  const session = await auth();

  if (!session?.user) {
    redirect('/admin/login');
  }

  redirect('/admin/dashboard');
}
