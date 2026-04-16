"use client";

import React, { useState } from 'react';
import { Users as UsersIcon, UserCheck, Search, Filter } from "lucide-react";
import { t } from "@/lib/i18n";
import { TherapistTable } from "./_components/TherapistTable";
import { PatientTable } from "./_components/PatientTable";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function UsersPage() {
  const [activeTab, setActiveTab] = useState<'therapists' | 'patients'>('therapists');

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-abeezee text-charcoal mb-2 tracking-tight">
            {t('users.title')}
          </h1>
          <p className="text-mediumSage text-lg font-abeezee leading-relaxed max-w-xl">
            {t('users.subtitle')}
          </p>
        </div>

        {/* Tab Switcher (Segmented Control) */}
        <div className="flex bg-lightSage/50 p-1.5 rounded-2xl border border-lightSage h-14 w-full md:w-80">
          <button
            onClick={() => setActiveTab('therapists')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-xl text-sm font-bold font-abeezee transition-all",
              activeTab === 'therapists' 
                ? "bg-white text-darkSage shadow-md shadow-charcoal/5" 
                : "text-mediumSage hover:text-darkSage"
            )}
          >
            <UsersIcon size={18} />
            {t('users.tab_therapists')}
          </button>
          <button
            onClick={() => setActiveTab('patients')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 rounded-xl text-sm font-bold font-abeezee transition-all",
              activeTab === 'patients' 
                ? "bg-white text-darkSage shadow-md shadow-charcoal/5" 
                : "text-mediumSage hover:text-darkSage"
            )}
          >
            <UserCheck size={18} />
            {t('users.tab_patients')}
          </button>
        </div>
      </section>

      {/* Filter & Search Bar */}
      <section className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mediumSage group-focus-within:text-darkSage transition-colors" size={20} />
          <input 
            type="text" 
            placeholder="Rechercher par nom, email ou ville..."
            className="w-full bg-white border border-lightSage pl-12 pr-4 py-4 rounded-2xl text-charcoal font-abeezee outline-none focus:ring-2 focus:ring-sageGreen/20 transition-all shadow-sm shadow-charcoal/5"
          />
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-4 bg-white border border-lightSage rounded-2xl text-darkSage font-bold font-abeezee hover:bg-lightSage/20 transition-all shadow-sm shadow-charcoal/5">
          <Filter size={18} />
          Filtres
        </button>
      </section>

      {/* Dynamic Content */}
      <section className="animate-in fade-in slide-in-from-bottom-2 duration-500">
        {activeTab === 'therapists' ? <TherapistTable /> : <PatientTable />}
      </section>
    </div>
  );
}
