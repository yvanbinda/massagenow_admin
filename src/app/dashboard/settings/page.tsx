import React from 'react';
import { adminDb } from '@/lib/firebase-admin';
import { UserRepository } from '@/repositories/user.repository';
import { getSuperAdminSession } from '@/lib/auth-utils';
import SettingsClient from './SettingsClient';

// Force dynamic rendering to ensure fresh settings
export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const userRepo = new UserRepository();
  const session = await getSuperAdminSession();

  // 1. Fetch global settings from Firestore
  const configDoc = await adminDb.collection('config').doc('platform').get();
  const configData = configDoc.exists ? configDoc.data() : {};

  const initialSettings = {
    guestMode: configData?.guestMode ?? true,
    therapistOnboarding: configData?.therapistOnboarding ?? true,
    commission: configData?.commission ?? "20",
    minPrice: configData?.minPrice ?? "50",
  };

  // 2. Fetch actual administrators for the team section
  const allUsers = await userRepo.getDirectoryUsers();
  const admins = allUsers.filter(u => (u as any).role === 'super_admin');

  // Identify current user to set 'isCurrent' flag
  const enrichedAdmins = admins.map(admin => ({
    ...admin,
    isCurrent: admin.id === session?.uid
  }));

  return (
    <SettingsClient 
      initialSettings={initialSettings} 
      teamMembers={enrichedAdmins} 
    />
  );
}
