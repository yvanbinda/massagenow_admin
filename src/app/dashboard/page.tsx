import React from 'react';
import { adminService } from "@/services/admin.service";
import DashboardClient from "./DashboardClient";

// Force dynamic rendering to ensure real-time data from Firestore
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  // 1. Fetch live metrics from Firestore via our Service Layer
  const stats = await adminService.getPlatformOverview();

  // 2. Map to the specific props expected by the dashboard view
  const dashboardData = {
    userCount: stats.userCount,
    therapistCount: stats.therapistCount,
    bookingCount: stats.bookingCount,
    totalRevenue: stats.totalRevenue,
    platformComm: stats.platformComm,
    // Add pending KYC specifically for the home view alerts
    pendingKycCount: (await adminService.getTherapistsForKyc()).length,
  };

  return (
    <DashboardClient stats={dashboardData} />
  );
}
