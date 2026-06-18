import { getStorageBucketRef } from './admin';

function getPublicUrl(bucketName: string, path: string): string {
  return `https://storage.googleapis.com/${bucketName}/${path}`;
}

export async function uploadBuffer(
  buffer: Buffer,
  destination: string,
  contentType: string
): Promise<string | null> {
  const bucket = getStorageBucketRef();
  if (!bucket) return null;

  const file = bucket.file(destination);
  await file.save(buffer, {
    metadata: { contentType },
  });
  await file.makePublic();

  return getPublicUrl(bucket.name, destination);
}

export async function uploadFromPath(
  localPath: string,
  destination: string,
  contentType: string
): Promise<string | null> {
  const bucket = getStorageBucketRef();
  if (!bucket) return null;

  await bucket.upload(localPath, {
    destination,
    metadata: { contentType },
  });

  const file = bucket.file(destination);
  await file.makePublic();

  return getPublicUrl(bucket.name, destination);
}

export async function deleteFile(imageUrl: string) {
  if (!imageUrl) return;

  try {
    const bucket = getStorageBucketRef();
    if (!bucket) return;

    const url = new URL(imageUrl);
    const path = decodeURIComponent(url.pathname).replace(`/${bucket.name}/`, '');
    await bucket.file(path).delete();
  } catch {
    // file not found or already deleted
  }
}

export function getStoragePath(imageUrl: string): string | null {
  if (!imageUrl) return null;
  try {
    const bucket = getStorageBucketRef();
    if (!bucket) return null;
    const url = new URL(imageUrl);
    return decodeURIComponent(url.pathname).replace(`/${bucket.name}/`, '');
  } catch {
    return null;
  }
}
