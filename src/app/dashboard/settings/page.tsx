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
    therapistOnboarding: configData?.therapistOnboarding ?? true,
    commission: configData?.commission ?? "20",
    minPrice: configData?.minPrice ?? "50",
  };

  // 2. Fetch actual administrators for the team section
  const allUsers = await userRepo.getAllUsers();
  const admins = allUsers.filter(u => (u as any).role === 'super_admin');

  return (
    <SettingsClient 
      initialSettings={initialSettings} 
      teamMembers={admins} 
    />
  );
}
