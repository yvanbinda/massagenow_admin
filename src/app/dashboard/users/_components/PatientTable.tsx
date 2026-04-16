"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { User, ChevronRight, History } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { t } from "@/lib/i18n";

const MOCK_PATIENTS = [
  { id: 'p1', name: 'Alice Morel', ltv: '€1,250', sessions: 12, lastActive: 'Il y a 2 jours', status: 'active' },
  { id: 'p2', name: 'Julien Petit', ltv: '€450', sessions: 4, lastActive: 'Il y a 1 semaine', status: 'active' },
  { id: 'p3', name: 'Sophie Martin', ltv: '€2,100', sessions: 24, lastActive: 'Aujourd\'hui', status: 'flagged' },
  { id: 'p4', name: 'Thomas Lefebvre', ltv: '€0', sessions: 0, lastActive: 'Jamais', status: 'active' },
];

export const PatientTable = () => {
  const router = useRouter();

  return (
    <div className="bg-white border border-lightSage rounded-2xl overflow-hidden shadow-sm shadow-charcoal/5">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-lightSage/50 bg-creamWhite/10">
            <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('users.table.patient')}</th>
            <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('users.table.ltv')}</th>
            <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('users.table.sessions')}</th>
            <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('users.table.last_active')}</th>
            <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('users.table.status')}</th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-lightSage/30">
          {MOCK_PATIENTS.map((item) => (
            <tr 
              key={item.id} 
              onClick={() => router.push(`/dashboard/users/patient/${item.id}`)}
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
              <td className="px-6 py-4 text-sm font-bold text-darkSage font-abeezee">{item.ltv}</td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-secondaryCharcoal">
                  <History size={14} className="text-mediumSage" />
                  <span className="text-sm font-bold font-abeezee">{item.sessions}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-xs font-abeezee text-mediumSage">{item.lastActive}</td>
              <td className="px-6 py-4">
                <Badge variant={item.status === 'active' ? 'success' : 'warning'}>
                  {item.status === 'active' ? t('users.status_active') : t('users.status_flagged')}
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
