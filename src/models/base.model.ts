import { Timestamp } from 'firebase-admin/firestore';

/**
 * Common fields for all Firestore documents
 */
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Utility to convert Firestore Timestamps to JS Dates
 */
export const convertTimestamps = (data: any) => {
  const result = { ...data };
  for (const key in result) {
    if (result[key] instanceof Timestamp) {
      result[key] = result[key].toDate();
    } else if (typeof result[key] === 'object' && result[key] !== null) {
      result[key] = convertTimestamps(result[key]);
    }
  }
  return result;
};
