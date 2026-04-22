import { UserRepository } from '@/repositories/user.repository';
import { BookingRepository } from '@/repositories/booking.repository';
import { User, TherapistProfile, Booking } from '@/types/models';

export class AdminService {
  private userRepo = new UserRepository();
  private bookingRepo = new BookingRepository();

  /**
   * Fetches a consolidated overview of the platform health.
   */
  async getPlatformOverview() {
    const [users, therapists, bookings] = await Promise.all([
      this.userRepo.getAllUsers(),
      this.userRepo.getTherapistProfiles(),
      this.bookingRepo.getAllBookings(),
    ]);

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.priceSnapshot || 0), 0);
    const platformComm = bookings.reduce((sum, b) => sum + (b.platformFee || 0), 0);

    return {
      userCount: users.length,
      therapistCount: therapists.length,
      bookingCount: bookings.length,
      totalRevenue,
      platformComm,
      recentBookings: bookings.slice(0, 10),
    };
  }

  /**
   * Approves a therapist's KYC and activates their profile.
   */
  async approveTherapist(id: string): Promise<void> {
    await this.userRepo.updateProfileStatus(id, 'active');
    // In production, we would also trigger a Firebase Cloud Function 
    // here to send a congratulatory email via SendGrid/Postmark.
  }

  async getTherapistsByStatus(status: TherapistProfile['status']): Promise<TherapistProfile[]> {
    const all = await this.userRepo.getTherapistProfiles();
    return all.filter(t => t.status === status);
  }
}

// Export a singleton instance for use across Next.js Server Components
export const adminService = new AdminService();
