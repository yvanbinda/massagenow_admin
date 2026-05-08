import { BaseRepository } from './base.repository';
import { Booking } from '@/types/models';

export class BookingRepository extends BaseRepository {
  private get collection() {
    return this.db.collection('bookings');
  }

  async getAllBookings(): Promise<Booking[]> {
    const snapshot = await this.collection.orderBy('createdAt', 'desc').get();
    return snapshot.docs.map(doc => this.serialize<Booking>(doc)!).filter(Boolean);
  }

  async getBookingsByTherapist(therapistId: string): Promise<Booking[]> {
    const snapshot = await this.collection
      .where('therapistId', '==', therapistId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => this.serialize<Booking>(doc)!).filter(Boolean);
  }

  async getBookingsByClient(clientId: string): Promise<Booking[]> {
    const snapshot = await this.collection
      .where('clientId', '==', clientId)
      .orderBy('createdAt', 'desc')
      .get();
    return snapshot.docs.map(doc => this.serialize<Booking>(doc)!).filter(Boolean);
  }
}
