import path from 'path';
import fs from 'fs/promises';
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

async function saveLocally(buffer: Buffer, folder: string, name: string, ext: string) {
  const relativePath = `uploads/${folder}`;
  const uploadPath = path.join(UPLOAD_DIR, folder);
  await fs.mkdir(uploadPath, { recursive: true });
  const outputFilename = `${name}.${ext}`;
  const outputPath = path.join(uploadPath, outputFilename);
  await fs.writeFile(outputPath, buffer);
  const stats = await fs.stat(outputPath);
  return {
    imageUrl: `/${relativePath}/${outputFilename}`,
    thumbnailUrl: `/${relativePath}/${outputFilename}`,
    fileSize: stats.size,
    imageType: ext,
  };
}

export async function saveImage(
  buffer: Buffer,
  filename: string,
  folder: string
): Promise<SaveImageResult> {
  const ext = path.extname(filename).toLowerCase().replace('.', '') || 'jpg';
  const isSvg = ext === 'svg';
  const sanitized = path.basename(filename).replace(/[^a-zA-Z0-9.-]/g, '');
  const name = `${Date.now()}-${sanitized.replace(/\.[^.]+$/, '')}`;
  const destFolder = `uploads/${folder}`;

  if (isSvg) {
    const destPath = `${destFolder}/${name}.svg`;
    const url = await uploadBuffer(buffer, destPath, 'image/svg+xml');
    if (url) {
      return {
        imageUrl: url,
        thumbnailUrl: url,
        dimensions: { width: 0, height: 0 },
        fileSize: buffer.length,
        imageType: 'svg',
      };
    }
    const local = await saveLocally(buffer, folder, name, 'svg');
    return { ...local, dimensions: { width: 0, height: 0 } };
  }

  const sharp = await getSharp();
  if (sharp) {
    try {
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

      if (imageUrl && thumbnailUrl) {
        return {
          imageUrl,
          thumbnailUrl,
          dimensions: { width, height },
          fileSize: processed.length,
          imageType: 'webp',
        };
      }

      const local = await saveLocally(processed, folder, name, 'webp');
      const localThumb = await saveLocally(thumb, folder, `thumb-${name}`, 'webp');
      return {
        imageUrl: local.imageUrl,
        thumbnailUrl: localThumb.imageUrl,
        dimensions: { width, height },
        fileSize: processed.length,
        imageType: 'webp',
      };
    } catch {
      // fall through to as-is save
    }
  }

  const contentType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
  const url = await uploadBuffer(buffer, `${destFolder}/${name}.${ext}`, contentType);
  if (url) {
    return {
      imageUrl: url,
      thumbnailUrl: url,
      dimensions: { width: 0, height: 0 },
      fileSize: buffer.length,
      imageType: ext,
    };
  }

  const local = await saveLocally(buffer, folder, name, ext);
  return { ...local, dimensions: { width: 0, height: 0 } };
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
