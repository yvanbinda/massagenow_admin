import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { adminAuth, isFirebaseAdminAvailable } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    console.log('[Login API] POST request received');
    // 1. Critical Availability Check
    if (!isFirebaseAdminAvailable) {
      console.error('[Login API] Firebase Admin is NOT available. Check env vars.');
      return NextResponse.json(
        { error: 'Firebase Admin is not configured. Please check your .env.local file.' },
        { status: 503 }
      );
    }

    const { idToken } = await request.json();

    if (!idToken) {
      console.warn('[Login API] Missing ID Token in request body');
      return NextResponse.json({ error: 'Missing ID Token' }, { status: 400 });
    }

    // 2. Verify the token with Firebase Admin
    console.log('[Login API] Verifying ID Token...');
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log('[Login API] Token verified. Role:', decodedToken.role, 'UID:', decodedToken.uid);

    // 3. SECURITY GATE: Ensure they are actually a Super Admin
    if (decodedToken.role !== 'super_admin') {
      console.warn('[Login API] Unauthorized: User is not a super_admin. Role found:', decodedToken.role);
      return NextResponse.json({ error: 'Unauthorized. Super Admin access required.' }, { status: 403 });
    }

    // 4. Bake the secure Session Cookie (Expires in 5 days)
    console.log('[Login API] Creating session cookie...');
    const expiresIn = 60 * 60 * 24 * 5 * 1000;
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // 5. Set the HTTP-Only cookie using Next.js 15 cookies API
    console.log('[Login API] Setting session cookie in browser...');
    const cookieStore = await cookies();
    cookieStore.set('admin_session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'strict',
    });

    console.log('[Login API] Login successful!');
    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error: any) {
    console.error('[Login API] Error occurred:', error.code, error.message);
    
    // Friendly error messages for common Firebase issues
    if (error.code === 'auth/id-token-expired') {
      return NextResponse.json({ error: 'Votre session a expiré. Veuillez vous reconnecter.' }, { status: 401 });
    }

    return NextResponse.json(
      { error: `Échec de la création de session sécurisée: ${error.message}` },
      { status: 500 }
    );
  }
}
