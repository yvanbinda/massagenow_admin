import { BaseEntity, convertTimestamps } from './base.model';
import { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';

export interface Service {
  name: string;
  duration: string;
  price: number;
}

export interface Payout {
  date: Date;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
}

export interface Therapist extends BaseEntity {
  name: string;
  email: string;
  phone: string;
  location: string;
  status: 'active' | 'suspended' | 'pending_kyc' | 'rejected';
  memberSince: Date;
  matchScore: number;
  totalRevenue: number;
  platformCommission: number;
  stripeStatus: 'active' | 'restricted' | 'pending';
  services: Service[];
  recentPayouts: Payout[];
  avatarUrl?: string;
  kycVerified: boolean;
}

export const therapistConverter: FirestoreDataConverter<Therapist> = {
  toFirestore(therapist: Therapist): FirebaseFirestore.DocumentData {
    return { ...therapist };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Therapist {
    const data = snapshot.data();
    return convertTimestamps({
      id: snapshot.id,
      ...data,
    }) as Therapist;
  },
};
