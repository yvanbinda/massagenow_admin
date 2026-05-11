import { UserRepository } from '@/repositories/user.repository';
import { BookingRepository } from '@/repositories/booking.repository';
import { NotificationRepository } from '@/repositories/notification.repository';
import { AuditRepository } from '@/repositories/audit.repository';
import { ReviewRepository } from '@/repositories/review.repository';
import { Booking } from '@/types/models';

export class AdminService {
  private get userRepo() { return new UserRepository(); }
  private get bookingRepo() { return new BookingRepository(); }
  private get notificationRepo() { return new NotificationRepository(); }
  private get auditRepo() { return new AuditRepository(); }
  private get reviewRepo() { return new ReviewRepository(); }

  async getPlatformOverview() {
    const [users, therapists, bookings, logs] = await Promise.all([
      this.userRepo.getAllUsers(),
      this.userRepo.getActiveTherapists(),
      this.bookingRepo.getAllBookings(),
      this.auditRepo.getLatestLogs(5)
    ]);

    const totalRevenue = bookings.reduce((sum, b) => sum + (b.priceSnapshot || 0), 0);
    const platformComm = bookings.reduce((sum, b) => sum + (b.platformFee || 0), 0);
    const chartData = this.calculateActivityStats(bookings);

    return {
      userCount: users.length,
      therapistCount: therapists.length,
      bookingCount: bookings.length,
      totalRevenue,
      platformComm,
      recentBookings: bookings.slice(0, 10),
      recentLogs: logs,
      chartData
    };
  }

  private calculateActivityStats(bookings: Booking[]) {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
    const now = new Date();
    const stats = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(now.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayLabel = days[date.getDay()];
      const count = bookings.filter(b => b.createdAt && b.createdAt.startsWith(dateStr)).length;
      stats.push({ name: dayLabel, count });
    }
    return stats;
  }

  async approveTherapist(id: string, email: string, admin: { id: string, name: string }): Promise<void> {
    await this.userRepo.updateVerificationStatus(id, 'approved');
    await this.userRepo.createOrUpdateTherapistProfile(id, {
      status: 'active',
      isOnline: false,
      rating: 5.0,
      reviewCount: 0,
    });
    await this.userRepo.updateUserCertification(id, true);
    await this.auditRepo.recordAction({
      adminId: admin.id,
      adminName: admin.name,
      action: 'approve_therapist',
      targetId: id,
      targetName: email,
      details: `Approbation du thérapeute ${email}`,
      createdAt: new Date().toISOString()
    });
  }

  async rejectTherapist(id: string, reason: string, admin: { id: string, name: string }): Promise<void> {
    const request = await this.userRepo.getUserById(id);
    await this.userRepo.updateVerificationStatus(id, 'rejected', reason);
    await this.auditRepo.recordAction({
      adminId: admin.id,
      adminName: admin.name,
      action: 'reject_therapist',
      targetId: id,
      targetName: request?.email || 'Inconnu',
      details: `Rejet du KYC pour ${request?.email || id}. Raison: ${reason}`,
      createdAt: new Date().toISOString()
    });
  }

  async getTherapistsForKyc() {
    const requests = await this.userRepo.getPendingKycRequests();
    const users = await this.userRepo.getAllUsers();
    return requests.map(req => {
      const user = users.find(u => u.id === req.id);
      const docsMap = (req as any).documents || {};
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
          idFront: docsMap.idFront,
          idBack: docsMap.idBack,
          selfie: docsMap.selfie,
          license: docsMap.license,
        },
      };
    });
  }

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

  async getPatientsForDirectory() {
    return await this.userRepo.getDirectoryUsers();
  }

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

  async getTherapistDetail(id: string) {
    const [profile, user, bookings, services, reviews, allUsers] = await Promise.all([
      this.userRepo.getTherapistProfile(id),
      this.userRepo.getUserById(id),
      this.bookingRepo.getBookingsByTherapist(id),
      this.userRepo.getTherapistServices(id),
      this.reviewRepo.getReviewsByTherapist(id),
      this.userRepo.getAllUsers()
    ]);
    if (!profile || !user) return null;
    return {
      ...profile,
      name: user.name,
      email: user.email,
      phone: user.phoneNumber || 'Non renseigné',
      memberSince: user.createdAt,
      bookings: bookings.map(b => ({ ...b, clientName: allUsers.find(u => u.id === b.clientId)?.name || 'Inconnu' })),
      services,
      reviews: reviews.map(r => ({ ...r, reviewerName: allUsers.find(u => u.id === r.clientId)?.name || r.reviewerName })),
      totalRevenue: bookings.reduce((sum, b) => sum + (b.priceSnapshot || 0), 0),
      platformComm: bookings.reduce((sum, b) => sum + (b.platformFee || 0), 0),
    };
  }

  async getPatientDetail(id: string) {
    const [user, bookings, reviews, allUsers] = await Promise.all([
      this.userRepo.getUserById(id),
      this.bookingRepo.getBookingsByClient(id),
      this.reviewRepo.getReviewsByClient(id),
      this.userRepo.getAllUsers()
    ]);
    if (!user) return null;
    return {
      ...user,
      bookings: bookings.map(b => ({ ...b, therapistName: allUsers.find(u => u.id === b.therapistId)?.name || 'Inconnu' })),
      reviews,
      totalSpent: bookings.reduce((sum, b) => sum + (b.priceSnapshot || 0), 0),
    };
  }

  async deleteUser(id: string, admin: { id: string, name: string }): Promise<void> {
    const user = await this.userRepo.getUserById(id);
    await this.userRepo.updateUserCertification(id, false);
    await this.auditRepo.recordAction({
      adminId: admin.id,
      adminName: admin.name,
      action: 'delete_user',
      targetId: id,
      targetName: user?.email || 'Utilisateur',
      details: `Suppression/Désactivation du compte utilisateur : ${user?.email || id}`,
      createdAt: new Date().toISOString()
    });
  }

  async getAuditLogs() {
    return await this.auditRepo.getLatestLogs();
  }
}

let instance: AdminService | null = null;
export const getAdminService = () => {
  if (!instance) instance = new AdminService();
  return instance;
};
