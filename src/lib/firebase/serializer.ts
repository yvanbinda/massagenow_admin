import { DocumentSnapshot, Timestamp } from 'firebase-admin/firestore';

/**
 * Safely serializes a Firestore document for Next.js Server-to-Client boundaries.
 * Deeply converts all Firebase Timestamps to ISO strings.
 */
export function serializeFirestoreDoc<T>(doc: DocumentSnapshot): T | null {
  if (!doc.exists) return null;

  const data = doc.data();
  if (!data) return null;

  const serializedData: any = { id: doc.id };

  for (const [key, value] of Object.entries(data)) {
    // If the value is a Firebase Timestamp, convert it to an ISO String
    if (value && typeof value === 'object' && 'toDate' in value) {
      serializedData[key] = (value as Timestamp).toDate().toISOString();
    } 
    // Handle nested objects (like TravelSettings)
    else if (value && typeof value === 'object' && !Array.isArray(value)) {
       const nestedObj: any = {};
       for (const [nestedKey, nestedValue] of Object.entries(value)) {
         if (nestedValue && typeof nestedValue === 'object' && 'toDate' in nestedValue) {
           nestedObj[nestedKey] = (nestedValue as Timestamp).toDate().toISOString();
         } else {
           nestedObj[nestedKey] = nestedValue;
         }
       }
       serializedData[key] = nestedObj;
    } 
    else {
      serializedData[key] = value;
    }
  }

  return serializedData as T;
}
