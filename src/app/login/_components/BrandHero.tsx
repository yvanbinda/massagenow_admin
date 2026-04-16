import React from 'react';
import { ShieldCheck } from "lucide-react";

export const BrandHero = () => {
  return (
    <div className="hidden lg:flex flex-col justify-center items-center bg-darkSage text-white p-12 relative overflow-hidden h-full">
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        {/* Pattern can be added here */}
      </div>
      
      <div className="relative z-10 max-w-md text-center">
        <ShieldCheck size={64} className="mx-auto mb-8 text-sageGreen" />
        <h1 className="text-4xl font-abeezee font-bold mb-4 tracking-tight">
          MassageNOW
        </h1>
        <p className="text-xl text-brokenWhite/80 font-abeezee leading-relaxed">
          Secure Data Vault for Super Administrators. Access high-level analytics, KYC verification, and financial oversight.
        </p>
      </div>

      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-center text-brokenWhite/30 border-t border-brokenWhite/10 pt-8">
        <span className="text-sm font-abeezee tracking-wide">System v1.0.0</span>
        <span className="text-sm font-abeezee uppercase tracking-[0.2em]">Encrypted Session</span>
      </div>
    </div>
  );
};
