import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { adminAuth } from '@/lib/firebase-admin';
import { Sidebar } from "@/components/layout/Sidebar";
import { DynamicHeader } from "./_components/DynamicHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session')?.value;

  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    // 1. Cryptographically verify the session cookie is real and not expired
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    // 2. The Ultimate Security Check: Double-check the custom claim
    if (decodedClaims.role !== 'super_admin') {
      console.warn(`Unauthorized access attempt by ${decodedClaims.email}`);
      throw new Error('Insufficient permissions');
    }

    // Pass successfully: Render the Admin Dashboard
    return (
      <div className="flex min-h-screen bg-creamWhite">
        {/* Sidebar - Fixed width component */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 ml-72 flex flex-col min-h-screen">
          <DynamicHeader />
          
          <main className="flex-1 p-8 md:p-12 lg:p-16">
            {children}
          </main>
        </div>
      </div>
    );

  } catch (error) {
    // If the cookie is forged, expired, or they aren't an admin, kick them out
    console.error('Admin verification failed:', error);
    redirect('/login');
  }
}
