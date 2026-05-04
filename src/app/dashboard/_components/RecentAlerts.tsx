import React from 'react';
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";

interface AlertItemProps {
  title: string;
  time: string;
  id: string;
}

const AlertItem = ({ title, time, id }: AlertItemProps) => (
  <div className="flex gap-4 items-start group cursor-pointer">
    <div className="w-2 h-2 rounded-full bg-sageGreen mt-1.5 shrink-0 group-hover:scale-125 transition-transform" />
    <div>
      <p className="text-sm font-abeezee font-semibold text-charcoal">{title}</p>
      <p className="text-xs font-abeezee text-mediumSage">{time} • ID: {id}</p>
    </div>
  </div>
);

export const RecentAlerts = () => {
  const alerts = [
    { id: '8235', title: t('dashboard.alerts.new_therapist'), time: 'Il y a 2 heures' },
    { id: '8236', title: t('dashboard.alerts.kyc_uploaded'), time: 'Il y a 4 heures' },
    { id: '8237', title: t('dashboard.alerts.payout_failed'), time: 'Il y a 5 heures' },
  ];

  return (
    <Card className="bg-white shadow-none">
      <h4 className="font-bold font-abeezee text-charcoal mb-4 border-b border-brokenWhite pb-4">
        {t('dashboard.alerts.title')}
      </h4>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} {...alert} />
        ))}
      </div>
    </Card>
  );
};
