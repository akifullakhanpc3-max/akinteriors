import mongoose, { Schema, Document } from 'mongoose';

export interface IBranding extends Document {
  siteName: string;
  logo: string; mobileLogo: string; footerLogo: string; adminLogo: string;
  darkLogo: string; lightLogo: string; favicon: string; appIcon: string;
  primaryColor: string; secondaryColor: string;
}

const BrandingSchema = new Schema<IBranding>({
  siteName: { type: String, default: 'AkInteriors' },
  logo: String, mobileLogo: String, footerLogo: String, adminLogo: String,
  darkLogo: String, lightLogo: String, favicon: String, appIcon: String,
  primaryColor: { type: String, default: '#C8A97E' },
  secondaryColor: { type: String, default: '#111827' },
}, { timestamps: true });

const Branding = mongoose.models.Branding || mongoose.model<IBranding>('Branding', BrandingSchema);
export default Branding;

export async function findOrCreateBranding(): Promise<IBranding> {
  const doc = await Branding.findOne();
  if (doc) return doc;
  return Branding.create({});
}
