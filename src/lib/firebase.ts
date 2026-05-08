import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";
import { getStorage, FirebaseStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

/**
 * Robust check to see if we have valid configuration.
 * Avoids initializing with strings like "undefined" which Vercel might pass.
 */
const isValidConfig = firebaseConfig.apiKey && firebaseConfig.apiKey !== "undefined";

/**
 * Initialize Firebase App conditionally to prevent build-time crashes.
 */
const app: FirebaseApp | undefined = (typeof window !== "undefined" && isValidConfig)
  ? (getApps().length > 0 ? getApp() : initializeApp(firebaseConfig))
  : undefined;

/**
 * Export Firebase services. 
 * They will be initialized only if 'app' exists.
 * If 'app' is undefined (like during build), we export empty objects cast to the correct type
 * to prevent crashes, but they will never be called during the build process.
 */
export const auth: Auth = app ? getAuth(app) : ({} as Auth);
export const db: Firestore = app ? getFirestore(app) : ({} as Firestore);
export const storage: FirebaseStorage = app ? getStorage(app) : ({} as FirebaseStorage);

export { app };
