'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getProfile, updateProfile, updatePassword } from '@/lib/actions/profile-actions';
import { signOut, useSession } from 'next-auth/react';
import { toast } from '@/hooks/use-toast';

export default function AdminProfile() {
  const { update } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: '', email: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPw, setShowPw] = useState({ current: false, new: false, confirm: false });

  useEffect(() => {
    getProfile().then((res) => {
      if (res.success && res.user) {
        setForm({ name: res.user.name || '', email: res.user.email || '' });
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const res = await updateProfile({ name: form.name, email: form.email });
    if (res.success) {
      toast({ title: 'Profile updated' });
      await update();
    } else {
      toast({ title: 'Error', description: res.error, variant: 'destructive' });
    }
    setSaving(false);
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    setSaving(true);
    const res = await updatePassword({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword });
    if (res.success) {
      toast({ title: 'Password updated', description: 'Please sign in again' });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      signOut({ callbackUrl: '/admin/login' });
    } else {
      toast({ title: 'Error', description: res.error, variant: 'destructive' });
    }
    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8A97E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">Profile</h1>
        <p className="text-gray-500 mt-1">Manage your account details and password.</p>
      </div>

      <form onSubmit={handleProfileSave}>
        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} />
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="gold" className="rounded-full" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>

      <form onSubmit={handlePasswordSave}>
        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Current Password</Label>
              <div className="relative">
                <Input type={showPw.current ? 'text' : 'password'} value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, currentPassword: e.target.value }))} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPw((prev) => ({ ...prev, current: !prev.current }))}>
                  {showPw.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>New Password</Label>
              <div className="relative">
                <Input type={showPw.new ? 'text' : 'password'} value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, newPassword: e.target.value }))} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPw((prev) => ({ ...prev, new: !prev.new }))}>
                  {showPw.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Confirm New Password</Label>
              <div className="relative">
                <Input type={showPw.confirm ? 'text' : 'password'} value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} />
                <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPw((prev) => ({ ...prev, confirm: !prev.confirm }))}>
                  {showPw.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="submit" variant="gold" className="rounded-full" disabled={saving}>
                <Save className="w-4 h-4 mr-2" />
                {saving ? 'Updating...' : 'Update Password'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
