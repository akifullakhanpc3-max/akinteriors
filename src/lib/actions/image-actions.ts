'use server';

import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/connect';
import WebsiteImage from '@/models/WebsiteImage';
import { imageSchema } from '@/lib/validations/schemas';
import { saveImage, deleteImage } from '@/lib/upload';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkAccess(session: any, allowEditor?: boolean) {
  if (!session || !session.user) return false;
  if (allowEditor && session.user.role === 'admin' || allowEditor && session.user.role === 'editor') return true;
  return session.user.role === 'admin';
}

export async function getImages(params?: {
  category?: string;
  section?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  const session = await auth();
  if (!checkAccess(session)) return { success: false, error: 'Unauthorized' };

  await connectDB();

  const page = params?.page || 1;
  const limit = params?.limit || 20;
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (params?.category) filter.category = params.category;
  if (params?.section) filter.section = params.section;
  if (params?.search) {
    filter.title = { $regex: params.search, $options: 'i' };
  }

  const [images, total] = await Promise.all([
    WebsiteImage.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    WebsiteImage.countDocuments(filter),
  ]);

  return {
    success: true,
    images: JSON.parse(JSON.stringify(images)),
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  };
}

export async function getImage(id: string) {
  const session = await auth();
  if (!checkAccess(session)) return { success: false, error: 'Unauthorized' };

  await connectDB();
  const image = await WebsiteImage.findById(id).lean();
  if (!image) return { success: false, error: 'Image not found' };

  return { success: true, image: JSON.parse(JSON.stringify(image)) };
}

export async function createImage(formData: FormData) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();

  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const section = formData.get('section') as string;
  const altText = formData.get('altText') as string || '';
  const displayOrder = parseInt(formData.get('displayOrder') as string) || 0;
  const isActive = formData.get('isActive') === 'true';
  const file = formData.get('file') as File | null;

  const parsed = imageSchema.safeParse({ title, category, section, altText, displayOrder, isActive });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  if (!file || file.size === 0) return { success: false, error: 'File is required' };

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
  if (!allowedTypes.includes(file.type)) return { success: false, error: 'Only JPG, PNG, WebP allowed' };

  if (file.size > 5 * 1024 * 1024) return { success: false, error: 'File too large (max 5MB)' };

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const result = await saveImage(buffer, file.name, category);

    const image = new WebsiteImage({
      title: parsed.data.title,
      category: parsed.data.category,
      section: parsed.data.section,
      altText: parsed.data.altText,
      imageUrl: result.imageUrl,
      thumbnailUrl: result.thumbnailUrl,
      imageType: result.imageType,
      fileSize: result.fileSize,
      dimensions: result.dimensions,
      displayOrder: parsed.data.displayOrder,
      isActive: parsed.data.isActive,
      isBranding: parsed.data.category === 'branding',
      uploadedBy: session!.user?.email,
    });

    await image.save();
    revalidatePath('/admin/images');
    revalidatePath('/');
    revalidatePath('/(site)/');
    return { success: true, image: JSON.parse(JSON.stringify(image.toObject())) };
  } catch {
    return { success: false, error: 'Failed to upload image' };
  }
}

export async function updateImage(id: string, formData: FormData) {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();

  const image = await WebsiteImage.findById(id);
  if (!image) return { success: false, error: 'Image not found' };

  const title = formData.get('title') as string;
  const category = formData.get('category') as string;
  const section = formData.get('section') as string;
  const altText = formData.get('altText') as string || '';
  const displayOrder = parseInt(formData.get('displayOrder') as string) || 0;
  const isActive = formData.get('isActive') === 'true';
  const file = formData.get('file') as File | null;

  const parsed = imageSchema.safeParse({ title, category, section, altText, displayOrder, isActive });
  if (!parsed.success) return { success: false, error: parsed.error.issues[0].message };

  try {
    if (file && file.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) return { success: false, error: 'Only JPG, PNG, WebP allowed' };
      if (file.size > 5 * 1024 * 1024) return { success: false, error: 'File too large (max 5MB)' };

      await deleteImage(image.imageUrl);

      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await saveImage(buffer, file.name, parsed.data.category);

      image.imageUrl = result.imageUrl;
      image.thumbnailUrl = result.thumbnailUrl;
      image.imageType = result.imageType;
      image.fileSize = result.fileSize;
      image.dimensions = result.dimensions;
    }

    image.title = parsed.data.title;
    image.category = parsed.data.category;
    image.section = parsed.data.section;
    image.altText = parsed.data.altText;
    image.displayOrder = parsed.data.displayOrder;
    image.isActive = parsed.data.isActive;
    image.isBranding = parsed.data.category === 'branding';

    await image.save();
    revalidatePath('/admin/images');
    revalidatePath('/');
    revalidatePath('/(site)/');
    return { success: true, image: JSON.parse(JSON.stringify(image.toObject())) };
  } catch {
    return { success: false, error: 'Failed to update image' };
  }
}

export async function deleteImageAction(id: string) {
  const session = await auth();
  if (!checkAccess(session)) return { success: false, error: 'Only admins can delete images' };

  await connectDB();

  const image = await WebsiteImage.findById(id);
  if (!image) return { success: false, error: 'Image not found' };
  if (image.isBranding) return { success: false, error: 'Branding assets cannot be deleted' };

  await deleteImage(image.imageUrl);
  await WebsiteImage.findByIdAndDelete(id);

  revalidatePath('/admin/images');
  revalidatePath('/');
  revalidatePath('/(site)/');
  return { success: true };
}

export async function getImageStats() {
  const session = await auth();
  if (!checkAccess(session)) return { success: false, error: 'Unauthorized' };

  await connectDB();

  const [total, categoryCounts, latest] = await Promise.all([
    WebsiteImage.countDocuments(),
    WebsiteImage.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
    WebsiteImage.find().sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  const sizeAgg = await WebsiteImage.aggregate([
    { $match: { fileSize: { $exists: true } } },
    { $group: { _id: null, totalBytes: { $sum: '$fileSize' } } },
  ]);

  const totalBytes = sizeAgg[0]?.totalBytes || 0;
  const storageMB = (totalBytes / (1024 * 1024)).toFixed(1);

  return {
    success: true,
    stats: {
      total,
      storageMB,
      byCategory: categoryCounts.map(c => ({ category: c._id, count: c.count })),
      latest: JSON.parse(JSON.stringify(latest)),
    },
  };
}

export async function getBrandingImages() {
  const session = await auth();
  if (!checkAccess(session, true)) return { success: false, error: 'Unauthorized' };

  await connectDB();

  const images = await WebsiteImage.find({ isBranding: true })
    .sort({ section: 1 })
    .lean();

  return { success: true, images: JSON.parse(JSON.stringify(images)) };
}
