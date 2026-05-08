import * as admin from 'firebase-admin';

// Configuration placeholders to avoid crashing on empty/invalid env vars during build or first load
const projectId = process.env.FIREBASE_PROJECT_ID || 'missing';
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL || 'missing';
const privateKey = process.env.FIREBASE_PRIVATE_KEY 
  ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  : undefined;

/**
 * Initializes Firebase Admin in a way that handles missing or invalid 
 * environment variables gracefully without crashing the whole application.
 */
function getAdminApp() {
  if (admin.apps.length > 0) return admin.apps[0];

  try {
    if (!privateKey || projectId === 'missing') {
      console.warn('Firebase Admin: Environment variables are missing. SDK will not be initialized.');
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
    console.error('Firebase Admin: Initialization failed', error);
    return null;
  }
}

const app = getAdminApp();

// Export proxies that check for app existence before calling methods
// This prevents the "The default Firebase app does not exist" error
export const adminAuth = app ? admin.auth(app) : ({} as admin.auth.Auth);
export const adminDb = app ? admin.firestore(app) : ({} as FirebaseFirestore.Firestore);
export const adminStorage = app ? admin.storage(app) : ({} as admin.storage.Storage);
export const isFirebaseAdminAvailable = !!app;
