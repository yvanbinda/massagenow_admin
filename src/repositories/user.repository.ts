import { BaseRepository } from './base.repository';
import { User, TherapistProfile } from '@/types/models';

export class UserRepository extends BaseRepository {
  private collection = this.db.collection('users');
  private profileCollection = this.db.collection('therapist_profiles');

  async getAllUsers(): Promise<User[]> {
    const snapshot = await this.collection.get();
    return snapshot.docs.map(doc => this.serialize<User>(doc)!).filter(Boolean);
  }

  async getTherapistProfiles(): Promise<TherapistProfile[]> {
    const snapshot = await this.profileCollection.get();
    return snapshot.docs.map(doc => this.serialize<TherapistProfile>(doc)!).filter(Boolean);
  }

  async getUserById(id: string): Promise<User | null> {
    const doc = await this.collection.doc(id).get();
    return this.serialize<User>(doc);
  }

  async updateProfileStatus(id: string, status: TherapistProfile['status']): Promise<void> {
    await this.profileCollection.doc(id).update({ status, updatedAt: new Date() });
  }
}
