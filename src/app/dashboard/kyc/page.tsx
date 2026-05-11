import React from 'react';
import { getAdminService } from "@/services/admin.service";
import KycClient from "./KycClient";

// Force dynamic rendering to ensure real-time data from Firestore
export const dynamic = 'force-dynamic';

export default async function KycPage() {
  const adminService = getAdminService();
  
  // Fetch real data from Firestore via our Service Layer
  const therapists = await adminService.getTherapistsForKyc();

  return (
    <KycClient initialData={therapists} />
  );
}
