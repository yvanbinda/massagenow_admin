import React from 'react';
import { Card } from "@/components/ui/Card";

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
    { id: '8235', title: 'New therapist registered', time: '2 hours ago' },
    { id: '8236', title: 'KYC Document Uploaded', time: '4 hours ago' },
    { id: '8237', title: 'Payout failed: Stripe Connect', time: '5 hours ago' },
  ];

  return (
    <Card className="bg-white">
      <h4 className="font-bold font-abeezee text-charcoal mb-4 border-b border-brokenWhite pb-4">
        Recent Alerts
      </h4>
      <div className="space-y-4">
        {alerts.map((alert) => (
          <AlertItem key={alert.id} {...alert} />
        ))}
      </div>
    </Card>
  );
};
