import mongoose, { Schema, Document } from 'mongoose';

export interface IPageSEO {
  page: string; metaTitle: string; metaDescription: string;
  keywords: string[]; canonicalUrl: string; ogImage: string; twitterCard: string;
}

export interface ISEOSettings extends Document { pages: IPageSEO[]; }

const PageSEOSchema = new Schema<IPageSEO>({
  page: { type: String, required: true },
  metaTitle: String, metaDescription: String,
  keywords: [String], canonicalUrl: String, ogImage: String,
  twitterCard: { type: String, default: 'summary_large_image' },
}, { _id: false });

const SEOSettingsSchema = new Schema<ISEOSettings>({
  pages: { type: [PageSEOSchema], default: [
    { page: 'home', metaTitle: '', metaDescription: '', keywords: [], canonicalUrl: '', ogImage: '', twitterCard: 'summary_large_image' },
    { page: 'about', metaTitle: '', metaDescription: '', keywords: [], canonicalUrl: '', ogImage: '', twitterCard: 'summary_large_image' },
    { page: 'services', metaTitle: '', metaDescription: '', keywords: [], canonicalUrl: '', ogImage: '', twitterCard: 'summary_large_image' },
    { page: 'projects', metaTitle: '', metaDescription: '', keywords: [], canonicalUrl: '', ogImage: '', twitterCard: 'summary_large_image' },
    { page: 'contact', metaTitle: '', metaDescription: '', keywords: [], canonicalUrl: '', ogImage: '', twitterCard: 'summary_large_image' },
    { page: 'blog', metaTitle: '', metaDescription: '', keywords: [], canonicalUrl: '', ogImage: '', twitterCard: 'summary_large_image' },
  ]},
}, { timestamps: true });

const SEOSettings = mongoose.models.SEOSettings || mongoose.model<ISEOSettings>('SEOSettings', SEOSettingsSchema);
export default SEOSettings;

export async function findOrCreateSEOSettings(): Promise<ISEOSettings> {
  const doc = await SEOSettings.findOne();
  if (doc) return doc;
  return SEOSettings.create({});
}
