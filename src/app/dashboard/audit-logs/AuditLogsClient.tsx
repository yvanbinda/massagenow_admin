"use client";

import React, { useState } from 'react';
import { 
  Shield, 
  Search, 
  Filter, 
  Clock, 
  User, 
  ExternalLink,
  ChevronRight,
  Database
} from "lucide-react";
import { t } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { AuditLog } from "@/types/models";
import { cn } from "@/lib/utils";

interface AuditLogsClientProps {
  initialLogs: AuditLog[];
}

export default function AuditLogsClient({ initialLogs }: AuditLogsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = initialLogs.filter(log => 
    log.adminName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.targetName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getActionBadge = (action: AuditLog['action']) => {
    switch (action) {
      case 'approve_therapist': return <Badge variant="success">Approbation</Badge>;
      case 'reject_therapist': return <Badge variant="error">Rejet</Badge>;
      case 'invite_admin': return <Badge variant="sage">Invitation</Badge>;
      case 'update_settings': return <Badge variant="warning">Réglages</Badge>;
      default: return <Badge variant="neutral">{action}</Badge>;
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-darkSage/10 rounded-lg">
              <Database size={24} className="text-darkSage" />
            </div>
            <h1 className="text-4xl font-bold font-abeezee text-charcoal tracking-tight">
              {t('header.audit_logs')}
            </h1>
          </div>
          <p className="text-mediumSage text-lg font-abeezee leading-relaxed max-w-2xl">
            Historique complet des actions administratives effectuées sur la plateforme.
          </p>
        </div>
      </section>

      {/* Search Bar */}
      <section className="relative group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mediumSage group-focus-within:text-darkSage transition-colors" size={20} />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Rechercher par administrateur, action ou cible..."
          className="w-full bg-white border border-lightSage pl-12 pr-4 py-4 rounded-2xl text-charcoal font-abeezee outline-none focus:ring-2 focus:ring-sageGreen/20 transition-all shadow-sm shadow-charcoal/5"
        />
      </section>

      {/* Logs Table */}
      <div className="bg-white border border-lightSage rounded-2xl overflow-hidden shadow-sm shadow-charcoal/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-lightSage/50 bg-creamWhite/10">
                <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">Date & Heure</th>
                <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">Administrateur</th>
                <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">Action</th>
                <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">Cible</th>
                <th className="px-6 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">Détails</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lightSage/30">
              {filteredLogs.length > 0 ? filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-lightSage/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-charcoal/70">
                      <Clock size={14} className="text-mediumSage" />
                      <span className="text-xs font-medium font-abeezee">
                        {new Date(log.createdAt).toLocaleString('fr-FR')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-darkSage/10 flex items-center justify-center text-darkSage text-[10px] font-bold">
                        {log.adminName.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-charcoal font-abeezee">{log.adminName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {getActionBadge(log.action)}
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-medium text-secondaryCharcoal font-abeezee">{log.targetName}</span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-xs text-mediumSage font-abeezee">{log.details}</p>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-mediumSage font-abeezee italic">
                    Aucun log d'audit trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
