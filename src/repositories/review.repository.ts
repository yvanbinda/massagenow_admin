import { BaseRepository } from './base.repository';
import { Review } from '@/types/models';

export class ReviewRepository extends BaseRepository {
  private get collection() {
    return this.db.collection('reviews');
  }

  /**
   * Fetches all reviews for a specific therapist.
   */
  async getReviewsByTherapist(therapistId: string): Promise<Review[]> {
    const snapshot = await this.collection
      .where('therapistId', '==', therapistId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => this.serialize<Review>(doc)!).filter(Boolean);
  }

  /**
   * Fetches all reviews written by a specific client.
   */
  async getReviewsByClient(clientId: string): Promise<Review[]> {
    const snapshot = await this.collection
      .where('clientId', '==', clientId)
      .orderBy('createdAt', 'desc')
      .get();
    
    return snapshot.docs.map(doc => this.serialize<Review>(doc)!).filter(Boolean);
  }

  /**
   * Toggles the publication status of a review.
   */
  async togglePublish(id: string, isPublished: boolean): Promise<void> {
    await this.collection.doc(id).update({ isPublished, updatedAt: new Date().toISOString() });
  }

  /**
   * Deletes a review (moderation).
   */
  async deleteReview(id: string): Promise<void> {
    await this.collection.doc(id).delete();
  }
}
