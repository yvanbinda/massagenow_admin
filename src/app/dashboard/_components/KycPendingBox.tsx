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
    <Card className="bg-[#546A63] border-none flex flex-col justify-between h-[155px] relative overflow-hidden shadow-lg p-6 group">
      {/* Refined Top Right Floating Badge - Matches screenshot depth and alignment */}
      <div className="absolute top-4 right-6 flex items-center justify-center pointer-events-none">
        <div className="relative">
          {/* Faint large shield background */}
          <Shield size={48} className="text-white opacity-10" strokeWidth={1.5} />
          {/* Overlaid circle badge with count */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-md shadow-inner">
               <span className="text-white font-bold text-[10px]">{count}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 space-y-1">
        <div className="flex items-center gap-2">
          <ShieldAlert size={16} className="text-white/80" />
          <h3 className="text-xs font-bold font-abeezee text-white tracking-widest uppercase">
            {t('kyc.pending_title')}
          </h3>
        </div>
        <p className="text-brokenWhite/70 text-[11px] font-abeezee leading-snug max-w-[190px] line-clamp-2">
          {t('kyc.pending_description').replace('{n}', count.toString())}
        </p>
      </div>

      <div className="relative z-10">
        <Link href="/dashboard/kyc" className="w-full">
          <button className="w-full h-11 bg-white/5 border border-white/20 text-white rounded-xl hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-[10px] font-bold uppercase tracking-widest shadow-sm group-hover:border-white/40">
            {t('kyc.review_button')}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>
      </div>
    </Card>
  );
};
