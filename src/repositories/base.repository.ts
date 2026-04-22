import { adminDb } from '@/lib/firebase-admin';
import { serializeFirestoreDoc } from '@/lib/firebase/serializer';

export abstract class BaseRepository {
  protected db = adminDb;

  protected serialize<T>(snapshot: FirebaseFirestore.DocumentSnapshot): T | null {
    return serializeFirestoreDoc<T>(snapshot);
  }
}
