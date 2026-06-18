'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Save, Loader2, Palette, Search, Share2, Menu as MenuIcon,
  Layout, FileText, Mail, MapPin, Globe, Upload, FileImage,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/hooks/use-toast';
import ImagePicker from '@/components/admin/ImagePicker';
import {
  getBranding, updateBranding,
  getHomepage, updateHomepage,
  getAboutPage, updateAboutPage,
  getContactPage, updateContactPage,
  getSocialLinks, updateSocialLinks,
  getSEOSettings, updateSEOSettings,
  getNavigation, updateNavigation,
  getFooter, updateFooter,
} from '@/lib/actions/cms-actions';

const ICON_OPTIONS = [
  'Award', 'Target', 'Eye', 'Users', 'Star', 'Gem', 'Clock', 'Monitor',
  'CheckCircle2', 'Globe', 'Camera', 'Briefcase', 'Play', 'Home', 'Building2',
  'CookingPot', 'Hammer', 'Heart', 'Shield', 'Lightbulb', 'Rocket',
  'Palette', 'Search', 'Share2', 'Menu', 'Layout', 'FileText', 'Mail',
  'MapPin', 'Phone', 'MessageCircle', 'ArrowRight', 'ChevronDown',
  'Facebook', 'Instagram', 'Linkedin', 'Twitter', 'Youtube', 'Pinterest', 'Threads',
];

function IconSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [mode, setMode] = useState<'name' | 'svg'>(value && (value.startsWith('http') || value.startsWith('/')) ? 'svg' : 'name');
  const [svgFile, setSvgFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleSvgUpload = async (file: File) => {
    setSvgFile(file);
    const fd = new FormData();
    fd.append('file', file);
    fd.append('title', 'social-icon-' + Date.now());
    fd.append('category', 'footer');
    fd.append('section', 'partner-logos');
    fd.append('altText', 'Social media icon');
    fd.append('displayOrder', '0');
    fd.append('isActive', 'true');
    try {
      const res = await fetch('/api/admin/images', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.success) {
        onChange(data.image.imageUrl);
      }
    } catch { /* ignore */ }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        <button type="button" onClick={() => { setMode('name'); setSvgFile(null); if (!value.startsWith('http') && !value.startsWith('/')) onChange(value); else onChange(''); }}
          className={`px-2 py-1 text-[10px] rounded border ${mode === 'name' ? 'bg-[#C8A97E] text-white border-[#C8A97E]' : 'bg-white text-gray-500 border-gray-200'}`}>
          Name
        </button>
        <button type="button" onClick={() => setMode('svg')}
          className={`px-2 py-1 text-[10px] rounded border ${mode === 'svg' ? 'bg-[#C8A97E] text-white border-[#C8A97E]' : 'bg-white text-gray-500 border-gray-200'}`}>
          SVG
        </button>
      </div>
      {mode === 'name' ? (
        <select value={value && !value.startsWith('http') && !value.startsWith('/') ? value : ''} onChange={(e) => onChange(e.target.value)}
          className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm">
          <option value="">-- Select icon --</option>
          {ICON_OPTIONS.map((icon) => (
            <option key={icon} value={icon}>{icon}</option>
          ))}
        </select>
      ) : (
        <div
          className="border-2 border-dashed rounded-lg p-3 text-center cursor-pointer hover:border-[#C8A97E] transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          {svgFile ? (
            <div className="space-y-1">
              <FileImage className="w-5 h-5 mx-auto text-[#C8A97E]" />
              <p className="text-xs font-medium truncate">{svgFile.name}</p>
            </div>
          ) : value && (value.startsWith('http') || value.startsWith('/')) ? (
            <div className="space-y-1">
              <img src={value} alt="" className="w-6 h-6 mx-auto" />
              <p className="text-xs text-gray-400">Click to replace</p>
            </div>
          ) : (
            <div className="space-y-1">
              <Upload className="w-5 h-5 mx-auto text-gray-400" />
              <p className="text-xs text-gray-500">Upload SVG</p>
            </div>
          )}
          <input ref={fileRef} type="file" accept="image/svg+xml,.svg" className="hidden"
            onChange={e => { const f = e.target.files?.[0]; if (f) handleSvgUpload(f); }} />
        </div>
      )}
    </div>
  );
}

const TABS = [
  { id: 'branding', label: 'Branding', icon: Palette },
  { id: 'seo', label: 'SEO', icon: Search },
  { id: 'social', label: 'Social Media', icon: Share2 },
  { id: 'navigation', label: 'Navigation', icon: MenuIcon },
  { id: 'footer', label: 'Footer', icon: Globe },
  { id: 'homepage', label: 'Homepage', icon: Layout },
  { id: 'about', label: 'About Page', icon: FileText },
  { id: 'contact', label: 'Contact Page', icon: Mail },
];

function ImgPreview({ src, label }: { src: string; label: string }) {
  if (!src) return null;
  return (
    <div className="mt-2 rounded-lg border border-gray-200 p-3 bg-gray-50 inline-block">
      <img src={src} alt={label} className="h-10 object-contain" />
    </div>
  );
}

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState('branding');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const autoSaveTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Branding
  const [branding, setBranding] = useState<Record<string, string>>({});
  // SEO
  const [seoPages, setSeoPages] = useState<Array<Record<string, unknown>>>([]);
  // Social
  const [socialLinks, setSocialLinks] = useState<Array<Record<string, unknown>>>([]);
  // Navigation
  const [navLinks, setNavLinks] = useState<Array<Record<string, unknown>>>([]);
  const [navCta, setNavCta] = useState({ ctaText: 'Get Free Quote', ctaLink: '/contact' });
  // Footer
  const [footer, setFooter] = useState<Record<string, unknown>>({});
  // Homepage
  const [homeSections, setHomeSections] = useState<Array<Record<string, unknown>>>([]);
  // About
  const [about, setAbout] = useState<Record<string, unknown>>({});
  // Contact
  const [contact, setContact] = useState<Record<string, unknown>>({});

  useEffect(() => {
    Promise.all([
      getBranding(), getHomepage(), getAboutPage(), getContactPage(),
      getSocialLinks(), getSEOSettings(), getNavigation(), getFooter(),
    ]).then(([b, h, a, c, s, seo, n, f]) => {
      if (b.success) setBranding((b.data as Record<string, string>) || {});
      if (h.success) setHomeSections(((h.data as Record<string, unknown>)?.sections as Array<Record<string, unknown>>) || []);
      if (a.success) setAbout((a.data as Record<string, unknown>) || {});
      if (c.success) setContact((c.data as Record<string, unknown>) || {});
      if (s.success) setSocialLinks(((s.data as Record<string, unknown>)?.links as Array<Record<string, unknown>>) || []);
      if (seo.success) setSeoPages(((seo.data as Record<string, unknown>)?.pages as Array<Record<string, unknown>>) || []);
      if (n.success) {
        const nd = n.data as Record<string, unknown>;
        setNavLinks((nd?.links as Array<Record<string, unknown>>) || []);
        setNavCta({ ctaText: (nd?.ctaText as string) || 'Get Free Quote', ctaLink: (nd?.ctaLink as string) || '/contact' });
      }
      if (f.success) setFooter((f.data as Record<string, unknown>) || {});
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const autoSave = useCallback((fn: () => Promise<void>) => {
    if (autoSaveTimer.current) clearTimeout(autoSaveTimer.current);
    autoSaveTimer.current = setTimeout(fn, 2000);
  }, []);

  async function handleSave(updateFn: (data: Record<string, unknown>) => Promise<{ success: boolean; error?: string }>, data: Record<string, unknown>) {
    setSaving(true);
    try {
      const res = await updateFn(data);
      if (res.success) toast({ title: 'Saved successfully' });
      else toast({ title: 'Error', description: res.error, variant: 'destructive' });
    } catch {
      toast({ title: 'Error', description: 'Save failed', variant: 'destructive' });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#111827]">CMS</h1>
          <p className="text-gray-500 mt-1">Manage all website content</p>
        </div>
        <Button variant="gold" className="rounded-full" disabled={saving} onClick={() => {
          const tabMap: Record<string, () => Promise<void>> = {
            branding: () => handleSave(updateBranding, branding as unknown as Record<string, unknown>),
            seo: () => handleSave(updateSEOSettings, { pages: seoPages }),
            social: () => handleSave(updateSocialLinks, { links: socialLinks }),
            navigation: () => handleSave(updateNavigation, { links: navLinks, ...navCta }),
            footer: () => handleSave(updateFooter, footer),
            homepage: () => handleSave(updateHomepage, { sections: homeSections }),
            about: () => handleSave(updateAboutPage, about),
            contact: () => handleSave(updateContactPage, contact),
          };
          tabMap[activeTab]?.();
        }}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Saving...' : 'Save'}
        </Button>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-1">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-[#C8A97E] border-b-2 border-[#C8A97E] shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Branding Tab */}
      {activeTab === 'branding' && (
        <Card>
          <CardHeader><CardTitle>Branding Assets</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Site Name</Label>
              <Input value={branding.siteName || 'AkInteriors'} onChange={(e) => setBranding(p => ({ ...p, siteName: e.target.value }))} />
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {['logo', 'mobileLogo', 'footerLogo', 'adminLogo', 'darkLogo', 'lightLogo', 'favicon', 'appIcon'].map((field) => (
                <div key={field} className="space-y-2">
                  <ImagePicker
                    value={branding[field] || ''}
                    onChange={(url) => { setBranding(p => ({ ...p, [field]: url })); autoSave(() => handleSave(updateBranding, { ...branding, [field]: url })); }}
                    category="branding"
                    section={field}
                    label={field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}
                  />
                </div>
              ))}
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Primary Color</Label>
                <div className="flex gap-2">
                  <Input value={branding.primaryColor || '#C8A97E'} onChange={(e) => setBranding(p => ({ ...p, primaryColor: e.target.value }))} className="flex-1" />
                  <input type="color" value={branding.primaryColor || '#C8A97E'} onChange={(e) => setBranding(p => ({ ...p, primaryColor: e.target.value }))} className="w-10 h-10 rounded cursor-pointer" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Secondary Color</Label>
                <div className="flex gap-2">
                  <Input value={branding.secondaryColor || '#111827'} onChange={(e) => setBranding(p => ({ ...p, secondaryColor: e.target.value }))} className="flex-1" />
                  <input type="color" value={branding.secondaryColor || '#111827'} onChange={(e) => setBranding(p => ({ ...p, secondaryColor: e.target.value }))} className="w-10 h-10 rounded cursor-pointer" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* SEO Tab */}
      {activeTab === 'seo' && (
        <div className="space-y-4">
          {['home', 'about', 'services', 'projects', 'contact', 'blog'].map((page) => {
            const p = seoPages.find(sp => (sp.page as string) === page) || { page, metaTitle: '', metaDescription: '', keywords: [], canonicalUrl: '', ogImage: '', twitterCard: 'summary_large_image' };
            return (
              <Card key={page}>
                <CardHeader><CardTitle className="capitalize">{page} Page SEO</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Meta Title</Label>
                      <Input value={p.metaTitle as string} onChange={(e) => setSeoPages(prev => prev.map(sp => sp.page === page ? { ...sp, metaTitle: e.target.value } : sp))} />
                    </div>
                    <div className="space-y-2">
                      <Label>Canonical URL</Label>
                      <Input value={p.canonicalUrl as string} onChange={(e) => setSeoPages(prev => prev.map(sp => sp.page === page ? { ...sp, canonicalUrl: e.target.value } : sp))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Meta Description</Label>
                    <Textarea value={p.metaDescription as string} onChange={(e) => setSeoPages(prev => prev.map(sp => sp.page === page ? { ...sp, metaDescription: e.target.value } : sp))} rows={3} />
                  </div>
                  <div className="space-y-2">
                    <Label>Keywords (comma separated)</Label>
                    <Input value={(p.keywords as string[])?.join(', ') || ''} onChange={(e) => setSeoPages(prev => prev.map(sp => sp.page === page ? { ...sp, keywords: e.target.value.split(',').map(k => k.trim()) } : sp))} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <ImagePicker
                        value={p.ogImage as string}
                        onChange={(url) => setSeoPages(prev => prev.map(sp => sp.page === page ? { ...sp, ogImage: url } : sp))}
                        category="seo"
                        section={page}
                        label="OG Image"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Twitter Card</Label>
                      <select value={p.twitterCard as string} onChange={(e) => setSeoPages(prev => prev.map(sp => sp.page === page ? { ...sp, twitterCard: e.target.value } : sp))} className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-white text-sm">
                        <option value="summary">Summary</option>
                        <option value="summary_large_image">Summary Large Image</option>
                        <option value="app">App</option>
                        <option value="player">Player</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <Card>
          <CardHeader><CardTitle>Social Media Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {socialLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-4 border border-gray-200 rounded-xl p-4">
                <div className="w-8 h-8 rounded-full bg-[#C8A97E]/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-[#C8A97E]">{link.platform?.toString().charAt(0)}</span>
                </div>
                <div className="flex-1 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Platform</Label>
                    <Input value={link.platform as string} onChange={(e) => setSocialLinks(prev => prev.map((l, idx) => idx === i ? { ...l, platform: e.target.value } : l))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">URL</Label>
                    <Input value={link.url as string} onChange={(e) => setSocialLinks(prev => prev.map((l, idx) => idx === i ? { ...l, url: e.target.value } : l))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Icon</Label>
                    <IconSelect value={link.icon as string} onChange={(v) => setSocialLinks(prev => prev.map((l, idx) => idx === i ? { ...l, icon: v } : l))} />
                  </div>
                  <div className="flex items-center gap-4 pt-5">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox checked={link.enabled as boolean} onCheckedChange={(checked) => setSocialLinks(prev => prev.map((l, idx) => idx === i ? { ...l, enabled: !!checked } : l))} />
                      Active
                    </label>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox checked={link.openNewTab as boolean} onCheckedChange={(checked) => setSocialLinks(prev => prev.map((l, idx) => idx === i ? { ...l, openNewTab: !!checked } : l))} />
                      New Tab
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Navigation Tab */}
      {activeTab === 'navigation' && (
        <Card>
          <CardHeader><CardTitle>Navigation Menu</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>CTA Button Text</Label>
                <Input value={navCta.ctaText} onChange={(e) => setNavCta(p => ({ ...p, ctaText: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>CTA Button Link</Label>
                <Input value={navCta.ctaLink} onChange={(e) => setNavCta(p => ({ ...p, ctaLink: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-3 mt-4">
              <Label className="text-base font-semibold">Navigation Links</Label>
              {navLinks.map((link, i) => (
                <div key={i} className="flex items-center gap-3 border border-gray-200 rounded-xl p-3">
                  <span className="text-sm text-gray-400 w-6">{i + 1}</span>
                  <div className="flex-1 grid sm:grid-cols-2 gap-3">
                    <Input value={link.label as string} onChange={(e) => setNavLinks(prev => prev.map((l, idx) => idx === i ? { ...l, label: e.target.value } : l))} placeholder="Label" />
                    <Input value={link.href as string} onChange={(e) => setNavLinks(prev => prev.map((l, idx) => idx === i ? { ...l, href: e.target.value } : l))} placeholder="/path" />
                  </div>
                  <Button type="button" variant="ghost" size="sm" onClick={() => setNavLinks(prev => prev.filter((_, idx) => idx !== i))}>
                    <span className="text-red-500 text-sm">Remove</span>
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setNavLinks(prev => [...prev, { label: '', href: '', order: prev.length }])}>
                + Add Link
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Footer Tab */}
      {activeTab === 'footer' && (
        <Card>
          <CardHeader><CardTitle>Footer Settings</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={(footer.description as string) || ''} onChange={(e) => setFooter(p => ({ ...p, description: e.target.value }))} rows={3} />
            </div>
            <div className="space-y-2">
              <Label>Newsletter Title</Label>
              <Input value={(footer.newsletterTitle as string) || ''} onChange={(e) => setFooter(p => ({ ...p, newsletterTitle: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Copyright Text</Label>
              <Input value={(footer.copyright as string) || ''} onChange={(e) => setFooter(p => ({ ...p, copyright: e.target.value }))} />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Background Color</Label>
                <div className="flex gap-2">
                  <Input value={(footer.backgroundColor as string) || '#111827'} onChange={(e) => setFooter(p => ({ ...p, backgroundColor: e.target.value }))} className="flex-1" />
                  <input type="color" value={(footer.backgroundColor as string) || '#111827'} onChange={(e) => setFooter(p => ({ ...p, backgroundColor: e.target.value }))} className="w-10 h-10 rounded cursor-pointer" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Text Color</Label>
                <div className="flex gap-2">
                  <Input value={(footer.textColor as string) || '#ffffff'} onChange={(e) => setFooter(p => ({ ...p, textColor: e.target.value }))} className="flex-1" />
                  <input type="color" value={(footer.textColor as string) || '#ffffff'} onChange={(e) => setFooter(p => ({ ...p, textColor: e.target.value }))} className="w-10 h-10 rounded cursor-pointer" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Homepage Tab */}
      {activeTab === 'homepage' && (
        <Card>
          <CardHeader><CardTitle>Homepage Sections</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {homeSections.sort((a, b) => (a.order as number) - (b.order as number)).map((section, i) => (
              <div key={section.id as string} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 capitalize">{section.type as string}</span>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <Checkbox checked={section.enabled as boolean} onCheckedChange={(checked) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, enabled: !!checked } : s))} />
                      Enabled
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" size="sm" disabled={i === 0} onClick={() => setHomeSections(prev => { const arr = [...prev]; const idx = arr.findIndex(s => s.id === section.id); if (idx > 0) { [arr[idx], arr[idx - 1]] = [arr[idx - 1], arr[idx]]; arr[idx].order = idx; arr[idx - 1].order = idx - 1; } return arr; })}>↑</Button>
                    <Button type="button" variant="ghost" size="sm" disabled={i === homeSections.length - 1} onClick={() => setHomeSections(prev => { const arr = [...prev]; const idx = arr.findIndex(s => s.id === section.id); if (idx < arr.length - 1) { [arr[idx], arr[idx + 1]] = [arr[idx + 1], arr[idx]]; arr[idx].order = idx; arr[idx + 1].order = idx + 1; } return arr; })}>↓</Button>
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Heading</Label>
                    <Input value={(section.heading as string) || ''} onChange={(e) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, heading: e.target.value } : s))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">CTA Link</Label>
                    <Input value={(section.ctaLink as string) || ''} onChange={(e) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, ctaLink: e.target.value } : s))} />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Subheading</Label>
                  <Input value={(section.subheading as string) || ''} onChange={(e) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, subheading: e.target.value } : s))} />
                </div>

                {/* About: Content & Image */}
                {(section.type as string) === 'about' && (
                  <>
                    <div className="space-y-1 pt-2 border-t">
                      <Label className="text-xs">Content</Label>
                      <Textarea value={(section.content as string) || ''} onChange={(e) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, content: e.target.value } : s))} rows={4} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Image</Label>
                      <ImagePicker value={(section.image as string) || ''} onChange={(url) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, image: url } : s))} category="about" section="homepage" />
                    </div>
                  </>
                )}

                {/* Hero: Slides */}
                {(section.type as string) === 'hero' && (
                  <>
                    <div className="space-y-2 pt-2 border-t">
                      <Label className="text-sm font-semibold">Slides</Label>
                      {((section.slides as Array<Record<string, string>>) || []).map((slide, si) => (
                        <div key={si} className="border border-gray-100 rounded-lg p-3 space-y-2 bg-gray-50">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-400">Slide {si + 1}</span>
                            <Button type="button" variant="ghost" size="sm" onClick={() => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, slides: (s.slides as Array<Record<string, string>>).filter((_, idx) => idx !== si) } : s))}>
                              <span className="text-red-500 text-xs">Remove</span>
                            </Button>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-2">
                            <ImagePicker value={slide.image || ''} onChange={(url) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, slides: (s.slides as Array<Record<string, string>>).map((sl, idx) => idx === si ? { ...sl, image: url } : sl) } : s))} category="hero" section="slides" label="Image" />
                            <ImagePicker value={slide.imageLg || ''} onChange={(url) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, slides: (s.slides as Array<Record<string, string>>).map((sl, idx) => idx === si ? { ...sl, imageLg: url } : sl) } : s))} category="hero" section="slides" label="Large Image" />
                          </div>
                          <div className="space-y-1"><Label className="text-xs">Headline</Label><Input value={slide.headline || ''} onChange={(e) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, slides: (s.slides as Array<Record<string, string>>).map((sl, idx) => idx === si ? { ...sl, headline: e.target.value } : sl) } : s))} /></div>
                          <div className="space-y-1"><Label className="text-xs">Subheadline</Label><Input value={slide.subheadline || ''} onChange={(e) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, slides: (s.slides as Array<Record<string, string>>).map((sl, idx) => idx === si ? { ...sl, subheadline: e.target.value } : sl) } : s))} /></div>
                          <div className="grid sm:grid-cols-2 gap-2">
                            <div className="space-y-1"><Label className="text-xs">CTA Text</Label><Input value={slide.ctaText || ''} onChange={(e) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, slides: (s.slides as Array<Record<string, string>>).map((sl, idx) => idx === si ? { ...sl, ctaText: e.target.value } : sl) } : s))} /></div>
                            <div className="space-y-1"><Label className="text-xs">CTA Link</Label><Input value={slide.ctaLink || ''} onChange={(e) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, slides: (s.slides as Array<Record<string, string>>).map((sl, idx) => idx === si ? { ...sl, ctaLink: e.target.value } : sl) } : s))} /></div>
                          </div>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, slides: [...(s.slides as Array<Record<string, string>> || []), { image: '', imageLg: '', headline: '', subheadline: '', ctaText: '', ctaLink: '' }] } : s))}>
                        + Add Slide
                      </Button>
                    </div>
                    {/* Hero: Stats */}
                    <div className="space-y-2 pt-2 border-t">
                      <Label className="text-sm font-semibold">Stats</Label>
                      {((section.stats as Array<Record<string, unknown>>) || []).map((stat, si) => (
                        <div key={si} className="flex items-center gap-2 border border-gray-100 rounded-lg p-2 bg-gray-50">
                          <div className="flex-1 space-y-1"><Label className="text-xs">Value</Label><Input type="number" value={(stat.value as number) || ''} onChange={(e) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, stats: (s.stats as Array<Record<string, unknown>>).map((st, idx) => idx === si ? { ...st, value: parseInt(e.target.value) || 0 } : st) } : s))} /></div>
                          <div className="flex-1 space-y-1"><Label className="text-xs">Suffix</Label><Input value={(stat.suffix as string) || ''} onChange={(e) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, stats: (s.stats as Array<Record<string, unknown>>).map((st, idx) => idx === si ? { ...st, suffix: e.target.value } : st) } : s))} /></div>
                          <div className="flex-1 space-y-1"><Label className="text-xs">Label</Label><Input value={(stat.label as string) || ''} onChange={(e) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, stats: (s.stats as Array<Record<string, unknown>>).map((st, idx) => idx === si ? { ...st, label: e.target.value } : st) } : s))} /></div>
                          <Button type="button" variant="ghost" size="sm" className="mt-5" onClick={() => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, stats: (s.stats as Array<Record<string, unknown>>).filter((_, idx) => idx !== si) } : s))}>
                            <span className="text-red-500 text-xs">X</span>
                          </Button>
                        </div>
                      ))}
                      <Button type="button" variant="outline" size="sm" onClick={() => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, stats: [...(s.stats as Array<Record<string, unknown>> || []), { value: 0, suffix: '+', label: '' }] } : s))}>
                        + Add Stat
                      </Button>
                    </div>
                  </>
                )}

                {/* Why Choose Us: Items */}
                {(section.type as string) === 'why-choose-us' && (
                  <div className="space-y-2 pt-2 border-t">
                    <Label className="text-sm font-semibold">Features</Label>
                    {((section.items as Array<Record<string, string>>) || []).map((item, ii) => (
                      <div key={ii} className="flex items-center gap-2 border border-gray-100 rounded-lg p-2 bg-gray-50">
                        <div className="flex-1 space-y-1"><Label className="text-xs">Icon</Label><IconSelect value={item.icon || ''} onChange={(v) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, items: (s.items as Array<Record<string, string>>).map((it, idx) => idx === ii ? { ...it, icon: v } : it) } : s))} /></div>
                        <div className="flex-1 space-y-1"><Label className="text-xs">Title</Label><Input value={item.title || ''} onChange={(e) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, items: (s.items as Array<Record<string, string>>).map((it, idx) => idx === ii ? { ...it, title: e.target.value } : it) } : s))} /></div>
                        <div className="flex-[2] space-y-1"><Label className="text-xs">Description</Label><Input value={item.description || ''} onChange={(e) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, items: (s.items as Array<Record<string, string>>).map((it, idx) => idx === ii ? { ...it, description: e.target.value } : it) } : s))} /></div>
                        <Button type="button" variant="ghost" size="sm" className="mt-5" onClick={() => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, items: (s.items as Array<Record<string, string>>).filter((_, idx) => idx !== ii) } : s))}>
                          <span className="text-red-500 text-xs">X</span>
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, items: [...(s.items as Array<Record<string, string>> || []), { icon: '', title: '', description: '' }] } : s))}>
                      + Add Feature
                    </Button>
                  </div>
                )}

                {/* Process: Steps */}
                {(section.type as string) === 'process' && (
                  <div className="space-y-2 pt-2 border-t">
                    <Label className="text-sm font-semibold">Steps</Label>
                    {((section.steps as Array<Record<string, unknown>>) || []).sort((a, b) => (a.step as number) - (b.step as number)).map((step, si) => (
                      <div key={si} className="flex items-center gap-2 border border-gray-100 rounded-lg p-2 bg-gray-50">
                        <div className="w-10 space-y-1"><Label className="text-xs">#</Label><Input type="number" value={(step.step as number) || si + 1} onChange={(e) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, steps: (s.steps as Array<Record<string, unknown>>).map((st, idx) => idx === si ? { ...st, step: parseInt(e.target.value) || si + 1 } : st) } : s))} /></div>
                        <div className="flex-1 space-y-1"><Label className="text-xs">Title</Label><Input value={(step.title as string) || ''} onChange={(e) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, steps: (s.steps as Array<Record<string, unknown>>).map((st, idx) => idx === si ? { ...st, title: e.target.value } : st) } : s))} /></div>
                        <div className="flex-[2] space-y-1"><Label className="text-xs">Description</Label><Input value={(step.description as string) || ''} onChange={(e) => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, steps: (s.steps as Array<Record<string, unknown>>).map((st, idx) => idx === si ? { ...st, description: e.target.value } : st) } : s))} /></div>
                        <Button type="button" variant="ghost" size="sm" className="mt-5" onClick={() => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, steps: (s.steps as Array<Record<string, unknown>>).filter((_, idx) => idx !== si) } : s))}>
                          <span className="text-red-500 text-xs">X</span>
                        </Button>
                      </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" onClick={() => setHomeSections(prev => prev.map(s => s.id === section.id ? { ...s, steps: [...(s.steps as Array<Record<string, unknown>> || []), { step: ((section.steps as Array<Record<string, unknown>>) || []).length + 1, title: '', description: '' }] } : s))}>
                      + Add Step
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* About Page Tab */}
      {activeTab === 'about' && (
        <Card>
          <CardHeader><CardTitle>About Page Content</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Heading</Label>
                <Input value={(about.heading as string) || ''} onChange={(e) => setAbout(p => ({ ...p, heading: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input value={(about.subtitle as string) || ''} onChange={(e) => setAbout(p => ({ ...p, subtitle: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Content</Label>
              <Textarea value={(about.content as string) || ''} onChange={(e) => setAbout(p => ({ ...p, content: e.target.value }))} rows={6} />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Mission</Label>
                <Textarea value={(about.mission as string) || ''} onChange={(e) => setAbout(p => ({ ...p, mission: e.target.value }))} rows={3} />
              </div>
              <div className="space-y-2">
                <Label>Vision</Label>
                <Textarea value={(about.vision as string) || ''} onChange={(e) => setAbout(p => ({ ...p, vision: e.target.value }))} rows={3} />
              </div>
            </div>
            <div className="space-y-2">
              <ImagePicker
                value={(about.image as string) || ''}
                onChange={(url) => setAbout(p => ({ ...p, image: url }))}
                category="about"
                section="about-page"
                label="About Image"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-5 border-t pt-4">
              <div className="space-y-2">
                <Label>Values Section Heading</Label>
                <Input value={(about.valuesHeading as string) || ''} onChange={(e) => setAbout(p => ({ ...p, valuesHeading: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Values Section Subtitle</Label>
                <Input value={(about.valuesSubtitle as string) || ''} onChange={(e) => setAbout(p => ({ ...p, valuesSubtitle: e.target.value }))} />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Timeline Section Heading</Label>
                <Input value={(about.timelineHeading as string) || ''} onChange={(e) => setAbout(p => ({ ...p, timelineHeading: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Timeline Section Subtitle</Label>
                <Input value={(about.timelineSubtitle as string) || ''} onChange={(e) => setAbout(p => ({ ...p, timelineSubtitle: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-2 border-t pt-4">
              <Label className="text-base font-semibold">Highlights / Values</Label>
              {((about.highlights as Array<Record<string, string>>) || []).map((h, i) => (
                <div key={i} className="flex items-center gap-2 border border-gray-100 rounded-lg p-2 bg-gray-50">
                  <div className="flex-1 space-y-1"><Label className="text-xs">Icon</Label><IconSelect value={h.icon || ''} onChange={(v) => setAbout(p => ({ ...p, highlights: (p.highlights as Array<Record<string, string>>).map((item, idx) => idx === i ? { ...item, icon: v } : item) }))} /></div>
                  <div className="flex-1 space-y-1"><Label className="text-xs">Label</Label><Input value={h.label || ''} onChange={(e) => setAbout(p => ({ ...p, highlights: (p.highlights as Array<Record<string, string>>).map((item, idx) => idx === i ? { ...item, label: e.target.value } : item) }))} /></div>
                  <div className="flex-[2] space-y-1"><Label className="text-xs">Description</Label><Input value={h.description || ''} onChange={(e) => setAbout(p => ({ ...p, highlights: (p.highlights as Array<Record<string, string>>).map((item, idx) => idx === i ? { ...item, description: e.target.value } : item) }))} /></div>
                  <Button type="button" variant="ghost" size="sm" className="mt-5" onClick={() => setAbout(p => ({ ...p, highlights: (p.highlights as Array<Record<string, string>>).filter((_, idx) => idx !== i) }))}>
                    <span className="text-red-500 text-xs">X</span>
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setAbout(p => ({ ...p, highlights: [...(p.highlights as Array<Record<string, string>> || []), { icon: '', label: '', description: '' }] }))}>
                + Add Highlight
              </Button>
            </div>
            <div className="space-y-2 border-t pt-4">
              <Label className="text-base font-semibold">Timeline / Milestones</Label>
              {((about.timeline as Array<Record<string, string>>) || []).map((t, i) => (
                <div key={i} className="flex items-center gap-2 border border-gray-100 rounded-lg p-2 bg-gray-50">
                  <div className="w-20 space-y-1"><Label className="text-xs">Year</Label><Input value={t.year || ''} onChange={(e) => setAbout(p => ({ ...p, timeline: (p.timeline as Array<Record<string, string>>).map((item, idx) => idx === i ? { ...item, year: e.target.value } : item) }))} /></div>
                  <div className="flex-1 space-y-1"><Label className="text-xs">Event</Label><Input value={t.event || ''} onChange={(e) => setAbout(p => ({ ...p, timeline: (p.timeline as Array<Record<string, string>>).map((item, idx) => idx === i ? { ...item, event: e.target.value } : item) }))} /></div>
                  <div className="flex-[2] space-y-1"><Label className="text-xs">Description</Label><Input value={t.description || ''} onChange={(e) => setAbout(p => ({ ...p, timeline: (p.timeline as Array<Record<string, string>>).map((item, idx) => idx === i ? { ...item, description: e.target.value } : item) }))} /></div>
                  <Button type="button" variant="ghost" size="sm" className="mt-5" onClick={() => setAbout(p => ({ ...p, timeline: (p.timeline as Array<Record<string, string>>).filter((_, idx) => idx !== i) }))}>
                    <span className="text-red-500 text-xs">X</span>
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setAbout(p => ({ ...p, timeline: [...(p.timeline as Array<Record<string, string>> || []), { year: '', event: '', description: '' }] }))}>
                + Add Milestone
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Contact Page Tab */}
      {activeTab === 'contact' && (
        <Card>
          <CardHeader><CardTitle>Contact Page & Branches</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Heading</Label>
                <Input value={(contact.heading as string) || 'Get In Touch'} onChange={(e) => setContact(p => ({ ...p, heading: e.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Subtitle</Label>
                <Input value={(contact.subtitle as string) || ''} onChange={(e) => setContact(p => ({ ...p, subtitle: e.target.value }))} />
              </div>
            </div>
            <div className="space-y-4">
              <Label className="text-base font-semibold">Branches / Offices</Label>
              {((contact.branches as Array<Record<string, unknown>>) || []).map((branch, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">{branch.name as string || `Branch ${i + 1}`}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => setContact(p => ({ ...p, branches: (p.branches as Array<Record<string, unknown>>).filter((_, idx) => idx !== i) }))}>
                      <span className="text-red-500 text-sm">Remove</span>
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1"><Label className="text-xs">Name</Label><Input value={branch.name as string} onChange={(e) => setContact(p => ({ ...p, branches: (p.branches as Array<Record<string, unknown>>).map((b, idx) => idx === i ? { ...b, name: e.target.value } : b) }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Phone</Label><Input value={branch.phone as string} onChange={(e) => setContact(p => ({ ...p, branches: (p.branches as Array<Record<string, unknown>>).map((b, idx) => idx === i ? { ...b, phone: e.target.value } : b) }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">WhatsApp</Label><Input value={branch.whatsapp as string} onChange={(e) => setContact(p => ({ ...p, branches: (p.branches as Array<Record<string, unknown>>).map((b, idx) => idx === i ? { ...b, whatsapp: e.target.value } : b) }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Email</Label><Input value={branch.email as string} onChange={(e) => setContact(p => ({ ...p, branches: (p.branches as Array<Record<string, unknown>>).map((b, idx) => idx === i ? { ...b, email: e.target.value } : b) }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">City</Label><Input value={branch.city as string} onChange={(e) => setContact(p => ({ ...p, branches: (p.branches as Array<Record<string, unknown>>).map((b, idx) => idx === i ? { ...b, city: e.target.value } : b) }))} /></div>
                    <div className="space-y-1"><Label className="text-xs">Working Hours</Label><Input value={branch.workingHours as string} onChange={(e) => setContact(p => ({ ...p, branches: (p.branches as Array<Record<string, unknown>>).map((b, idx) => idx === i ? { ...b, workingHours: e.target.value } : b) }))} /></div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Address</Label>
                    <Input value={branch.address as string} onChange={(e) => setContact(p => ({ ...p, branches: (p.branches as Array<Record<string, unknown>>).map((b, idx) => idx === i ? { ...b, address: e.target.value } : b) }))} />
                  </div>
                </div>
              ))}
              <Button type="button" variant="outline" size="sm" onClick={() => setContact(p => ({ ...p, branches: [...(p.branches as Array<Record<string, unknown>> || []), { name: '', phone: '', whatsapp: '', email: '', address: '', city: '', workingHours: '', mapEmbed: '' }] }))}>
                + Add Branch
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
