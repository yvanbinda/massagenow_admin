import { cookies } from 'next/headers';
import { adminAuth } from './firebase-admin';

/**
 * Checks if the current request has a valid Super Admin session.
 * Used for protecting API routes.
 */
export async function checkSuperAdminSession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session')?.value;

    if (!sessionCookie) return false;

    // Verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);
    
    // Check for the super_admin role
    return decodedClaims.role === 'super_admin';
  } catch (error) {
    console.error('Auth check failed:', error);
    return false;
  }
}
