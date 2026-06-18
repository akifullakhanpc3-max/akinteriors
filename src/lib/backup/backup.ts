import { connectDB } from '@/lib/db/connect';
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';

const BACKUPS_DIR = path.join(process.cwd(), 'backups');
const MAX_BACKUPS = 30;

const MODEL_NAMES = [
  'User',
  'Project',
  'Service',
  'Testimonial',
  'TeamMember',
  'FAQ',
  'Inquiry',
  'Settings',
  'Blog',
  'WebsiteImage',
  'AboutPage',
  'ContactPage',
  'FooterSettings',
  'Homepage',
  'Navigation',
  'SEOSettings',
  'SocialLinks',
  'Branding',
] as const;

const DISPLAY_NAMES: Record<string, string> = {
  User: 'Admins',
  Project: 'Projects',
  Service: 'Services',
  Testimonial: 'Testimonials',
  TeamMember: 'Team Members',
  FAQ: 'FAQs',
  Inquiry: 'Inquiries',
  Settings: 'Settings',
  Blog: 'Blog Posts',
  WebsiteImage: 'Images',
  AboutPage: 'About Page',
  ContactPage: 'Contact Page',
  FooterSettings: 'Footer Settings',
  Homepage: 'Homepage',
  Navigation: 'Navigation',
  SEOSettings: 'SEO Settings',
  SocialLinks: 'Social Links',
  Branding: 'Branding',
};

export interface BackupData {
  version: string;
  exportDate: string;
  stats: {
    totalRecords: number;
    collections: Record<string, number>;
  };
  data: Record<string, Record<string, unknown>[]>;
}

export async function ensureBackupsDir() {
  try {
    await fs.mkdir(BACKUPS_DIR, { recursive: true });
  } catch {
    // directory exists
  }
}

export async function exportBackup(): Promise<BackupData> {
  await connectDB();

  await ensureBackupsDir();

  const data: Record<string, Record<string, unknown>[]> = {};
  const stats: BackupData['stats'] = {
    totalRecords: 0,
    collections: {},
  };

  for (const modelName of MODEL_NAMES) {
    try {
      const Model = mongoose.models[modelName];
      if (!Model) continue;

      let query = Model.find({});
      if (modelName === 'User') {
        query = query.select('+password');
      }
      const docs = await query.lean();
      const cleaned = docs.map((doc: Record<string, unknown>) => {
        const { __v, ...rest } = doc;
        return rest;
      });

      data[modelName] = cleaned;
      stats.collections[modelName] = cleaned.length;
      stats.totalRecords += cleaned.length;
    } catch {
      data[modelName] = [];
      stats.collections[modelName] = 0;
    }
  }

  return {
    version: '1.0',
    exportDate: new Date().toISOString(),
    stats,
    data,
  };
}

export async function importBackup(backupData: BackupData): Promise<{ success: boolean; error?: string; imported: Record<string, number> }> {
  if (!backupData || backupData.version !== '1.0') {
    return { success: false, error: 'Invalid backup file format', imported: {} };
  }

  if (!backupData.data || typeof backupData.data !== 'object') {
    return { success: false, error: 'Backup file contains no data', imported: {} };
  }

  await connectDB();
  await ensureBackupsDir();

  const autoBackup = await exportBackup();
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const autoPath = path.join(BACKUPS_DIR, `pre-restore-${timestamp}.json`);
  await fs.writeFile(autoPath, JSON.stringify(autoBackup, null, 2));

  const imported: Record<string, number> = {};

  for (const modelName of MODEL_NAMES) {
    try {
      const docs = backupData.data[modelName];
      if (!docs || !Array.isArray(docs) || docs.length === 0) {
        imported[modelName] = 0;
        continue;
      }

      const Model = mongoose.models[modelName];
      if (!Model) {
        imported[modelName] = 0;
        continue;
      }

      await Model.deleteMany({});

      if (docs.length > 0) {
        await Model.insertMany(docs, { ordered: false });
      }

      imported[modelName] = docs.length;
    } catch {
      imported[modelName] = 0;
    }
  }

  return { success: true, imported };
}

export async function saveBackupToFile(): Promise<string> {
  const backup = await exportBackup();
  await ensureBackupsDir();

  const date = new Date().toISOString().split('T')[0];
  const filename = `backup-${date}.json`;
  const filePath = path.join(BACKUPS_DIR, filename);

  await fs.writeFile(filePath, JSON.stringify(backup, null, 2));

  await cleanOldBackups();

  return filePath;
}

export async function cleanOldBackups() {
  try {
    await ensureBackupsDir();
    const files = await fs.readdir(BACKUPS_DIR);
    const backupFiles = files
      .filter((f) => f.endsWith('.json'))
      .map((f) => ({
        name: f,
        path: path.join(BACKUPS_DIR, f),
        time: 0,
      }));

    for (const file of backupFiles) {
      try {
        const stat = await fs.stat(file.path);
        file.time = stat.mtimeMs;
      } catch {
        file.time = 0;
      }
    }

    backupFiles.sort((a, b) => b.time - a.time);

    if (backupFiles.length > MAX_BACKUPS) {
      const toDelete = backupFiles.slice(MAX_BACKUPS);
      for (const file of toDelete) {
        try {
          await fs.unlink(file.path);
        } catch {
          // skip
        }
      }
    }
  } catch {
    // no backups directory yet
  }
}

export async function getLastBackupDate(): Promise<Date | null> {
  try {
    await ensureBackupsDir();
    const files = await fs.readdir(BACKUPS_DIR);
    const backupFiles = files.filter((f) => f.endsWith('.json') && f.startsWith('backup-'));

    let latest: Date | null = null;
    for (const file of backupFiles) {
      try {
        const stat = await fs.stat(path.join(BACKUPS_DIR, file));
        if (!latest || stat.mtime > latest) {
          latest = stat.mtime;
        }
      } catch {
        // skip
      }
    }
    return latest;
  } catch {
    return null;
  }
}

export async function getBackupInfo() {
  await ensureBackupsDir();

  let lastBackup: string | null = null;
  let totalSize = 0;

  try {
    const files = await fs.readdir(BACKUPS_DIR);
    const jsonFiles = files.filter((f) => f.endsWith('.json') && f.startsWith('backup-'));

    for (const file of jsonFiles) {
      const filePath = path.join(BACKUPS_DIR, file);
      try {
        const stat = await fs.stat(filePath);
        totalSize += stat.size;
        if (!lastBackup || stat.mtimeMs > new Date(lastBackup).getTime()) {
          lastBackup = stat.mtime.toISOString();
        }
      } catch {
        // skip
      }
    }
  } catch {
    // no files
  }

  return { lastBackup, totalSize, backupCount: 0 };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}
