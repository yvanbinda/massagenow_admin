"use client";

import React, { useState } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  Download,
  Filter
} from "lucide-react";
import { t } from "@/lib/i18n";
import { MetricCard } from "../_components/MetricCard";
import { Badge } from "@/components/ui/Badge";
import { TransactionReceipt } from "./_components/TransactionReceipt";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MOCK_TRANSACTIONS = [
  { id: 'txn_8f92k', patient: 'Alice Morel', therapist: 'Sarah Chen', amount: '150,00 $', fee: '30,00 $', status: 'succeeded', date: '12 Nov 2024' },
  { id: 'txn_7g31m', patient: 'Julien Petit', therapist: 'Mark Wilson', amount: '120,00 $', fee: '24,00 $', status: 'succeeded', date: '11 Nov 2024' },
  { id: 'txn_9h45p', patient: 'Sophie Martin', therapist: 'Sarah Chen', amount: '150,00 $', fee: '30,00 $', status: 'refunded', date: '10 Nov 2024' },
  { id: 'txn_2j18q', patient: 'Thomas L.', therapist: 'James Taylor', amount: '90,00 $', fee: '18,00 $', status: 'succeeded', date: '09 Nov 2024' },
];

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState<'transactions' | 'payouts' | 'disputes'>('transactions');
  const [selectedTxn, setSelectedTxn] = useState<any | null>(null);

  return (
    <div className="space-y-10 pb-12">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold font-abeezee text-charcoal mb-2 tracking-tight">
            {t('finance.title')}
          </h1>
          <p className="text-mediumSage text-lg font-abeezee leading-relaxed max-w-xl">
            {t('finance.subtitle')}
          </p>
        </div>
        
        <div className="flex gap-3">
           <button className="flex items-center gap-2 px-5 py-3 bg-white border border-lightSage rounded-2xl text-charcoal font-bold font-abeezee text-sm hover:bg-lightSage/20 transition-all shadow-sm">
              <Download size={18} className="text-mediumSage" />
              Exporter
           </button>
        </div>
      </section>

      {/* Financial KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title={t('finance.gross_volume')}
          value="45 850 $" 
          icon={Wallet} 
          bgColor="bg-mediumSage/10" 
          borderColor="border-mediumSage/20"
          iconBgColor="bg-mediumSage/20" 
          iconColor="text-mediumSage"
          trend={{ value: "8.2%", isUp: true, color: "text-success" }}
        />
        <MetricCard 
          title={t('finance.platform_revenue')}
          value="9 170 $" 
          icon={TrendingUp} 
          bgColor="bg-darkSage/10" 
          borderColor="border-darkSage/20"
          iconBgColor="bg-darkSage/20" 
          iconColor="text-darkSage"
          trend={{ value: "12% vs last mo", isUp: true, color: "text-success" }}
        />
        <MetricCard 
          title={t('finance.pending_payouts')}
          value="3 240 $" 
          icon={Clock} 
          bgColor="bg-sageGreen/10" 
          borderColor="border-sageGreen/20"
          iconBgColor="bg-sageGreen/20" 
          iconColor="text-sageGreen"
          subtitle="Processing via Stripe"
        />
        <MetricCard 
          title={t('finance.active_disputes')}
          value="2" 
          icon={AlertCircle} 
          bgColor="bg-error/10" 
          borderColor="border-error/20"
          iconBgColor="bg-error/20" 
          iconColor="text-error"
          trend={{ value: "Action Required", isUp: false, color: "text-error" }}
        />
      </section>

      {/* Main Ledger Section */}
      <section className="bg-white border border-lightSage rounded-3xl overflow-hidden shadow-sm shadow-charcoal/5">
        {/* Tab Controls */}
        <div className="px-8 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-lightSage bg-creamWhite/10">
           <div className="flex gap-8">
              <TabButton 
                active={activeTab === 'transactions'} 
                onClick={() => setActiveTab('transactions')}
                label={t('finance.tabs.transactions')}
              />
              <TabButton 
                active={activeTab === 'payouts'} 
                onClick={() => setActiveTab('payouts')}
                label={t('finance.tabs.payouts')}
              />
              <TabButton 
                active={activeTab === 'disputes'} 
                onClick={() => setActiveTab('disputes')}
                label={t('finance.tabs.disputes')}
              />
           </div>
           
           <div className="flex items-center gap-2 pb-4">
              <div className="relative group">
                 <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-mediumSage" size={14} />
                 <select className="bg-white border border-lightSage rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-charcoal outline-none focus:ring-2 focus:ring-sageGreen/20 appearance-none cursor-pointer">
                    <option>Tous les statuts</option>
                    <option>Succès</option>
                    <option>Remboursé</option>
                 </select>
              </div>
           </div>
        </div>

        {/* Table Area */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-creamWhite/5 border-b border-lightSage/50">
                <th className="px-8 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('finance.table.txn_id')}</th>
                <th className="px-8 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('finance.table.patient')}</th>
                <th className="px-8 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('finance.table.therapist')}</th>
                <th className="px-8 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('finance.table.amount')}</th>
                <th className="px-8 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('finance.table.fee')}</th>
                <th className="px-8 py-4 text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('finance.table.status')}</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-lightSage/30">
              {MOCK_TRANSACTIONS.map((txn) => (
                <tr 
                  key={txn.id} 
                  onClick={() => setSelectedTxn(txn)}
                  className="group hover:bg-lightSage/10 cursor-pointer transition-colors"
                >
                  <td className="px-8 py-5 text-xs font-bold text-charcoal font-mono uppercase tracking-tighter">{txn.id}</td>
                  <td className="px-8 py-5 text-sm font-bold text-charcoal font-abeezee">{txn.patient}</td>
                  <td className="px-8 py-5 text-sm font-medium text-secondaryCharcoal font-abeezee">{txn.therapist}</td>
                  <td className="px-8 py-5 text-sm font-bold text-charcoal font-abeezee">{txn.amount}</td>
                  <td className="px-8 py-5 text-sm font-bold text-darkSage font-abeezee">+{txn.fee}</td>
                  <td className="px-8 py-5">
                    <Badge variant={txn.status === 'succeeded' ? 'success' : 'neutral'}>
                      {txn.status === 'succeeded' ? 'Succès' : 'Remboursé'}
                    </Badge>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="w-8 h-8 rounded-full bg-lightSage/0 group-hover:bg-white flex items-center justify-center transition-all border border-transparent group-hover:border-lightSage shadow-sm group-hover:shadow-charcoal/5">
                       <ArrowUpRight size={16} className="text-mediumSage" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Receipt Drawer */}
      <TransactionReceipt 
        transaction={selectedTxn} 
        onClose={() => setSelectedTxn(null)} 
      />
    </div>
  );
}

const TabButton = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button 
    onClick={onClick}
    className={cn(
      "pb-4 text-xs font-bold uppercase tracking-widest transition-all border-b-2",
      active 
        ? "text-darkSage border-darkSage" 
        : "text-mediumSage border-transparent hover:text-darkSage"
    )}
  >
    {label}
  </button>
);
