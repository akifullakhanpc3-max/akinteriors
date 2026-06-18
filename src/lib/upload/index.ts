import path from 'path';
import crypto from 'crypto';

const HOST = (process.env.NEXT_PUBLIC_HOSTINGER_URL || 'https://akinterious.in').replace(/\/+$/, '');
const UPLOAD_PATH = '/akinterious/uploads';

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

function buildImageUrl(filename: string): string {
  return `${HOST}${UPLOAD_PATH}/${filename}`;
}

async function uploadToHostinger(
  buffer: Buffer,
  filename: string,
): Promise<string> {
  const url = getUploadUrl();
  const formData = new FormData();
  const uint8 = new Uint8Array(buffer);
  const blob = new Blob([uint8], { type: 'application/octet-stream' });
  formData.append('file', blob, filename);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) {
    let errorText: string;
    try {
      const body = await res.json();
      errorText = body.error || `HTTP ${res.status}`;
    } catch {
      const text = await res.text().catch(() => '');
      errorText = text ? text.slice(0, 200) : `HTTP ${res.status}`;
    }
    throw new Error(`Upload to Hostinger failed: ${errorText}`);
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
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
      },
      body: JSON.stringify({ filename }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.warn('Delete from Hostinger warning:', body.error || `HTTP ${res.status}`);
    }
  } catch (err) {
    console.warn('Delete from Hostinger error:', err);
  }
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
