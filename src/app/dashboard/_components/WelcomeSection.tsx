import React from 'react';
import { Activity } from "lucide-react";
import { t } from "@/lib/i18n";

export const WelcomeSection = () => {
  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-4xl font-bold font-abeezee text-charcoal mb-2 tracking-tight">
          {t('dashboard.title')}
        </h1>
        <p className="text-mediumSage text-lg font-abeezee leading-relaxed max-w-xl">
          {t('dashboard.welcome')}
        </p>
      </div>
      
      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-brokenWhite shadow-sm">
        <Activity size={18} className="text-sageGreen" />
        <span className="text-sm font-abeezee font-medium text-darkSage">
          {t('dashboard.live_feed')}
        </span>
      </div>
    </section>
  );
};
