import React from 'react';
import { Card } from "@/components/ui/Card";
import { ShieldAlert, ArrowRight, Shield } from "lucide-react";
import { t } from "@/lib/i18n";
import Link from 'next/link';

interface KycPendingBoxProps {
  count?: number;
}

export const KycPendingBox = ({ count = 0 }: KycPendingBoxProps) => {
  return (
    <Card className="bg-[#546A63] border-none flex flex-col justify-between h-[180px] relative overflow-hidden shadow-lg p-6 group">
      {/* Refined Top Right Floating Shield and Count */}
      <div className="absolute top-4 right-4 flex items-center justify-center">
        <div className="relative">
          {/* Outer Shield glow/transparent */}
          <Shield size={64} className="text-white/10" strokeWidth={1} />
          {/* Inner Circle for number */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center shadow-inner backdrop-blur-sm">
              <span className="text-white font-bold text-xs">{count}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="relative z-10 space-y-1">
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} className="text-white/80" />
          <h3 className="text-sm font-bold font-abeezee text-white uppercase tracking-widest">
            {t('kyc.pending_title')}
          </h3>
        </div>
        <p className="text-white/70 text-[11px] font-abeezee leading-snug max-w-[220px]">
          {t('kyc.pending_description').replace('{n}', count.toString())}
        </p>
      </div>

      <div className="relative z-10">
        <Link href="/dashboard/kyc" className="w-full">
          <button className="w-full h-12 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-xs font-bold uppercase tracking-widest shadow-sm">
            {t('kyc.review_button')}
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </Card>
  );
};
