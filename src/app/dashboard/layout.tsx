import React from 'react';
import { Sidebar } from "@/components/layout/Sidebar";
import { DynamicHeader } from "./_components/DynamicHeader";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
}
