import { BaseRepository } from './base.repository';
import { AuditLog } from '@/types/models';

export class AuditRepository extends BaseRepository {
  private collection = this.db.collection('audit_logs');

  /**
   * Records a new administrative action in the audit log.
   */
  async recordAction(log: Omit<AuditLog, 'id'>): Promise<void> {
    await this.collection.add({
      ...log,
      createdAt: log.createdAt || new Date().toISOString()
    });
  }

  /**
   * Fetches the latest audit logs for the security dashboard.
   */
  async getLatestLogs(limit: number = 50): Promise<AuditLog[]> {
    const snapshot = await this.collection
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .get();
    
    return snapshot.docs.map(doc => this.serialize<AuditLog>(doc)!).filter(Boolean);
  }
}
