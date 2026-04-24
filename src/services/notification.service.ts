import { NotificationRepository } from '@/repositories/notification.repository';
import { NotificationModel } from '@/types/models';

export class NotificationService {
  private repo = new NotificationRepository();

  /**
   * Retrieves the latest notifications for the Super Admin.
   */
  async getAdminNotifications(): Promise<NotificationModel[]> {
    return await this.repo.getAdminNotifications();
  }

  /**
   * Marks a specific notification as read.
   */
  async markAsRead(id: string): Promise<void> {
    await this.repo.markAsRead(id);
  }

  /**
   * Marks all unread admin notifications as read.
   */
  async markAllAsRead(): Promise<void> {
    await this.repo.markAllAsRead();
  }
}

export const notificationService = new NotificationService();
