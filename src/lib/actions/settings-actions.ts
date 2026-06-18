'use server';

import { auth } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/connect';
import Settings from '@/models/Settings';
import { revalidateSettings } from './data';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkAccess(session: any) {
  if (!session || !session.user) return false;
  return session.user.role === 'admin';
}

export async function updateSettings(data: Record<string, unknown>) {
  const session = await auth();
  if (!checkAccess(session)) return { success: false, error: 'Unauthorized' };

  await connectDB();

  try {
    const result = await Settings.findOneAndUpdate(
      {},
      { $set: data },
      { new: true, upsert: true }
    );

    revalidateSettings();

    return { success: true, settings: JSON.parse(JSON.stringify(result)) };
  } catch {
    return { success: false, error: 'Failed to update settings' };
  }
}

export async function getAdminSettings() {
  const session = await auth();
  if (!checkAccess(session)) return { success: false, error: 'Unauthorized' };

  await connectDB();

  let settings = await Settings.findOne().lean();
  if (!settings) {
    const { findOrCreateSettings } = await import('@/models/Settings');
    settings = await findOrCreateSettings();
  }

  return { success: true, settings: JSON.parse(JSON.stringify(settings)) };
}
