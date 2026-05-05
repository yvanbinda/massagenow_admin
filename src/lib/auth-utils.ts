import { cookies } from 'next/headers';
import { adminAuth } from './firebase-admin';

/**
 * Decodes and returns the current Super Admin session claims.
 * Returns null if the session is invalid or not a super admin.
 */
export async function getSuperAdminSession() {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session')?.value;

    if (!sessionCookie) return null;

    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    if (decodedClaims.role !== 'super_admin') return null;
    
    return decodedClaims;
  } catch (error) {
    console.error('Auth verification failed:', error);
    return null;
  }
}

/**
 * Simple boolean check for session validity.
 */
export async function checkSuperAdminSession(): Promise<boolean> {
  const session = await getSuperAdminSession();
  return !!session;
}
