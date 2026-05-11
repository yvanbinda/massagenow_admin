import React from 'react';
import { getAdminService } from "@/services/admin.service";
import DashboardClient from "./DashboardClient";

// Force dynamic rendering to ensure real-time data from Firestore
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const adminService = getAdminService();
  
  // 1. Fetch live metrics and logs from Firestore via our Service Layer
  const stats = await adminService.getPlatformOverview();
  const kycTherapists = await adminService.getTherapistsForKyc();

  // 2. Map to the specific props expected by the dashboard view
  const dashboardData = {
    userCount: stats.userCount,
    therapistCount: stats.therapistCount,
    bookingCount: stats.bookingCount,
    totalRevenue: stats.totalRevenue,
    platformComm: stats.platformComm,
    pendingKycCount: kycTherapists.length,
    chartData: stats.chartData,
    recentLogs: stats.recentLogs,
  };

  return (
    <DashboardClient stats={dashboardData} />
  );
}
