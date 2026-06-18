import mongoose, { Schema, Document } from 'mongoose';

export interface IHeroSlide { image: string; imageLg: string; headline: string; subheadline: string; ctaText?: string; ctaLink?: string; }
export interface IHeroStat { value: number; suffix: string; label: string; }
export interface IWhyChooseUsItem { icon: string; title: string; description: string; }
export interface IProcessStep { step: number; title: string; description: string; }

export interface IHomepageSection {
  id: string; type: string; enabled: boolean; order: number;
  heading?: string; subheading?: string; content?: string;
  image?: string; ctaText?: string; ctaLink?: string;
  slides?: IHeroSlide[]; stats?: IHeroStat[];
  items?: IWhyChooseUsItem[]; steps?: IProcessStep[];
}

export interface IHomepage extends Document {
  sections: IHomepageSection[];
  layout: string; containerWidth: string;
}

const HeroSlideSchema = new Schema<IHeroSlide>({
  image: String, imageLg: String, headline: String, subheadline: String,
  ctaText: String, ctaLink: String,
}, { _id: false });

const HeroStatSchema = new Schema<IHeroStat>({
  value: Number, suffix: String, label: String,
}, { _id: false });

const WhyChooseUsItemSchema = new Schema<IWhyChooseUsItem>({
  icon: String, title: String, description: String,
}, { _id: false });

const ProcessStepSchema = new Schema<IProcessStep>({
  step: Number, title: String, description: String,
}, { _id: false });

const HomepageSectionSchema = new Schema<IHomepageSection>({
  id: { type: String, required: true },
  type: { type: String, required: true },
  enabled: { type: Boolean, default: true },
  order: { type: Number, default: 0 },
  heading: String, subheading: String, content: String,
  image: String, ctaText: String, ctaLink: String,
  slides: [HeroSlideSchema], stats: [HeroStatSchema],
  items: [WhyChooseUsItemSchema], steps: [ProcessStepSchema],
}, { _id: false });

const HomepageSchema = new Schema<IHomepage>({
  sections: { type: [HomepageSectionSchema], default: [
    {
      id: 'hero', type: 'hero', enabled: true, order: 0,
      slides: [
        { image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&q=60', imageLg: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1920&q=60', headline: 'Transforming Spaces Into Timeless Experiences', subheadline: 'Luxury Interior Design Solutions For Modern Living' },
        { image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=60', imageLg: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=60', headline: 'Elegance Redefined For Your Home', subheadline: 'Bespoke Interior Design Tailored To Your Lifestyle' },
        { image: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1200&q=60', imageLg: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1920&q=60', headline: 'Where Vision Meets Perfection', subheadline: 'Creating Extraordinary Spaces That Inspire' },
      ],
      stats: [
        { value: 500, suffix: '+', label: 'Projects' },
        { value: 300, suffix: '+', label: 'Clients' },
        { value: 15, suffix: '+', label: 'Years' },
      ],
    },
    { id: 'about', type: 'about', enabled: true, order: 1, heading: 'About Us', content: 'At AkInteriors, we believe every space has a story to tell. With over 15 years of experience in luxury interior design, we have transformed hundreds of spaces across India into breathtaking environments that blend aesthetics with functionality.\nOur team of award-winning designers brings together global design trends with local craftsmanship, creating interiors that are both timeless and contemporary. From intimate home makeovers to large-scale commercial projects, we deliver excellence in every detail.', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=60' },
    { id: 'services', type: 'services', enabled: true, order: 2, heading: 'Our Services', subheading: 'Comprehensive Design Solutions', content: 'From concept to completion, we offer end-to-end interior design services tailored to your unique style and requirements.' },
    {
      id: 'why-choose-us', type: 'why-choose-us', enabled: true, order: 3, heading: 'Why Choose Us', subheading: 'What Sets Us Apart', content: 'We combine creativity with craftsmanship to deliver interiors that exceed expectations.',
      items: [
        { icon: 'Star', title: 'Expert Designers', description: 'Our team of award-winning designers brings years of experience and creativity to every project.' },
        { icon: 'Gem', title: 'Premium Materials', description: 'We source only the finest materials from around the world for lasting quality.' },
        { icon: 'Eye', title: 'Transparent Pricing', description: 'No hidden costs. Clear, detailed quotations for every project.' },
        { icon: 'Clock', title: 'On-Time Delivery', description: 'We respect your time and deliver projects within the promised timeline.' },
        { icon: 'Monitor', title: '3D Visualization', description: 'See your space before we build it with photorealistic 3D renders.' },
        { icon: 'CheckCircle2', title: 'End-to-End Execution', description: 'From concept to completion, we handle everything with precision.' },
      ],
    },
    { id: 'stats', type: 'stats', enabled: true, order: 4, heading: 'Our Impact', subheading: 'Numbers That Speak' },
    { id: 'projects', type: 'projects', enabled: true, order: 5, heading: 'Our Portfolio', subheading: 'Featured Projects', content: 'Explore our curated collection of premium interior design projects.' },
    {
      id: 'process', type: 'process', enabled: true, order: 6, heading: 'Our Process', subheading: 'How We Work', content: 'A streamlined approach that ensures every project is delivered with excellence.',
      steps: [
        { step: 1, title: 'Consultation', description: 'We begin with a detailed consultation to understand your vision, needs, and budget.' },
        { step: 2, title: 'Planning', description: 'Our team creates a comprehensive plan including layouts, material selection, and timelines.' },
        { step: 3, title: 'Design', description: 'We present photorealistic 3D designs and refine them based on your feedback.' },
        { step: 4, title: 'Execution', description: 'Our skilled craftsmen bring the design to life with precision and attention to detail.' },
        { step: 5, title: 'Handover', description: 'We deliver your dream space with a final walkthrough and post-completion support.' },
      ],
    },
    { id: 'testimonials', type: 'testimonials', enabled: true, order: 7, heading: 'Testimonials', subheading: 'What Our Clients Say' },
    { id: 'team', type: 'team', enabled: true, order: 8, heading: 'Our Team', subheading: 'Meet The Experts', content: 'Talented professionals dedicated to creating extraordinary spaces.' },
    { id: 'faq', type: 'faq', enabled: true, order: 9, heading: 'FAQ', subheading: 'Frequently Asked Questions' },
    { id: 'contact', type: 'contact', enabled: true, order: 10, heading: 'Get In Touch', subheading: "Let's Create Something Beautiful", content: 'Ready to transform your space? Reach out to us for a free consultation.' },
  ]},
  layout: { type: String, default: 'full-width' },
  containerWidth: { type: String, default: 'max-w-7xl' },
}, { timestamps: true });

const Homepage = mongoose.models.Homepage || mongoose.model<IHomepage>('Homepage', HomepageSchema);
export default Homepage;

export async function findOrCreateHomepage(): Promise<IHomepage> {
  let doc = await Homepage.findOne();
  if (!doc) {
    doc = await Homepage.create({});
    return doc;
  }
  // Fill in missing fields on existing doc from schema defaults
  const defaultSections: IHomepageSection[] = [
    {
      id: 'hero', type: 'hero', enabled: true, order: 0,
      slides: [
        { image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1200&q=60', imageLg: 'https://images.unsplash.com/photo-1618220179428-22790b461013?w=1920&q=60', headline: 'Transforming Spaces Into Timeless Experiences', subheadline: 'Luxury Interior Design Solutions For Modern Living' },
        { image: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1200&q=60', imageLg: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=1920&q=60', headline: 'Elegance Redefined For Your Home', subheadline: 'Bespoke Interior Design Tailored To Your Lifestyle' },
        { image: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1200&q=60', imageLg: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?w=1920&q=60', headline: 'Where Vision Meets Perfection', subheadline: 'Creating Extraordinary Spaces That Inspire' },
      ],
      stats: [
        { value: 500, suffix: '+', label: 'Projects' },
        { value: 300, suffix: '+', label: 'Clients' },
        { value: 15, suffix: '+', label: 'Years' },
      ],
    },
    { id: 'about', type: 'about', enabled: true, order: 1, heading: 'About Us', content: 'At AkInteriors, we believe every space has a story to tell. With over 15 years of experience in luxury interior design, we have transformed hundreds of spaces across India into breathtaking environments that blend aesthetics with functionality.\nOur team of award-winning designers brings together global design trends with local craftsmanship, creating interiors that are both timeless and contemporary. From intimate home makeovers to large-scale commercial projects, we deliver excellence in every detail.', image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=700&q=60' },
    { id: 'services', type: 'services', enabled: true, order: 2, heading: 'Our Services', subheading: 'Comprehensive Design Solutions', content: 'From concept to completion, we offer end-to-end interior design services tailored to your unique style and requirements.' },
    {
      id: 'why-choose-us', type: 'why-choose-us', enabled: true, order: 3, heading: 'Why Choose Us', subheading: 'What Sets Us Apart', content: 'We combine creativity with craftsmanship to deliver interiors that exceed expectations.',
      items: [
        { icon: 'Star', title: 'Expert Designers', description: 'Our team of award-winning designers brings years of experience and creativity to every project.' },
        { icon: 'Gem', title: 'Premium Materials', description: 'We source only the finest materials from around the world for lasting quality.' },
        { icon: 'Eye', title: 'Transparent Pricing', description: 'No hidden costs. Clear, detailed quotations for every project.' },
        { icon: 'Clock', title: 'On-Time Delivery', description: 'We respect your time and deliver projects within the promised timeline.' },
        { icon: 'Monitor', title: '3D Visualization', description: 'See your space before we build it with photorealistic 3D renders.' },
        { icon: 'CheckCircle2', title: 'End-to-End Execution', description: 'From concept to completion, we handle everything with precision.' },
      ],
    },
    { id: 'stats', type: 'stats', enabled: true, order: 4, heading: 'Our Impact', subheading: 'Numbers That Speak' },
    { id: 'projects', type: 'projects', enabled: true, order: 5, heading: 'Our Portfolio', subheading: 'Featured Projects', content: 'Explore our curated collection of premium interior design projects.' },
    {
      id: 'process', type: 'process', enabled: true, order: 6, heading: 'Our Process', subheading: 'How We Work', content: 'A streamlined approach that ensures every project is delivered with excellence.',
      steps: [
        { step: 1, title: 'Consultation', description: 'We begin with a detailed consultation to understand your vision, needs, and budget.' },
        { step: 2, title: 'Planning', description: 'Our team creates a comprehensive plan including layouts, material selection, and timelines.' },
        { step: 3, title: 'Design', description: 'We present photorealistic 3D designs and refine them based on your feedback.' },
        { step: 4, title: 'Execution', description: 'Our skilled craftsmen bring the design to life with precision and attention to detail.' },
        { step: 5, title: 'Handover', description: 'We deliver your dream space with a final walkthrough and post-completion support.' },
      ],
    },
    { id: 'testimonials', type: 'testimonials', enabled: true, order: 7, heading: 'Testimonials', subheading: 'What Our Clients Say' },
    { id: 'team', type: 'team', enabled: true, order: 8, heading: 'Our Team', subheading: 'Meet The Experts', content: 'Talented professionals dedicated to creating extraordinary spaces.' },
    { id: 'faq', type: 'faq', enabled: true, order: 9, heading: 'FAQ', subheading: 'Frequently Asked Questions' },
    { id: 'contact', type: 'contact', enabled: true, order: 10, heading: 'Get In Touch', subheading: "Let's Create Something Beautiful", content: 'Ready to transform your space? Reach out to us for a free consultation.' },
  ];
  let changed = false;
  doc.sections = doc.sections.map((s: any) => {
    const def = defaultSections.find((d) => d.type === s.type);
    if (!def) return s;
    const merged: any = { ...s.toObject?.() ?? s };
    let sectionChanged = false;
    // Fill missing heading, subheading, content, image
    if (!merged.heading && def.heading) { merged.heading = def.heading; sectionChanged = true; }
    if (!merged.subheading && def.subheading) { merged.subheading = def.subheading; sectionChanged = true; }
    if (!merged.content && def.content) { merged.content = def.content; sectionChanged = true; }
    if (!merged.image && def.image) { merged.image = def.image; sectionChanged = true; }
    // Fill missing slides
    if (s.type === 'hero' && def.slides && (!merged.slides || merged.slides.length === 0)) {
      merged.slides = def.slides; sectionChanged = true;
    }
    // Fill missing stats
    if (s.type === 'hero' && def.stats && (!merged.stats || merged.stats.length === 0)) {
      merged.stats = def.stats; sectionChanged = true;
    }
    // Fill missing items
    if (s.type === 'why-choose-us' && def.items && (!merged.items || merged.items.length === 0)) {
      merged.items = def.items; sectionChanged = true;
    }
    // Fill missing steps
    if (s.type === 'process' && def.steps && (!merged.steps || merged.steps.length === 0)) {
      merged.steps = def.steps; sectionChanged = true;
    }
    if (sectionChanged) changed = true;
    return merged;
  });
  if (changed) {
    doc.markModified('sections');
    await doc.save();
  }
  return doc;
}
