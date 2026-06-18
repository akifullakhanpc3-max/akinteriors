import { redirect } from 'next/navigation';
import { checkAdminExists } from '@/lib/actions/setup-actions';
import SetupForm from './SetupForm';

export default async function SetupPage() {
  const { exists, error } = await checkAdminExists();

  if (error) {
    return (
      <div className="min-h-screen bg-[#F9F7F4] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-[#111827] mb-4">Database Connection Error</h1>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (exists) {
    redirect('/admin/login');
  }

  return <SetupForm />;
}
