'use server';

/* eslint-disable @typescript-eslint/no-explicit-any */

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/connect';
import Service from '@/models/Service';
import Project from '@/models/Project';
import TeamMember from '@/models/TeamMember';
import Testimonial from '@/models/Testimonial';
import FAQ from '@/models/FAQ';
import FooterSettings from '@/models/FooterSettings';
import Homepage from '@/models/Homepage';
import Inquiry from '@/models/Inquiry';
import Blog from '@/models/Blog';
import {
  revalidateServices,
  revalidateProjects,
  revalidateTeam,
  revalidateTestimonials,
  revalidateFAQs,
} from './data';

function checkAccess(session: any, allowEditor = false) {
  if (!session || !session.user) return false;
  if (allowEditor && (session.user.role === 'admin' || session.user.role === 'editor')) return true;
  return session.user.role === 'admin';
}

const ITEMS_PER_PAGE = 10;

async function paginatedQuery<T>(
  model: any,
  query: Record<string, unknown> = {},
  sort: Record<string, 1 | -1> = { createdAt: -1 },
  page: number = 1,
  limit: number = ITEMS_PER_PAGE
) {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    model.find(query).sort(sort).skip(skip).limit(limit).lean(),
    model.countDocuments(query),
  ]);
  return {
    items: JSON.parse(JSON.stringify(items)) as T[],
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

// ─── SERVICES ────────────────────────────────────────────────────────────────

export async function createService(data: {
  title: string;
  description: string;
  content?: string;
  image?: string;
  icon: string;
  displayOrder?: number;
  isActive?: boolean;
}) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    const service = await Service.create(data);
    revalidateServices();
    return { success: true, service: JSON.parse(JSON.stringify(service.toObject())) };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to create service' };
  }
}

export async function updateService(id: string, data: Partial<{
  title: string;
  description: string;
  content: string;
  image: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
}>) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    const service = await Service.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    if (!service) return { success: false, error: 'Service not found' };
    revalidateServices();
    return { success: true, service: JSON.parse(JSON.stringify(service)) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update service' };
  }
}

export async function deleteService(id: string) {
  const session = await auth();
  if (!checkAccess(session)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    await Service.findByIdAndDelete(id);
    revalidateServices();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete service' };
  }
}

export async function getAdminServices(page?: number) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  if (page) {
    const result = await paginatedQuery<any>(Service, {}, { displayOrder: 1 }, page);
    return { success: true, ...result };
  }
  const services = await Service.find().sort({ displayOrder: 1 }).lean();
  return { success: true, services: JSON.parse(JSON.stringify(services)) };
}

export async function getAdminService(id: string) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  const service = await Service.findById(id).lean();
  if (!service) return { success: false, error: 'Service not found' };
  return { success: true, service: JSON.parse(JSON.stringify(service)) };
}

// ─── PROJECTS ────────────────────────────────────────────────────────────────

export async function createProject(data: {
  title: string;
  description: string;
  content?: string;
  categories: string[];
  coverImage?: string;
  images?: string[];
  location?: string;
  area?: string;
  duration?: string;
  clientName?: string;
  status?: 'draft' | 'published';
  featured?: boolean;
  metaTitle?: string;
  metaDescription?: string;
  tags?: string[];
}) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    const project = await Project.create(data as any);
    revalidateProjects();
    return { success: true, project: JSON.parse(JSON.stringify(project.toObject())) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create project' };
  }
}

export async function updateProject(id: string, data: Partial<{
  title: string;
  description: string;
  content: string;
  categories: string[];
  coverImage: string;
  images: string[];
  location: string;
  area: string;
  duration: string;
  clientName: string;
  status: 'draft' | 'published';
  featured: boolean;
  metaTitle: string;
  metaDescription: string;
  tags: string[];
}>) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    const project = await Project.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    if (!project) return { success: false, error: 'Project not found' };
    revalidateProjects();
    return { success: true, project: JSON.parse(JSON.stringify(project)) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update project' };
  }
}

export async function deleteProject(id: string) {
  const session = await auth();
  if (!checkAccess(session)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    await Project.findByIdAndDelete(id);
    revalidateProjects();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete project' };
  }
}

export async function getAdminProjects(page?: number) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  if (page) {
    const result = await paginatedQuery<any>(Project, {}, { createdAt: -1 }, page);
    return { success: true, ...result };
  }
  const projects = await Project.find().sort({ createdAt: -1 }).lean();
  return { success: true, projects: JSON.parse(JSON.stringify(projects)) };
}

export async function getAdminProject(id: string) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  const project = await Project.findById(id).lean();
  if (!project) return { success: false, error: 'Project not found' };
  return { success: true, project: JSON.parse(JSON.stringify(project)) };
}

// ─── TEAM MEMBERS ────────────────────────────────────────────────────────────

export async function createTeamMember(data: {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  email?: string;
  socialLinks?: { linkedin?: string; twitter?: string; instagram?: string };
  displayOrder?: number;
  isActive?: boolean;
}) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    const member = await TeamMember.create(data);
    revalidateTeam();
    return { success: true, member: JSON.parse(JSON.stringify(member.toObject())) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create team member' };
  }
}

export async function updateTeamMember(id: string, data: Partial<{
  name: string;
  role: string;
  bio: string;
  avatar: string;
  email: string;
  socialLinks: { linkedin?: string; twitter?: string; instagram?: string };
  displayOrder: number;
  isActive: boolean;
}>) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    const member = await TeamMember.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    if (!member) return { success: false, error: 'Team member not found' };
    revalidateTeam();
    return { success: true, member: JSON.parse(JSON.stringify(member)) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update team member' };
  }
}

export async function deleteTeamMember(id: string) {
  const session = await auth();
  if (!checkAccess(session)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    await TeamMember.findByIdAndDelete(id);
    revalidateTeam();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete team member' };
  }
}

export async function getAdminTeamMembers(page?: number) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  if (page) {
    const result = await paginatedQuery<any>(TeamMember, {}, { displayOrder: 1 }, page);
    return { success: true, ...result };
  }
  const members = await TeamMember.find().sort({ displayOrder: 1 }).lean();
  return { success: true, members: JSON.parse(JSON.stringify(members)) };
}

// ─── TESTIMONIALS ────────────────────────────────────────────────────────────

export async function createTestimonial(data: {
  clientName: string;
  content: string;
  rating: number;
  clientTitle?: string;
  company?: string;
  avatar?: string;
  isActive?: boolean;
  displayOrder?: number;
}) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    const testimonial = await Testimonial.create(data);
    revalidateTestimonials();
    return { success: true, testimonial: JSON.parse(JSON.stringify(testimonial.toObject())) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create testimonial' };
  }
}

export async function updateTestimonial(id: string, data: Partial<{
  clientName: string;
  content: string;
  rating: number;
  clientTitle: string;
  company: string;
  avatar: string;
  isActive: boolean;
  displayOrder: number;
}>) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    const testimonial = await Testimonial.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    if (!testimonial) return { success: false, error: 'Testimonial not found' };
    revalidateTestimonials();
    return { success: true, testimonial: JSON.parse(JSON.stringify(testimonial)) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update testimonial' };
  }
}

export async function deleteTestimonial(id: string) {
  const session = await auth();
  if (!checkAccess(session)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    await Testimonial.findByIdAndDelete(id);
    revalidateTestimonials();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete testimonial' };
  }
}

export async function getAdminTestimonials(page?: number) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  if (page) {
    const result = await paginatedQuery<any>(Testimonial, {}, { displayOrder: 1 }, page);
    return { success: true, ...result };
  }
  const testimonials = await Testimonial.find().sort({ displayOrder: 1 }).lean();
  return { success: true, testimonials: JSON.parse(JSON.stringify(testimonials)) };
}

// ─── FAQS ────────────────────────────────────────────────────────────────────

export async function createFAQ(data: {
  question: string;
  answer: string;
  category?: string;
  order?: number;
  isActive?: boolean;
}) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    const faq = await FAQ.create(data);
    revalidateFAQs();
    return { success: true, faq: JSON.parse(JSON.stringify(faq.toObject())) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create FAQ' };
  }
}

export async function updateFAQ(id: string, data: Partial<{
  question: string;
  answer: string;
  category: string;
  order: number;
  isActive: boolean;
}>) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    const faq = await FAQ.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    if (!faq) return { success: false, error: 'FAQ not found' };
    revalidateFAQs();
    return { success: true, faq: JSON.parse(JSON.stringify(faq)) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update FAQ' };
  }
}

export async function deleteFAQ(id: string) {
  const session = await auth();
  if (!checkAccess(session)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    await FAQ.findByIdAndDelete(id);
    revalidateFAQs();
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete FAQ' };
  }
}

export async function getAdminFAQs(page?: number) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  if (page) {
    const result = await paginatedQuery<any>(FAQ, {}, { order: 1 }, page);
    return { success: true, ...result };
  }
  const faqs = await FAQ.find().sort({ order: 1 }).lean();
  return { success: true, faqs: JSON.parse(JSON.stringify(faqs)) };
}

// ---- DASHBOARD STATS ----

export async function getAdminDashboardStats() {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    const [projects, services, testimonials, team, inquiries] = await Promise.all([
      Project.countDocuments(),
      Service.countDocuments(),
      Testimonial.countDocuments(),
      TeamMember.countDocuments(),
      Inquiry.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    const totalInquiries = await Inquiry.countDocuments();
    const unreadInquiries = await Inquiry.countDocuments({ status: 'unread' });

    return {
      success: true,
      stats: {
        totalProjects: projects,
        totalServices: services,
        totalTestimonials: testimonials,
        totalTeamMembers: team,
        totalInquiries,
        unreadInquiries,
      },
      recentInquiries: JSON.parse(JSON.stringify(inquiries)),
    };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to fetch dashboard stats' };
  }
}

// ---- INQUIRIES ----

export async function getAdminInquiries(page?: number) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  if (page) {
    const result = await paginatedQuery<any>(Inquiry, {}, { createdAt: -1 }, page);
    return { success: true, ...result };
  }
  const inquiries = await Inquiry.find().sort({ createdAt: -1 }).lean();
  return { success: true, inquiries: JSON.parse(JSON.stringify(inquiries)) };
}

export async function updateInquiryStatus(id: string, status: 'unread' | 'read' | 'archived') {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  await Inquiry.findByIdAndUpdate(id, { status });
  revalidatePath('/admin/inquiries');
  return { success: true };
}

export async function deleteInquiry(id: string) {
  const session = await auth();
  if (!checkAccess(session)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  await Inquiry.findByIdAndDelete(id);
  revalidatePath('/admin/inquiries');
  return { success: true };
}

// ---- BLOG ----

export async function getAdminBlogPosts() {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  const posts = await Blog.find().sort({ publishedAt: -1 }).lean();
  return { success: true, posts: JSON.parse(JSON.stringify(posts)) };
}

export async function createBlogPost(data: {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags?: string[];
  status: 'draft' | 'published';
  featured?: boolean;
}) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    const post = await Blog.create(data);
    revalidatePath('/blog');
    revalidatePath('/(site)/blog');
    return { success: true, post: JSON.parse(JSON.stringify(post.toObject())) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to create blog post' };
  }
}

export async function updateBlogPost(id: string, data: Partial<{
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  status: 'draft' | 'published';
  featured: boolean;
}>) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    const post = await Blog.findByIdAndUpdate(id, { $set: data }, { new: true }).lean();
    if (!post) return { success: false, error: 'Blog post not found' };
    revalidatePath('/blog');
    revalidatePath('/(site)/blog');
    return { success: true, post: JSON.parse(JSON.stringify(post)) };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to update blog post' };
  }
}

export async function deleteBlogPost(id: string) {
  const session = await auth();
  if (!checkAccess(session)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  try {
    await Blog.findByIdAndDelete(id);
    revalidatePath('/blog');
    revalidatePath('/(site)/blog');
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || 'Failed to delete blog post' };
  }
}

// ─── SEED DEFAULT CONTENT ─────────────────────────────────────────────────────

const defaultServices = [
  { title: 'Residential Interiors', description: 'Custom-designed homes that reflect your personality and lifestyle.', icon: 'Home', displayOrder: 1, isActive: true },
  { title: 'Commercial Interiors', description: 'Professional spaces that enhance productivity and brand image.', icon: 'Building2', displayOrder: 2, isActive: true },
  { title: 'Modular Kitchens', description: 'Functional and stylish kitchens designed for modern living.', icon: 'CookingPot', displayOrder: 3, isActive: true },
  { title: 'Living Room Design', description: 'Elegant living spaces that blend comfort with sophistication.', icon: 'Sofa', displayOrder: 4, isActive: true },
  { title: 'Bedroom Design', description: 'Serene bedrooms designed for ultimate relaxation.', icon: 'BedDouble', displayOrder: 5, isActive: true },
  { title: 'Office Design', description: 'Productive work environments that inspire creativity.', icon: 'Briefcase', displayOrder: 6, isActive: true },
];

const defaultProjects = [
  { title: 'Modern Villa', slug: 'modern-villa', description: 'A stunning modern villa', categories: ['Residential'], location: 'Bangalore', coverImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=500&q=60', featured: true, status: 'published' },
  { title: 'Corporate Office', slug: 'corporate-office', description: 'Modern corporate office', categories: ['Office'], location: 'Mumbai', coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=500&q=60', featured: true, status: 'published' },
  { title: 'Luxury Kitchen', slug: 'luxury-kitchen', description: 'Luxury modular kitchen', categories: ['Kitchen'], location: 'Delhi', coverImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&q=60', featured: true, status: 'published' },
  { title: 'Elegant Living Room', slug: 'elegant-living-room', description: 'Elegant living space', categories: ['Living Room'], location: 'Pune', coverImage: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=500&q=60', featured: true, status: 'published' },
  { title: 'Master Bedroom', slug: 'master-bedroom', description: 'Luxurious bedroom suite', categories: ['Bedroom'], location: 'Hyderabad', coverImage: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=500&q=60', featured: true, status: 'published' },
  { title: 'Retail Showroom', slug: 'retail-showroom', description: 'Modern retail space', categories: ['Commercial'], location: 'Chennai', coverImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=500&q=60', featured: true, status: 'published' },
];

const defaultTestimonials = [
  { clientName: 'Priya Sharma', clientTitle: 'Homeowner, Bangalore', content: 'AkInteriors transformed our home into a masterpiece. Their attention to detail and understanding of our vision was remarkable. Every room tells a story now.', rating: 5, isActive: true, displayOrder: 1 },
  { clientName: 'Rajesh Mehta', clientTitle: 'Villa Owner, Pune', content: 'The team at AkInteriors delivered beyond our expectations. Our villa now reflects true luxury living. The 3D visualization helped us see the final result before execution.', rating: 5, isActive: true, displayOrder: 2 },
  { clientName: 'Anita Patel', clientTitle: 'Business Owner, Mumbai', content: 'Our office space redesign by AkInteriors has completely transformed our work environment. Productivity has increased and clients are always impressed.', rating: 5, isActive: true, displayOrder: 3 },
  { clientName: 'Vikram Singh', clientTitle: 'Homeowner, Delhi', content: 'Professional, creative, and reliable. Our modular kitchen is both beautiful and functional. Highly recommend their services.', rating: 4, isActive: true, displayOrder: 4 },
  { clientName: 'Neha Gupta', clientTitle: 'Interior Designer, Chennai', content: 'As someone from the industry, I have high standards. AkInteriors exceeded them all. Truly world-class design execution.', rating: 5, isActive: true, displayOrder: 5 },
];

const defaultTeamMembers = [
  { name: 'Arjun Kapoor', role: 'Founder & Principal Designer', bio: 'Visionary designer with 20+ years of experience in luxury interiors.', avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=350&q=60', isActive: true, displayOrder: 1 },
  { name: 'Meera Reddy', role: 'Senior Interior Designer', bio: 'Award-winning designer specializing in residential and commercial spaces.', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=350&q=60', isActive: true, displayOrder: 2 },
  { name: 'Rahul Verma', role: 'Project Manager', bio: 'Ensures every project is delivered on time and within budget.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=350&q=60', isActive: true, displayOrder: 3 },
  { name: 'Sneha Patel', role: 'Lead Architect', bio: 'Expert in spatial planning and architectural design integration.', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=350&q=60', isActive: true, displayOrder: 4 },
];

const defaultFAQs = [
  { question: 'What is the typical timeline for an interior design project?', answer: 'The timeline varies based on scope. A single room takes 4-6 weeks, while a full home or office project can take 2-4 months. We provide a detailed timeline during consultation.', order: 1, isActive: true },
  { question: 'How much do interior design services cost?', answer: 'Our pricing is transparent and customized to your needs. We offer different packages from basic consultation to full turnkey solutions. Contact us for a detailed quote.', order: 2, isActive: true },
  { question: 'Do you offer 3D visualization before starting the project?', answer: 'Yes! We provide photorealistic 3D renders of your space before any work begins. This allows you to see and approve the design before execution.', order: 3, isActive: true },
  { question: 'What areas do you serve?', answer: 'We are based in Bangalore and serve major cities across India including Mumbai, Delhi, Pune, Hyderabad, and Chennai. For premium projects, we offer pan-India services.', order: 4, isActive: true },
  { question: 'Do you handle both residential and commercial projects?', answer: 'Absolutely. We specialize in both residential interiors (homes, villas, apartments) and commercial spaces (offices, retail, restaurants, hotels).', order: 5, isActive: true },
  { question: 'What is your design process?', answer: 'Our process includes 5 steps: Consultation, Planning, Design, Execution, and Handover. We involve you at every stage to ensure the final result matches your vision.', order: 6, isActive: true },
];

export async function seedDefaultContent() {
  const session = await auth();
  if (!checkAccess(session)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  const results: string[] = [];

  try {
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany(defaultServices);
      results.push('Services');
    }
  } catch (e: any) {
    results.push(`Services failed: ${e.message}`);
  }

  try {
    const projectCount = await Project.countDocuments();
    if (projectCount === 0) {
      await Project.insertMany(defaultProjects);
      results.push('Projects');
    }
  } catch (e: any) {
    results.push(`Projects failed: ${e.message}`);
  }

  try {
    const testimonialCount = await Testimonial.countDocuments();
    if (testimonialCount === 0) {
      await Testimonial.insertMany(defaultTestimonials);
      results.push('Testimonials');
    }
  } catch (e: any) {
    results.push(`Testimonials failed: ${e.message}`);
  }

  try {
    const teamCount = await TeamMember.countDocuments();
    if (teamCount === 0) {
      await TeamMember.insertMany(defaultTeamMembers);
      results.push('Team Members');
    }
  } catch (e: any) {
    results.push(`Team Members failed: ${e.message}`);
  }

  try {
    const faqCount = await FAQ.countDocuments();
    if (faqCount === 0) {
      await FAQ.insertMany(defaultFAQs);
      results.push('FAQs');
    }
  } catch (e: any) {
    results.push(`FAQs failed: ${e.message}`);
  }

  try {
    const footerDoc = await FooterSettings.findOne();
    if (!footerDoc || !footerDoc.description) {
      await FooterSettings.findOneAndUpdate({}, {
        $set: {
          description: 'Transforming spaces into timeless experiences. We create luxury interiors that reflect your personality and elevate your lifestyle.',
          newsletterTitle: 'Subscribe to our newsletter',
          copyright: 'AkInteriors. All rights reserved.',
          quickLinks: [
            { label: 'Home', href: '/' }, { label: 'About Us', href: '/about' },
            { label: 'Projects', href: '/projects' }, { label: 'Contact', href: '/contact' },
            { label: 'FAQ', href: '/#faq' },
          ],
          serviceLinks: [
            { label: 'Residential Interiors', href: '/services' },
            { label: 'Commercial Interiors', href: '/services' },
            { label: 'Modular Kitchens', href: '/services' },
          ],
        },
      }, { upsert: true });
      results.push('Footer');
    }
  } catch (e: any) {
    results.push(`Footer failed: ${e.message}`);
  }

  try {
    const hpDoc = await Homepage.findOne();
    const hpResults: string[] = [];
    if (hpDoc) {
      hpDoc.sections = hpDoc.sections.map((s: any) => {
        if (s.type === 'hero' && (!s.slides?.length)) {
          hpResults.push('hero');
          return {
            ...s.toObject?.() ?? s, heading: s.heading || undefined,
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
          };
        }
        if (!s.heading) {
          const headings: Record<string, string> = {
            services: 'Our Services', projects: 'Our Portfolio',
            testimonials: 'Testimonials', team: 'Our Team', faq: 'FAQ',
            contact: 'Get In Touch', 'why-choose-us': 'Why Choose Us',
            process: 'Our Process', stats: 'Our Impact',
          };
          const subheadings: Record<string, string> = {
            services: 'Comprehensive Design Solutions', projects: 'Featured Projects',
            testimonials: 'What Our Clients Say', team: 'Meet The Experts',
            faq: 'Frequently Asked Questions', contact: "Let's Create Something Beautiful",
            'why-choose-us': 'What Sets Us Apart', process: 'How We Work',
            stats: 'Numbers That Speak',
          };
          const contents: Record<string, string> = {
            services: 'From concept to completion, we offer end-to-end interior design services tailored to your unique style and requirements.',
            projects: 'Explore our curated collection of premium interior design projects.',
            team: 'Talented professionals dedicated to creating extraordinary spaces.',
            contact: "Ready to transform your space? Reach out to us for a free consultation.",
            'why-choose-us': 'We combine creativity with craftsmanship to deliver interiors that exceed expectations.',
            process: 'A streamlined approach that ensures every project is delivered with excellence.',
          };
          const updated: any = { ...s.toObject?.() ?? s };
          if (headings[s.type]) updated.heading = headings[s.type];
          if (subheadings[s.type]) updated.subheading = subheadings[s.type];
          if (contents[s.type]) updated.content = contents[s.type];
          hpResults.push(s.type);
          return updated;
        }
        if (s.type === 'why-choose-us' && (!s.items?.length)) {
          hpResults.push('why-choose-us');
          return {
            ...s.toObject?.() ?? s,
            items: [
              { icon: 'Star', title: 'Expert Designers', description: 'Our team of award-winning designers brings years of experience and creativity to every project.' },
              { icon: 'Gem', title: 'Premium Materials', description: 'We source only the finest materials from around the world for lasting quality.' },
              { icon: 'Eye', title: 'Transparent Pricing', description: 'No hidden costs. Clear, detailed quotations for every project.' },
              { icon: 'Clock', title: 'On-Time Delivery', description: 'We respect your time and deliver projects within the promised timeline.' },
              { icon: 'Monitor', title: '3D Visualization', description: 'See your space before we build it with photorealistic 3D renders.' },
              { icon: 'CheckCircle2', title: 'End-to-End Execution', description: 'From concept to completion, we handle everything with precision.' },
            ],
          };
        }
        if (s.type === 'process' && (!s.steps?.length)) {
          hpResults.push('process');
          return {
            ...s.toObject?.() ?? s,
            steps: [
              { step: 1, title: 'Consultation', description: 'We begin with a detailed consultation to understand your vision, needs, and budget.' },
              { step: 2, title: 'Planning', description: 'Our team creates a comprehensive plan including layouts, material selection, and timelines.' },
              { step: 3, title: 'Design', description: 'We present photorealistic 3D designs and refine them based on your feedback.' },
              { step: 4, title: 'Execution', description: 'Our skilled craftsmen bring the design to life with precision and attention to detail.' },
              { step: 5, title: 'Handover', description: 'We deliver your dream space with a final walkthrough and post-completion support.' },
            ],
          };
        }
        return s;
      });
      await hpDoc.save();
      if (hpResults.length > 0) results.push(`Homepage (${hpResults.join(', ')})`);
    }
  } catch (e: any) {
    results.push(`Homepage failed: ${e.message}`);
  }

  revalidatePath('/');
  revalidatePath('/admin');

  return { success: true, seeded: results };
}
