import { redirect } from 'next/navigation';
import { checkAdminExists } from '@/lib/actions/setup-actions';

export default async function RegisterPage() {
  const { exists } = await checkAdminExists();

  if (!exists) {
    redirect('/admin/setup');
  }

  redirect('/admin/login');
}
