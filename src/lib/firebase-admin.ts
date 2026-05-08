import * as admin from 'firebase-admin';

const projectId = process.env.FIREBASE_PROJECT_ID || 'missing';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || 'missing';
const privateKey = process.env.FIREBASE_PRIVATE_KEY 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

function getAdminApp() {
  if (admin.apps.length > 0) return admin.apps[0];

  try {
    if (!privateKey || projectId === 'missing') {
      return null;
    }

    return admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL: `https://${projectId}.firebaseio.com`,
    });
  } catch (error) {
    return null;
  }
}

const app = getAdminApp();

/**
 * Robust exports using Proxies to avoid crashes during Next.js build phase
 * when environment variables might be missing.
 */
export const adminAuth = new Proxy({} as admin.auth.Auth, {
  get: (target, prop) => {
    if (!app) throw new Error('Firebase Admin Auth accessed before initialization or missing credentials.');
    return (admin.auth(app) as any)[prop];
  }
});

export const adminDb = new Proxy({} as FirebaseFirestore.Firestore, {
  get: (target, prop) => {
    if (!app) throw new Error('Firebase Admin Firestore accessed before initialization or missing credentials.');
    return (admin.firestore(app) as any)[prop];
  }
});

export const adminStorage = new Proxy({} as admin.storage.Storage, {
  get: (target, prop) => {
    if (!app) throw new Error('Firebase Admin Storage accessed before initialization or missing credentials.');
    return (admin.storage(app) as any)[prop];
  }
});

export const isFirebaseAdminAvailable = !!app;
