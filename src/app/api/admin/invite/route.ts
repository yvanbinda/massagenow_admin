import { NextResponse } from 'next/server';
import { adminAuth, adminDb, isFirebaseAdminAvailable } from '@/lib/firebase-admin';
import { adminService } from '@/services/admin.service';
import { getSuperAdminSession } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    // 1. Critical Availability Check
    if (!isFirebaseAdminAvailable) {
      return NextResponse.json({ error: 'Firebase Admin not configured' }, { status: 503 });
    }

    // 2. Authorization Check
    const session = await getSuperAdminSession();
    if (!session) {
      return NextResponse.json({ error: 'Forbidden: Super Admin access required' }, { status: 403 });
    }

    const { email, name } = await request.json();

    if (!email || !name) {
      return NextResponse.json({ error: 'Email and Name are required' }, { status: 400 });
    }

    // 3. Create the user in Firebase Auth
    const newUser = await adminAuth.createUser({
      email,
      displayName: name,
      emailVerified: true,
    });

    // 4. Set the Custom Claim (Security Badge)
    await adminAuth.setCustomUserClaims(newUser.uid, { role: 'super_admin' });

    // 5. Create Firestore record
    await adminDb.collection('users').doc(newUser.uid).set({
      email,
      name,
      role: 'super_admin',
      createdAt: new Date().toISOString(),
      isCertified: true,
    });

    // 6. Record Audit Log
    // Using a repository method directly or via adminService if exposed
    await adminDb.collection('audit_logs').add({
      adminId: session.uid,
      adminName: session.name || session.email || 'Admin',
      action: 'invite_admin',
      targetId: newUser.uid,
      targetName: email,
      details: `Invitation d'un nouvel administrateur : ${email}`,
      createdAt: new Date().toISOString()
    });

    // 7. Generate Password Reset / Invitation Link
    const inviteLink = await adminAuth.generatePasswordResetLink(email);
    console.log(`[SECURITY] Invitation created for ${email} by ${session.email}. Link: ${inviteLink}`);

    return NextResponse.json({ 
      success: true, 
      message: 'Admin invited successfully. Link generated in logs.',
      uid: newUser.uid 
    }, { status: 200 });

  } catch (error: any) {
    console.error('Invite Admin failed:', error);
    return NextResponse.json({ error: error.message || 'Failed to invite admin' }, { status: 500 });
  }
}
