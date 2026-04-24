import { NextResponse } from 'next/server';
import { notificationService } from '@/services/notification.service';
import { checkSuperAdminSession } from '@/lib/auth-utils';

export async function GET() {
  try {
    const isAuthorized = await checkSuperAdminSession();
    if (!isAuthorized) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const notifications = await notificationService.getAdminNotifications();
    return NextResponse.json(notifications);
  } catch (error) {
    console.error('Fetch notifications API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
