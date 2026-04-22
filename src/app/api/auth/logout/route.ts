import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  const cookieStore = await cookies();
  
  // Overwrite the cookie with an immediate expiration date to shred it
  cookieStore.set('admin_session', '', {
    maxAge: -1,
    path: '/',
  });

  return NextResponse.json({ success: true }, { status: 200 });
}
