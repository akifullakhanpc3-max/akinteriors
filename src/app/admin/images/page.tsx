'use client';

import { useState, useEffect, useCallback, useRef, startTransition } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import {
  Upload, Search, Grid3X3, List, Trash2, Edit3, Eye,
  ImageIcon, FileImage, FolderOpen, Filter,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils/cn';

const CATEGORIES = [
  { value: 'hero', label: 'Hero Section' },
  { value: 'about', label: 'About Section' },
  { value: 'services', label: 'Services Section' },
  { value: 'projects', label: 'Projects Section' },
  { value: 'testimonials', label: 'Testimonials' },
  { value: 'team', label: 'Team Section' },
  { value: 'blog', label: 'Blog Section' },
  { value: 'contact', label: 'Contact Section' },
  { value: 'footer', label: 'Footer Section' },
  { value: 'branding', label: 'Website Branding' },
];

const SECTIONS: Record<string, { value: string; label: string }[]> = {
  hero: [
    { value: 'hero-background', label: 'Hero Background' },
    { value: 'hero-banner', label: 'Hero Banner' },
    { value: 'hero-slider', label: 'Hero Slider Images' },
  ],
  about: [
    { value: 'about-main', label: 'About Main Image' },
    { value: 'about-gallery', label: 'About Gallery Images' },
  ],
  services: [
    { value: 'service-images', label: 'Service Images' },
    { value: 'service-icons', label: 'Service Icons' },
  ],
  projects: [
    { value: 'featured-projects', label: 'Featured Project Images' },
    { value: 'project-gallery', label: 'Project Gallery Images' },
  ],
  testimonials: [
    { value: 'client-photos', label: 'Client Photos' },
  ],
  team: [
    { value: 'team-photos', label: 'Team Member Photos' },
  ],
  blog: [
    { value: 'featured-images', label: 'Featured Images' },
    { value: 'blog-banners', label: 'Blog Banners' },
  ],
  contact: [
    { value: 'contact-banner', label: 'Contact Banner' },
    { value: 'office-images', label: 'Office Images' },
  ],
  footer: [
    { value: 'footer-logo', label: 'Footer Logo' },
    { value: 'partner-logos', label: 'Partner Logos' },
  ],
  branding: [
    { value: 'main-logo', label: 'Main Logo' },
    { value: 'admin-logo', label: 'Admin Logo' },
    { value: 'favicon', label: 'Favicon' },
    { value: 'mobile-logo', label: 'Mobile Logo' },
    { value: 'dark-mode-logo', label: 'Dark Mode Logo' },
    { value: 'og-image', label: 'Open Graph Image' },
  ],
};

interface ImageItem {
  _id: string;
  title: string;
  slug: string;
  category: string;
  section: string;
  altText: string;
  imageUrl: string;
  thumbnailUrl?: string;
  imageType: string;
  fileSize?: number;
  dimensions?: { width: number; height: number };
  displayOrder: number;
  isActive: boolean;
  isBranding: boolean;
  createdAt: string;
}

export default function AdminImagesPage() {
  const { data: session } = useSession();
  const isAdmin = (session?.user as { role?: string } | undefined)?.role === 'admin';

  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 0, page: 1, limit: 20 });
  const [showUpload, setShowUpload] = useState(false);
  const [editingImage, setEditingImage] = useState<ImageItem | null>(null);
  const [previewImage, setPreviewImage] = useState<ImageItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ImageItem | null>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dropFile, setDropFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    section: '',
    altText: '',
    displayOrder: 0,
    isActive: true,
  });

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (categoryFilter) params.set('category', categoryFilter);
    if (sectionFilter) params.set('section', sectionFilter);
    if (search) params.set('search', search);
    params.set('page', String(page));
    params.set('limit', '20');

    const res = await fetch(`/api/admin/images?${params}`);
    const data = await res.json();
    if (data.success) {
      setImages(data.images);
      setPagination(data.pagination);
    }
    setLoading(false);
  }, [categoryFilter, sectionFilter, search, page]);

  useEffect(() => { startTransition(() => { fetchImages(); }); }, [categoryFilter, sectionFilter, search, page]); // eslint-disable-line react-hooks/exhaustive-deps

  const resetForm = () => {
    setFormData({ title: '', category: '', section: '', altText: '', displayOrder: 0, isActive: true });
    setDropFile(null);
  };

  const handleUpload = async () => {
    if (!formData.title || !formData.category || !formData.section) {
      toast({ title: 'Error', description: 'Title, category, and section are required', variant: 'destructive' });
      return;
    }
    if (!dropFile) {
      toast({ title: 'Error', description: 'Please select a file', variant: 'destructive' });
      return;
    }

    setUploadProgress(true);
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('category', formData.category);
    fd.append('section', formData.section);
    fd.append('altText', formData.altText);
    fd.append('displayOrder', String(formData.displayOrder));
    fd.append('isActive', String(formData.isActive));
    fd.append('file', dropFile);

    try {
      const res = await fetch('/api/admin/images', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Success', description: 'Image uploaded successfully', variant: 'success' });
        setShowUpload(false);
        resetForm();
        fetchImages();
      } else {
        toast({ title: 'Error', description: data.error || 'Upload failed', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Upload failed', variant: 'destructive' });
    } finally {
      setUploadProgress(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingImage) return;
    if (!formData.title || !formData.category || !formData.section) {
      toast({ title: 'Error', description: 'Title, category, and section are required', variant: 'destructive' });
      return;
    }

    setUploadProgress(true);
    const fd = new FormData();
    fd.append('title', formData.title);
    fd.append('category', formData.category);
    fd.append('section', formData.section);
    fd.append('altText', formData.altText);
    fd.append('displayOrder', String(formData.displayOrder));
    fd.append('isActive', String(formData.isActive));
    if (dropFile) fd.append('file', dropFile);

    try {
      const res = await fetch(`/api/admin/images/${editingImage._id}`, {
        method: 'PUT',
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Success', description: 'Image updated successfully', variant: 'success' });
        setEditingImage(null);
        resetForm();
        fetchImages();
      } else {
        toast({ title: 'Error', description: data.error || 'Update failed', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Update failed', variant: 'destructive' });
    } finally {
      setUploadProgress(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    if (!isAdmin) {
      toast({ title: 'Error', description: 'Only admins can delete images', variant: 'destructive' });
      return;
    }

    try {
      const res = await fetch(`/api/admin/images/${deleteConfirm._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success) {
        toast({ title: 'Success', description: 'Image deleted', variant: 'success' });
        setDeleteConfirm(null);
        fetchImages();
      } else {
        toast({ title: 'Error', description: data.error || 'Delete failed', variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Delete failed', variant: 'destructive' });
    }
  };

  const openEdit = (image: ImageItem) => {
    setEditingImage(image);
    setFormData({
      title: image.title,
      category: image.category,
      section: image.section,
      altText: image.altText || '',
      displayOrder: image.displayOrder || 0,
      isActive: image.isActive,
    });
    setDropFile(null);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && ['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setDropFile(file);
    } else {
      toast({ title: 'Error', description: 'Only JPG, PNG, WebP files allowed', variant: 'destructive' });
    }
  };

  const formatSize = (bytes?: number) => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">Website Images</h1>
          <p className="text-gray-500 mt-1">Manage all website images in one place</p>
        </div>
        <Button onClick={() => { resetForm(); setShowUpload(true); }}>
          <Upload className="w-4 h-4 mr-2" />
          Upload Image
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search images..."
                value={search}
                onChange={e => { setSearch(e.target.value); setPage(1); }}
                className="pl-9"
              />
            </div>
            <Select value={categoryFilter} onValueChange={v => { setCategoryFilter(v); setSectionFilter(''); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-44">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map(c => (
                  <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {categoryFilter && categoryFilter !== 'all' && (
              <Select value={sectionFilter} onValueChange={v => { setSectionFilter(v); setPage(1); }}>
                <SelectTrigger className="w-full sm:w-44">
                  <SelectValue placeholder="All Sections" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Sections</SelectItem>
                  {(SECTIONS[categoryFilter] || []).map(s => (
                    <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg self-start">
              <button
                onClick={() => setView('grid')}
                className={cn('p-2 rounded-md transition-colors', view === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200')}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setView('list')}
                className={cn('p-2 rounded-md transition-colors', view === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200')}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <ImageIcon className="w-4 h-4" />
          {pagination.total} total images
        </span>
        <span className="flex items-center gap-1">
          <FolderOpen className="w-4 h-4" />
          {CATEGORIES.filter(c => images.some(i => i.category === c.value)).length} categories
        </span>
      </div>

      {/* Image Grid/List */}
      {loading ? (
        view === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-0">
                  <Skeleton className="aspect-[4/3] rounded-t-lg" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-lg border">
                <Skeleton className="w-16 h-12 rounded" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )
      ) : images.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <FileImage className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-500 mb-2">No images found</h3>
            <p className="text-sm text-gray-400 mb-6">Upload your first image to get started</p>
            <Button onClick={() => { resetForm(); setShowUpload(true); }}>
              <Upload className="w-4 h-4 mr-2" />
              Upload Image
            </Button>
          </CardContent>
        </Card>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map(image => (
            <Card key={image._id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="relative aspect-[4/3] bg-gray-100">
                  <Image
                    src={image.thumbnailUrl || image.imageUrl}
                    alt={image.altText || image.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => setPreviewImage(image)}
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => openEdit(image)}
                      className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    {isAdmin && !image.isBranding && (
                      <button
                        onClick={() => setDeleteConfirm(image)}
                        className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors text-red-500"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  {image.isBranding && (
                    <Badge className="absolute top-2 left-2 bg-purple-500 text-white text-[10px]">
                      Branding
                    </Badge>
                  )}
                  {!image.isActive && (
                    <Badge className="absolute top-2 right-2 bg-gray-500 text-white text-[10px]">
                      Hidden
                    </Badge>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{image.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-[10px]">
                      {CATEGORIES.find(c => c.value === image.category)?.label || image.category}
                    </Badge>
                    <span className="text-[10px] text-gray-400">{image.imageType.toUpperCase()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {images.map(image => (
            <div
              key={image._id}
              className="flex items-center gap-4 p-4 bg-white rounded-lg border hover:border-[#C8A97E]/30 transition-colors group"
            >
              <div className="relative w-16 h-12 rounded overflow-hidden bg-gray-100 shrink-0">
                <Image
                  src={image.thumbnailUrl || image.imageUrl}
                  alt={image.altText || image.title}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{image.title}</p>
                <p className="text-xs text-gray-500 truncate">
                  {CATEGORIES.find(c => c.value === image.category)?.label || image.category}
                  {image.dimensions && ` • ${image.dimensions.width}x${image.dimensions.height}`}
                  {image.fileSize && ` • ${formatSize(image.fileSize)}`}
                </p>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => setPreviewImage(image)}
                  className="p-1.5 rounded hover:bg-gray-100"
                >
                  <Eye className="w-4 h-4 text-gray-500" />
                </button>
                <button
                  onClick={() => openEdit(image)}
                  className="p-1.5 rounded hover:bg-gray-100"
                >
                  <Edit3 className="w-4 h-4 text-gray-500" />
                </button>
                {isAdmin && !image.isBranding && (
                  <button
                    onClick={() => setDeleteConfirm(image)}
                    className="p-1.5 rounded hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </button>
                )}
              </div>
              <Badge variant={image.isActive ? 'default' : 'secondary'} className="hidden sm:inline-flex">
                {image.isActive ? 'Active' : 'Hidden'}
              </Badge>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.pages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage(p => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page >= pagination.pages}
              onClick={() => setPage(p => p + 1)}
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Upload Image</DialogTitle>
            <DialogDescription>Upload a new image to the website library</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div
              className={cn(
                'border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer',
                dragging ? 'border-[#C8A97E] bg-[#C8A97E]/5' : 'border-gray-300 hover:border-gray-400'
              )}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              {dropFile ? (
                <div className="space-y-2">
                  <FileImage className="w-10 h-10 mx-auto text-[#C8A97E]" />
                  <p className="text-sm font-medium">{dropFile.name}</p>
                  <p className="text-xs text-gray-500">{(dropFile.size / 1024).toFixed(1)} KB</p>
                  <button
                    onClick={e => { e.stopPropagation(); setDropFile(null); }}
                    className="text-xs text-red-500 hover:text-red-600"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-10 h-10 mx-auto text-gray-400" />
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-[#C8A97E]">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-400">JPG, PNG, WebP (max 5MB)</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) setDropFile(file);
                }}
              />
            </div>

            <div className="space-y-3">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                  placeholder="Image title"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={v => setFormData(p => ({ ...p, category: v, section: '' }))}
                  >
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map(c => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="section">Section *</Label>
                  <Select
                    value={formData.section}
                    onValueChange={v => setFormData(p => ({ ...p, section: v }))}
                    disabled={!formData.category}
                  >
                    <SelectTrigger id="section">
                      <SelectValue placeholder={formData.category ? 'Select' : 'Pick category first'} />
                    </SelectTrigger>
                    <SelectContent>
                      {(SECTIONS[formData.category] || []).map(s => (
                        <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="altText">Alt Text</Label>
                <Textarea
                  id="altText"
                  value={formData.altText}
                  onChange={e => setFormData(p => ({ ...p, altText: e.target.value }))}
                  placeholder="Describe the image for SEO"
                  rows={2}
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <Label htmlFor="order">Display Order</Label>
                  <Input
                    id="order"
                    type="number"
                    min={0}
                    value={formData.displayOrder}
                    onChange={e => setFormData(p => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))}
                  />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch
                    id="active"
                    checked={formData.isActive}
                    onCheckedChange={v => setFormData(p => ({ ...p, isActive: v }))}
                  />
                  <Label htmlFor="active">Active</Label>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowUpload(false); resetForm(); }}>
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={uploadProgress}>
              {uploadProgress ? 'Uploading...' : 'Upload'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={!!editingImage} onOpenChange={v => { if (!v) { setEditingImage(null); resetForm(); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Image</DialogTitle>
            <DialogDescription>Update image details or replace the file</DialogDescription>
          </DialogHeader>
          {editingImage && (
            <div className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={editingImage.imageUrl}
                  alt={editingImage.altText || editingImage.title}
                  fill
                  className="object-contain"
                  sizes="400px"
                />
              </div>

              <div
                className={cn(
                  'border-2 border-dashed rounded-lg p-4 text-center transition-colors cursor-pointer',
                  dragging ? 'border-[#C8A97E] bg-[#C8A97E]/5' : 'border-gray-300 hover:border-gray-400'
                )}
                onDragOver={e => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                {dropFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{dropFile.name}</p>
                    <button onClick={e => { e.stopPropagation(); setDropFile(null); }} className="text-xs text-red-500">Remove</button>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">
                    <span className="text-[#C8A97E] font-medium">Click</span> to replace image
                  </p>
                )}
                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) setDropFile(file);
                }} />
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="edit-title">Title *</Label>
                  <Input id="edit-title" value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label>Category</Label>
                    <Select value={formData.category} onValueChange={v => setFormData(p => ({ ...p, category: v, section: '' }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Section</Label>
                    <Select value={formData.section} onValueChange={v => setFormData(p => ({ ...p, section: v }))} disabled={!formData.category}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {(SECTIONS[formData.category] || []).map(s => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Alt Text</Label>
                  <Textarea value={formData.altText} onChange={e => setFormData(p => ({ ...p, altText: e.target.value }))} rows={2} />
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label>Display Order</Label>
                    <Input type="number" min={0} value={formData.displayOrder} onChange={e => setFormData(p => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))} />
                  </div>
                  <div className="flex items-center gap-2 pt-6">
                    <Switch id="edit-active" checked={formData.isActive} onCheckedChange={v => setFormData(p => ({ ...p, isActive: v }))} />
                    <Label htmlFor="edit-active">Active</Label>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => { setEditingImage(null); resetForm(); }}>Cancel</Button>
            <Button onClick={handleUpdate} disabled={uploadProgress}>
              {uploadProgress ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={!!previewImage} onOpenChange={v => { if (!v) setPreviewImage(null); }}>
        <DialogContent className="max-w-3xl">
          {previewImage && (
            <>
              <DialogHeader>
                <DialogTitle>{previewImage.title}</DialogTitle>
              </DialogHeader>
              <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
                <Image
                  src={previewImage.imageUrl}
                  alt={previewImage.altText || previewImage.title}
                  fill
                  className="object-contain"
                  sizes="800px"
                />
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 text-xs">Category</p>
                  <p className="font-medium">{CATEGORIES.find(c => c.value === previewImage.category)?.label || previewImage.category}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Dimensions</p>
                  <p className="font-medium">{previewImage.dimensions ? `${previewImage.dimensions.width}x${previewImage.dimensions.height}` : 'N/A'}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">File Size</p>
                  <p className="font-medium">{formatSize(previewImage.fileSize)}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-xs">Type</p>
                  <p className="font-medium uppercase">{previewImage.imageType}</p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={!!deleteConfirm} onOpenChange={v => { if (!v) setDeleteConfirm(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete &ldquo;{deleteConfirm?.title}&rdquo;? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
