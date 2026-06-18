import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { exportBackup } from '@/lib/backup/backup';

export async function GET() {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const backup = await exportBackup();
    return NextResponse.json({ success: true, backup });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to export backup' }, { status: 500 });
  }
}
