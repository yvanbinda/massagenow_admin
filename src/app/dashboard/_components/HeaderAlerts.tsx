"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, CreditCard, CheckCircle, BellOff } from "lucide-react";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { t } from "@/lib/i18n";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HeaderAlertsProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_ALERTS = [
  {
    id: 1,
    type: 'warning',
    icon: ShieldAlert,
    title: "5 Nouveaux documents KYC en attente.",
    time: "Il y a 2 heures",
    bgColor: "bg-warning/10",
    iconColor: "text-warning",
    actionUrl: "/dashboard/kyc",
    isRead: false,
  },
  {
    id: 2,
    type: 'error',
    icon: CreditCard,
    title: "Échec du paiement Stripe.",
    time: "Il y a 5 heures",
    bgColor: "bg-error/10",
    iconColor: "text-error",
    actionUrl: "/dashboard/payments",
    isRead: false,
  },
  {
    id: 3,
    type: 'success',
    icon: CheckCircle,
    title: "Sauvegarde de la plateforme terminée.",
    time: "Il y a 12 heures",
    bgColor: "bg-success/10",
    iconColor: "text-success",
    actionUrl: "/dashboard",
    isRead: false,
  }
];

export const HeaderAlerts = ({ isOpen, onClose }: HeaderAlertsProps) => {
  const router = useRouter();
  const [alerts, setAlerts] = useState(INITIAL_ALERTS);

  if (!isOpen) return null;

  const handleNotificationClick = (id: number, url: string) => {
    // Optimistic UI update: Mark as read
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, isRead: true } : a));
    
    // Close popover
    onClose();
    
    // Deep Link Navigation
    router.push(url);
  };

  const handleViewAll = () => {
    onClose();
    router.push("/dashboard/notifications");
  };

  const unreadCount = alerts.filter(a => !a.isRead).length;

  return (
    <>
      <div className="fixed inset-0 z-[60]" onClick={onClose} />
      <div className="absolute top-16 right-0 w-80 bg-white border border-lightSage rounded-2xl shadow-xl z-[70] overflow-hidden animate-in slide-in-from-top-2 duration-200">
        <div className="px-6 py-4 border-b border-lightSage flex items-center justify-between bg-creamWhite/30">
          <h3 className="text-sm font-bold text-charcoal font-abeezee uppercase tracking-wider">
            {t('header.alerts_title')}
          </h3>
          {unreadCount > 0 && (
            <button 
              className="text-[10px] font-bold text-mediumSage hover:text-darkSage uppercase tracking-tighter transition-colors"
              onClick={() => setAlerts(prev => prev.map(a => ({ ...a, isRead: true })))}
            >
              {t('header.mark_all_read')}
            </button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {alerts.length > 0 ? (
            <div className="divide-y divide-lightSage/50">
              {alerts.map((alert) => (
                <button 
                  key={alert.id} 
                  onClick={() => handleNotificationClick(alert.id, alert.actionUrl)}
                  className={cn(
                    "w-full p-4 flex gap-4 transition-all text-left group",
                    alert.isRead ? "bg-white opacity-60" : cn("hover:bg-lightSage/30", alert.bgColor)
                  )}
                >
                  <div className={cn(
                    "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                    alert.isRead ? "bg-lightSage/40" : alert.bgColor
                  )}>
                    <alert.icon className={alert.isRead ? "text-mediumSage" : alert.iconColor} size={20} />
                  </div>
                  <div className="flex flex-col gap-0.5">
                    <p className={cn(
                      "text-sm leading-tight font-abeezee",
                      alert.isRead ? "font-medium text-mediumSage" : "font-bold text-charcoal"
                    )}>
                      {alert.title}
                    </p>
                    <p className="text-[11px] text-mediumSage font-abeezee">
                      {alert.time}
                    </p>
                  </div>
                  {!alert.isRead && (
                    <div className="ml-auto self-center w-2 h-2 rounded-full bg-error ring-4 ring-error/10" />
                  )}
                </button>
              ))}
            </div>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center text-center">
               <div className="w-16 h-16 bg-creamWhite rounded-full flex items-center justify-center mb-4 border border-lightSage">
                  <BellOff size={24} className="text-mediumSage/40" />
               </div>
               <p className="text-sm font-bold text-charcoal mb-1">{t('header.no_alerts')}</p>
            </div>
          )}
        </div>

        <div className="p-3 bg-creamWhite/50 border-t border-lightSage">
           <button 
            onClick={handleViewAll}
            className="w-full py-2 text-[11px] font-bold text-darkSage uppercase tracking-widest hover:bg-white rounded-lg transition-all border border-transparent hover:border-lightSage"
          >
              {t('header.view_all')}
           </button>
        </div>
      </div>
    </>
  );
};
