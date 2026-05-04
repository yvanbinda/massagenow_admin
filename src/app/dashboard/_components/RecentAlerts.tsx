"use client";

import React from 'react';
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";
import { NotificationModel } from "@/types/models";
import { useRouter } from "next/navigation";

interface RecentAlertsProps {
  notifications?: NotificationModel[];
}

const AlertItem = ({ notification }: { notification: NotificationModel }) => {
  const router = useRouter();
  
  return (
    <div 
      className="flex gap-4 items-start group cursor-pointer hover:bg-lightSage/10 p-2 -mx-2 rounded-xl transition-all"
      onClick={() => router.push('/dashboard/notifications')}
    >
      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 transition-transform group-hover:scale-125 ${
        notification.isRead ? 'bg-lightSage' : 'bg-darkSage'
      }`} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-abeezee font-bold text-charcoal truncate">{notification.title}</p>
        <p className="text-[10px] font-abeezee text-mediumSage">
          {new Date(notification.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} • ID: {notification.id.substring(0, 4)}
        </p>
      </div>
    </div>
  );
};

export const RecentAlerts = ({ notifications = [] }: RecentAlertsProps) => {
  return (
    <Card className="bg-white shadow-none border-lightSage">
      <h4 className="font-bold font-abeezee text-charcoal mb-4 border-b border-lightSage pb-4 text-sm uppercase tracking-wider">
        {t('dashboard.alerts.title')}
      </h4>
      <div className="space-y-3 max-h-[220px] overflow-y-auto pr-2 scrollbar-hide">
        {notifications.length > 0 ? (
          notifications.map((notif) => (
            <AlertItem key={notif.id} notification={notif} />
          ))
        ) : (
          <p className="text-center py-6 text-xs text-mediumSage italic">
            Aucune alerte récente.
          </p>
        )}
      </div>
    </Card>
  );
};
