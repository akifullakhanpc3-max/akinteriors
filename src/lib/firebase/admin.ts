import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getStorage } from 'firebase-admin/storage';

function getServiceAccount() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    return null;
  }

  return { projectId, privateKey, clientEmail };
}

function getStorageBucket() {
  return process.env.FIREBASE_STORAGE_BUCKET || '';
}

export function getFirebaseApp() {
  const serviceAccount = getServiceAccount();
  if (!serviceAccount) return null;

  if (getApps().length > 0) return getApp();

  return initializeApp({
    credential: cert(serviceAccount),
    storageBucket: getStorageBucket(),
  });
}

export function getStorageBucketRef() {
  const app = getFirebaseApp();
  if (!app) return null;
  return getStorage(app).bucket();
}
