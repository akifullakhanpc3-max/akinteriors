import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroSlide {
  image: string;
  imageLg: string;
  headline: string;
  subheadline: string;
  ctaText?: string;
  ctaLink?: string;
}

export interface IAboutContent {
  heading: string;
  paragraphs: string[];
  image: string;
  highlights: { icon: string; label: string; description: string }[];
  yearsExperience: number;
  projectsDelivered: number;
}

export interface IWhyChooseUsItem {
  icon: string;
  title: string;
  description: string;
}

export interface IStat {
  value: number;
  suffix: string;
  label: string;
}

export interface IProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface IFooterLink {
  label: string;
  href: string;
}

export interface ISocialLink {
  platform: string;
  url: string;
  icon: string;
}

export interface INavLink {
  label: string;
  href: string;
}

export interface IHeroConfig {
  slides: IHeroSlide[];
  stats: IStat[];
}

export interface IFooterContent {
  description: string;
  quickLinks: IFooterLink[];
  serviceLinks: IFooterLink[];
  socialLinks: ISocialLink[];
  newsletterTitle: string;
  copyright: string;
}

export interface INavConfig {
  links: INavLink[];
  ctaText: string;
  ctaLink: string;
}

export interface IWhatsAppConfig {
  number: string;
  message: string;
}

export interface ISEOConfig {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  keywords?: string[];
}

export interface IContactInfo {
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface ISocialLinks {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  pinterest?: string;
  youtube?: string;
}

export interface ISettings extends Document {
  siteName: string;
  siteDescription: string;
  logo?: string;
  favicon?: string;
  contact: IContactInfo;
  socialLinks: ISocialLinks;
  seo: ISEOConfig;
  aboutText?: string;
  missionStatement?: string;
  workingHours?: string;
  googleMapsApiKey?: string;
  analyticsId?: string;
  whatsapp: IWhatsAppConfig;
  maintenanceMode: boolean;
  hero: IHeroConfig;
  aboutSection: IAboutContent;
  whyChooseUs: IWhyChooseUsItem[];
  stats: IStat[];
  processSteps: IProcessStep[];
  footer: IFooterContent;
  nav: INavConfig;
  createdAt: Date;
  updatedAt: Date;
}

const HeroSlideSchema = new Schema<IHeroSlide>(
  {
    image: { type: String, default: '' },
    imageLg: { type: String, default: '' },
    headline: { type: String, default: '' },
    subheadline: { type: String, default: '' },
    ctaText: { type: String, default: '' },
    ctaLink: { type: String, default: '' },
  },
  { _id: false }
);

const StatSchema = new Schema<IStat>(
  {
    value: { type: Number, default: 0 },
    suffix: { type: String, default: '' },
    label: { type: String, default: '' },
  },
  { _id: false }
);

const WhyChooseUsItemSchema = new Schema<IWhyChooseUsItem>(
  {
    icon: { type: String, default: '' },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const ProcessStepSchema = new Schema<IProcessStep>(
  {
    step: { type: Number, default: 0 },
    title: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const FooterLinkSchema = new Schema<IFooterLink>(
  {
    label: { type: String, default: '' },
    href: { type: String, default: '' },
  },
  { _id: false }
);

const SocialLinkSchema = new Schema<ISocialLink>(
  {
    platform: { type: String, default: '' },
    url: { type: String, default: '' },
    icon: { type: String, default: '' },
  },
  { _id: false }
);

const NavLinkSchema = new Schema<INavLink>(
  {
    label: { type: String, default: '' },
    href: { type: String, default: '' },
  },
  { _id: false }
);

const AboutHighlightSchema = new Schema(
  {
    icon: { type: String, default: '' },
    label: { type: String, default: '' },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const ContactInfoSchema = new Schema<IContactInfo>(
  {
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    zip: { type: String, trim: true },
    country: { type: String, trim: true, default: 'IN' },
  },
  { _id: false }
);

const SocialLinksSchema = new Schema<ISocialLinks>(
  {
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    instagram: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    pinterest: { type: String, trim: true },
    youtube: { type: String, trim: true },
  },
  { _id: false }
);

const SEOConfigSchema = new Schema<ISEOConfig>(
  {
    metaTitle: { type: String, trim: true, maxlength: 70 },
    metaDescription: { type: String, trim: true, maxlength: 160 },
    ogImage: { type: String, trim: true },
    keywords: { type: [String], default: [] },
  },
  { _id: false }
);

const WhatsAppSchema = new Schema<IWhatsAppConfig>(
  {
    number: { type: String, default: '' },
    message: { type: String, default: 'Hi! I would like to know more about your services.' },
  },
  { _id: false }
);

const SettingsSchema = new Schema<ISettings>(
  {
    siteName: {
      type: String,
      required: [true, 'Site name is required'],
      trim: true,
      maxlength: [100, 'Site name cannot exceed 100 characters'],
    },
    siteDescription: {
      type: String,
      required: [true, 'Site description is required'],
      trim: true,
      maxlength: [300, 'Site description cannot exceed 300 characters'],
    },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    contact: { type: ContactInfoSchema, default: {} },
    socialLinks: { type: SocialLinksSchema, default: {} },
    seo: { type: SEOConfigSchema, default: {} },
    aboutText: { type: String, default: '' },
    missionStatement: { type: String, default: '' },
    workingHours: { type: String, default: '' },
    googleMapsApiKey: { type: String, default: '' },
    analyticsId: { type: String, default: '' },
    whatsapp: { type: WhatsAppSchema, default: {} },
    maintenanceMode: {
      type: Boolean,
      default: false,
    },
    hero: {
      type: new Schema(
        {
          slides: { type: [HeroSlideSchema], default: [] },
          stats: { type: [StatSchema], default: [] },
        },
        { _id: false }
      ),
      default: {},
    },
    aboutSection: {
      type: new Schema(
        {
          heading: { type: String, default: '' },
          paragraphs: { type: [String], default: [] },
          image: { type: String, default: '' },
          highlights: { type: [AboutHighlightSchema], default: [] },
          yearsExperience: { type: Number, default: 15 },
          projectsDelivered: { type: Number, default: 500 },
        },
        { _id: false }
      ),
      default: {},
    },
    whyChooseUs: {
      type: [WhyChooseUsItemSchema],
      default: [],
    },
    stats: {
      type: [StatSchema],
      default: [],
    },
    processSteps: {
      type: [ProcessStepSchema],
      default: [],
    },
    footer: {
      type: new Schema(
        {
          description: { type: String, default: '' },
          quickLinks: { type: [FooterLinkSchema], default: [] },
          serviceLinks: { type: [FooterLinkSchema], default: [] },
          socialLinks: { type: [SocialLinkSchema], default: [] },
          newsletterTitle: { type: String, default: '' },
          copyright: { type: String, default: '' },
        },
        { _id: false }
      ),
      default: {},
    },
    nav: {
      type: new Schema(
        {
          links: { type: [NavLinkSchema], default: [] },
          ctaText: { type: String, default: '' },
          ctaLink: { type: String, default: '' },
        },
        { _id: false }
      ),
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export async function findOrCreateSettings(): Promise<ISettings> {
  const settings = await Settings.findOne();
  if (settings) return settings;
  return Settings.create({
    siteName: 'AkInteriors',
    siteDescription: 'Premium Interior Design Services',
    hero: {
      slides: [
        {
          image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&q=60',
          imageLg: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1920&q=60',
          headline: 'Transforming Spaces Into Timeless Experiences',
          subheadline: 'Luxury Interior Design Solutions For Modern Living',
        },
        {
          image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=60',
          imageLg: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=60',
          headline: 'Elegance Redefined For Your Home',
          subheadline: 'Bespoke Interior Design Tailored To Your Lifestyle',
        },
        {
          image: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1200&q=60',
          imageLg: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1920&q=60',
          headline: 'Where Vision Meets Perfection',
          subheadline: 'Creating Extraordinary Spaces That Inspire',
        },
      ],
      stats: [
        { value: 500, suffix: '+', label: 'Projects' },
        { value: 300, suffix: '+', label: 'Clients' },
        { value: 15, suffix: '+', label: 'Years' },
      ],
    },
    aboutSection: {
      heading: 'Crafting Dreams Into Reality',
      paragraphs: [
        'At AkInteriors, we believe every space has a story to tell. With over 15 years of experience in luxury interior design, we have transformed hundreds of spaces across India into breathtaking environments that blend aesthetics with functionality.',
        'Our team of award-winning designers brings together global design trends with local craftsmanship, creating interiors that are both timeless and contemporary. From intimate home makeovers to large-scale commercial projects, we deliver excellence in every detail.',
      ],
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=60',
      highlights: [
        { icon: 'Award', label: 'Award Winning', description: 'Recognized for design excellence' },
        { icon: 'Target', label: 'Our Mission', description: 'To create inspiring spaces that enhance lives through innovative design' },
        { icon: 'Eye', label: 'Our Vision', description: 'To be the most trusted luxury interior design brand in India' },
        { icon: 'Users', label: 'Expert Team', description: '25+ skilled designers and craftsmen' },
      ],
      yearsExperience: 15,
      projectsDelivered: 500,
    },
    whyChooseUs: [
      { icon: 'Star', title: 'Expert Designers', description: 'Our team of award-winning designers brings years of experience and creativity to every project.' },
      { icon: 'Gem', title: 'Premium Materials', description: 'We source only the finest materials from around the world for lasting quality.' },
      { icon: 'Eye', title: 'Transparent Pricing', description: 'No hidden costs. Clear, detailed quotations for every project.' },
      { icon: 'Clock', title: 'On-Time Delivery', description: 'We respect your time and deliver projects within the promised timeline.' },
      { icon: 'Monitor', title: '3D Visualization', description: 'See your space before we build it with photorealistic 3D renders.' },
      { icon: 'CheckCircle2', title: 'End-to-End Execution', description: 'From concept to completion, we handle everything with precision.' },
    ],
    stats: [
      { value: 500, suffix: '+', label: 'Projects Completed' },
      { value: 300, suffix: '+', label: 'Happy Clients' },
      { value: 15, suffix: '+', label: 'Years Experience' },
      { value: 25, suffix: '+', label: 'Design Experts' },
    ],
    processSteps: [
      { step: 1, title: 'Consultation', description: 'We begin with a detailed consultation to understand your vision, needs, and budget.' },
      { step: 2, title: 'Planning', description: 'Our team creates a comprehensive plan including layouts, material selection, and timelines.' },
      { step: 3, title: 'Design', description: 'We present photorealistic 3D designs and refine them based on your feedback.' },
      { step: 4, title: 'Execution', description: 'Our skilled craftsmen bring the design to life with precision and attention to detail.' },
      { step: 5, title: 'Handover', description: 'We deliver your dream space with a final walkthrough and post-completion support.' },
    ],
    footer: {
      description: 'Transforming spaces into timeless experiences. We create luxury interiors that reflect your personality and elevate your lifestyle.',
      quickLinks: [
        { label: 'Home', href: '/' },
        { label: 'About Us', href: '/about' },
        { label: 'Projects', href: '/projects' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
        { label: 'FAQ', href: '/#faq' },
      ],
      serviceLinks: [
        { label: 'Residential Interiors', href: '/services' },
        { label: 'Commercial Interiors', href: '/services' },
        { label: 'Modular Kitchens', href: '/services' },
        { label: 'Living Room Design', href: '/services' },
        { label: 'Office Design', href: '/services' },
        { label: 'Renovation Services', href: '/services' },
      ],
      socialLinks: [
        { platform: 'Facebook', url: '#', icon: 'Globe' },
        { platform: 'Instagram', url: '#', icon: 'Camera' },
        { platform: 'LinkedIn', url: '#', icon: 'Briefcase' },
        { platform: 'YouTube', url: '#', icon: 'Play' },
      ],
      newsletterTitle: 'Subscribe to our newsletter',
      copyright: 'AkInteriors. All rights reserved.',
    },
    nav: {
      links: [
        { label: 'Home', href: '/' },
        { label: 'Projects', href: '/projects' },
        { label: 'Services', href: '/services' },
        { label: 'About', href: '/about' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
      ],
      ctaText: 'Get Free Quote',
      ctaLink: '/contact',
    },
    contact: {
      email: 'info@akinteriors.com',
      phone: '+91 99999 99999',
      address: '123 Design Street',
      city: 'Bangalore',
      state: 'Karnataka',
      zip: '560001',
      country: 'IN',
    },
    workingHours: 'Mon-Sat: 10:00 AM - 7:00 PM',
    whatsapp: {
      number: '919999999999',
      message: 'Hi! I would like to know more about your services.',
    },
    seo: {
      metaTitle: 'AkInteriors | Luxury Interior Design Agency',
      metaDescription: 'Transforming spaces into timeless experiences. Premium interior design solutions for residential and commercial spaces.',
      keywords: ['interior design', 'luxury interiors', 'home interiors', 'commercial interiors', 'modular kitchen', 'Bangalore interior designers'],
      ogImage: '/og-image.jpg',
    },
  });
}

export default Settings;
