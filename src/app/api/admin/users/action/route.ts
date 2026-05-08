import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getSuperAdminSession } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const session = await getSuperAdminSession();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { uid, action, name } = await request.json();

    if (!uid || !action) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
    }

    if (action === 'delete') {
      // 1. Mark user as deactivated in Firestore
      // We don't hard delete to preserve booking history integrity
      await adminDb.collection('users').doc(uid).update({
        status: 'deleted',
        deactivatedAt: new Date().toISOString(),
        deactivatedBy: session.uid
      });

      // 2. If therapist, mark profile as inactive
      const therapistDoc = await adminDb.collection('therapists').doc(uid).get();
      if (therapistDoc.exists) {
        await adminDb.collection('therapists').doc(uid).update({
          status: 'suspended',
          isOnline: false
        });
      }

      // 3. Record in Audit Log
      await adminDb.collection('audit_logs').add({
        adminId: session.uid,
        adminName: session.name || session.email || 'Admin',
        action: 'delete_user',
        targetId: uid,
        targetName: name || uid,
        details: `Suppression du compte : ${name || uid}`,
        createdAt: new Date().toISOString()
      });

      return NextResponse.json({ success: true, message: 'User deactivated and logged' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error: any) {
    console.error('User Action API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
