import { BaseRepository } from './base.repository';
import { NotificationModel } from '@/types/models';

export class NotificationRepository extends BaseRepository {
  private collection = this.db.collection('notifications');

  async getAdminNotifications(limit: number = 20): Promise<NotificationModel[]> {
    const snapshot = await this.collection
      .where('recipientId', '==', 'super_admin')
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    
    return snapshot.docs.map(doc => this.serialize<NotificationModel>(doc)!).filter(Boolean);
  }

  async markAsRead(id: string): Promise<void> {
    await this.collection.doc(id).update({ isRead: true });
  }

  async markAllAsRead(): Promise<void> {
    const unread = await this.collection
      .where('recipientId', '==', 'super_admin')
      .where('isRead', '==', false)
      .get();
    
    const batch = this.db.batch();
    unread.docs.forEach(doc => {
      batch.update(doc.ref, { isRead: true });
    });
    
    await batch.commit();
  }
}
