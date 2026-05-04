import React from 'react';
import { adminService } from "@/services/admin.service";
import TherapistDetailClient from "./TherapistDetailClient";
import { notFound } from "next/navigation";

// Force dynamic rendering to ensure real-time data from Firestore
export const dynamic = 'force-dynamic';

export default async function TherapistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // Fetch real data from Firestore via our Service Layer
  const therapist = await adminService.getTherapistDetail(id);

  if (!therapist) {
    notFound();
  }

  return (
    <TherapistDetailClient therapist={therapist} />
  );
}
