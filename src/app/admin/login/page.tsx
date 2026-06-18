import { redirect } from 'next/navigation';
import { checkAdminExists } from '@/lib/actions/setup-actions';
import LoginForm from './LoginForm';

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}) {
  const { exists } = await checkAdminExists();

  if (!exists) {
    redirect('/admin/setup');
  }

  const { callbackUrl, error } = await searchParams;

  return <LoginForm callbackUrl={callbackUrl} error={error} />;
}
