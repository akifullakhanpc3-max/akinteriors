'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Star, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/admin/PageHeader';
import { DataTable, Column } from '@/components/admin/DataTable';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { getAdminTestimonials, createTestimonial, updateTestimonial, deleteTestimonial } from '@/lib/actions/admin-actions';

interface TestimonialItem {
  _id: string;
  clientName: string;
  clientTitle?: string;
  company?: string;
  content?: string;
  rating: number;
  avatar?: string;
  isActive?: boolean;
  displayOrder?: number;
}

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<TestimonialItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<TestimonialItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const avatarFileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    clientName: '', clientTitle: '', company: '', content: '', rating: 5, avatar: '', isActive: true, displayOrder: 0,
  });

  const loadTestimonials = useCallback(async (p: number) => {
    setLoading(true);
    const data = await getAdminTestimonials(p) as Record<string, unknown>;
    if (data.success) {
      setTestimonials((data.items || data.testimonials || []) as TestimonialItem[]);
      setTotalPages((data.totalPages as number) || 1);
      setTotalItems((data.total as number) || 0);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadTestimonials(page); }, [page, loadTestimonials]);

  const resetForm = () => {
    setForm({ clientName: '', clientTitle: '', company: '', content: '', rating: 5, avatar: '', isActive: true, displayOrder: 0 });
    setAvatarFile(null);
  };

  const openCreate = () => { resetForm(); setEditing(null); setShowDialog(true); };

  const openEdit = (t: TestimonialItem) => {
    setEditing(t);
    setForm({
      clientName: t.clientName,
      clientTitle: t.clientTitle || '',
      company: t.company || '',
      content: t.content || '',
      rating: t.rating,
      avatar: t.avatar || '',
      isActive: t.isActive ?? true,
      displayOrder: t.displayOrder || 0,
    });
    setAvatarFile(null);
    setShowDialog(true);
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', form.clientName + '-avatar');
    fd.append('category', 'testimonials');
    fd.append('section', 'testimonial-avatars');
    fd.append('altText', `${form.clientName} avatar`);
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
    if (!form.clientName || !form.content) {
      toast({ title: 'Error', description: 'Client name and content are required', variant: 'destructive' });
      return;
    }
    setSaving(true);
    let avatarUrl = form.avatar;
    if (avatarFile) {
      const uploaded = await uploadAvatar(avatarFile);
      if (uploaded) avatarUrl = uploaded;
      else {
        toast({ title: 'Error', description: 'Failed to upload avatar', variant: 'destructive' });
        setSaving(false);
        return;
      }
    }
    const payload = { ...form, avatar: avatarUrl };
    try {
      if (editing) {
        const res = await updateTestimonial(editing._id, payload);
        if (res.success) {
          toast({ title: 'Success', description: 'Testimonial updated' });
          setShowDialog(false);
          loadTestimonials(page);
        } else {
          toast({ title: 'Error', description: res.error || 'Update failed', variant: 'destructive' });
        }
      } else {
        const res = await createTestimonial(payload);
        if (res.success) {
          toast({ title: 'Success', description: 'Testimonial created' });
          setShowDialog(false);
          loadTestimonials(1);
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
    const res = await deleteTestimonial(deleteConfirm._id);
    if (res.success) {
      toast({ title: 'Success', description: 'Testimonial deleted' });
      setDeleteConfirm(null);
      loadTestimonials(page);
    } else {
      toast({ title: 'Error', description: res.error || 'Delete failed', variant: 'destructive' });
    }
  };

  const columns: Column<TestimonialItem>[] = [
    {
      key: 'avatar',
      header: '',
      render: (t) => (
        <div className="w-10 h-10 rounded-full bg-[#C8A97E]/10 flex items-center justify-center">
          <span className="text-[#C8A97E] font-bold">{t.clientName[0]}</span>
        </div>
      ),
      hideHeader: true,
      className: 'w-12',
    },
    {
      key: 'clientName',
      header: 'Client',
      render: (t) => (
        <div>
          <span className="font-medium text-[#111827]">{t.clientName}</span>
          {t.clientTitle && <p className="text-xs text-gray-500">{t.clientTitle}</p>}
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      render: (t) => (
        <div className="flex items-center gap-1">
          {Array.from({ length: t.rating || 5 }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-[#C8A97E] text-[#C8A97E]" />
          ))}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Testimonials"
        description="Manage client testimonials."
        actionLabel="Add Testimonial"
        onAction={openCreate}
      />

      <DataTable
        columns={columns}
        data={testimonials}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteConfirm}
        emptyMessage='No testimonials yet. Click "Add Testimonial" to create one.'
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        keyExtractor={(t) => t._id}
        hideSearch
      />

      <Dialog open={showDialog} onOpenChange={v => { if (!v) { setShowDialog(false); resetForm(); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle>
            <DialogDescription>{editing ? 'Update the testimonial details.' : 'Add a new client testimonial.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Client Name *</Label>
                <Input id="name" value={form.clientName} onChange={e => setForm(p => ({ ...p, clientName: e.target.value }))} placeholder="Client name" />
              </div>
              <div>
                <Label htmlFor="title">Client Title</Label>
                <Input id="title" value={form.clientTitle} onChange={e => setForm(p => ({ ...p, clientTitle: e.target.value }))} placeholder="e.g. CEO" />
              </div>
              <div>
                <Label htmlFor="company">Company</Label>
                <Input id="company" value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))} placeholder="Company name" />
              </div>
              <div>
                <Label htmlFor="rating">Rating</Label>
                <div className="flex items-center gap-1 mt-2">
                  {[1, 2, 3, 4, 5].map(r => (
                    <button key={r} type="button" onClick={() => setForm(p => ({ ...p, rating: r }))}>
                      <Star className={`w-6 h-6 ${r <= form.rating ? 'fill-[#C8A97E] text-[#C8A97E]' : 'text-gray-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="col-span-2">
                <Label>Avatar</Label>
                <div className="flex gap-2 mb-2">
                  <Input value={form.avatar} onChange={e => setForm(p => ({ ...p, avatar: e.target.value }))} placeholder="Image URL..." />
                  <Button type="button" variant="outline" className="shrink-0" onClick={() => avatarFileRef.current?.click()}>
                    <Upload className="w-4 h-4 mr-1" /> Upload
                  </Button>
                </div>
                <input ref={avatarFileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (!f) return; if (f.size > 5 * 1024 * 1024) { toast({ title: 'File too large', description: 'Max 5MB allowed', variant: 'destructive' }); e.target.value = ''; return; } setAvatarFile(f); setForm(p => ({ ...p, avatar: '' })); }} />
                {avatarFile && <p className="text-xs text-green-600">Selected: {avatarFile.name}</p>}
                {(form.avatar || avatarFile) && (
                  <div className="mt-2 relative w-16 h-16 rounded-full overflow-hidden border">
                    <img src={avatarFile ? URL.createObjectURL(avatarFile) : form.avatar} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="content">Content *</Label>
              <Textarea id="content" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="What the client said..." rows={4} />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <Label htmlFor="order">Display Order</Label>
                <Input id="order" type="number" min={0} value={form.displayOrder} onChange={e => setForm(p => ({ ...p, displayOrder: parseInt(e.target.value) || 0 }))} />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch id="active" checked={form.isActive} onCheckedChange={v => setForm(p => ({ ...p, isActive: v }))} />
                <Label htmlFor="active">Active</Label>
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
        title="Delete Testimonial"
        description={`Are you sure you want to delete "${deleteConfirm?.clientName}"? This action cannot be undone.`}
      />
    </div>
  );
}
