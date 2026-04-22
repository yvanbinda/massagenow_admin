import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';

export async function POST(request: Request) {
  try {
    const { idToken } = await request.json();

    // 1. Verify the token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // 2. SECURITY GATE: Ensure they are actually a Super Admin
    // Note: This requires you to have set custom claims for your admin users
    if (decodedToken.role !== 'super_admin') {
      return NextResponse.json({ error: 'Unauthorized. Admins only.' }, { status: 403 });
    }

    // 3. Bake the secure Session Cookie (Expires in 5 days)
    const expiresIn = 60 * 60 * 24 * 5 * 1000; 
    const sessionCookie = await adminAuth.createSessionCookie(idToken, { expiresIn });

    // 4. Set the HTTP-Only cookie using Next.js 15 cookies API
    const cookieStore = await cookies();
    cookieStore.set('admin_session', sessionCookie, {
      maxAge: expiresIn / 1000,
      httpOnly: true, // Crucial: Prevents XSS attacks from reading the cookie
      secure: process.env.NODE_ENV === 'production', // Only sent over HTTPS in prod
      path: '/',
      sameSite: 'strict', // Prevents CSRF attacks
    });

    return NextResponse.json({ success: true }, { status: 200 });

  } catch (error) {
    console.error('Session creation failed:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
