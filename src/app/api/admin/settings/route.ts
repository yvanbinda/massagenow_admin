import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { getSuperAdminSession } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const session = await getSuperAdminSession();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const newSettings = await request.json();

    // 1. Update global settings in Firestore
    // Assuming a single document for platform settings
    await adminDb.collection('config').doc('platform').set({
      ...newSettings,
      updatedAt: new Date().toISOString(),
      updatedBy: session.uid
    }, { merge: true });

    // 2. Record in Audit Log
    await adminDb.collection('audit_logs').add({
      adminId: session.uid,
      adminName: session.name || session.email || 'Admin',
      action: 'update_settings',
      targetId: 'platform_config',
      targetName: 'Paramètres Système',
      details: `Mise à jour des paramètres de la plateforme (Commission: ${newSettings.commission}%)`,
      createdAt: new Date().toISOString()
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Settings Update API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
