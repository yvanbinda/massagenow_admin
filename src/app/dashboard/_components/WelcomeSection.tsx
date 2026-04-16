import React from 'react';
import { Activity } from "lucide-react";

export const WelcomeSection = () => {
  return (
    <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      <div>
        <h1 className="text-4xl font-bold font-abeezee text-charcoal mb-2 tracking-tight">
          System Overview
        </h1>
        <p className="text-mediumSage text-lg font-abeezee leading-relaxed max-w-xl">
          Real-time insights into the MassageNOW platform performance and therapist operations.
        </p>
      </div>
      
      <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-brokenWhite shadow-sm">
        <Activity size={18} className="text-sageGreen" />
        <span className="text-sm font-abeezee font-medium text-darkSage">
          Live Feed: Updated 2m ago
        </span>
      </div>
    </section>
  );
};
