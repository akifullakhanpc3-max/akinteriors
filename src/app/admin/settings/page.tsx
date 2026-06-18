'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { updateSettings } from '@/lib/actions/settings-actions';
import { getSettings } from '@/lib/actions/data';
import { toast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    siteName: 'AkInteriors',
    siteDescription: 'Luxury Interior Design Agency',
    analyticsId: '',
    whatsappNumber: '',
    maintenanceMode: false,
  });

  useEffect(() => {
    getSettings().then((settings) => {
      setForm({
        siteName: settings.siteName || 'AkInteriors',
        siteDescription: settings.siteDescription || '',
        analyticsId: settings.analyticsId || '',
        whatsappNumber: settings.whatsapp?.number || '',
        maintenanceMode: settings.maintenanceMode || false,
      });
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await updateSettings({
        siteName: form.siteName,
        siteDescription: form.siteDescription,
        analyticsId: form.analyticsId,
        maintenanceMode: form.maintenanceMode,
        whatsapp: {
          number: form.whatsappNumber,
          message: 'Hi! I would like to know more about your services.',
        },
      });
      if (result.success) {
        toast({ title: 'Settings saved successfully' });
      } else {
        toast({ title: 'Error', description: result.error, variant: 'destructive' });
      }
    } catch {
      toast({ title: 'Error', description: 'Failed to save settings', variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-[#C8A97E]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#111827]">Settings</h1>
        <p className="text-gray-500 mt-1">Manage system-wide settings (branding, content, and SEO are managed in CMS).</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Site Name</Label>
                <Input value={form.siteName} onChange={(e) => handleChange('siteName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Tagline</Label>
                <Input value={form.siteDescription} onChange={(e) => handleChange('siteDescription', e.target.value)} />
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <Label htmlFor="maintenanceMode" className="text-sm font-medium cursor-pointer">Maintenance Mode</Label>
                  <p className="text-xs text-gray-500">Enable to show a maintenance page to public visitors. Admins can still access the admin panel.</p>
                </div>
              </div>
              <Switch
                id="maintenanceMode"
                checked={form.maintenanceMode}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, maintenanceMode: checked }))}
                className={form.maintenanceMode ? 'bg-amber-500' : ''}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Integration Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Google Analytics ID</Label>
                <Input value={form.analyticsId} onChange={(e) => handleChange('analyticsId', e.target.value)} placeholder="G-XXXXXXXXXX" />
              </div>
              <div className="space-y-2">
                <Label>WhatsApp Number</Label>
                <Input value={form.whatsappNumber} onChange={(e) => handleChange('whatsappNumber', e.target.value)} placeholder="919999999999" />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" variant="gold" className="rounded-full" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Saving...' : 'Save Settings'}
          </Button>
        </div>
      </form>
    </div>
  );
}
