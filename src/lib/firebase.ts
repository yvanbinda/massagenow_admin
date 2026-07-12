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
 * If 'app' is undefined (like during build or if config is missing),
 * we export undefined to avoid 'e._getRecaptchaConfig is not a function' errors.
 */
export const auth: Auth | undefined = app ? getAuth(app) : undefined;
export const db: Firestore | undefined = app ? getFirestore(app) : undefined;
export const storage: FirebaseStorage | undefined = app ? getStorage(app) : undefined;

export { app, isValidConfig };
