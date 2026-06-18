'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Upload, FileImage } from 'lucide-react';
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
import { StatusBadge } from '@/components/admin/StatusBadge';
import { getAdminServices, createService, updateService, deleteService } from '@/lib/actions/admin-actions';

interface ServiceItem {
  _id: string;
  title: string;
  description: string;
  content?: string;
  image?: string;
  icon: string;
  displayOrder: number;
  isActive?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ICON_OPTIONS = [
  'Award', 'Target', 'Eye', 'Users', 'Star', 'Gem', 'Clock', 'Monitor',
  'CheckCircle2', 'Globe', 'Camera', 'Briefcase', 'Play', 'Home', 'Building2',
  'CookingPot', 'Hammer', 'Heart', 'Shield', 'Lightbulb', 'Rocket',
  'Palette', 'Search', 'Share2', 'Menu', 'Layout', 'FileText', 'Mail',
  'MapPin', 'Phone', 'MessageCircle', 'ArrowRight', 'ChevronDown',
  'Sofa', 'BedDouble', 'Armchair', 'ClipboardCheck', 'Ruler',
  'Facebook', 'Instagram', 'Linkedin', 'Twitter', 'Youtube', 'Pinterest', 'Threads',
];

export default function AdminServices() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<ServiceItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<ServiceItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [iconType, setIconType] = useState<'name' | 'svg'>('name');
  const [svgFile, setSvgFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const imageFileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ title: '', description: '', content: '', image: '', icon: '', displayOrder: 0, isActive: true });

  const loadServices = useCallback(async (p: number) => {
    setLoading(true);
    const data = await getAdminServices(p) as Record<string, unknown>;
    if (data.success) {
      setServices((data.items || data.services || []) as ServiceItem[]);
      setTotalPages((data.totalPages as number) || 1);
      setTotalItems((data.total as number) || 0);
    }
    setLoading(false);
  }, []);

  useEffect(() => { loadServices(page); }, [page, loadServices]);

  const resetForm = () => {
    setForm({ title: '', description: '', content: '', image: '', icon: '', displayOrder: 0, isActive: true });
    setIconType('name');
    setSvgFile(null);
    setImageFile(null);
  };

  const openCreate = () => { resetForm(); setEditing(null); setShowDialog(true); };

  const openEdit = (service: ServiceItem) => {
    setEditing(service);
    const isUrl = service.icon.startsWith('http') || service.icon.startsWith('/');
    setIconType(isUrl ? 'svg' : 'name');
    setForm({
      title: service.title,
      description: service.description,
      content: service.content || '',
      image: service.image || '',
      icon: isUrl ? '' : service.icon,
      displayOrder: service.displayOrder,
      isActive: service.isActive ?? true,
    });
    setSvgFile(null);
    setImageFile(null);
    setShowDialog(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.description) {
      toast({ title: 'Error', description: 'Title and description are required', variant: 'destructive' });
      return;
    }
    if (iconType === 'name' && !form.icon) {
      toast({ title: 'Error', description: 'Please select an icon or upload an SVG', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
      let iconValue = form.icon;
      if (iconType === 'svg' && svgFile) {
        const fd = new FormData();
        fd.append('file', svgFile);
        fd.append('title', form.title + '-icon');
        fd.append('category', 'services');
        fd.append('section', 'service-icons');
        fd.append('altText', `${form.title} icon`);
        fd.append('displayOrder', '0');
        fd.append('isActive', 'true');
        const res = await fetch('/api/admin/images', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success) iconValue = data.image.imageUrl;
        else {
          toast({ title: 'Error', description: data.error || 'Failed to upload SVG icon', variant: 'destructive' });
          setSaving(false);
          return;
        }
      }

      let imageUrl = form.image;
      if (imageFile) {
        const fd = new FormData();
        fd.append('file', imageFile);
        fd.append('title', form.title + '-image');
        fd.append('category', 'services');
        fd.append('section', 'service-images');
        fd.append('altText', `${form.title} image`);
        fd.append('displayOrder', '0');
        fd.append('isActive', 'true');
        const res = await fetch('/api/admin/images', { method: 'POST', body: fd });
        const data = await res.json();
        if (data.success) imageUrl = data.image.imageUrl;
      }

      const payload = { ...form, icon: iconValue, image: imageUrl };

      if (editing) {
        const res = await updateService(editing._id, payload);
        if (res.success) {
          toast({ title: 'Success', description: 'Service updated' });
          setShowDialog(false);
          loadServices(page);
        } else {
          toast({ title: 'Error', description: res.error || 'Update failed', variant: 'destructive' });
        }
      } else {
        const res = await createService(payload);
        if (res.success) {
          toast({ title: 'Success', description: 'Service created' });
          setShowDialog(false);
          loadServices(1);
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
    const res = await deleteService(deleteConfirm._id);
    if (res.success) {
      toast({ title: 'Success', description: 'Service deleted' });
      setDeleteConfirm(null);
      loadServices(page);
    } else {
      toast({ title: 'Error', description: res.error || 'Delete failed', variant: 'destructive' });
    }
  };

  const isUrl = (v: string) => v.startsWith('http') || v.startsWith('/');

  const columns: Column<ServiceItem>[] = [
    {
      key: 'icon',
      header: '',
      render: (s) => (
        <div className="w-10 h-10 rounded-xl bg-[#C8A97E]/10 flex items-center justify-center shrink-0">
          {isUrl(s.icon) ? (
            <img src={s.icon} alt="" className="w-6 h-6" />
          ) : (
            <span className="text-sm font-bold text-[#C8A97E]">{s.icon[0]}</span>
          )}
        </div>
      ),
      hideHeader: true,
      className: 'w-12',
    },
    { key: 'title', header: 'Title', render: (s) => <span className="font-medium text-[#111827]">{s.title}</span> },
    {
      key: 'displayOrder', header: 'Order',
      render: (s) => <span className="text-sm text-gray-500">{s.displayOrder}</span>,
    },
    { key: 'isActive', header: 'Status', render: (s) => <StatusBadge status={s.isActive ? 'active' : 'inactive'} /> },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        description="Manage your service offerings."
        actionLabel="Add Service"
        onAction={openCreate}
      />

      <DataTable
        columns={columns}
        data={services}
        loading={loading}
        onEdit={openEdit}
        onDelete={setDeleteConfirm}
        emptyMessage='No services yet. Click "Add Service" to create one.'
        page={page}
        totalPages={totalPages}
        totalItems={totalItems}
        onPageChange={setPage}
        keyExtractor={(s) => s._id}
        hideSearch
      />

      <Dialog open={showDialog} onOpenChange={v => { if (!v) { setShowDialog(false); resetForm(); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Service' : 'Add Service'}</DialogTitle>
            <DialogDescription>{editing ? 'Update the service details.' : 'Create a new service offering.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pr-1">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input id="title" value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Service name" />
            </div>
            <div>
              <Label htmlFor="desc">Description *</Label>
              <Textarea id="desc" value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Brief description" rows={3} />
            </div>
            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea id="content" value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} placeholder="Full content (optional)" rows={4} />
            </div>

            <div>
              <Label>Icon</Label>
              <div className="flex gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => setIconType('name')}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${iconType === 'name' ? 'bg-[#C8A97E] text-white border-[#C8A97E]' : 'bg-white text-gray-600 border-gray-200'}`}
                >
                  Icon Name
                </button>
                <button
                  type="button"
                  onClick={() => setIconType('svg')}
                  className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${iconType === 'svg' ? 'bg-[#C8A97E] text-white border-[#C8A97E]' : 'bg-white text-gray-600 border-gray-200'}`}
                >
                  Upload SVG
                </button>
              </div>
              {iconType === 'name' ? (
                <Select value={form.icon} onValueChange={v => setForm(p => ({ ...p, icon: v }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select icon" />
                  </SelectTrigger>
                  <SelectContent>
                    {ICON_OPTIONS.map(name => (
                      <SelectItem key={name} value={name}>{name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div
                  className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-[#C8A97E] transition-colors"
                  onClick={() => document.getElementById('svg-upload')?.click()}
                >
                  {svgFile ? (
                    <div className="space-y-1">
                      <FileImage className="w-8 h-8 mx-auto text-[#C8A97E]" />
                      <p className="text-sm font-medium">{svgFile.name}</p>
                      <button type="button" onClick={e => { e.stopPropagation(); setSvgFile(null); }} className="text-xs text-red-500">Remove</button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-8 h-8 mx-auto text-gray-400" />
                      <p className="text-sm text-gray-500">Click to upload SVG icon</p>
                    </div>
                  )}
                  <input
                    id="svg-upload"
                    type="file"
                    accept="image/svg+xml,.svg"
                    className="hidden"
                    onChange={e => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > MAX_FILE_SIZE) {
                          toast({ title: 'File too large', description: 'Max 5MB allowed', variant: 'destructive' });
                          e.target.value = '';
                          return;
                        }
                        setSvgFile(file);
                      }
                    }}
                  />
                </div>
              )}
            </div>

            <div className="col-span-2">
              <Label>Image</Label>
              <div className="flex gap-2 mb-2">
                <Input value={form.image} onChange={e => setForm(p => ({ ...p, image: e.target.value }))} placeholder="Image URL..." />
                <Button type="button" variant="outline" className="shrink-0" onClick={() => imageFileRef.current?.click()}>
                  <Upload className="w-4 h-4 mr-1" /> Upload
                </Button>
              </div>
              <input ref={imageFileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (!f) return; if (f.size > MAX_FILE_SIZE) { toast({ title: 'File too large', description: 'Max 5MB allowed', variant: 'destructive' }); e.target.value = ''; return; } setImageFile(f); setForm(p => ({ ...p, image: '' })); }} />
              {imageFile && <p className="text-xs text-green-600">Selected: {imageFile.name}</p>}
              {(form.image || imageFile) && (
                <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border">
                  <img src={imageFile ? URL.createObjectURL(imageFile) : form.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
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
        title="Delete Service"
        description={`Are you sure you want to delete "${deleteConfirm?.title}"? This action cannot be undone.`}
      />
    </div>
  );
}
