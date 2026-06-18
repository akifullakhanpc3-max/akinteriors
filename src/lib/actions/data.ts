'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { connectDB } from '@/lib/db/connect';
import { findOrCreateSettings } from '@/models/Settings';
import Service from '@/models/Service';
import Project from '@/models/Project';
import TeamMember from '@/models/TeamMember';
import Testimonial from '@/models/Testimonial';
import FAQ from '@/models/FAQ';
import WebsiteImage from '@/models/WebsiteImage';

export async function getSettings() {
  await connectDB();
  const settings = await findOrCreateSettings();
  return JSON.parse(JSON.stringify(settings));
}

export async function getActiveServices() {
  await connectDB();
  const services = await Service.find({ isActive: true })
    .sort({ displayOrder: 1 })
    .lean();
  return JSON.parse(JSON.stringify(services));
}

export async function getAllServices() {
  await connectDB();
  const services = await Service.find()
    .sort({ displayOrder: 1 })
    .lean();
  return JSON.parse(JSON.stringify(services));
}

export async function getPublishedProjects() {
  await connectDB();
  const projects = await Project.find({ status: 'published' })
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(projects));
}

export async function getFeaturedProjects() {
  await connectDB();
  const projects = await Project.find({ status: 'published', featured: true })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean();
  return JSON.parse(JSON.stringify(projects));
}

export async function getProjectBySlug(slug: string) {
  await connectDB();
  const project = await Project.findOne({ slug, status: 'published' }).lean();
  if (!project) return null;
  return JSON.parse(JSON.stringify(project));
}

export async function getActiveTeamMembers() {
  await connectDB();
  const members = await TeamMember.find({ isActive: true })
    .sort({ displayOrder: 1 })
    .lean();
  return JSON.parse(JSON.stringify(members));
}

export async function getActiveTestimonials() {
  await connectDB();
  const testimonials = await Testimonial.find({ isActive: true })
    .sort({ displayOrder: 1 })
    .lean();
  return JSON.parse(JSON.stringify(testimonials));
}

export async function getActiveFAQs() {
  await connectDB();
  const faqs = await FAQ.find({ isActive: true })
    .sort({ order: 1 })
    .lean();
  return JSON.parse(JSON.stringify(faqs));
}

export async function getHeroImages() {
  await connectDB();
  const images = await WebsiteImage.find({
    category: 'hero',
    isActive: true,
  })
    .sort({ displayOrder: 1 })
    .lean();
  return JSON.parse(JSON.stringify(images));
}

export async function getImagesByCategory(category: string) {
  await connectDB();
  const images = await WebsiteImage.find({
    category,
    isActive: true,
  })
    .sort({ displayOrder: 1 })
    .lean();
  return JSON.parse(JSON.stringify(images));
}

export async function getBrandingImages() {
  await connectDB();
  const images = await WebsiteImage.find({ isBranding: true, isActive: true })
    .sort({ section: 1 })
    .lean();
  return JSON.parse(JSON.stringify(images));
}

const CACHE_TAGS = {
  settings: 'settings',
  services: 'services',
  projects: 'projects',
  team: 'team',
  testimonials: 'testimonials',
  faqs: 'faqs',
  images: 'images',
} as const;

export async function revalidateAll() {
  const paths = [
    '/',
    '/projects',
    '/services',
    '/about',
    '/contact',
  ];
  paths.forEach((path) => revalidatePath(path, 'page'));
  paths.forEach((path) => revalidatePath(`/(site)${path}`, 'page'));
  Object.values(CACHE_TAGS).forEach((tag) => revalidateTag(tag, 'default'));
}

export async function revalidateSettings() {
  revalidatePath('/', 'page');
  revalidatePath('/(site)/', 'page');
  revalidatePath('/about', 'page');
  revalidatePath('/(site)/about', 'page');
  revalidatePath('/contact', 'page');
  revalidatePath('/(site)/contact', 'page');
  revalidateTag(CACHE_TAGS.settings, 'default');
}

export async function revalidateServices() {
  revalidatePath('/', 'page');
  revalidatePath('/(site)/', 'page');
  revalidatePath('/services', 'page');
  revalidatePath('/(site)/services', 'page');
  revalidateTag(CACHE_TAGS.services, 'default');
}

export async function revalidateProjects() {
  revalidatePath('/', 'page');
  revalidatePath('/(site)/', 'page');
  revalidatePath('/projects', 'page');
  revalidatePath('/(site)/projects', 'page');
  revalidateTag(CACHE_TAGS.projects, 'default');
}

export async function revalidateTeam() {
  revalidatePath('/', 'page');
  revalidatePath('/(site)/', 'page');
  revalidateTag(CACHE_TAGS.team, 'default');
}

export async function revalidateTestimonials() {
  revalidatePath('/', 'page');
  revalidatePath('/(site)/', 'page');
  revalidateTag(CACHE_TAGS.testimonials, 'default');
}

export async function revalidateFAQs() {
  revalidatePath('/', 'page');
  revalidatePath('/(site)/', 'page');
  revalidateTag(CACHE_TAGS.faqs, 'default');
}

export async function getPublishedBlogPosts() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const connectModule: any = await import('@/lib/db/connect');
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const blogModule: any = await import('@/models/Blog');
  await connectModule.default();
  const posts = await blogModule.default.find({ status: 'published' })
    .sort({ publishedAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(posts));
}

export async function revalidateImages() {
  const paths = ['/', '/about', '/contact'];
  paths.forEach((path) => {
    revalidatePath(path, 'page');
    revalidatePath(`/(site)${path}`, 'page');
  });
  revalidateTag(CACHE_TAGS.images, 'default');
}
