import mongoose, { Schema, Document } from 'mongoose';

export interface ISocialLink {
  platform: string; url: string; icon: string;
  enabled: boolean; openNewTab: boolean; order: number;
}
export interface ISocialLinks extends Document { links: ISocialLink[]; }

const SocialLinkSchema = new Schema<ISocialLink>({
  platform: { type: String, required: true },
  url: String, icon: String,
  enabled: { type: Boolean, default: true },
  openNewTab: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
}, { _id: false });

const SocialLinksSchema = new Schema<ISocialLinks>({
  links: { type: [SocialLinkSchema], default: [
    { platform: 'Facebook', url: '', icon: 'Facebook', enabled: true, openNewTab: true, order: 0 },
    { platform: 'Instagram', url: '', icon: 'Instagram', enabled: true, openNewTab: true, order: 1 },
    { platform: 'LinkedIn', url: '', icon: 'Linkedin', enabled: true, openNewTab: true, order: 2 },
    { platform: 'YouTube', url: '', icon: 'Youtube', enabled: true, openNewTab: true, order: 3 },
    { platform: 'Pinterest', url: '', icon: 'Pinterest', enabled: true, openNewTab: true, order: 4 },
    { platform: 'Twitter', url: '', icon: 'Twitter', enabled: true, openNewTab: true, order: 5 },
    { platform: 'Threads', url: '', icon: 'MessageCircle', enabled: true, openNewTab: true, order: 6 },
    { platform: 'Behance', url: '', icon: 'Briefcase', enabled: true, openNewTab: true, order: 7 },
    { platform: 'Houzz', url: '', icon: 'Home', enabled: true, openNewTab: true, order: 8 },
  ]},
}, { timestamps: true });

const SocialLinks = mongoose.models.SocialLinks || mongoose.model<ISocialLinks>('SocialLinks', SocialLinksSchema);
export default SocialLinks;

export async function findOrCreateSocialLinks(): Promise<ISocialLinks> {
  const doc = await SocialLinks.findOne();
  if (doc) return doc;
  return SocialLinks.create({});
}
