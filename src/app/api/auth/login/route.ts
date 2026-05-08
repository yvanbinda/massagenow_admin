import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { adminAuth, isFirebaseAdminAvailable } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    // 1. Critical Availability Check
    if (!isFirebaseAdminAvailable) {
      return NextResponse.json(
        { error: 'Firebase Admin is not configured. Please check your .env.local file.' },
        { status: 503 }
      );
    }

    const { idToken } = await request.json();

    if (!idToken) {
      return NextResponse.json({ error: 'Missing ID Token' }, { status: 400 });
    }

    // 2. Verify the token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // 3. SECURITY GATE: Ensure they are actually a Super Admin
    if (decodedToken.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized. Super Admin access required.' }, { status: 403 });
    }

    // 4. Bake the secure Session Cookie (Expires in 5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; 
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // 5. Set the HTTP-Only cookie using Next.js 15 cookies API
    const cookieStore = await cookies();
    cookieStore.set('admin_session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error('Session creation failed:', error);
    
    // Friendly error messages for common Firebase issues
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json({ error: 'Votre session a expiré. Veuillez vous reconnecter.' }, { status: 401 });
    }

    return NextResponse.json(
      { error: 'Échec de la création de session sécurisée.' },
      { status: 500 }
    );
  }
}
