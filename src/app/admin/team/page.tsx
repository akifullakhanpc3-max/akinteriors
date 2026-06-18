'use client';

import { useState, useEffect, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent } from '@/components/ui/card';
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
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';
import { StatusBadge } from '@/components/admin/StatusBadge';
import { SearchInput } from '@/components/admin/SearchInput';
import { getAdminTeamMembers, createTeamMember, updateTeamMember, deleteTeamMember } from '@/lib/actions/admin-actions';

interface TeamMemberItem {
  _id: string;
  name: string;
  role: string;
  bio?: string;
  avatar?: string;
  email?: string;
  socialLinks?: { linkedin?: string; twitter?: string; instagram?: string };
  isActive?: boolean;
  displayOrder?: number;
}

export default function AdminTeam() {
  const [members, setMembers] = useState<TeamMemberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [editing, setEditing] = useState<TeamMemberItem | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<TeamMemberItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [form, setForm] = useState({
    name: '', role: '', bio: '', avatar: '', email: '',
    socialLinks: { linkedin: '', twitter: '', instagram: '' },
    isActive: true, displayOrder: 0,
  });

  const loadMembers = useCallback(async () => {
    setLoading(true);
    const data = await getAdminTeamMembers();
    if (data.success) setMembers(data.members);
    setLoading(false);
  }, []);

  useEffect(() => { loadMembers(); }, [loadMembers]);

  const resetForm = () => {
    setForm({
      name: '', role: '', bio: '', avatar: '', email: '',
      socialLinks: { linkedin: '', twitter: '', instagram: '' },
      isActive: true, displayOrder: 0,
    });
    setAvatarFile(null);
  };

  const openCreate = () => { resetForm(); setEditing(null); setShowDialog(true); };

  const openEdit = (m: TeamMemberItem) => {
    setEditing(m);
    setForm({
      name: m.name,
      role: m.role,
      bio: m.bio || '',
      avatar: m.avatar || '',
      email: m.email || '',
      socialLinks: {
        linkedin: m.socialLinks?.linkedin || '',
        twitter: m.socialLinks?.twitter || '',
        instagram: m.socialLinks?.instagram || '',
      },
      isActive: m.isActive ?? true,
      displayOrder: m.displayOrder || 0,
    });
    setAvatarFile(null);
    setShowDialog(true);
  };

  const uploadAvatar = async (file: File): Promise<string | null> => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', form.name + '-avatar');
    fd.append('category', 'team');
    fd.append('section', 'team-photos');
    fd.append('altText', `${form.name} avatar`);
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
    if (!form.name || !form.role || !form.bio) {
      toast({ title: 'Error', description: 'Name, role, and bio are required', variant: 'destructive' });
      return;
    }

    setSaving(true);
    try {
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

      if (editing) {
        const res = await updateTeamMember(editing._id, payload);
        if (res.success) {
          toast({ title: 'Success', description: 'Team member updated' });
          setShowDialog(false);
          loadMembers();
        } else {
          toast({ title: 'Error', description: res.error || 'Update failed', variant: 'destructive' });
        }
      } else {
        const res = await createTeamMember(payload);
        if (res.success) {
          toast({ title: 'Success', description: 'Team member created' });
          setShowDialog(false);
          loadMembers();
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
    const res = await deleteTeamMember(deleteConfirm._id);
    if (res.success) {
      toast({ title: 'Success', description: 'Team member deleted' });
      setDeleteConfirm(null);
      loadMembers();
    } else {
      toast({ title: 'Error', description: res.error || 'Delete failed', variant: 'destructive' });
    }
  };

  const filtered = search
    ? members.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.role.toLowerCase().includes(search.toLowerCase()))
    : members;

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Team" description="Manage team members." actionLabel="Add Member" onAction={openCreate} />
        <Card>
          <CardContent className="py-20 text-center text-gray-500">Loading...</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Team" description="Manage team members." actionLabel="Add Member" onAction={openCreate} />

      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-sm">
          <SearchInput value={search} onChange={setSearch} placeholder="Search team members..." />
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-500">No team members found.</div>
        )}
        {filtered.map((member) => (
          <Card key={member._id} className="group">
            <CardContent className="p-6">
              <div className="w-16 h-16 rounded-full bg-[#C8A97E]/10 flex items-center justify-center mx-auto mb-4 overflow-hidden">
                {member.avatar ? (
                  <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl font-bold text-[#C8A97E]">{member.name[0]}</span>
                )}
              </div>
              <h3 className="text-center font-bold text-[#111827]">{member.name}</h3>
              <p className="text-center text-sm text-gray-500 mb-2">{member.role}</p>
              <div className="text-center mb-4">
                {member.isActive === false && <StatusBadge status="inactive" />}
              </div>
              <div className="flex justify-center gap-2">
                <button onClick={() => openEdit(member)} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">Edit</button>
                <button onClick={() => setDeleteConfirm(member)} className="px-3 py-1.5 text-sm bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">Delete</button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={showDialog} onOpenChange={v => { if (!v) { setShowDialog(false); resetForm(); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? 'Edit Team Member' : 'Add Team Member'}</DialogTitle>
            <DialogDescription>{editing ? 'Update the team member details.' : 'Add a new team member.'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input id="name" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Full name" />
              </div>
              <div>
                <Label htmlFor="role">Role *</Label>
                <Input id="role" value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))} placeholder="e.g. Designer" />
              </div>
            </div>
            <div>
              <Label htmlFor="bio">Bio *</Label>
              <Textarea id="bio" value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Brief bio" rows={3} />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} placeholder="email@example.com" />
            </div>
            <div>
              <Label>Avatar</Label>
              <div
                className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-[#C8A97E] transition-colors mt-1"
                onClick={() => document.getElementById('avatar-upload')?.click()}
              >
                {avatarFile ? (
                  <div className="space-y-1">
                    <img src={URL.createObjectURL(avatarFile)} alt="" className="w-12 h-12 rounded-full mx-auto object-cover" />
                    <p className="text-sm font-medium">{avatarFile.name}</p>
                    <button type="button" onClick={e => { e.stopPropagation(); setAvatarFile(null); }} className="text-xs text-red-500">Remove</button>
                  </div>
                ) : form.avatar ? (
                  <div className="space-y-1">
                    <img src={form.avatar} alt="" className="w-12 h-12 rounded-full mx-auto object-cover" />
                    <p className="text-xs text-gray-400">Current avatar</p>
                    <p className="text-xs text-[#C8A97E]">Click to replace</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <Upload className="w-8 h-8 mx-auto text-gray-400" />
                    <p className="text-sm text-gray-500">Click to upload avatar</p>
                  </div>
                )}
                <input id="avatar-upload" type="file" accept="image/*" className="hidden" onChange={e => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  if (file.size > 5 * 1024 * 1024) {
                    toast({ title: 'File too large', description: 'Max 5MB allowed', variant: 'destructive' });
                    e.target.value = '';
                    return;
                  }
                  setAvatarFile(file);
                }} />
              </div>
            </div>
            <div>
              <Label>Social Links</Label>
              <div className="space-y-2 mt-1">
                <Input value={form.socialLinks.linkedin} onChange={e => setForm(p => ({ ...p, socialLinks: { ...p.socialLinks, linkedin: e.target.value } }))} placeholder="LinkedIn URL" />
                <Input value={form.socialLinks.twitter} onChange={e => setForm(p => ({ ...p, socialLinks: { ...p.socialLinks, twitter: e.target.value } }))} placeholder="Twitter URL" />
                <Input value={form.socialLinks.instagram} onChange={e => setForm(p => ({ ...p, socialLinks: { ...p.socialLinks, instagram: e.target.value } }))} placeholder="Instagram URL" />
              </div>
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
        title="Delete Team Member"
        description={`Are you sure you want to delete "${deleteConfirm?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}
