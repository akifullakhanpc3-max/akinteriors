'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { connectDB } from '@/lib/db/connect';
import { findOrCreateBranding } from '@/models/Branding';
import Branding from '@/models/Branding';
import { findOrCreateHomepage } from '@/models/Homepage';
import Homepage from '@/models/Homepage';
import { findOrCreateAboutPage } from '@/models/AboutPage';
import AboutPage from '@/models/AboutPage';
import { findOrCreateContactPage } from '@/models/ContactPage';
import ContactPage from '@/models/ContactPage';
import { findOrCreateSocialLinks } from '@/models/SocialLinks';
import SocialLinks from '@/models/SocialLinks';
import { findOrCreateSEOSettings } from '@/models/SEOSettings';
import SEOSettings from '@/models/SEOSettings';
import { findOrCreateNavigation } from '@/models/Navigation';
import Navigation from '@/models/Navigation';
import { findOrCreateFooter } from '@/models/FooterSettings';
import FooterSettings from '@/models/FooterSettings';

type ActionResult = { success: boolean; data?: unknown; error?: string };

async function respond<T>(fn: () => Promise<T>): Promise<ActionResult> {
  try {
    await connectDB();
    const data = await fn();
    return { success: true, data: JSON.parse(JSON.stringify(data)) };
  } catch (e) {
    return { success: false, error: (e as Error).message };
  }
}

// Branding
export async function getBranding() {
  return respond(() => findOrCreateBranding());
}
export async function updateBranding(data: Record<string, unknown>) {
  return respond(async () => {
    const doc = await Branding.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true });
    revalidateTag('branding', 'default');
    return doc;
  });
}

// Homepage
export async function getHomepage() {
  return respond(() => findOrCreateHomepage());
}
export async function updateHomepage(data: Record<string, unknown>) {
  return respond(async () => {
    const doc = await Homepage.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true });
    revalidatePath('/', 'page');
    revalidateTag('homepage', 'default');
    return doc;
  });
}

// About Page
export async function getAboutPage() {
  return respond(() => findOrCreateAboutPage());
}
export async function updateAboutPage(data: Record<string, unknown>) {
  return respond(async () => {
    const doc = await AboutPage.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true });
    revalidatePath('/about', 'page');
    revalidateTag('about', 'default');
    return doc;
  });
}

// Contact Page
export async function getContactPage() {
  return respond(() => findOrCreateContactPage());
}
export async function updateContactPage(data: Record<string, unknown>) {
  return respond(async () => {
    const doc = await ContactPage.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true });
    revalidatePath('/contact', 'page');
    revalidateTag('contact', 'default');
    return doc;
  });
}

// Social Links
export async function getSocialLinks() {
  return respond(() => findOrCreateSocialLinks());
}
export async function updateSocialLinks(data: Record<string, unknown>) {
  return respond(async () => {
    const doc = await SocialLinks.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true });
    revalidateTag('social', 'default');
    return doc;
  });
}

// SEO Settings
export async function getSEOSettings() {
  return respond(() => findOrCreateSEOSettings());
}
export async function updateSEOSettings(data: Record<string, unknown>) {
  return respond(async () => {
    const doc = await SEOSettings.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true });
    revalidateTag('seo', 'default');
    return doc;
  });
}

// Navigation
export async function getNavigation() {
  return respond(() => findOrCreateNavigation());
}
export async function updateNavigation(data: Record<string, unknown>) {
  return respond(async () => {
    const doc = await Navigation.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true });
    revalidateTag('nav', 'default');
    return doc;
  });
}

// Footer
export async function getFooter() {
  return respond(() => findOrCreateFooter());
}
export async function updateFooter(data: Record<string, unknown>) {
  return respond(async () => {
    const doc = await FooterSettings.findOneAndUpdate({}, { $set: data }, { new: true, upsert: true });
    revalidateTag('footer', 'default');
    return doc;
  });
}

// Bulk revalidation
export async function revalidateCMS() {
  revalidatePath('/', 'page');
  revalidatePath('/about', 'page');
  revalidatePath('/contact', 'page');
  revalidatePath('/services', 'page');
  revalidatePath('/projects', 'page');
  revalidateTag('branding', 'default');
  revalidateTag('homepage', 'default');
  revalidateTag('about', 'default');
  revalidateTag('contact', 'default');
  revalidateTag('social', 'default');
  revalidateTag('seo', 'default');
  revalidateTag('nav', 'default');
  revalidateTag('footer', 'default');
  return { success: true };
}
