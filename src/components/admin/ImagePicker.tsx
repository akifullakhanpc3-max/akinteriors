'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, X, Image as ImageIcon, Search, Loader2, Trash2, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageItem {
  _id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  title: string;
  category: string;
  section: string;
  fileSize?: number;
  dimensions?: { width: number; height: number };
}

interface ImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  category?: string;
  section?: string;
  label?: string;
}

export default function ImagePicker({ value, onChange, category = 'general', section = 'general', label = 'Image' }: ImagePickerProps) {
  const [showLibrary, setShowLibrary] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState('');
  const [libraryImages, setLibraryImages] = useState<ImageItem[]>([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const startTimeRef = useRef(0);

  useEffect(() => {
    if (!uploading) { setUploadProgress(0); setUploadStatus(''); return; }
    startTimeRef.current = Date.now();
    const interval = setInterval(() => {
      const elapsed = (Date.now() - startTimeRef.current) / 1000;
      const pct = Math.min(95, Math.round((elapsed / 30) * 100));
      setUploadProgress(pct);
      if (elapsed < 3) setUploadStatus('Uploading...');
      else if (elapsed < 8) setUploadStatus('Processing image...');
      else if (elapsed < 15) setUploadStatus('Uploading to storage...');
      else setUploadStatus('Almost done...');
    }, 250);
    return () => clearInterval(interval);
  }, [uploading]);

  const uploadFile = useCallback(async (file: File) => {
    if (file.size > 5 * 1024 * 1024) { alert('File too large (max 5MB)'); return; }
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!allowed.includes(file.type)) { alert('Only JPG, PNG, WebP allowed'); return; }

    setUploading(true);
    setUploadProgress(0);
    try {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('title', file.name.replace(/\.[^.]+$/, ''));
      fd.append('category', category);
      fd.append('section', section);
      fd.append('isActive', 'true');

      const res = await fetch('/api/admin/images', { method: 'POST', body: fd });
      setUploadProgress(100);
      setUploadStatus('Complete!');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          onChange(data.image.imageUrl);
        } else {
          alert(data.error || 'Upload failed');
        }
      } else {
        const text = await res.text().catch(() => '');
        let msg: string;
        try { msg = JSON.parse(text).error || text; } catch { msg = text || `Server error (${res.status})`; }
        alert(msg);
      }
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  }, [category, section, onChange]);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) uploadFile(file);
    if (e.target) e.target.value = '';
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) uploadFile(file);
  }

  async function openLibrary() {
    setShowLibrary(true);
    setLibraryLoading(true);
    try {
      const res = await fetch(`/api/admin/images?limit=50`);
      const data = await res.json();
      setLibraryImages(data.images || []);
    } catch {
      setLibraryImages([]);
    } finally {
      setLibraryLoading(false);
    }
  }

  const filtered = libraryImages.filter((img) =>
    !search || img.title.toLowerCase().includes(search.toLowerCase()) || img.category.toLowerCase().includes(search.toLowerCase())
  );

  function formatSize(bytes?: number) {
    if (!bytes) return '';
    return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`;
  }

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* Preview */}
      {value ? (
        <div className="relative rounded-lg border border-gray-200 overflow-hidden group">
          <img src={value} alt="Preview" className="w-full h-32 object-cover" />
          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => onChange('')}>
              <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload className="w-3.5 h-3.5 mr-1" /> Replace
            </Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => window.open(value, '_blank')}>
              <ExternalLink className="w-3.5 h-3.5 mr-1" /> View
            </Button>
          </div>
        </div>
      ) : (
        /* Upload Zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragOver ? 'border-[#C8A97E] bg-[#C8A97E]/5' : 'border-gray-300 hover:border-gray-400'
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-[#C8A97E]" />
              <span className="text-sm text-gray-500">{uploadStatus}</span>
              <div className="w-full max-w-xs bg-gray-200 rounded-full h-2 mt-1">
                <div
                  className="bg-[#C8A97E] h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {uploadProgress}%
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-gray-400" />
              <span className="text-sm text-gray-500">Click or drag image here</span>
              <span className="text-xs text-gray-400">JPG, PNG, WebP, SVG (max 5MB)</span>
            </div>
          )}
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleFile} />

      {/* Browse Library */}
      <div className="flex gap-2">
        <Button type="button" variant="outline" size="sm" onClick={openLibrary} className="flex-1">
          <ImageIcon className="w-3.5 h-3.5 mr-1" /> Browse Media Library
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={uploading}>
          <Upload className="w-3.5 h-3.5 mr-1" /> Upload
        </Button>
      </div>

      {/* Optional URL input (secondary) */}
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="Or paste image URL..." className="text-xs" />

      {/* Media Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowLibrary(false)}>
          <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col m-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-bold">Media Library</h2>
              <Button type="button" variant="ghost" size="sm" onClick={() => setShowLibrary(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search images..."
                  className="pl-9"
                />
              </div>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-4">
              {libraryLoading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="w-8 h-8 animate-spin text-[#C8A97E]" />
                </div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                  <ImageIcon className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>No images found</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {filtered.map((img) => (
                    <button
                      key={img._id}
                      type="button"
                      onClick={() => { onChange(img.imageUrl); setShowLibrary(false); }}
                      className={`group relative rounded-lg border overflow-hidden text-left transition-all hover:ring-2 hover:ring-[#C8A97E] ${
                        value === img.imageUrl ? 'ring-2 ring-[#C8A97E]' : ''
                      }`}
                    >
                      <div className="aspect-square">
                        <img src={img.thumbnailUrl || img.imageUrl} alt={img.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-2 bg-white">
                        <p className="text-xs font-medium truncate">{img.title}</p>
                        <p className="text-xs text-gray-400">
                          {img.dimensions && `${img.dimensions.width}x${img.dimensions.height}`}
                          {img.fileSize && ` · ${formatSize(img.fileSize)}`}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
