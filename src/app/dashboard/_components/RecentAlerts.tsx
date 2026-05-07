"use client";

import React from 'react';
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { AuditLog } from "@/types/models";
import { useRouter } from "next/navigation";
import { Shield, UserPlus, CheckCircle2, AlertTriangle, Trash2, Clock } from "lucide-react";

interface RecentAlertsProps {
  logs?: AuditLog[];
}

const getActionIcon = (action: AuditLog['action']) => {
  switch (action) {
    case 'approve_therapist': return <CheckCircle2 size={14} className="text-success" />;
    case 'reject_therapist': return <AlertTriangle size={14} className="text-warning" />;
    case 'invite_admin': return <UserPlus size={14} className="text-darkSage" />;
    case 'delete_user': return <Trash2 size={14} className="text-error" />;
    default: return <Shield size={14} className="text-mediumSage" />;
  }
};

const LogItem = ({ log }: { log: AuditLog }) => {
  const router = useRouter();
  
  return (
    <div 
      className="flex gap-4 items-start group cursor-pointer hover:bg-lightSage/10 p-3 -mx-2 rounded-xl transition-all"
      onClick={() => router.push('/dashboard/audit-logs')}
    >
      <div className="mt-1 p-1.5 bg-creamWhite border border-lightSage rounded-lg shadow-sm group-hover:bg-white transition-colors">
        {getActionIcon(log.action)}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-abeezee font-bold text-charcoal truncate">
          {log.adminName}
        </p>
        <p className="text-[11px] text-mediumSage leading-snug line-clamp-1 italic">
          {log.details}
        </p>
        <div className="flex items-center gap-1.5 mt-1 text-[9px] font-bold text-mediumSage uppercase tracking-tighter">
          <Clock size={10} />
          {new Date(log.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export const RecentAlerts = ({ logs = [] }: RecentAlertsProps) => {
  return (
    <Card className="bg-white shadow-sm border-lightSage h-full">
      <h4 className="font-bold font-abeezee text-charcoal mb-4 border-b border-lightSage pb-4 text-sm uppercase tracking-wider">
        Actions Récentes
      </h4>
      <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1 scrollbar-hide">
        {logs.length > 0 ? (
          logs.map((log) => (
            <LogItem key={log.id} log={log} />
          ))
        ) : (
          <div className="py-12 text-center space-y-2">
            <Shield className="mx-auto text-lightSage opacity-20" size={32} />
            <p className="text-xs text-mediumSage font-abeezee italic">
              Aucune activité enregistrée.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
