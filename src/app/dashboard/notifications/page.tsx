"use client";

import React, { useState } from 'react';
import { 
  Bell, 
  Filter, 
  Trash2, 
  CheckCircle2, 
  ShieldAlert, 
  Info,
  MoreVertical,
  Search,
  Archive,
  Download
} from "lucide-react";
import { t } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Mock data for notifications hub
const MOCK_NOTIFICATIONS = [
  {
    id: '1',
    type: 'critical',
    category: 'Finance',
    title: "Échec du paiement Stripe",
    body: "L'intégration Stripe a renvoyé une erreur pour le thérapeute ID #402.",
    time: "Il y a 2 heures",
    isRead: false,
    actionUrl: "/dashboard/payments"
  },
  {
    id: '2',
    type: 'warning',
    category: 'KYC',
    title: "5 Nouveaux documents KYC",
    body: "Plusieurs thérapeutes attendent la vérification de leurs licences.",
    time: "Il y a 4 heures",
    isRead: false,
    actionUrl: "/dashboard/kyc"
  },
  {
    id: '3',
    type: 'info',
    category: 'Système',
    title: "Sauvegarde réussie",
    body: "La sauvegarde hebdomadaire de la base de données est terminée.",
    time: "Hier à 22:00",
    isRead: true,
    actionUrl: "/dashboard"
  },
  {
    id: '4',
    type: 'info',
    category: 'Utilisateurs',
    title: "Nouveau signalement",
    body: "Un patient a signalé un comportement inapproprié pour la session #882.",
    time: "Il y a 2 jours",
    isRead: true,
    actionUrl: "/dashboard/users"
  }
];

export default function NotificationsPage() {
  const [activeSeverity, setActiveSeverity] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === MOCK_NOTIFICATIONS.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(MOCK_NOTIFICATIONS.map(n => n.id));
    }
  };

  return (
    <div className="space-y-8 pb-32">
      {/* Header Section */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-abeezee text-charcoal mb-2 tracking-tight">
            {t('notifications.title')}
          </h1>
          <p className="text-mediumSage text-lg font-abeezee leading-relaxed max-w-xl">
            Gérez toutes les alertes système et les événements de la plateforme.
          </p>
        </div>
        
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-5 py-3 bg-white border border-lightSage rounded-2xl text-charcoal font-bold font-abeezee text-sm hover:bg-lightSage/20 transition-all shadow-sm">
              <Download size={18} className="text-mediumSage" />
              {t('notifications.export')}
           </button>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="bg-white border border-lightSage rounded-3xl p-2 flex flex-col md:flex-row items-center gap-2 shadow-sm shadow-charcoal/5">
        <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto scrollbar-hide p-1">
          <FilterButton active={activeSeverity === 'all'} onClick={() => setActiveSeverity('all')} label={t('notifications.all')} />
          <FilterButton active={activeSeverity === 'critical'} onClick={() => setActiveSeverity('critical')} label={t('notifications.critical')} color="text-error" />
          <FilterButton active={activeSeverity === 'warning'} onClick={() => setActiveSeverity('warning')} label={t('notifications.warning')} color="text-warning" />
          <FilterButton active={activeSeverity === 'info'} onClick={() => setActiveSeverity('info')} label={t('notifications.info')} color="text-success" />
        </div>
        
        <div className="h-8 w-px bg-lightSage hidden md:block mx-2" />
        
        <div className="flex-1 relative group w-full md:w-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mediumSage group-focus-within:text-darkSage transition-colors" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher dans les notifications..."
            className="w-full bg-transparent pl-12 pr-4 py-3 text-sm font-abeezee outline-none text-charcoal placeholder:text-mediumSage/50"
          />
        </div>
      </section>

      {/* Bulk Action Bar (Sticky) */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-8 duration-500">
           <div className="bg-charcoal text-white rounded-2xl px-8 py-5 shadow-2xl flex items-center gap-10 border border-white/10 backdrop-blur-lg">
              <div className="flex items-center gap-3">
                 <span className="w-8 h-8 rounded-full bg-darkSage flex items-center justify-center text-xs font-bold">
                    {selectedIds.length}
                 </span>
                 <span className="text-sm font-bold font-abeezee tracking-wide">Sélectionnées</span>
              </div>
              <div className="flex items-center gap-2">
                 <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-all text-sm font-bold font-abeezee">
                    <CheckCircle2 size={18} className="text-success" />
                    {t('notifications.mark_read')}
                 </button>
                 <button className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-all text-sm font-bold font-abeezee text-brokenWhite/60">
                    <Archive size={18} />
                    {t('notifications.archive')}
                 </button>
                 <div className="w-px h-6 bg-white/10 mx-2" />
                 <button className="p-2 hover:bg-error/20 rounded-xl transition-all text-error">
                    <Trash2 size={20} />
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Notification List */}
      <div className="bg-white border border-lightSage rounded-3xl overflow-hidden shadow-sm shadow-charcoal/5">
        <div className="px-8 py-4 border-b border-lightSage bg-creamWhite/20 flex items-center gap-4">
           <input 
            type="checkbox" 
            className="w-5 h-5 rounded-lg border-lightSage text-darkSage focus:ring-darkSage cursor-pointer"
            checked={selectedIds.length === MOCK_NOTIFICATIONS.length}
            onChange={toggleSelectAll}
           />
           <span className="text-xs font-bold text-mediumSage uppercase tracking-widest">
             Toutes les notifications
           </span>
        </div>

        <div className="divide-y divide-lightSage/30">
          {MOCK_NOTIFICATIONS.map((notif) => (
            <div 
              key={notif.id}
              className={cn(
                "group px-8 py-6 flex items-start gap-6 transition-all hover:bg-lightSage/5 cursor-pointer relative",
                !notif.isRead && "bg-creamWhite/30"
              )}
            >
              <div className="flex items-center pt-1">
                 <input 
                  type="checkbox" 
                  className="w-5 h-5 rounded-lg border-lightSage text-darkSage focus:ring-darkSage cursor-pointer"
                  checked={selectedIds.includes(notif.id)}
                  onChange={(e) => {
                    e.stopPropagation();
                    toggleSelect(notif.id);
                  }}
                 />
              </div>

              <div className={cn(
                "shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-sm",
                getSeverityBg(notif.type)
              )}>
                {getSeverityIcon(notif.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="sage" className="text-[9px] uppercase tracking-tighter">
                      {notif.category}
                    </Badge>
                    <span className="text-[11px] text-mediumSage font-abeezee">{notif.time}</span>
                  </div>
                  <button className="p-2 opacity-0 group-hover:opacity-100 hover:bg-lightSage rounded-lg transition-all">
                    <MoreVertical size={16} className="text-mediumSage" />
                  </button>
                </div>
                <h3 className={cn(
                  "text-lg font-abeezee tracking-tight leading-tight",
                  notif.isRead ? "text-secondaryCharcoal" : "text-charcoal font-bold"
                )}>
                  {notif.title}
                </h3>
                <p className="text-sm text-mediumSage font-abeezee leading-relaxed max-w-2xl">
                  {notif.body}
                </p>
              </div>

              {!notif.isRead && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-darkSage" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const FilterButton = ({ active, onClick, label, color }: { active: boolean, onClick: () => void, label: string, color?: string }) => (
  <button
    onClick={onClick}
    className={cn(
      "px-4 py-2 rounded-xl text-xs font-bold font-abeezee transition-all whitespace-nowrap",
      active 
        ? "bg-darkSage text-white shadow-md shadow-darkSage/10" 
        : cn("text-mediumSage hover:bg-lightSage/50", color)
    )}
  >
    {label}
  </button>
);

const getSeverityIcon = (type: string) => {
  switch (type) {
    case 'critical': return <ShieldAlert size={22} className="text-error" />;
    case 'warning': return <AlertCircle size={22} className="text-warning" />;
    case 'info': return <Info size={22} className="text-success" />;
    default: return <Bell size={22} className="text-darkSage" />;
  }
};

const getSeverityBg = (type: string) => {
  switch (type) {
    case 'critical': return 'bg-error/10';
    case 'warning': return 'bg-warning/10';
    case 'info': return 'bg-success/10';
    default: return 'bg-darkSage/10';
  }
};
