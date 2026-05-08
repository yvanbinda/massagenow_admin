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
  const sessionCookie = (await cookieStore).get('admin_session')?.value;

  if (!sessionCookie) {
    redirect('/login');
  }

  try {
    // 1. Cryptographically verify the session cookie
    const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie, true);

    // 2. Security Check
    if (decodedClaims.role !== 'super_admin') {
      redirect('/login');
    }

    const adminData = {
      name: decodedClaims.name || 'Admin',
      email: decodedClaims.email || '',
    };

    // Pass successfully: Render the Admin Dashboard
    return (
      <div className="flex min-h-screen bg-creamWhite">
        <Sidebar />

        <div className="flex-1 ml-72 flex flex-col min-h-screen">
          <DynamicHeader adminData={adminData} />
          
          <main className="flex-1 p-8 md:p-12 lg:p-16">
            {children}
          </main>
        </div>
      </div>
    );

  } catch (error) {
    console.error('Admin verification failed:', error);
    redirect('/login');
  }
}
