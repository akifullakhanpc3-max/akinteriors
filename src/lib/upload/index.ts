import path from 'path';
import fs from 'fs/promises';

const UPLOAD_DIR = path.join(process.cwd(), 'public/uploads');

async function getSharp() {
  try {
    return (await import('sharp')).default;
  } catch {
    return null;
  }
}

export async function ensureDir(dir: string) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch {
    // directory already exists
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
  const name = `${Date.now()}-${path.basename(filename).replace(/[^a-zA-Z0-9.-]/g, '').replace(/\.[^.]+$/, '')}`;

  if (isSvg) {
    const outputFilename = `${name}.svg`;
    const outputPath = path.join(uploadPath, outputFilename);
    await fs.writeFile(outputPath, buffer);
    const stats = await fs.stat(outputPath);
    return {
      imageUrl: `/uploads/${folder}/${outputFilename}`,
      thumbnailUrl: `/uploads/${folder}/${outputFilename}`,
      dimensions: { width: 0, height: 0 },
      fileSize: stats.size,
      imageType: 'svg',
    };
  }

  const sharp = await getSharp();
  if (sharp) {
    try {
      const metadata = await sharp(buffer).metadata();
      const width = metadata.width || 1920;
      const height = metadata.height || 1080;

      const outputFilename = `${name}.webp`;
      const outputPath = path.join(uploadPath, outputFilename);

      let pipeline = sharp(buffer);
      if (width > 1920) {
        pipeline = pipeline.resize(1920, 1080, { fit: 'inside', withoutEnlargement: true });
      }
      pipeline = pipeline.webp({ quality: 75 });
      await pipeline.toFile(outputPath);
      const stats = await fs.stat(outputPath);

      const thumbFilename = `thumb-${outputFilename}`;
      const thumbPath = path.join(uploadPath, thumbFilename);
      await sharp(buffer).resize(400, 300, { fit: 'cover' }).webp({ quality: 60 }).toFile(thumbPath);

      return {
        imageUrl: `/uploads/${folder}/${outputFilename}`,
        thumbnailUrl: `/uploads/${folder}/${thumbFilename}`,
        dimensions: { width, height },
        fileSize: stats.size,
        imageType: 'webp',
      };
    } catch {
      // sharp processing failed — fall through to as-is save
    }
  }

  // fallback: save file as-is (no conversion, no thumbnail)
  const outputFilename = `${name}.${ext}`;
  const outputPath = path.join(uploadPath, outputFilename);
  await fs.writeFile(outputPath, buffer);
  const stats = await fs.stat(outputPath);
  return {
    imageUrl: `/uploads/${folder}/${outputFilename}`,
    thumbnailUrl: `/uploads/${folder}/${outputFilename}`,
    dimensions: { width: 0, height: 0 },
    fileSize: stats.size,
    imageType: ext,
  };
}

export async function deleteImage(imagePath: string) {
  if (!imagePath) return;
  const fullPath = path.join(process.cwd(), 'public', imagePath);
  const thumbPath = fullPath.replace(/([^/]+)$/, 'thumb-$1');

  try {
    await fs.unlink(fullPath);
    await fs.unlink(thumbPath).catch(() => {});
  } catch {
    // file not found
  }
}
