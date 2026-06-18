'use client';

import { useState, useEffect } from 'react';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { updateSettings } from '@/lib/actions/settings-actions';
import { getSettings } from '@/lib/actions/data';
import { toast } from '@/hooks/use-toast';

interface HeroSlide {
  image: string;
  imageLg: string;
  headline: string;
  subheadline: string;
  ctaText?: string;
  ctaLink?: string;
}

interface StatItem {
  value: number;
  suffix: string;
  label: string;
}

interface Highlight {
  icon: string;
  label: string;
  description: string;
}

interface AboutData {
  heading: string;
  paragraphs: string[];
  image: string;
  highlights: Highlight[];
  yearsExperience: number;
  projectsDelivered: number;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

function newSlide(): HeroSlide {
  return { image: '', imageLg: '', headline: '', subheadline: '', ctaText: '', ctaLink: '' };
}

function newStat(): StatItem {
  return { value: 0, suffix: '+', label: '' };
}

function newHighlight(): Highlight {
  return { icon: '', label: '', description: '' };
}

function newFeature(): Feature {
  return { icon: '', title: '', description: '' };
}

function newStep(): ProcessStep {
  return { step: 1, title: '', description: '' };
}

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    siteName: 'AkInteriors',
    siteDescription: 'Luxury Interior Design Agency',
    aboutText: '',
    workingHours: 'Mon-Sat: 10:00 AM - 7:00 PM',
    contactEmail: '',
    contactPhone: '',
    contactAddress: '',
    contactCity: '',
    contactState: '',
    contactZip: '',
    socialFacebook: '',
    socialInstagram: '',
    socialLinkedin: '',
    socialYoutube: '',
    seoTitle: '',
    seoDescription: '',
    analyticsId: '',
    whatsappNumber: '',
    logo: '',
    favicon: '',
  });

  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>([newSlide()]);
  const [heroStats, setHeroStats] = useState<StatItem[]>([newStat()]);
  const [aboutData, setAboutData] = useState<AboutData>({
    heading: '', paragraphs: [], image: '', highlights: [],
    yearsExperience: 15, projectsDelivered: 500,
  });
  const [whyChooseUs, setWhyChooseUs] = useState<Feature[]>([newFeature()]);
  const [sectionStats, setSectionStats] = useState<StatItem[]>([newStat()]);
  const [processSteps, setProcessSteps] = useState<ProcessStep[]>([newStep()]);

  useEffect(() => {
    getSettings().then((settings) => {
      setForm({
        siteName: settings.siteName || 'AkInteriors',
        siteDescription: settings.siteDescription || '',
        aboutText: settings.aboutText || '',
        workingHours: settings.workingHours || '',
        contactEmail: settings.contact?.email || '',
        contactPhone: settings.contact?.phone || '',
        contactAddress: settings.contact?.address || '',
        contactCity: settings.contact?.city || '',
        contactState: settings.contact?.state || '',
        contactZip: settings.contact?.zip || '',
        socialFacebook: settings.socialLinks?.facebook || '',
        socialInstagram: settings.socialLinks?.instagram || '',
        socialLinkedin: settings.socialLinks?.linkedin || '',
        socialYoutube: settings.socialLinks?.youtube || '',
        seoTitle: settings.seo?.metaTitle || '',
        seoDescription: settings.seo?.metaDescription || '',
        analyticsId: settings.analyticsId || '',
        whatsappNumber: settings.whatsapp?.number || '',
        logo: settings.logo || '',
        favicon: settings.favicon || '',
      });
      if (settings.hero?.slides?.length) setHeroSlides(settings.hero.slides);
      if (settings.hero?.stats?.length) setHeroStats(settings.hero.stats);
      if (settings.aboutSection) setAboutData({
        heading: settings.aboutSection.heading || '',
        paragraphs: settings.aboutSection.paragraphs || [],
        image: settings.aboutSection.image || '',
        highlights: settings.aboutSection.highlights || [],
        yearsExperience: settings.aboutSection.yearsExperience ?? 15,
        projectsDelivered: settings.aboutSection.projectsDelivered ?? 500,
      });
      if (settings.whyChooseUs?.length) setWhyChooseUs(settings.whyChooseUs);
      if (settings.stats?.length) setSectionStats(settings.stats);
      if (settings.processSteps?.length) setProcessSteps(settings.processSteps);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function setSlide(i: number, field: string, value: string) {
    setHeroSlides((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }

  function removeSlide(i: number) {
    setHeroSlides((prev) => prev.filter((_, idx) => idx !== i));
  }

  function setHeroStat(i: number, field: string, value: string | number) {
    setHeroStats((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }

  function removeHeroStat(i: number) {
    setHeroStats((prev) => prev.filter((_, idx) => idx !== i));
  }

  function setHighlight(i: number, field: string, value: string) {
    setAboutData((prev) => ({
      ...prev,
      highlights: prev.highlights.map((h, idx) => idx === i ? { ...h, [field]: value } : h),
    }));
  }

  function removeHighlight(i: number) {
    setAboutData((prev) => ({
      ...prev,
      highlights: prev.highlights.filter((_, idx) => idx !== i),
    }));
  }

  function setFeature(i: number, field: string, value: string) {
    setWhyChooseUs((prev) => prev.map((f, idx) => idx === i ? { ...f, [field]: value } : f));
  }

  function removeFeature(i: number) {
    setWhyChooseUs((prev) => prev.filter((_, idx) => idx !== i));
  }

  function setSectionStat(i: number, field: string, value: string | number) {
    setSectionStats((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }

  function removeSectionStat(i: number) {
    setSectionStats((prev) => prev.filter((_, idx) => idx !== i));
  }

  function setStep(i: number, field: string, value: string | number) {
    setProcessSteps((prev) => prev.map((s, idx) => idx === i ? { ...s, [field]: value } : s));
  }

  function removeStep(i: number) {
    setProcessSteps((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const result = await updateSettings({
        siteName: form.siteName,
        siteDescription: form.siteDescription,
        aboutText: form.aboutText,
        workingHours: form.workingHours,
        logo: form.logo,
        favicon: form.favicon,
        analyticsId: form.analyticsId,
        contact: {
          email: form.contactEmail,
          phone: form.contactPhone,
          address: form.contactAddress,
          city: form.contactCity,
          state: form.contactState,
          zip: form.contactZip,
        },
        socialLinks: {
          facebook: form.socialFacebook,
          instagram: form.socialInstagram,
          linkedin: form.socialLinkedin,
          youtube: form.socialYoutube,
        },
        seo: {
          metaTitle: form.seoTitle,
          metaDescription: form.seoDescription,
        },
        whatsapp: {
          number: form.whatsappNumber,
          message: 'Hi! I would like to know more about your services.',
        },
        hero: { slides: heroSlides, stats: heroStats },
        aboutSection: aboutData,
        whyChooseUs,
        stats: sectionStats,
        processSteps,
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
        <p className="text-gray-500 mt-1">Manage your website settings.</p>
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
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Logo URL</Label>
                <Input value={form.logo} onChange={(e) => handleChange('logo', e.target.value)} placeholder="https://example.com/logo.png" />
                {form.logo && (
                  <div className="mt-2 rounded-lg border border-gray-200 p-3 bg-gray-50 inline-block">
                    <img src={form.logo} alt="Logo preview" className="h-10 object-contain" />
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <Label>Favicon URL</Label>
                <Input value={form.favicon} onChange={(e) => handleChange('favicon', e.target.value)} placeholder="https://example.com/favicon.ico" />
                {form.favicon && (
                  <div className="mt-2 rounded-lg border border-gray-200 p-3 bg-gray-50 inline-block">
                    <img src={form.favicon} alt="Favicon preview" className="h-8 w-8 object-contain" />
                  </div>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label>About Content</Label>
              <Textarea value={form.aboutText} onChange={(e) => handleChange('aboutText', e.target.value)} rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Working Hours</Label>
              <Input value={form.workingHours} onChange={(e) => handleChange('workingHours', e.target.value)} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={form.contactEmail} onChange={(e) => handleChange('contactEmail', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={form.contactPhone} onChange={(e) => handleChange('contactPhone', e.target.value)} />
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={form.contactAddress} onChange={(e) => handleChange('contactAddress', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>City</Label>
                <Input value={form.contactCity} onChange={(e) => handleChange('contactCity', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>State</Label>
                <Input value={form.contactState} onChange={(e) => handleChange('contactState', e.target.value)} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Social Media Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Facebook</Label>
                <Input value={form.socialFacebook} onChange={(e) => handleChange('socialFacebook', e.target.value)} placeholder="https://facebook.com/..." />
              </div>
              <div className="space-y-2">
                <Label>Instagram</Label>
                <Input value={form.socialInstagram} onChange={(e) => handleChange('socialInstagram', e.target.value)} placeholder="https://instagram.com/..." />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn</Label>
                <Input value={form.socialLinkedin} onChange={(e) => handleChange('socialLinkedin', e.target.value)} placeholder="https://linkedin.com/..." />
              </div>
              <div className="space-y-2">
                <Label>YouTube</Label>
                <Input value={form.socialYoutube} onChange={(e) => handleChange('socialYoutube', e.target.value)} placeholder="https://youtube.com/..." />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>SEO & Integration Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Meta Title</Label>
              <Input value={form.seoTitle} onChange={(e) => handleChange('seoTitle', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Meta Description</Label>
              <Textarea value={form.seoDescription} onChange={(e) => handleChange('seoDescription', e.target.value)} rows={3} />
            </div>
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

        {/* Hero Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Hero Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold">Slides</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setHeroSlides((prev) => [...prev, newSlide()])}>
                  <Plus className="w-4 h-4 mr-1" /> Add Slide
                </Button>
              </div>
              {heroSlides.map((slide, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 mb-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Slide {i + 1}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeSlide(i)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Image URL</Label>
                      <Input value={slide.image} onChange={(e) => setSlide(i, 'image', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Image URL (Large)</Label>
                      <Input value={slide.imageLg} onChange={(e) => setSlide(i, 'imageLg', e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Headline</Label>
                    <Input value={slide.headline} onChange={(e) => setSlide(i, 'headline', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Subheadline</Label>
                    <Input value={slide.subheadline} onChange={(e) => setSlide(i, 'subheadline', e.target.value)} />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">CTA Text</Label>
                      <Input value={slide.ctaText || ''} onChange={(e) => setSlide(i, 'ctaText', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">CTA Link</Label>
                      <Input value={slide.ctaLink || ''} onChange={(e) => setSlide(i, 'ctaLink', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold">Hero Stats</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setHeroStats((prev) => [...prev, newStat()])}>
                  <Plus className="w-4 h-4 mr-1" /> Add Stat
                </Button>
              </div>
              {heroStats.map((stat, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 mb-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Stat {i + 1}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeHeroStat(i)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Value</Label>
                      <Input type="number" value={stat.value} onChange={(e) => setHeroStat(i, 'value', Number(e.target.value))} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Suffix</Label>
                      <Input value={stat.suffix} onChange={(e) => setHeroStat(i, 'suffix', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Label</Label>
                      <Input value={stat.label} onChange={(e) => setHeroStat(i, 'label', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* About Section */}
        <Card>
          <CardHeader>
            <CardTitle>About Section</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label>Heading</Label>
              <Input value={aboutData.heading} onChange={(e) => setAboutData((prev) => ({ ...prev, heading: e.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Paragraphs (one per line)</Label>
              <Textarea value={aboutData.paragraphs.join('\n')} onChange={(e) => setAboutData((prev) => ({ ...prev, paragraphs: e.target.value.split('\n').filter(Boolean) }))} rows={4} />
            </div>
            <div className="space-y-2">
              <Label>Image URL</Label>
              <Input value={aboutData.image} onChange={(e) => setAboutData((prev) => ({ ...prev, image: e.target.value }))} />
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label>Years Experience</Label>
                <Input type="number" value={aboutData.yearsExperience} onChange={(e) => setAboutData((prev) => ({ ...prev, yearsExperience: Number(e.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label>Projects Delivered</Label>
                <Input type="number" value={aboutData.projectsDelivered} onChange={(e) => setAboutData((prev) => ({ ...prev, projectsDelivered: Number(e.target.value) }))} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base font-semibold">Highlights</Label>
                <Button type="button" variant="outline" size="sm" onClick={() => setAboutData((prev) => ({ ...prev, highlights: [...prev.highlights, newHighlight()] }))}>
                  <Plus className="w-4 h-4 mr-1" /> Add Highlight
                </Button>
              </div>
              {aboutData.highlights.map((item, i) => (
                <div key={i} className="border border-gray-200 rounded-xl p-4 mb-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Highlight {i + 1}</span>
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeHighlight(i)}>
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Icon</Label>
                      <Input value={item.icon} onChange={(e) => setHighlight(i, 'icon', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Label</Label>
                      <Input value={item.label} onChange={(e) => setHighlight(i, 'label', e.target.value)} />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Description</Label>
                      <Input value={item.description} onChange={(e) => setHighlight(i, 'description', e.target.value)} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Why Choose Us */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Why Choose Us</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => setWhyChooseUs((prev) => [...prev, newFeature()])}>
              <Plus className="w-4 h-4 mr-1" /> Add Feature
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {whyChooseUs.map((feature, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Feature {i + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeFeature(i)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Icon</Label>
                    <Input value={feature.icon} onChange={(e) => setFeature(i, 'icon', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Title</Label>
                    <Input value={feature.title} onChange={(e) => setFeature(i, 'title', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Input value={feature.description} onChange={(e) => setFeature(i, 'description', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Stats Section */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Stats Section</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => setSectionStats((prev) => [...prev, newStat()])}>
              <Plus className="w-4 h-4 mr-1" /> Add Stat
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {sectionStats.map((stat, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Stat {i + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeSectionStat(i)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Value</Label>
                    <Input type="number" value={stat.value} onChange={(e) => setSectionStat(i, 'value', Number(e.target.value))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Suffix</Label>
                    <Input value={stat.suffix} onChange={(e) => setSectionStat(i, 'suffix', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Label</Label>
                    <Input value={stat.label} onChange={(e) => setSectionStat(i, 'label', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Process Steps */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Process Steps</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={() => setProcessSteps((prev) => [...prev, newStep()])}>
              <Plus className="w-4 h-4 mr-1" /> Add Step
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {processSteps.map((step, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">Step {i + 1}</span>
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeStep(i)}>
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Step Number</Label>
                    <Input type="number" value={step.step} onChange={(e) => setStep(i, 'step', Number(e.target.value))} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Title</Label>
                    <Input value={step.title} onChange={(e) => setStep(i, 'title', e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Description</Label>
                    <Input value={step.description} onChange={(e) => setStep(i, 'description', e.target.value)} />
                  </div>
                </div>
              </div>
            ))}
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
