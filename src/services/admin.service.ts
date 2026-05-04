import { UserRepository } from '@/repositories/user.repository';
import { BookingRepository } from '@/repositories/booking.repository';
import { NotificationRepository } from '@/repositories/notification.repository';
import { VerificationRequest, TherapistProfile, User, Booking, Service, NotificationModel } from '@/types/models';

export class AdminService {
  private userRepo = new UserRepository();
  private bookingRepo = new BookingRepository();
  private notificationRepo = new NotificationRepository();

  /**
   * Fetches a consolidated overview of the platform health.
   */
  async getPlatformOverview() {
    const [users, therapists, bookings, notifications] = await Promise.all([
      this.userRepo.getAllUsers(),
      this.userRepo.getActiveTherapists(),
      this.bookingRepo.getAllBookings(),
      this.notificationRepo.getAdminNotifications(5) // Fetch 5 most recent
    ]);

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.priceSnapshot || 0), 0);
    const platformComm = bookings.reduce((sum, b) => sum + (b.platformFee || 0), 0);

    // Calculate chart data (last 7 days)
    const chartData = this.calculateActivityStats(bookings);

    return {
      userCount: users.length,
      therapistCount: therapists.length,
      bookingCount: bookings.length,
      totalRevenue,
      platformComm,
      recentBookings: bookings.slice(0, 10),
      recentNotifications: notifications,
      chartData
    };
  }

  /**
   * Helper to aggregate bookings by date for the activity chart.
   */
  private calculateActivityStats(bookings: Booking[]) {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const now = new Date();
    const stats = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayLabel = days[date.getDay()];

      const count = bookings.filter(b => 
        b.createdAt && b.createdAt.startsWith(dateStr)
      ).length;

      stats.push({ name: dayLabel, count });
    }

    return stats;
  }

  /**
   * Approves a therapist's KYC and activates their profile.
   */
  async approveTherapist(id: string, email: string): Promise<void> {
    await this.userRepo.updateVerificationStatus(id, 'approved');
    await this.userRepo.createOrUpdateTherapistProfile(id, {
      status: 'active',
      isOnline: false,
      rating: 5.0,
      reviewCount: 0,
    });
    await this.userRepo.updateUserCertification(id, true);
  }

  /**
   * Rejects a therapist's KYC.
   */
  async rejectTherapist(id: string, reason: string): Promise<void> {
    await this.userRepo.updateVerificationStatus(id, 'rejected', reason);
  }

  /**
   * Fetches pending KYC requests joined with User data.
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
   * Fetches all users for the directory.
   * Includes everyone (Clients and converted Therapists).
   */
  async getPatientsForDirectory() {
    const users = await this.userRepo.getDirectoryUsers();
    return users;
  }

  /**
   * Fetches all bookings with associated user details for the financial ledger.
   */
  async getAllTransactions() {
    const [bookings, users] = await Promise.all([
      this.bookingRepo.getAllBookings(),
      this.userRepo.getAllUsers()
    ]);

    return bookings.map(booking => {
      const client = users.find(u => u.id === booking.clientId);
      const therapist = users.find(u => u.id === booking.therapistId);
      
      return {
        ...booking,
        clientName: client?.name || 'Client Inconnu',
        therapistName: therapist?.name || 'Thérapeute Inconnu'
      };
    });
  }

  /**
   * Fetches full detail for a specific therapist.
   */
  async getTherapistDetail(id: string) {
    const [profile, user, bookings, services] = await Promise.all([
      this.userRepo.getTherapistProfile(id),
      this.userRepo.getUserById(id),
      this.bookingRepo.getBookingsByTherapist(id),
      this.userRepo.getTherapistServices(id)
    ]);

    if (!profile || !user) return null;

    return {
      ...profile,
      name: user.name,
      email: user.email,
      phone: user.phoneNumber || 'Non renseigné',
      memberSince: user.createdAt,
      bookings: bookings,
      services: services,
      totalRevenue: bookings.reduce((sum, b) => sum + (b.priceSnapshot || 0), 0),
      platformComm: bookings.reduce((sum, b) => sum + (b.platformFee || 0), 0),
    };
  }

  /**
   * Fetches full detail for a specific user.
   */
  async getPatientDetail(id: string) {
    const user = await this.userRepo.getUserById(id);
    if (!user) return null;

    const snapshot = await this.bookingRepo.getAllBookings(); 
    const userBookings = snapshot.filter(b => b.clientId === id);

    return {
      ...user,
      bookings: userBookings,
      totalSpent: userBookings.reduce((sum, b) => sum + (b.priceSnapshot || 0), 0),
    };
  }
}

export const adminService = new AdminService();
