'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { getAdminProjects, createProject, updateProject, deleteProject } from '@/lib/actions/admin-actions';

interface ProjectItem {
  _id: string;
  title: string;
  description?: string;
  content?: string;
  categories: string[];
  status: 'draft' | 'published';
  featured?: boolean;
  coverImage?: string;
  images?: string[];
  location?: string;
  area?: string;
  duration?: string;
  clientName?: string;
}

const CATEGORY_OPTIONS = ['Residential', 'Commercial', 'Kitchen', 'Living Room', 'Bedroom', 'Office'];

export default function AdminProjects() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<ProjectItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ProjectItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const coverFileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    title: '', description: '', content: '', categories: [] as string[],
    status: 'draft' as 'draft' | 'published', featured: false,
    coverImage: '', location: '', area: '', duration: '', clientName: '',
  });

  const loadProjects = useCallback(async (p: number) => {
    setLoading(true);
    const data = await getAdminProjects(p) as Record<string, unknown>;
    if (data.success) {
      setProjects((data.items || data.projects || []) as ProjectItem[]);
      setTotalPages((data.totalPages as number) || 1);
      setTotalItems((data.total as number) || 0);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadProjects(page); }, [page, loadProjects]);

  const resetForm = () => {
    setForm({
      title: '', description: '', content: '', categories: [],
      status: 'draft', featured: false,
      coverImage: '', location: '', area: '', duration: '', clientName: '',
    });
    setCoverFile(null);
  };

  const openCreate = () => { resetForm(); setEditing(null); setShowDialog(true); };

  const openEdit = (project: ProjectItem) => {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description || '',
      content: project.content || '',
      categories: project.categories || [],
      status: project.status,
      featured: project.featured || false,
      coverImage: project.coverImage || '',
      location: project.location || '',
      area: project.area || '',
      duration: project.duration || '',
      clientName: project.clientName || '',
    });
    setCoverFile(null);
    setShowDialog(true);
  };

  const uploadImage = async (file: File, name: string): Promise<string | null> => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', name);
    fd.append('category', 'projects');
    fd.append('section', 'project-images');
    fd.append('altText', name);
    fd.append('displayOrder', '0');
    fd.append('isActive', 'true');
    try {
      const res = await fetch('/api/admin/images', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) return data.image.imageUrl;
    } catch { /* ignore */ }
    return null;
  };

  const handleSave = async () => {
    if (!form.title || !form.description) {
      toast({ title: 'Error', description: 'Title and description are required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    let coverUrl = form.coverImage;
    if (coverFile) {
      const uploaded = await uploadImage(coverFile, form.title + '-cover');
      if (uploaded) coverUrl = uploaded;
      else {
        toast({ title: 'Error', description: 'Failed to upload cover image', variant: 'destructive' });
        setSaving(false);
        return;
      }
    }
    const payload = { ...form, coverImage: coverUrl };
    try {
      if (editing) {
        const res = await updateProject(editing._id, payload);
        if (res.success) {
          toast({ title: 'Success', description: 'Project updated' });
          setShowDialog(false);
          loadProjects(page);
        } else {
          toast({ title: 'Error', description: res.error || 'Update failed', variant: 'destructive' });
        }
      } else {
        const res = await createProject(payload);
        if (res.success) {
          toast({ title: 'Success', description: 'Project created' });
          setShowDialog(false);
          loadProjects(1);
          setPage(1);
        } else {
          toast({ title: 'Error', description: res.error || 'Creation failed', variant: 'destructive' });
        }
      }
    } catch {
      toast({ title: 'Error', description: 'Operation failed', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    const res = await deleteProject(deleteConfirm._id);
    if (res.success) {
      toast({ title: 'Success', description: 'Project deleted' });
      setDeleteConfirm(null);
      loadProjects(page);
    } else {
      toast({ title: 'Error', description: res.error || 'Delete failed', variant: 'destructive' });
    }
  };

  const filtered = search
    ? projects.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
    : projects;

  const columns: Column<ProjectItem>[] = [
    {
      key: 'coverImage',
      header: '',
      render: (p) => p.coverImage ? (
        <div className="w-10 h-8 rounded overflow-hidden border">
          <img src={p.coverImage} alt="" className="w-full h-full object-cover" />
        </div>
      ) : <div className="w-10 h-8 rounded bg-gray-100" />,
      className: 'w-12',
      hideHeader: true,
    },
    { key: 'title', header: 'Title', render: (p) => <span className="font-medium text-[#111827]">{p.title}</span> },
    { key: 'categories', header: 'Category', render: (p) => <span className="text-sm text-gray-500">{p.categories?.[0] || '-'}</span> },
    { key: 'status', header: 'Status', render: (p) => <Badge variant={p.status === 'published' ? 'default' : 'secondary'}>{p.status}</Badge> },
    {
      key: 'featured',
      header: 'Featured',
      render: (p) => p.featured ? <Badge variant="default">Featured</Badge> : <span className="text-sm text-gray-400">No</span>,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects"
        description="Manage your portfolio projects."
        actionLabel="Add Project"
        onAction={openCreate}
      />

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        searchValue={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        searchPlaceholder="Search projects..."
        onEdit={openEdit}
        onDelete={setDeleteConfirm}
        emptyMessage="No projects found."
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        keyExtractor={(p) => p._id}
      />

      <Dialog open={showDialog} onOpenChange={v => { if (!v) { setShowDialog(false); resetForm(); } }}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Project' : 'Add Project'}</DialogTitle>
            <DialogDescription>{editing ? 'Update the project details.' : 'Create a new portfolio project.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Project name" />
              </div>
              <div className="col-span-2">
                <Label htmlFor="desc">Description *</Label>
                <Textarea id="desc" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description" rows={3} />
              </div>
              <div className="col-span-2">
                <Label htmlFor="content">Content</Label>
                <Textarea id="content" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Full project content (optional)" rows={5} />
              </div>
              <div className="col-span-2">
                <Label>Categories</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {CATEGORY_OPTIONS.map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm(p => ({
                        ...p,
                        categories: p.categories.includes(cat)
                          ? p.categories.filter(c => c !== cat)
                          : [...p.categories, cat],
                      }))}
                      className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
                        form.categories.includes(cat)
                          ? 'bg-[#C8A97E] text-white border-[#C8A97E]'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={form.status} onValueChange={v => setForm(p => ({ ...p, status: v as 'draft' | 'published' }))}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch id="featured" checked={form.featured} onCheckedChange={v => setForm(p => ({ ...p, featured: v }))} />
                <Label htmlFor="featured">Featured</Label>
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input id="location" value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))} placeholder="City, State" />
              </div>
              <div>
                <Label htmlFor="area">Area</Label>
                <Input id="area" value={form.area} onChange={e => setForm(p => ({ ...p, area: e.target.value }))} placeholder="e.g. 1500 sq.ft" />
              </div>
              <div>
                <Label htmlFor="duration">Duration</Label>
                <Input id="duration" value={form.duration} onChange={e => setForm(p => ({ ...p, duration: e.target.value }))} placeholder="e.g. 3 months" />
              </div>
              <div>
                <Label htmlFor="client">Client Name</Label>
                <Input id="client" value={form.clientName} onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))} placeholder="Client name" />
              </div>
              <div className="col-span-2">
                <Label>Cover Image</Label>
                <div className="flex gap-2 mb-2">
                  <Input value={form.coverImage} onChange={e => setForm(p => ({ ...p, coverImage: e.target.value }))} placeholder="Image URL..." />
                  <Button type="button" variant="outline" className="shrink-0" onClick={() => coverFileRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-1" /> Upload
                  </Button>
                </div>
                <input ref={coverFileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (!f) return; if (f.size > 5 * 1024 * 1024) { toast({ title: 'File too large', description: 'Max 5MB allowed', variant: 'destructive' }); e.target.value = ''; return; } setCoverFile(f); setForm(p => ({ ...p, coverImage: '' })); }} />
                {coverFile && <p className="text-xs text-green-600">Selected: {coverFile.name}</p>}
                {(form.coverImage || coverFile) && (
                  <div className="mt-2 relative w-40 h-28 rounded-lg overflow-hidden border">
                    <img src={coverFile ? URL.createObjectURL(coverFile) : form.coverImage} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setShowDialog(false); resetForm(); }}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>{saving ? 'Saving...' : editing ? 'Update' : 'Create'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteConfirm}
        onOpenChange={(v) => { if (!v) setDeleteConfirm(null); }}
        onConfirm={handleDelete}
        title="Delete Project"
        description={`Are you sure you want to delete "${deleteConfirm?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
