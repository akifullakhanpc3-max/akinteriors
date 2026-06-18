import path from 'path';
import { uploadBuffer, deleteFile as firebaseDelete } from '@/lib/firebase/storage';

async function getSharp() {
  try {
    return (await import('sharp')).default;
  } catch {
    return null;
  }
}

export interface SaveImageResult {
  imageUrl: string;
  thumbnailUrl: string;
  dimensions: { width: number; height: number };
  fileSize: number;
  imageType: string;
}

export async function saveImage(
  buffer: Buffer,
  filename: string,
  folder: string
): Promise<SaveImageResult> {
  const ext = path.extname(filename).toLowerCase().replace('.', '') || 'jpg';
  const isSvg = ext === 'svg';
  const sanitized = filename.replace(/[^a-zA-Z0-9.-]/g, '');
  const name = `${Date.now()}-${sanitized.replace(/\.[^.]+$/, '')}`;
  const destFolder = `uploads/${folder}`;
  const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext === 'svg' ? 'svg+xml' : ext}`;

  if (isSvg) {
    const url = await uploadBuffer(buffer, `${destFolder}/${name}.svg`, contentType);
    if (!url) throw new Error('Firebase not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY env vars.');
    return {
      imageUrl: url,
      thumbnailUrl: url,
      dimensions: { width: 0, height: 0 },
      fileSize: buffer.length,
      imageType: 'svg',
    };
  }

  const sharp = await getSharp();
  if (sharp) {
    const metadata = await sharp(buffer).metadata();
    const width = metadata.width || 1920;
    const height = metadata.height || 1080;

    const outputFilename = `${name}.webp`;
    const thumbFilename = `thumb-${outputFilename}`;

    let pipeline = sharp(buffer);
    if (width > 1920) {
      pipeline = pipeline.resize(1920, 1080, { fit: 'inside', withoutEnlargement: true });
    }
    const processed = await pipeline.webp({ quality: 75 }).toBuffer();
    const thumb = await sharp(buffer)
      .resize(400, 300, { fit: 'cover' })
      .webp({ quality: 60 })
      .toBuffer();

    const [imageUrl, thumbnailUrl] = await Promise.all([
      uploadBuffer(processed, `${destFolder}/${outputFilename}`, 'image/webp'),
      uploadBuffer(thumb, `${destFolder}/${thumbFilename}`, 'image/webp'),
    ]);

    if (!imageUrl || !thumbnailUrl) {
      throw new Error('Firebase not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY env vars.');
    }

    return {
      imageUrl,
      thumbnailUrl,
      dimensions: { width, height },
      fileSize: processed.length,
      imageType: 'webp',
    };
  }

  const url = await uploadBuffer(buffer, `${destFolder}/${name}.${ext}`, contentType);
  if (!url) {
    throw new Error('Firebase not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY env vars.');
  }

  return {
    imageUrl: url,
    thumbnailUrl: url,
    dimensions: { width: 0, height: 0 },
    fileSize: buffer.length,
    imageType: ext,
  };
}

export async function deleteImage(imageUrl: string) {
  if (!imageUrl) return;

  if (imageUrl.startsWith('http')) {
    await firebaseDelete(imageUrl);
    const thumbUrl = imageUrl.replace(/([^/]+)$/, 'thumb-$1');
    await firebaseDelete(thumbUrl).catch(() => {});
  }
}
