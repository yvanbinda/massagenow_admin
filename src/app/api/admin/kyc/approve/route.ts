import { NextResponse } from 'next/server';
import { adminService } from '@/services/admin.service';
import { checkSuperAdminSession } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const isAuthorized = await checkSuperAdminSession();
    if (!isAuthorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id, email } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'Missing ID' }, { status: 400 });
    }

    await adminService.approveTherapist(id, email);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('KYC Approval API Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
