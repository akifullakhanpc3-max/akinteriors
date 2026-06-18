export interface UserType {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor';
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectType {
  _id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  location?: string;
  budget?: string;
  area?: string;
  completionDate?: Date;
  clientName?: string;
  featuredImage: string;
  beforeImages: string[];
  afterImages: string[];
  galleryImages: string[];
  status: 'draft' | 'published';
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ServiceType {
  _id: string;
  title: string;
  description: string;
  image?: string;
  icon: string;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface TestimonialType {
  _id: string;
  name: string;
  photo?: string;
  rating: number;
  designation: string;
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMemberType {
  _id: string;
  name: string;
  designation: string;
  photo?: string;
  bio?: string;
  socialLinks: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface FAQType {
  _id: string;
  question: string;
  answer: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogType {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  tags: string[];
  author: string;
  seoTitle?: string;
  seoDescription?: string;
  publishedAt?: Date;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export interface InquiryType {
  _id: string;
  name: string;
  email: string;
  phone: string;
  service?: string;
  budget?: string;
  message: string;
  status: 'unread' | 'read' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export interface SettingsType {
  logo?: string;
  favicon?: string;
  siteName: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  socialLinks: {
    facebook?: string;
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    pinterest?: string;
  };
  heroTitle: string;
  heroSubtitle: string;
  aboutContent: string;
  seoSettings: {
    title: string;
    description: string;
    keywords: string;
  };
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  whatsappNumber?: string;
  emailSettings: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPass: string;
    notificationEmail: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLogType {
  _id: string;
  action: string;
  entity: string;
  entityId?: string;
  userId?: string;
  details?: string;
  createdAt: Date;
}
