import mongoose, { Schema, Document } from 'mongoose';

export interface INavLink { label: string; href: string; order: number; }
export interface INavigation extends Document {
  links: INavLink[]; ctaText: string; ctaLink: string; sticky: boolean;
}

const NavLinkSchema = new Schema<INavLink>({
  label: { type: String, required: true },
  href: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { _id: false });

const NavigationSchema = new Schema<INavigation>({
  links: { type: [NavLinkSchema], default: [
    { label: 'Home', href: '/', order: 0 },
    { label: 'Projects', href: '/projects', order: 1 },
    { label: 'Services', href: '/services', order: 2 },
    { label: 'About', href: '/about', order: 3 },
    { label: 'Blog', href: '/blog', order: 4 },
    { label: 'Contact', href: '/contact', order: 5 },
  ]},
  ctaText: { type: String, default: 'Get Free Quote' },
  ctaLink: { type: String, default: '/contact' },
  sticky: { type: Boolean, default: true },
}, { timestamps: true });

const Navigation = mongoose.models.Navigation || mongoose.model<INavigation>('Navigation', NavigationSchema);
export default Navigation;

export async function findOrCreateNavigation(): Promise<INavigation> {
  const doc = await Navigation.findOne();
  if (doc) return doc;
  return Navigation.create({});
}
