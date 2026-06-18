import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Invalid phone number'),
  service: z.string().optional(),
  budget: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export const projectSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  category: z.string(),
  location: z.string().optional(),
  budget: z.string().optional(),
  area: z.string().optional(),
  completionDate: z.string().optional(),
  clientName: z.string().optional(),
  status: z.enum(['draft', 'published']),
  featured: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const serviceSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  icon: z.string().min(1),
  displayOrder: z.number().int().positive(),
});

export const testimonialSchema = z.object({
  name: z.string().min(2),
  rating: z.number().min(1).max(5),
  designation: z.string().min(2),
  review: z.string().min(10),
});

export const teamMemberSchema = z.object({
  name: z.string().min(2),
  designation: z.string().min(2),
  bio: z.string().optional(),
  socialLinks: z.object({
    linkedin: z.string().url().optional().or(z.literal('')),
    twitter: z.string().url().optional().or(z.literal('')),
    instagram: z.string().url().optional().or(z.literal('')),
  }).optional(),
});

export const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(10),
  order: z.number().int().positive(),
});

export const blogSchema = z.object({
  title: z.string().min(2),
  content: z.string().min(50),
  category: z.string().min(2),
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  status: z.enum(['draft', 'published']),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const imageSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  category: z.enum([
    'hero', 'about', 'services', 'projects',
    'testimonials', 'team', 'blog', 'contact',
    'footer', 'branding',
  ]),
  section: z.string().min(2, 'Section is required'),
  altText: z.string().optional().default(''),
  displayOrder: z.number().int().min(0).optional().default(0),
  isActive: z.boolean().optional().default(true),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type ProjectInput = z.infer<typeof projectSchema>;
export type ServiceInput = z.infer<typeof serviceSchema>;
export type TestimonialInput = z.infer<typeof testimonialSchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;
export type FAQInput = z.infer<typeof faqSchema>;
export type BlogInput = z.infer<typeof blogSchema>;
export type ImageInput = z.infer<typeof imageSchema>;
