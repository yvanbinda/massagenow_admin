import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export async function middleware(request: NextRequest) {
  // Check if they are trying to access the protected admin area
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    
    // Look for our HTTP-Only cookie
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('admin_session')?.value;

    // If no cookie exists, redirect immediately to login
    if (!sessionCookie) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

// Optimize middleware to only run on the dashboard paths
export const config = {
  matcher: ['/dashboard/:path*'],
};
