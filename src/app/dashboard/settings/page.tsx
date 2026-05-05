import React from 'react';
import { adminDb } from '@/lib/firebase-admin';
import { UserRepository } from '@/repositories/user.repository';
import SettingsClient from './SettingsClient';

// Force dynamic rendering to ensure fresh settings
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const userRepo = new UserRepository();

  // 1. Fetch global settings from Firestore
  const configDoc = await adminDb.collection('config').doc('platform').get();
  const configData = configDoc.exists ? configDoc.data() : {};

  const initialSettings = {
    guestMode: configData?.guestMode ?? true,
    maintenanceMode: configData?.maintenanceMode ?? false,
    therapistOnboarding: configData?.therapistOnboarding ?? true,
    commission: configData?.commission ?? "20",
    minPrice: configData?.minPrice ?? "50",
  };

  // 2. Fetch all administrators for the team section
  const teamMembers = await userRepo.getDirectoryUsers();
  // Filter for super_admins if you have a specific way to identify them in the users collection
  // For now, displaying all users as potential team members or filter by a specific criteria

  return (
    <SettingsClient 
      initialSettings={initialSettings} 
      teamMembers={teamMembers.slice(0, 10)} 
    />
  );
}
