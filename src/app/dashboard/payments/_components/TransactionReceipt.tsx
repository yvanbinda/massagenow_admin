"use client";

import React from 'react';
import { 
  X, 
  ArrowRight, 
  ExternalLink, 
  Undo2, 
  Calendar,
  User,
  CreditCard
} from "lucide-react";
import { t } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface TransactionReceiptProps {
  transaction: any | null;
  onClose: () => void;
}

export const TransactionReceipt = ({ transaction, onClose }: TransactionReceiptProps) => {
  if (!transaction) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-charcoal/30 backdrop-blur-sm z-[100] transition-opacity" 
        onClick={onClose}
      />
      
      <div className="fixed inset-y-0 right-0 w-full sm:max-w-[500px] bg-white z-[110] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        <div className="px-8 py-6 border-b border-lightSage flex items-center justify-between bg-creamWhite/20">
          <div>
            <h2 className="text-xl font-bold text-charcoal font-abeezee leading-tight">
              {t('finance.receipt.title')}
            </h2>
            <p className="text-xs text-mediumSage font-medium uppercase tracking-widest mt-1">
              ID: {transaction.id}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-lightSage rounded-full transition-colors text-mediumSage"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Status & Amount */}
          <div className="text-center space-y-3 pb-8 border-b border-lightSage">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-success/5 text-success rounded-full border border-success/10 text-xs font-bold uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                {t('finance.table.status')} : Succès
             </div>
             <h3 className="text-5xl font-bold text-charcoal font-abeezee">{transaction.amount}</h3>
             <p className="text-sm text-mediumSage flex items-center justify-center gap-2">
                <Calendar size={14} /> 12 Novembre 2024 • 14:30
             </p>
          </div>

          {/* Parties Involved */}
          <div className="grid grid-cols-2 gap-4">
             <div className="p-4 bg-creamWhite/50 rounded-2xl border border-lightSage/50">
                <p className="text-[10px] font-bold text-mediumSage uppercase tracking-widest mb-3">{t('finance.table.patient')}</p>
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-darkSage border border-lightSage">
                      <User size={14} />
                   </div>
                   <span className="text-sm font-bold text-charcoal">{transaction.patient}</span>
                </div>
             </div>
             <div className="p-4 bg-creamWhite/50 rounded-2xl border border-lightSage/50">
                <p className="text-[10px] font-bold text-mediumSage uppercase tracking-widest mb-3">{t('finance.table.therapist')}</p>
                <div className="flex items-center gap-2">
                   <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-darkSage border border-lightSage">
                      <User size={14} />
                   </div>
                   <span className="text-sm font-bold text-charcoal">{transaction.therapist}</span>
                </div>
             </div>
          </div>

          {/* Breakdown Receipt */}
          <div className="space-y-4">
             <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider font-abeezee">
               {t('finance.receipt.breakdown')}
             </h4>
             <div className="bg-creamWhite rounded-2xl p-6 border border-lightSage space-y-4 font-abeezee">
                <div className="flex justify-between items-center text-sm">
                   <span className="text-mediumSage">{t('finance.receipt.total_charge')}</span>
                   <span className="font-bold text-charcoal">{transaction.amount}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                   <span className="text-mediumSage">{t('finance.receipt.stripe_fee')}</span>
                   <span className="text-error font-medium">-4,65 €</span>
                </div>
                <div className="flex justify-between items-center text-sm pt-4 border-t border-lightSage/50">
                   <span className="text-darkSage font-bold uppercase tracking-widest text-xs">{t('finance.receipt.commission')}</span>
                   <span className="text-darkSage font-bold">+{transaction.fee}</span>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-lightSage">
                   <span className="text-charcoal font-bold">{t('finance.receipt.net_therapist')}</span>
                   <span className="text-xl font-bold text-charcoal">115,35 €</span>
                </div>
             </div>
          </div>

          {/* Method */}
          <div className="p-4 rounded-xl border border-lightSage flex items-center justify-between">
             <div className="flex items-center gap-3">
                <CreditCard size={18} className="text-mediumSage" />
                <span className="text-sm font-medium text-charcoal">Visa •••• 4242</span>
             </div>
             <Badge variant="neutral">Authentifié 3DS</Badge>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-lightSage bg-white grid grid-cols-2 gap-3">
           <Button variant="outline" className="gap-2 border-error/20 text-error hover:bg-error/5">
              <Undo2 size={16} />
              {t('finance.receipt.refund_btn')}
           </Button>
           <Button className="gap-2 bg-charcoal text-white hover:bg-charcoal/90">
              <ExternalLink size={16} />
              {t('finance.receipt.view_stripe')}
           </Button>
        </div>
      </div>
    </>
  );
};
