import { NextResponse } from 'next/server';
import { saveBackupToFile, cleanOldBackups } from '@/lib/backup/backup';

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization');
  if (!process.env.CRON_SECRET || authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await saveBackupToFile();
    await cleanOldBackups();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Backup failed' }, { status: 500 });
  }
}
