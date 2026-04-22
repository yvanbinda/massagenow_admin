export type UserRole = 'client' | 'therapist' | 'super_admin';
export type ProfileStatus = 'pending' | 'active' | 'suspended';
export type LocationType = 'at_home' | 'studio';

export type BookingStatus = 
  | 'pending_therapist_approval' 
  | 'confirmed' 
  | 'in_progress' 
  | 'completed' 
  | 'cancelled_by_client' 
  | 'cancelled_by_therapist' 
  | 'no_show';

export type PaymentStatus = 
  | 'pending_authorization' 
  | 'held_in_escrow' 
  | 'transferred' 
  | 'refunded' 
  | 'penalty_applied';
