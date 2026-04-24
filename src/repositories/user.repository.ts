import { BaseRepository } from './base.repository';
import { User, TherapistProfile, VerificationRequest } from '@/types/models';

export class UserRepository extends BaseRepository {
  private usersCollection = this.db.collection('users');
  private verificationCollection = this.db.collection('verification_requests');
  private therapistsCollection = this.db.collection('therapists');

  // --- 1. USER DATA ---
  async getAllUsers(): Promise<User[]> {
    const snapshot = await this.usersCollection.get();
    return snapshot.docs.map(doc => this.serialize<User>(doc)!).filter(Boolean);
  }

  /**
   * Fetches only users who are not certified professionals (Clients/Users side).
   */
  async getUncertifiedUsers(): Promise<User[]> {
    const snapshot = await this.usersCollection
      .where('isCertified', '==', false)
      .get();
    return snapshot.docs.map(doc => this.serialize<User>(doc)!).filter(Boolean);
  }

  async getUserById(id: string): Promise<User | null> {
    const doc = await this.usersCollection.doc(id).get();
    return this.serialize<User>(doc);
  }

  async updateUserCertification(id: string, isCertified: boolean): Promise<void> {
    await this.usersCollection.doc(id).update({ 
      isCertified, 
      updatedAt: new Date().toISOString() 
    });
  }

  // --- 2. KYC / VERIFICATION REQUESTS ---
  async getAllKycRequests(): Promise<VerificationRequest[]> {
    const snapshot = await this.verificationCollection
      .orderBy('submittedAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => this.serialize<VerificationRequest>(doc)!).filter(Boolean);
  }

  async getPendingKycRequests(): Promise<VerificationRequest[]> {
    const snapshot = await this.verificationCollection
      .where('status', '==', 'pending')
      .get();
    
    return snapshot.docs.map(doc => this.serialize<VerificationRequest>(doc)!).filter(Boolean);
  }

  async updateVerificationStatus(id: string, status: VerificationRequest['status'], reason?: string): Promise<void> {
    const updateData: any = { 
      status, 
      reviewedAt: new Date().toISOString() 
    };
    if (reason) updateData.rejectionReason = reason;

    await this.verificationCollection.doc(id).update(updateData);
  }

  // --- 3. LIVE THERAPIST PROFILES ---
  async getActiveTherapists(): Promise<TherapistProfile[]> {
    const snapshot = await this.therapistsCollection
      .where('status', '==', 'active')
      .get();
    
    return snapshot.docs.map(doc => this.serialize<TherapistProfile>(doc)!).filter(Boolean);
  }

  async getTherapistProfile(id: string): Promise<TherapistProfile | null> {
    const doc = await this.therapistsCollection.doc(id).get();
    return this.serialize<TherapistProfile>(doc);
  }

  async createOrUpdateTherapistProfile(id: string, data: Partial<TherapistProfile>): Promise<void> {
    await this.therapistsCollection.doc(id).set({
      ...data,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  }
}
