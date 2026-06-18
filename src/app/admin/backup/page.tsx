'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Download, Upload, Database, Calendar, HardDrive,
  Loader2, CheckCircle2, AlertCircle, FileWarning,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PageHeader } from '@/components/admin/PageHeader';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { getBackupStats, triggerAutoBackup } from '@/lib/actions/backup-actions';

interface BackupStats {
  totalRecords: number;
  collections: Record<string, number>;
  lastBackup: string | null;
  totalBackupSize: number;
  totalBackupSizeFormatted: string;
}

interface ImportResult {
  imported: Record<string, number>;
}

type Status = 'idle' | 'exporting' | 'importing' | 'success' | 'error';

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

export default function BackupPage() {
  const [stats, setStats] = useState<BackupStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState<Status>('idle');
  const [statusMessage, setStatusMessage] = useState('');
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showRestoreConfirm, setShowRestoreConfirm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    setLoading(true);
    const result = await getBackupStats();
    if (result.success) {
      setStats(result.stats as BackupStats);
    }
    setLoading(false);
  }

  async function handleExport() {
    setStatus('exporting');
    setStatusMessage('Generating backup...');
    setImportResult(null);

    try {
      const res = await fetch('/api/admin/backup/export');
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Export failed');
      }

      const json = JSON.stringify(data.backup, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const date = new Date().toISOString().split('T')[0];
      a.download = `backup-${date}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      await triggerAutoBackup();

      setStatus('success');
      setStatusMessage('Backup exported successfully!');
      await loadStats();
    } catch (err) {
      setStatus('error');
      setStatusMessage(err instanceof Error ? err.message : 'Export failed');
    }

    setTimeout(() => {
      if (status !== 'exporting') {
        setStatus('idle');
        setStatusMessage('');
      }
    }, 3000);
  }

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    setFileError('');

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.name.endsWith('.json')) {
      setFileError('Please select a valid JSON backup file');
      setSelectedFile(null);
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setFileError('File too large (max 50MB)');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  }

  async function handleRestore() {
    if (!selectedFile) return;

    setShowRestoreConfirm(false);
    setStatus('importing');
    setStatusMessage('Restoring backup...');
    setImportResult(null);

    try {
      const text = await selectedFile.text();
      const backupData = JSON.parse(text);

      if (!backupData.version || !backupData.data) {
        throw new Error('Invalid backup file structure');
      }

      const res = await fetch('/api/admin/backup/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(backupData),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Restore failed');
      }

      setImportResult(data);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }

      setStatus('success');
      setStatusMessage('Backup restored successfully!');
      await loadStats();
    } catch (err) {
      setStatus('error');
      setStatusMessage(err instanceof Error ? err.message : 'Restore failed');
    }

    setTimeout(() => {
      if (status !== 'importing') {
        setStatus('idle');
        setStatusMessage('');
      }
    }, 5000);
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return 'Never';
    try {
      return new Date(dateStr).toLocaleString();
    } catch {
      return dateStr;
    }
  }

  const statusColors: Record<Status, string> = {
    idle: '',
    exporting: 'text-blue-600',
    importing: 'text-amber-600',
    success: 'text-green-600',
    error: 'text-red-600',
  };

  return (
    <div>
      <PageHeader
        title="Backup & Restore"
        description="Manage your website data backups and restore"
      />

      <div className="mt-6 space-y-6">
        {/* Status Banner */}
        {status !== 'idle' && (
          <div className={`flex items-center gap-3 p-4 rounded-lg border ${
            status === 'success' ? 'bg-green-50 border-green-200' :
            status === 'error' ? 'bg-red-50 border-red-200' :
            status === 'exporting' || status === 'importing' ? 'bg-blue-50 border-blue-200' :
            'bg-gray-50 border-gray-200'
          }`}>
            {status === 'exporting' || status === 'importing' ? (
              <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
            ) : status === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${statusColors[status]}`}>
              {statusMessage}
            </span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total Records</CardTitle>
              <Database className="w-4 h-4 text-[#C8A97E]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  stats?.totalRecords.toLocaleString() || '0'
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Last Backup</CardTitle>
              <Calendar className="w-4 h-4 text-[#C8A97E]" />
            </CardHeader>
            <CardContent>
              <div className="text-sm font-medium truncate">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  formatDate(stats?.lastBackup || null)
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Backup Size</CardTitle>
              <HardDrive className="w-4 h-4 text-[#C8A97E]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  stats?.totalBackupSizeFormatted || '0 B'
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Collections</CardTitle>
              <Database className="w-4 h-4 text-[#C8A97E]" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
                ) : (
                  Object.keys(stats?.collections || {}).length || '0'
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Export */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Download className="w-5 h-5 text-[#C8A97E]" />
                Export Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                Download all website data as a JSON file. This includes all collections,
                settings, and content.
              </p>
              <Button
                variant="gold"
                onClick={handleExport}
                disabled={status === 'exporting' || status === 'importing'}
                className="w-full sm:w-auto"
              >
                {status === 'exporting' ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Exporting...</>
                ) : (
                  <><Download className="w-4 h-4 mr-2" /> Download Backup</>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Import */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="w-5 h-5 text-[#C8A97E]" />
                Import Backup
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-500">
                Restore website data from a previously exported backup file.
                A pre-restore backup will be created automatically.
              </p>

              <div className="space-y-3">
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Select Backup File
                  </label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#C8A97E]/10 file:text-[#C8A97E] hover:file:bg-[#C8A97E]/20 cursor-pointer"
                  />
                  {fileError && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <FileWarning className="w-3 h-3" /> {fileError}
                    </p>
                  )}
                  {selectedFile && !fileError && (
                    <p className="mt-1 text-sm text-green-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
                    </p>
                  )}
                </div>

                <Button
                  variant="gold"
                  onClick={() => setShowRestoreConfirm(true)}
                  disabled={!selectedFile || !!fileError || status === 'exporting' || status === 'importing'}
                  className="w-full sm:w-auto"
                >
                  {status === 'importing' ? (
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Restoring...</>
                  ) : (
                    <><Upload className="w-4 h-4 mr-2" /> Restore from Backup</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collection Breakdown */}
        {stats?.collections && Object.keys(stats.collections).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-[#C8A97E]" />
                Data Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(stats.collections).map(([key, count]) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                    <span className="text-sm font-medium text-gray-700">
                      {DISPLAY_NAMES[key] || key}
                    </span>
                    <span className="text-sm font-bold text-[#C8A97E]">
                      {count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Import Results */}
        {importResult && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="w-5 h-5" />
                Restore Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {Object.entries(importResult.imported).map(([key, count]) => (
                  <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-green-50">
                    <span className="text-sm font-medium text-green-700">
                      {DISPLAY_NAMES[key] || key}
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {count.toLocaleString()} records
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <ConfirmDialog
        open={showRestoreConfirm}
        onOpenChange={setShowRestoreConfirm}
        title="Restore Backup?"
        description={`This will replace ALL existing website data with the data from "${selectedFile?.name}". A backup of your current data will be created automatically before restoring. This action cannot be undone.`}
        confirmLabel="Restore Data"
        onConfirm={handleRestore}
      />
    </div>
  );
}
