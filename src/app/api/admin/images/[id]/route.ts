import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/connect';
import WebsiteImage from '@/models/WebsiteImage';
import { imageSchema } from '@/lib/validations/schemas';
import { saveImage, deleteImage } from '@/lib/upload';
import { revalidatePath } from 'next/cache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkAccess(session: any, allowEditor = false) {
  if (!session?.user) return false;
  if (allowEditor && (session.user.role === 'admin' || session.user.role === 'editor')) return true;
  return session.user.role === 'admin';
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!checkAccess(session, true)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
  } catch {
    return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 });
  }

  try {
    const { id } = await params;
    const existing = await WebsiteImage.findById(id);
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Image not found' }, { status: 404 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const section = formData.get('section') as string;
    const altText = (formData.get('altText') as string) || '';
    const displayOrder = parseInt(formData.get('displayOrder') as string) || 0;
    const isActive = formData.get('isActive') === 'true';
    const file = formData.get('file') as File | null;

    const parsed = imageSchema.safeParse({ title, category, section, altText, displayOrder, isActive });
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 });
    }

    if (file && file.size > 0) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({ success: false, error: 'Only JPG, PNG, WebP allowed' }, { status: 400 });
      }
      if (file.size > 5 * 1024 * 1024) {
        return NextResponse.json({ success: false, error: 'File too large (max 5MB)' }, { status: 400 });
      }

      await deleteImage(existing.imageUrl);
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await saveImage(buffer, file.name, parsed.data.category);

      existing.imageUrl = result.imageUrl;
      existing.thumbnailUrl = result.thumbnailUrl;
      existing.imageType = result.imageType;
      existing.fileSize = result.fileSize;
      existing.dimensions = result.dimensions;
    }

    existing.title = parsed.data.title;
    existing.category = parsed.data.category;
    existing.section = parsed.data.section;
    existing.altText = parsed.data.altText || '';
    existing.displayOrder = parsed.data.displayOrder;
    existing.isActive = parsed.data.isActive;
    existing.isBranding = parsed.data.category === 'branding';

    await existing.save();
    revalidatePath('/admin/images');
    revalidatePath('/');
    revalidatePath('/(site)/');
    return NextResponse.json({ success: true, image: JSON.parse(JSON.stringify(existing)) });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update image' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!checkAccess(session)) {
    return NextResponse.json({ success: false, error: 'Only admins can delete images' }, { status: 403 });
  }

  try {
    await connectDB();
  } catch {
    return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 });
  }

  try {
    const { id } = await params;
    const image = await WebsiteImage.findById(id);
    if (!image) {
      return NextResponse.json({ success: false, error: 'Image not found' }, { status: 404 });
    }
    if (image.isBranding) {
      return NextResponse.json({ success: false, error: 'Branding assets cannot be deleted' }, { status: 400 });
    }

    await deleteImage(image.imageUrl);
    await WebsiteImage.findByIdAndDelete(id);

    revalidatePath('/admin/images');
    revalidatePath('/');
    revalidatePath('/(site)/');
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to delete image' }, { status: 500 });
  }
}
