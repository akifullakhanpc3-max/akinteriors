import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { connectDB } from '@/lib/db/connect';
import WebsiteImage from '@/models/WebsiteImage';
import { imageSchema } from '@/lib/validations/schemas';
import { saveImage } from '@/lib/upload';
import { revalidatePath } from 'next/cache';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function checkAccess(session: any, allowEditor = false) {
  if (!session?.user) return false;
  if (allowEditor && (session.user.role === 'admin' || session.user.role === 'editor')) return true;
  return session.user.role === 'admin';
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!checkAccess(session, true)) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectDB();
  } catch {
    return NextResponse.json({ success: false, error: 'Database connection failed' }, { status: 500 });
  }

  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category') || '';
  const section = searchParams.get('section') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '20');
  const skip = (page - 1) * limit;

  const filter: Record<string, unknown> = {};
  if (category && category !== 'all') filter.category = category;
  if (section && section !== 'all') filter.section = section;
  if (search) filter.title = { $regex: search, $options: 'i' };

  try {
    const [images, total] = await Promise.all([
      WebsiteImage.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      WebsiteImage.countDocuments(filter),
    ]);

    return NextResponse.json({
      success: true,
      images: JSON.parse(JSON.stringify(images)),
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch images' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!checkAccess(session, true)) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

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

    if (!file || (typeof file === 'object' && 'size' in file && (file as File).size === 0)) {
      return NextResponse.json({ success: false, error: 'File is required' }, { status: 400 });
    }

    const typedFile = file as File;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (typedFile.type && !allowedTypes.includes(typedFile.type)) {
      return NextResponse.json({ success: false, error: 'Only JPG, PNG, WebP allowed' }, { status: 400 });
    }
    if (typedFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ success: false, error: 'File too large (max 5MB)' }, { status: 400 });
    }

    let buffer: Buffer;
    if (typeof typedFile.arrayBuffer === 'function') {
      buffer = Buffer.from(await typedFile.arrayBuffer());
    } else if (typeof typedFile.stream === 'function') {
      const reader = (typedFile as File).stream().getReader();
      const chunks: Uint8Array[] = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      const total = chunks.reduce((s, c) => s + c.length, 0);
      buffer = Buffer.concat(chunks.map(c => Buffer.from(c)), total);
    } else {
      return NextResponse.json({ success: false, error: 'File reading not supported' }, { status: 500 });
    }
    const result = await saveImage(buffer, typedFile.name || 'image.jpg', parsed.data.category);

    const image = new WebsiteImage({
      title: parsed.data.title,
      category: parsed.data.category,
      section: parsed.data.section,
      altText: parsed.data.altText || '',
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
    return NextResponse.json({ success: true, image: JSON.parse(JSON.stringify(image)) });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    const stack = err instanceof Error ? err.stack : '';
    console.error('Upload error:', message, stack);
    return NextResponse.json({ success: false, error: `Upload failed: ${message}` }, { status: 500 });
  }
}
