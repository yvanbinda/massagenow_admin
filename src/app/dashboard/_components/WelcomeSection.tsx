"use client";

import React, { useState, useEffect } from 'react';
import { Activity } from "lucide-react";
import { t } from "@/lib/i18n";

export const WelcomeSection = () => {
  const [minutes, setMinutes] = useState(2); // Starting with 2m as requested to show state

  useEffect(() => {
    const interval = setInterval(() => {
      setMinutes(prev => prev + 1);
    }, 60000); 

    return () => clearInterval(interval);
  }, []);

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
      
      <div className="flex items-center gap-3 bg-white px-5 py-2.5 rounded-2xl border border-lightSage shadow-sm">
        <div className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
        </div>
        <span className="text-sm font-bold font-abeezee text-darkSage">
          {t('dashboard.live_feed').replace('{n}', minutes.toString())}
        </span>
      </div>
    </section>
  );
};
