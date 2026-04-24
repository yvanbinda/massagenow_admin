import React from 'react';
import { notificationService } from "@/services/notification.service";
import NotificationsHub from "./NotificationsHub";

// Ensure real-time data on every request
export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  // Fetch real notification data from Firestore
  const notifications = await notificationService.getAdminNotifications();

  return (
    <NotificationsHub initialData={notifications} />
  );
}
