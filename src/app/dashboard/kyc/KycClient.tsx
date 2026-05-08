"use client";

import React, { useState } from 'react';
import { KycFilters } from "./_components/KycFilters";
import { KycTable } from "./_components/KycTable";
import { KycReviewPanel } from "./_components/KycReviewPanel";
import { t } from "@/lib/i18n";
import { ShieldCheck, Info } from "lucide-react";

interface KycClientProps {
  initialData: any[];
}

export default function KycClient({ initialData }: KycClientProps) {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  // Filter logic to handle 'pending', 'approved', 'rejected'
  const filteredData = initialData.filter(record => {
    if (activeFilter === 'all') return true;
    
    // Normalize status for filtering
    const status = record.status;
    if (activeFilter === 'pending') return status === 'pending';
    if (activeFilter === 'approved') return status === 'approved';
    if (activeFilter === 'resubmit') return status === 'rejected' || status === 'resubmit';
    
    return true;
  });

  const pendingCount = initialData.filter(r => r.status === 'pending').length;

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-darkSage/10 rounded-lg">
              <ShieldCheck size={24} className="text-darkSage" />
            </div>
            <h1 className="text-4xl font-bold font-abeezee text-charcoal tracking-tight">
              {t('kyc.title')}
            </h1>
          </div>
          <p className="text-mediumSage text-lg font-abeezee leading-relaxed max-w-2xl">
            {t('kyc.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl border border-lightSage shadow-sm">
          <Info size={18} className="text-warning" />
          <span className="text-sm font-abeezee font-semibold text-charcoal">
            {pendingCount} {t('kyc.status_pending')}
          </span>
        </div>
      </section>

      {/* Triage Center Controls */}
      <section>
        <KycFilters 
          activeFilter={activeFilter} 
          onChange={setActiveFilter} 
        />
        
        <KycTable 
          data={filteredData}
          onRowClick={(record) => setSelectedRecord(record)} 
        />
      </section>

      {/* Master-Detail Review Panel */}
      <KycReviewPanel 
        record={selectedRecord} 
        onClose={() => setSelectedRecord(null)} 
      />

      {/* Footer Info */}
      <p className="text-center text-xs text-mediumSage font-abeezee opacity-60 mt-12">
        Système de vérification MassageNOW v1.0 • Sécurisé par chiffrement de bout en bout
      </p>
    </div>
  );
}
