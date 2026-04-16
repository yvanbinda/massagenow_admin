"use client";

import React from 'react';
import { t } from "@/lib/i18n";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const KycFilters = ({ activeFilter, onChange }: { activeFilter: string, onChange: (filter: string) => void }) => {
  const filters = [
    { id: 'all', label: t('kyc.filter_all') },
    { id: 'pending', label: t('kyc.filter_pending'), color: 'bg-warning/10 text-warning border-warning/20' },
    { id: 'resubmit', label: t('kyc.filter_resubmit') },
    { id: 'approved', label: t('kyc.filter_approved') },
  ];

  return (
    <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onChange(filter.id)}
          className={cn(
            "px-5 py-2 rounded-full text-xs font-bold font-abeezee border transition-all whitespace-nowrap",
            activeFilter === filter.id
              ? (filter.color || "bg-darkSage text-white border-darkSage")
              : "bg-white text-mediumSage border-lightSage hover:border-mediumSage"
          )}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
