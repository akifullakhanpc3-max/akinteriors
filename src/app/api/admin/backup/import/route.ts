import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { importBackup } from '@/lib/backup/backup';

export async function POST(request: NextRequest) {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (!user || user.role !== 'admin') {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const backupData = await request.json();

    const result = await importBackup(backupData);

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || 'Restore failed' }, { status: 400 });
    }

    return NextResponse.json({ success: true, imported: result.imported });
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid backup file' }, { status: 400 });
  }
}
