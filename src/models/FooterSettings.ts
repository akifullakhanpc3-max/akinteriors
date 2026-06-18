import mongoose, { Schema, Document } from 'mongoose';

export interface IFooterLink { label: string; href: string; }
export interface IFooterSettings extends Document {
  description: string; quickLinks: IFooterLink[]; serviceLinks: IFooterLink[];
  newsletterTitle: string; copyright: string;
  showNewsletter: boolean; backgroundColor: string; textColor: string;
}

const FooterLinkSchema = new Schema<IFooterLink>({
  label: String, href: String,
}, { _id: false });

const FooterSettingsSchema = new Schema<IFooterSettings>({
  description: { type: String, default: 'Transforming spaces into timeless experiences. We create luxury interiors that reflect your personality and elevate your lifestyle.' },
  quickLinks: { type: [FooterLinkSchema], default: [
    { label: 'Home', href: '/' }, { label: 'About Us', href: '/about' },
    { label: 'Projects', href: '/projects' }, { label: 'Blog', href: '/blog' },
    { label: 'Contact', href: '/contact' }, { label: 'FAQ', href: '/#faq' },
  ]},
  serviceLinks: { type: [FooterLinkSchema], default: [
    { label: 'Residential Interiors', href: '/services' }, { label: 'Commercial Interiors', href: '/services' },
    { label: 'Modular Kitchens', href: '/services' }, { label: 'Living Room Design', href: '/services' },
    { label: 'Office Design', href: '/services' }, { label: 'Renovation Services', href: '/services' },
  ]},
  newsletterTitle: { type: String, default: 'Subscribe to our newsletter' },
  copyright: { type: String, default: 'AkInteriors. All rights reserved.' },
  showNewsletter: { type: Boolean, default: true },
  backgroundColor: { type: String, default: '#111827' },
  textColor: { type: String, default: '#ffffff' },
}, { timestamps: true });

const FooterSettings = mongoose.models.FooterSettings || mongoose.model<IFooterSettings>('FooterSettings', FooterSettingsSchema);
export default FooterSettings;

export async function findOrCreateFooter(): Promise<IFooterSettings> {
  const doc = await FooterSettings.findOne();
  if (doc) return doc;
  return FooterSettings.create({});
}
