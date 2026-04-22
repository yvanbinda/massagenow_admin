import { BaseEntity, convertTimestamps } from './base.model';
import { FirestoreDataConverter, QueryDocumentSnapshot } from 'firebase-admin/firestore';

export interface PatientPreferences {
  environment: string;
  maxBudget: number;
  technique: string;
  genderPref: string;
}

export interface PatientMetrics {
  ltv: number;
  cancellationRate: number;
  noShowCount: number;
  totalSessions: number;
}

export interface PatientBooking {
  id: string;
  therapistId: string;
  therapistName: string;
  date: Date;
  status: 'completed' | 'cancelled' | 'no_show';
}

export interface Patient extends BaseEntity {
  name: string;
  email: string;
  avatarUrl?: string;
  status: 'active' | 'flagged' | 'suspended';
  memberSince: Date;
  preferences: PatientPreferences;
  metrics: PatientMetrics;
  recentBookings: PatientBooking[];
}

export const patientConverter: FirestoreDataConverter<Patient> = {
  toFirestore(patient: Patient): FirebaseFirestore.DocumentData {
    return { ...patient };
  },
  fromFirestore(snapshot: QueryDocumentSnapshot): Patient {
    const data = snapshot.data();
    return convertTimestamps({
      id: snapshot.id,
      ...data,
    }) as Patient;
  },
};
