import path from 'path';
import fs from 'fs/promises';
import os from 'os';
import { uploadBuffer, deleteFile as firebaseDelete } from '@/lib/firebase/storage';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

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
  const uploadPath = path.join(UPLOAD_DIR, folder);
  await ensureDir(uploadPath);

  const ext = path.extname(filename).toLowerCase().replace('.', '') || 'jpg';
  const isSvg = ext === 'svg';
  const sanitized = path.basename(filename).replace(/[^a-zA-Z0-9.-]/g, '');
  const name = `${Date.now()}-${sanitized.replace(/\.[^.]+$/, '')}`;
  const destFolder = `uploads/${folder}`;

  if (isSvg) {
    const outputFilename = `${name}.svg`;
    const contentType = 'image/svg+xml';
    const url = await uploadBuffer(buffer, `${destFolder}/${outputFilename}`, contentType);

    if (url) {
      return {
        imageUrl: url,
        thumbnailUrl: url,
        dimensions: { width: 0, height: 0 },
        fileSize: buffer.length,
        imageType: 'svg',
      };
    }
  }

  const sharp = await getSharp();
  if (sharp) {
    try {
      const metadata = await sharp(buffer).metadata();
      const width = metadata.width || 1920;
      const height = metadata.height || 1080;

      let pipeline = sharp(buffer);
      if (width > 1920) {
        pipeline = pipeline.resize(1920, 1080, { fit: 'inside', withoutEnlargement: true });
      }
      const processed = await pipeline.webp({ quality: 75 }).toBuffer();
      const thumb = await sharp(buffer)
        .resize(400, 300, { fit: 'cover' })
        .webp({ quality: 60 })
        .toBuffer();

      const outputFilename = `${name}.webp`;
      const thumbFilename = `thumb-${outputFilename}`;
      const contentType = 'image/webp';

      const [imageUrl, thumbnailUrl] = await Promise.all([
        uploadBuffer(processed, `${destFolder}/${outputFilename}`, contentType),
        uploadBuffer(thumb, `${destFolder}/${thumbFilename}`, contentType),
      ]);

      if (imageUrl && thumbnailUrl) {
        return {
          imageUrl,
          thumbnailUrl,
          dimensions: { width, height },
          fileSize: processed.length,
          imageType: 'webp',
        };
      }
    } catch {
      // fall through to as-is save
    }
  }

  const outputFilename = `${name}.${ext}`;
  const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  const url = await uploadBuffer(buffer, `${destFolder}/${outputFilename}`, contentType);

  if (url) {
    return {
      imageUrl: url,
      thumbnailUrl: url,
      dimensions: { width: 0, height: 0 },
      fileSize: buffer.length,
      imageType: ext,
    };
  }

  // ultimate fallback: local filesystem
  const localOutput = path.join(uploadPath, outputFilename);
  await fs.writeFile(localOutput, buffer);
  const stats = await fs.stat(localOutput);
  return {
    imageUrl: `/uploads/${folder}/${outputFilename}`,
    thumbnailUrl: `/uploads/${folder}/${outputFilename}`,
    dimensions: { width: 0, height: 0 },
    fileSize: stats.size,
    imageType: ext,
  };
}

export async function deleteImage(imageUrl: string) {
  if (!imageUrl) return;

  if (imageUrl.startsWith('http')) {
    await firebaseDelete(imageUrl);
    const thumbUrl = imageUrl.replace(/([^/]+)$/, 'thumb-$1');
    await firebaseDelete(thumbUrl).catch(() => {});
    return;
  }

  const fullPath = path.join(process.cwd(), 'public', imageUrl);
  const thumbPath = fullPath.replace(/([^/]+)$/, 'thumb-$1');

  try {
    await fs.unlink(fullPath);
    await fs.unlink(thumbPath).catch(() => {});
  } catch {
    // file not found
  }
}

export async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // directory already exists
  }
}
