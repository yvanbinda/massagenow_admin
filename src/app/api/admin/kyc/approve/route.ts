import { NextResponse } from 'next/server';
import { adminService } from '@/services/admin.service';
import { getSuperAdminSession } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const session = await getSuperAdminSession();
    if (!session) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id, email } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    // Pass the admin session data for auditing
    await adminService.approveTherapist(id, email, {
      id: session.uid,
      name: session.name || session.email || 'Admin'
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('KYC Approval API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
