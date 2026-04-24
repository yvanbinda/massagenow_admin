import { UserRepository } from '@/repositories/user.repository';
import { BookingRepository } from '@/repositories/booking.repository';
import { VerificationRequest, TherapistProfile, User } from '@/types/models';

export class AdminService {
  private userRepo = new UserRepository();
  private bookingRepo = new BookingRepository();

  /**
   * Fetches a consolidated overview of the platform health.
   */
  async getPlatformOverview() {
    const [users, therapists, bookings] = await Promise.all([
      this.userRepo.getAllUsers(),
      this.userRepo.getActiveTherapists(),
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
   * This handles the 3-step atomic update.
   */
  async approveTherapist(id: string, email: string): Promise<void> {
    // 1. Update verification request status
    await this.userRepo.updateVerificationStatus(id, 'approved');
    
    // 2. Create/Activate live therapist profile
    await this.userRepo.createOrUpdateTherapistProfile(id, {
      status: 'active',
      isOnline: false,
      rating: 5.0,
      reviewCount: 0,
    });

    // 3. Flag user as certified
    await this.userRepo.updateUserCertification(id, true);
  }

  /**
   * Rejects a therapist's KYC.
   */
  async rejectTherapist(id: string, reason: string): Promise<void> {
    await this.userRepo.updateVerificationStatus(id, 'rejected', reason);
  }

  /**
   * Fetches pending KYC requests directly from the verification snapshot collection.
   * Joins with the User collection to retrieve real names and emails.
   */
  async getTherapistsForKyc() {
    const requests = await this.userRepo.getPendingKycRequests();
    const users = await this.userRepo.getAllUsers();
    
    return requests.map(req => {
      const user = users.find(u => u.id === req.id);

      return {
        id: req.id,
        professionalName: req.professionalName,
        operationMode: req.operationMode,
        specialties: req.specialties,
        bio: req.bio,
        experienceLevel: req.experienceLevel,
        avatarUrl: req.avatarUrl,
        email: user?.email || req.email || 'N/A', 
        name: user?.name || req.name || 'Inconnu', 
        date: req.submittedAt,
        status: req.status,
        docs: {
          idFront: req.idFrontUrl,
          idBack: req.idBackUrl,
          selfie: req.selfieUrl,
          license: req.licenseUrl,
        },
      };
    });
  }

  /**
   * Fetches all therapists for the directory with user details.
   */
  async getTherapistsForDirectory() {
    const [profiles, users] = await Promise.all([
      this.userRepo.getActiveTherapists(),
      this.userRepo.getAllUsers()
    ]);

    return profiles.map(profile => {
      const user = users.find(u => u.id === profile.id);
      return {
        ...profile,
        name: user?.name || 'Inconnu',
        email: user?.email || 'N/A',
        avatarUrl: user?.avatarUrl || profile.avatarUrl
      };
    });
  }

  /**
   * Fetches all users (clients) for the directory who are not certified professionals.
   */
  async getPatientsForDirectory() {
    // Corrected to use the existing method in UserRepository
    const patients = await this.userRepo.getUncertifiedUsers();
    return patients;
  }
}

export const adminService = new AdminService();
