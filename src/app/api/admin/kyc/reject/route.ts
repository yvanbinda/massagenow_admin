import { NextResponse } from 'next/server';
import { getAdminService } from '@/services/admin.service';
import { getSuperAdminSession } from '@/lib/auth-utils';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const session = await getSuperAdminSession();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id, reason } = await request.json();

    if (!id || !reason) {
      return NextResponse.json({ error: 'Missing ID or Reason' }, { status: 400 });
    }

    const adminService = getAdminService();
    // Pass the admin session data for auditing
    await adminService.rejectTherapist(id, reason, {
      id: session.uid,
      name: session.name || session.email || 'Admin'
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('KYC Rejection API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
