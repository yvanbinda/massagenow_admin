"use client";

import React from 'react';
import { t } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { FileCheck, ShieldAlert, Clock, User, ChevronRight } from "lucide-react";

interface KycRecord {
  id: string;
  name: string;
  email: string;
  date: string;
  docs: ('id' | 'license')[];
  status: 'pending' | 'approved' | 'rejected' | 'resubmit';
}

const MOCK_DATA: KycRecord[] = [
  { id: '4092', name: 'Sarah Chen', email: 'sarah.c@wellness.com', date: '2024-11-10', docs: ['id', 'license'], status: 'pending' },
  { id: '4093', name: 'Mark Wilson', email: 'mark.w@pro.com', date: '2024-11-09', docs: ['id', 'license'], status: 'pending' },
  { id: '4094', name: 'Elena Rodriguez', email: 'elena.r@massage.net', date: '2024-11-09', docs: ['id'], status: 'resubmit' },
  { id: '4095', name: 'James Taylor', email: 'j.taylor@zen.com', date: '2024-11-08', docs: ['id', 'license'], status: 'approved' },
];

export const KycTable = ({ onRowClick }: { onRowClick: (record: KycRecord) => void }) => {
  const getStatusBadge = (status: KycRecord['status']) => {
    switch (status) {
      case 'pending': return <Badge variant="warning">{t('kyc.status_pending')}</Badge>;
      case 'approved': return <Badge variant="success">{t('kyc.status_approved')}</Badge>;
      case 'rejected': return <Badge variant="error">{t('kyc.status_rejected')}</Badge>;
      case 'resubmit': return <Badge variant="sage">{t('kyc.status_resubmit')}</Badge>;
      default: return null;
    }
  };

  return (
    <div className="bg-white border border-lightSage rounded-2xl overflow-hidden shadow-sm shadow-charcoal/5">
      <div className="px-6 py-4 border-b border-lightSage bg-creamWhite/20">
        <h3 className="text-sm font-bold text-charcoal font-abeezee uppercase tracking-[0.1em]">
          {t('kyc.queue_title')}
        </h3>
      </div>
      
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-lightSage/50 bg-creamWhite/10">
            <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('kyc.table_name')}</th>
            <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('kyc.table_date')}</th>
            <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('kyc.table_docs')}</th>
            <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('kyc.table_status')}</th>
            <th className="px-6 py-4"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-lightSage/30">
          {MOCK_DATA.map((record) => (
            <tr 
              key={record.id} 
              onClick={() => onRowClick(record)}
              className="group hover:bg-lightSage/10 cursor-pointer transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-lightSage flex items-center justify-center text-darkSage group-hover:bg-white transition-colors">
                    <User size={18} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-charcoal font-abeezee">{record.name}</span>
                    <span className="text-[11px] text-mediumSage font-abeezee">{record.email}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-charcoal/70">
                  <Clock size={14} className="text-mediumSage" />
                  <span className="text-xs font-medium font-abeezee">{record.date}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  {record.docs.includes('id') && (
                    <div className="p-1.5 bg-success/10 rounded-lg" title="ID Verification">
                       <FileCheck size={16} className="text-success" />
                    </div>
                  )}
                  {record.docs.includes('license') && (
                    <div className="p-1.5 bg-darkSage/10 rounded-lg" title="Massage License">
                       <ShieldAlert size={16} className="text-darkSage" />
                    </div>
                  )}
                </div>
              </td>
              <td className="px-6 py-4">
                {getStatusBadge(record.status)}
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
