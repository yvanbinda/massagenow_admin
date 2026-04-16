"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { User, ChevronRight, Star } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/i18n";

const MOCK_THERAPISTS = [
  { id: '1', name: 'Sarah Chen', speciality: 'Deep Tissue', matchScore: 94, earnings: '€12,450', status: 'active' },
  { id: '2', name: 'Jean Dupont', speciality: 'Suédois', matchScore: 88, earnings: '€8,200', status: 'active' },
  { id: '3', name: 'Marie Laurent', speciality: 'Sportif', matchScore: 91, earnings: '€15,100', status: 'suspended' },
  { id: '4', name: 'Lucie Bernard', speciality: 'Réflexologie', matchScore: 85, earnings: '€4,300', status: 'active' },
];

export const TherapistTable = () => {
  const router = useRouter();

  return (
    <div className="bg-white border border-lightSage rounded-2xl overflow-hidden shadow-sm shadow-charcoal/5">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-lightSage/50 bg-creamWhite/10">
            <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('users.table.therapist')}</th>
            <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('users.table.speciality')}</th>
            <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('users.table.match_health')}</th>
            <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('users.table.earnings')}</th>
            <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('users.table.status')}</th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-lightSage/30">
          {MOCK_THERAPISTS.map((item) => (
            <tr 
              key={item.id} 
              onClick={() => router.push(`/dashboard/users/therapist/${item.id}`)}
              className="group hover:bg-lightSage/10 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-lightSage flex items-center justify-center text-darkSage group-hover:bg-white transition-colors">
                    <User size={18} />
                  </div>
                  <span className="text-sm font-bold text-charcoal font-abeezee">{item.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm font-abeezee text-secondaryCharcoal">{item.speciality}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-warning fill-warning" />
                  <span className="text-sm font-bold text-charcoal font-abeezee">{item.matchScore}%</span>
                </div>
              </td>
              <td className="px-6 py-4 text-sm font-bold text-darkSage font-abeezee">{item.earnings}</td>
              <td className="px-6 py-4">
                <Badge variant={item.status === 'active' ? 'success' : 'error'}>
                  {item.status === 'active' ? t('users.status_active') : t('users.status_suspended')}
                </Badge>
              </td>
              <td className="px-6 py-4 text-right">
                <ChevronRight size={18} className="text-lightSage group-hover:text-mediumSage inline-block transition-transform group-hover:translate-x-1" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
