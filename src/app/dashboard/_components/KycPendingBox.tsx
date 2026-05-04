import React from 'react';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ShieldAlert, ArrowRight } from "lucide-react";
import { t } from "@/lib/i18n";

export const KycPendingBox = () => {
  return (
    <Card variant="sage" className="flex flex-col justify-between h-full relative overflow-hidden">
      <div className="absolute top-[-20px] right-[-20px] opacity-10">
        <ShieldAlert size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="bg-white/20 w-10 h-10 rounded-lg flex items-center justify-center mb-4">
          <ShieldAlert size={20} className="text-white" />
        </div>
        <h3 className="text-xl font-bold font-abeezee mb-2">{t('kyc.pending_title')}</h3>
        <p className="text-brokenWhite/70 text-sm font-abeezee leading-relaxed">
          {t('kyc.pending_description')}
        </p>
      </div>

      <div className="relative z-10 mt-8">
        <Button 
          variant="outline" 
          className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20 group"
        >
          {t('kyc.review_button')}
          <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  );
};
