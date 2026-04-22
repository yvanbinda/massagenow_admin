import { BookingStatus, LocationType, PaymentStatus, ProfileStatus } from "./enums";

// --- 1. USER MODEL ---
export interface User {
  id: string; // The uid
  email: string;
  name: string;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  stripeCustomerId?: string | null;
  fcmTokens: string[];
  isCertified: boolean;
  lastActiveMode: 'client' | 'therapist';
  createdAt: string; // ISO String
  updatedAt?: string | null;
}

// --- 2. THERAPIST PROFILE MODEL ---
export interface TravelSettings {
  acceptsAtHome: boolean;
  maxRadiusKm: number;
  baseAddress?: string | null;
  baseLat?: number | null;
  baseLng?: number | null;
}

export interface TherapistProfile {
  id: string; // Matches User ID
  bio: string;
  status: ProfileStatus;
  stripeConnectId?: string | null;
  rating: number;
  reviewCount: number;
  travelSettings: TravelSettings;
  isOnline: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

// --- 3. SERVICE MODEL ---
export interface Service {
  id: string;
  therapistId: string;
  title: string;
  description: string;
  category: string;
  durationMinutes: number;
  price: number;
  isActive: boolean;
  createdAt: string;
  updatedAt?: string | null;
}

// --- 4. BOOKING MODEL (The Escrow Ledger) ---
export interface Booking {
  id: string;
  clientId: string;
  therapistId: string;
  serviceId: string;
  
  // Snapshots
  serviceTitleSnapshot: string;
  durationMinutesSnapshot: number;
  priceSnapshot: number;
  
  // Scheduling
  startTime: string;
  endTime: string;
  status: BookingStatus;
  
  // Logistics
  locationType: LocationType;
  clientAddress?: string | null;
  clientLat?: number | null;
  clientLng?: number | null;
  specialInstructions?: string | null;
  
  // Financials
  stripePaymentIntentId?: string | null;
  paymentStatus: PaymentStatus;
  platformFee: number;
  therapistNetPayout: number;
  
  createdAt: string;
  updatedAt?: string | null;
}

// --- 5. REVIEW MODEL ---
export interface Review {
  id: string;
  therapistId: string;
  clientId: string;
  bookingId: string;
  reviewerName: string;
  reviewerAvatarUrl?: string | null;
  rating: number;
  text: string;
  isPublished: boolean;
  therapistReply?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

// --- 6. STORY MODEL ---
export interface Story {
  id: string;
  therapistId: string;
  mediaUrl: string;
  mediaType: 'image' | 'video';
  caption?: string | null;
  linkUrl?: string | null;
  viewsCount: number;
  createdAt: string;
  expiresAt: string; 
}
