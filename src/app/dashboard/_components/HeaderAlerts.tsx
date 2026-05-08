"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldAlert, CreditCard, CheckCircle, BellOff, AlertTriangle, Loader2 } from "lucide-react";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { t } from "@/lib/i18n";
import { NotificationModel } from '@/types/models';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HeaderAlertsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HeaderAlerts = ({ isOpen, onClose }: HeaderAlertsProps) => {
  const router = useRouter();
  const [notifications, setNotifications] = useState<NotificationModel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/admin/notifications');
      if (response.ok) {
        const data = await response.json();
        setNotifications(data);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleNotificationClick = async (id: string, metadata?: any) => {
    // Optimistic UI update: Mark as read
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
    
    try {
      await fetch('/api/admin/notifications/mark-read', {
        method: 'POST',
        body: JSON.stringify({ id }),
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }

    onClose();
    
    // Deep Link Navigation based on metadata
    if (metadata?.therapistId) {
      router.push(`/dashboard/kyc`);
    } else {
      router.push("/dashboard/notifications");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
      await fetch('/api/admin/notifications/mark-read', {
        method: 'POST',
        body: JSON.stringify({ all: true }),
      });
      router.refresh();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleViewAll = () => {
    onClose();
    router.push("/dashboard/notifications");
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIcon = (type: string) => {
    switch (type) {
      case 'kyc_submitted': return ShieldAlert;
      case 'kyc_rejected': return AlertTriangle;
      case 'kyc_approved': return CheckCircle;
      default: return BellOff;
    }
  };

  const getColorClasses = (type: string) => {
    switch (type) {
      case 'kyc_submitted': return { bg: "bg-error/10", icon: "text-error" };
      case 'kyc_rejected': return { bg: "bg-warning/10", icon: "text-warning" };
      case 'kyc_approved': return { bg: "bg-success/10", icon: "text-success" };
      default: return { bg: "bg-mediumSage/10", icon: "text-mediumSage" };
    }
  };

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
              onClick={handleMarkAllRead}
            >
              {t('header.mark_all_read')}
            </button>
          )}
        </div>

        <div className="max-h-[400px] overflow-y-auto">
          {isLoading ? (
            <div className="p-12 flex justify-center">
              <Loader2 className="animate-spin text-mediumSage" size={24} />
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-lightSage/50">
              {notifications.map((notif) => {
                const Icon = getIcon(notif.type);
                const colors = getColorClasses(notif.type);
                return (
                  <button 
                    key={notif.id} 
                    onClick={() => handleNotificationClick(notif.id, notif.metadata)}
                    className={cn(
                      "w-full p-4 flex gap-4 transition-all text-left group",
                      notif.isRead ? "bg-white opacity-60" : cn("hover:bg-lightSage/30", colors.bg)
                    )}
                  >
                    <div className={cn(
                      "shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                      notif.isRead ? "bg-lightSage/40" : colors.bg
                    )}>
                      <Icon className={notif.isRead ? "text-mediumSage" : colors.icon} size={20} />
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <p className={cn(
                        "text-sm leading-tight font-abeezee",
                        notif.isRead ? "font-medium text-mediumSage" : "font-bold text-charcoal"
                      )}>
                        {notif.title}
                      </p>
                      <p className="text-[11px] text-mediumSage font-abeezee">
                        {new Date(notif.createdAt).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    {!notif.isRead && (
                      <div className="ml-auto self-center w-2 h-2 rounded-full bg-error ring-4 ring-error/10" />
                    )}
                  </button>
                );
              })}
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
