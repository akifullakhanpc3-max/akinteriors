'use server';

import { auth } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/connect';
import {
  getBackupInfo,
  getLastBackupDate,
  formatFileSize,
  saveBackupToFile,
  cleanOldBackups,
} from '@/lib/backup/backup';

const MODEL_NAMES = [
  'User', 'Project', 'Service', 'Testimonial', 'TeamMember',
  'FAQ', 'Inquiry', 'Settings', 'Blog', 'WebsiteImage',
  'AboutPage', 'ContactPage', 'FooterSettings', 'Homepage',
  'Navigation', 'SEOSettings', 'SocialLinks', 'Branding',
] as const;

import mongoose from 'mongoose';

import '@/models/User';
import '@/models/Project';
import '@/models/Service';
import '@/models/Testimonial';
import '@/models/TeamMember';
import '@/models/FAQ';
import '@/models/Inquiry';
import '@/models/Settings';
import '@/models/Blog';
import '@/models/WebsiteImage';
import '@/models/AboutPage';
import '@/models/ContactPage';
import '@/models/FooterSettings';
import '@/models/Homepage';
import '@/models/Navigation';
import '@/models/SEOSettings';
import '@/models/SocialLinks';
import '@/models/Branding';

export async function getBackupStats() {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await connectDB();

    const collections: Record<string, number> = {};
    let totalRecords = 0;

    for (const modelName of MODEL_NAMES) {
      try {
        const Model = mongoose.models[modelName];
        if (Model) {
          const count = await Model.countDocuments({});
          collections[modelName] = count;
          totalRecords += count;
        }
      } catch {
        collections[modelName] = 0;
      }
    }

    const backupInfo = await getBackupInfo();

    return {
      success: true,
      stats: {
        totalRecords,
        collections,
        lastBackup: backupInfo.lastBackup,
        totalBackupSize: backupInfo.totalSize,
        totalBackupSizeFormatted: formatFileSize(backupInfo.totalSize),
      },
    };
  } catch {
    return { success: false, error: 'Failed to get backup stats' };
  }
}

export async function triggerAutoBackup() {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await saveBackupToFile();
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to create backup' };
  }
}

export async function cleanupBackups() {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (!user || user.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await cleanOldBackups();
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to clean backups' };
  }
}

export async function checkWeeklyBackup() {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (!user || user.role !== 'admin') {
    return;
  }

  try {
    const lastDate = await getLastBackupDate();
    if (!lastDate) {
      await saveBackupToFile();
      return;
    }

    const now = new Date();
    const daysSinceLastBackup = (now.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceLastBackup >= 7) {
      await saveBackupToFile();
    }
  } catch {
    // silent fail — backup is best-effort
  }
}
