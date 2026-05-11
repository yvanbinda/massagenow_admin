import React from 'react';
import { getAdminService } from "@/services/admin.service";
import PatientDetailClient from "./PatientDetailClient";
import { notFound } from "next/navigation";

// Force dynamic rendering to ensure real-time data from Firestore
export const dynamic = 'force-dynamic';

export default async function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const adminService = getAdminService();

  // Fetch real data from Firestore via our Service Layer
  const patient = await adminService.getPatientDetail(id);

  if (!patient) {
    notFound();
  }

  return (
    <PatientDetailClient patient={patient} />
  );
}
