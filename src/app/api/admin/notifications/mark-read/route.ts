import { NextResponse } from 'next/server';
import { notificationService } from '@/services/notification.service';
import { checkSuperAdminSession } from '@/lib/auth-utils';

export async function POST(request: Request) {
  try {
    const isAuthorized = await checkSuperAdminSession();
    if (!isAuthorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { id, all } = await request.json();

    if (all) {
      await notificationService.markAllAsRead();
    } else if (id) {
      await notificationService.markAsRead(id);
    } else {
      return NextResponse.json({ error: 'Missing ID or all flag' }, { status: 400 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: any) {
    console.error('Notifications API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
