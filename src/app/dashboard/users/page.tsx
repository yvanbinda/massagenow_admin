import React from 'react';
import { getAdminService } from "@/services/admin.service";
import UserDirectoryClient from "./UserDirectoryClient";

// Ensure real-time data on every request
export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  const adminService = getAdminService();
  
  // Fetch real user data from Firestore via our Service Layer
  const [therapists, patients] = await Promise.all([
    adminService.getTherapistsForDirectory(),
    adminService.getPatientsForDirectory(),
  ]);

  return (
    <UserDirectoryClient 
      therapists={therapists} 
      patients={patients} 
    />
  );
}
