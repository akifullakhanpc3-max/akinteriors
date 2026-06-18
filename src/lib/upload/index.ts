import path from 'path';
import crypto from 'crypto';

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

function getUploadUrl(): string {
  const url = process.env.HOSTINGER_UPLOAD_URL;
  if (!url) throw new Error('HOSTINGER_UPLOAD_URL not configured');
  return url;
}

function generateFilename(ext: string): string {
  const timestamp = Date.now();
  const random = crypto.randomBytes(8).toString('hex');
  return `${timestamp}-${random}.${ext}`;
}

async function uploadToHostinger(
  buffer: Buffer,
  filename: string,
): Promise<string> {
  const url = getUploadUrl();
  const formData = new FormData();
  const uint8 = new Uint8Array(buffer);
  const blob = new Blob([uint8]);
  formData.append('file', blob, filename);

  const res = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error || `Upload failed with status ${res.status}`);
  }

  const data = await res.json();
  if (!data.success || !data.imageUrl) {
    throw new Error('Invalid response from upload server');
  }

  return data.imageUrl;
}

async function deleteFromHostinger(filename: string): Promise<void> {
  const url = getUploadUrl();
  const apiKey = process.env.HOSTINGER_UPLOAD_API_KEY || '';
  await fetch(url, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({ filename }),
  }).catch(() => {});
}

export async function saveImage(
  buffer: Buffer,
  _filename: string,
  _folder: string
): Promise<SaveImageResult> {
  const ext = path.extname(_filename).toLowerCase().replace('.', '') || 'jpg';

  const sharp = await getSharp();
  if (sharp) {
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

    const mainName = generateFilename('webp');
    const thumbName = `thumb-${mainName}`;

    const [imageUrl, thumbnailUrl] = await Promise.all([
      uploadToHostinger(processed, mainName),
      uploadToHostinger(thumb, thumbName),
    ]);

    return {
      imageUrl,
      thumbnailUrl,
      dimensions: { width, height },
      fileSize: processed.length,
      imageType: 'webp',
    };
  }

  const name = generateFilename(ext);
  const imageUrl = await uploadToHostinger(buffer, name);

  return {
    imageUrl,
    thumbnailUrl: imageUrl,
    dimensions: { width: 0, height: 0 },
    fileSize: buffer.length,
    imageType: ext,
  };
}

export async function deleteImage(imageUrl: string) {
  if (!imageUrl) return;

  if (imageUrl.startsWith('http')) {
    const urlParts = imageUrl.split('/');
    const filename = urlParts[urlParts.length - 1];
    if (filename) {
      await deleteFromHostinger(filename);
      const thumbFilename = `thumb-${filename}`;
      await deleteFromHostinger(thumbFilename).catch(() => {});
    }
  }
}
