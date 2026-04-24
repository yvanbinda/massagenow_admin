"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { 
  Bell, 
  Trash2, 
  CheckCircle2, 
  ShieldAlert, 
  Info,
  MoreVertical,
  Search,
  Archive,
  Download,
  AlertTriangle,
  Loader2
} from "lucide-react";
import { t } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { NotificationModel } from "@/types/models";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface NotificationsHubProps {
  initialData: NotificationModel[];
}

export default function NotificationsHub({ initialData }: NotificationsHubProps) {
  const router = useRouter();
  const [activeSeverity, setActiveSeverity] = useState('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === initialData.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialData.map(n => n.id));
    }
  };

  const handleMarkAsRead = async () => {
    if (selectedIds.length === 0) return;
    try {
      setIsProcessing(true);
      // Logic to call API for multiple IDs or just loop
      await Promise.all(selectedIds.map(id => 
        fetch('/api/admin/notifications/mark-read', {
          method: 'POST',
          body: JSON.stringify({ id }),
        })
      ));
      setSelectedIds([]);
      router.refresh();
    } catch (error) {
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const getFilteredData = () => {
    if (activeSeverity === 'all') return initialData;
    return initialData.filter(n => {
      if (activeSeverity === 'critical') return n.type === 'kyc_submitted'; // Mapping types to severity
      if (activeSeverity === 'warning') return n.type === 'kyc_rejected';
      return n.type === 'kyc_approved';
    });
  };

  const filteredData = getFilteredData();

  return (
    <div className="space-y-8 pb-32">
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

      <section className="bg-white border border-lightSage rounded-3xl p-2 flex flex-col md:flex-row items-center gap-2 shadow-sm shadow-charcoal/5">
        <div className="flex items-center gap-1 w-full md:w-auto overflow-x-auto scrollbar-hide p-1">
          <FilterButton active={activeSeverity === 'all'} onClick={() => setActiveSeverity('all')} label={t('notifications.all')} />
          <FilterButton active={activeSeverity === 'critical'} onClick={() => setActiveSeverity('critical')} label={t('notifications.critical')} color="text-error" />
          <FilterButton active={activeSeverity === 'warning'} onClick={() => setActiveSeverity('warning')} label={t('notifications.warning')} color="text-warning" />
          <FilterButton active={activeSeverity === 'info'} onClick={() => setActiveSeverity('info')} label={t('notifications.info')} color="text-success" />
        </div>
      </section>

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
                 <button 
                  onClick={handleMarkAsRead}
                  disabled={isProcessing}
                  className="flex items-center gap-2 px-4 py-2 hover:bg-white/10 rounded-xl transition-all text-sm font-bold font-abeezee"
                 >
                    {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} className="text-success" />}
                    {t('notifications.mark_read')}
                 </button>
              </div>
           </div>
        </div>
      )}

      <div className="bg-white border border-lightSage rounded-3xl overflow-hidden shadow-sm shadow-charcoal/5">
        <div className="divide-y divide-lightSage/30">
          {filteredData.length > 0 ? filteredData.map((notif) => (
            <div 
              key={notif.id}
              onClick={() => {
                if (notif.metadata?.therapistId) router.push(`/dashboard/kyc`);
              }}
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
                "shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm",
                getSeverityBg(notif.type)
              )}>
                {getSeverityIcon(notif.type)}
              </div>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-mediumSage font-abeezee">
                    {new Date(notif.createdAt).toLocaleString('fr-FR')}
                  </span>
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
          )) : (
            <div className="p-20 text-center text-mediumSage italic font-abeezee">
              {t('notifications.no_results')}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const FilterButton = ({ active, onClick, label, color }: { active: boolean, onClick: () => void, label: string, color?: string }) => (
  <button onClick={onClick} className={cn("px-4 py-2 rounded-xl text-xs font-bold font-abeezee transition-all whitespace-nowrap", active ? "bg-darkSage text-white shadow-md shadow-darkSage/10" : cn("text-mediumSage hover:bg-lightSage/50", color))}>
    {label}
  </button>
);

const getSeverityIcon = (type: string) => {
  switch (type) {
    case 'kyc_submitted': return <ShieldAlert size={22} className="text-error" />;
    case 'kyc_rejected': return <AlertTriangle size={22} className="text-warning" />;
    case 'kyc_approved': return <CheckCircle2 size={22} className="text-success" />;
    default: return <Bell size={22} className="text-darkSage" />;
  }
};

const getSeverityBg = (type: string) => {
  switch (type) {
    case 'kyc_submitted': return 'bg-error/10';
    case 'kyc_rejected': return 'bg-warning/10';
    case 'kyc_approved': return 'bg-success/10';
    default: return 'bg-darkSage/10';
  }
};
