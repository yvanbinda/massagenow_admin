"use client";

import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  AlertCircle,
  ArrowUpRight,
  Download,
  Filter,
  Search
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

interface PaymentsClientProps {
  transactions: any[];
  stats: {
    grossVolume: number;
    platformRevenue: number;
    pendingPayouts: number;
    activeDisputes: number;
  };
}

export default function PaymentsClient({ transactions, stats }: PaymentsClientProps) {
  const [activeTab, setActiveTab] = useState<'transactions' | 'payouts' | 'disputes'>('transactions');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<any | null>(null);
  const currency = t('common.currency');

  // Logic: Advanced Filtering
  const filteredData = useMemo(() => {
    return transactions.filter(txn => {
      // 1. Tab Filtering logic
      if (activeTab === 'payouts') {
        // Only show bookings that have been transferred to therapists
        if (txn.paymentStatus !== 'transferred' && txn.status !== 'completed') return false;
      }
      if (activeTab === 'disputes') {
        // Show only refunds or penalties
        if (txn.paymentStatus !== 'refunded' && txn.paymentStatus !== 'penalty_applied' && txn.status !== 'no_show') return false;
      }

      // 2. Status Dropdown Filter
      if (statusFilter !== 'all') {
        const isSuccess = txn.status === 'succeeded' || txn.status === 'completed' || txn.status === 'confirmed';
        if (statusFilter === 'success' && !isSuccess) return false;
        if (statusFilter === 'refunded' && txn.paymentStatus !== 'refunded') return false;
      }

      // 3. Search Query (Client or Therapist name)
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesClient = txn.clientName?.toLowerCase().includes(query);
        const matchesTherapist = txn.therapistName?.toLowerCase().includes(query);
        const matchesId = txn.id.toLowerCase().includes(query);
        if (!matchesClient && !matchesTherapist && !matchesId) return false;
      }

      return true;
    });
  }, [transactions, activeTab, statusFilter, searchQuery]);

  // Function: Professional CSV Export
  const handleExport = () => {
    if (filteredData.length === 0) return;

    const headers = ["ID Transaction", "Client", "Thérapeute", "Montant Brut", "Commission MN", "Statut Réservation", "Statut Paiement", "Date"];
    const rows = filteredData.map(txn => [
      txn.id,
      txn.clientName || 'N/A',
      txn.therapistName || 'N/A',
      `${txn.amount} ${currency}`,
      `${txn.fee} ${currency}`,
      txn.status,
      txn.paymentStatus || 'pending',
      txn.date
    ]);

    const csvContent = "\uFEFF" + [headers, ...rows].map(e => e.map(cell => `"${cell}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `MN_Finances_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
           <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-5 py-3 bg-white border border-lightSage rounded-2xl text-charcoal font-bold font-abeezee text-sm hover:bg-lightSage/20 transition-all shadow-sm"
           >
              <Download size={18} className="text-mediumSage" />
              {t('common.export')}
           </button>
        </div>
      </section>

      {/* Financial KPIs */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title={t('finance.gross_volume')}
          value={`${stats.grossVolume.toLocaleString()} ${currency}`} 
          icon={Wallet} 
          bgColor="bg-mediumSage/10" 
          borderColor="border-mediumSage/20"
          iconBgColor="bg-mediumSage/20" 
          iconColor="text-mediumSage"
          trend={{ value: "Volume Total", isUp: true, color: "text-success" }}
        />
        <MetricCard 
          title={t('finance.platform_revenue')}
          value={`${stats.platformRevenue.toLocaleString()} ${currency}`} 
          icon={TrendingUp} 
          bgColor="bg-darkSage/10" 
          borderColor="border-darkSage/20"
          iconBgColor="bg-darkSage/20" 
          iconColor="text-darkSage"
          trend={{ value: "Commission", isUp: true, color: "text-success" }}
        />
        <MetricCard 
          title={t('finance.pending_payouts')}
          value={`${stats.pendingPayouts.toLocaleString()} ${currency}`} 
          icon={Clock} 
          bgColor="bg-sageGreen/10" 
          borderColor="border-sageGreen/20"
          iconBgColor="bg-sageGreen/20" 
          iconColor="text-sageGreen"
          subtitle="Via Stripe Connect"
        />
        <MetricCard 
          title={t('finance.active_disputes')}
          value={stats.activeDisputes} 
          icon={AlertCircle} 
          bgColor="bg-error/10" 
          borderColor="border-error/20"
          iconBgColor="bg-error/20" 
          iconColor="text-error"
          trend={{ value: "Action requise", isUp: false, color: "text-error" }}
        />
      </section>

      {/* Main Ledger Section */}
      <section className="bg-white border border-lightSage rounded-3xl overflow-hidden shadow-sm shadow-charcoal/5">
        {/* Tab Controls */}
        <div className="px-8 pt-6 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-lightSage bg-creamWhite/10">
           <div className="flex gap-8">
              <TabButton 
                active={activeTab === 'transactions'} 
                onClick={() => { setActiveTab('transactions'); setStatusFilter('all'); }}
                label={t('finance.tabs.transactions')}
              />
              <TabButton 
                active={activeTab === 'payouts'} 
                onClick={() => { setActiveTab('payouts'); setStatusFilter('all'); }}
                label={t('finance.tabs.payouts')}
              />
              <TabButton 
                active={activeTab === 'disputes'} 
                onClick={() => { setActiveTab('disputes'); setStatusFilter('all'); }}
                label={t('finance.tabs.disputes')}
              />
           </div>
        </div>

        {/* Operational Bar (Search + Filter) */}
        <div className="p-4 px-8 bg-creamWhite/5 border-b border-lightSage/50 flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-mediumSage group-focus-within:text-darkSage transition-colors" size={18} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par nom ou ID..."
                className="w-full bg-white border border-lightSage pl-12 pr-4 py-2.5 rounded-xl text-sm font-abeezee outline-none focus:ring-2 focus:ring-sageGreen/10 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full">
                 <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-mediumSage" size={14} />
                 <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full md:w-48 bg-white border border-lightSage rounded-xl pl-9 pr-4 py-2.5 text-xs font-bold text-charcoal outline-none focus:ring-2 focus:ring-sageGreen/10 appearance-none cursor-pointer"
                 >
                    <option value="all">{t('finance.table.all_status')}</option>
                    <option value="success">{t('finance.table.success')}</option>
                    <option value="refunded">{t('finance.table.refunded')}</option>
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
              {filteredData.length > 0 ? filteredData.map((txn) => (
                <tr 
                  key={txn.id} 
                  onClick={() => setSelectedTxn(txn)}
                  className="group hover:bg-lightSage/10 cursor-pointer transition-colors"
                >
                  <td className="px-8 py-5 text-xs font-bold text-charcoal font-mono uppercase tracking-tighter">{txn.id.substring(0, 10)}...</td>
                  <td className="px-8 py-5 text-sm font-bold text-charcoal font-abeezee">{txn.clientName || 'Inconnu'}</td>
                  <td className="px-8 py-5 text-sm font-medium text-secondaryCharcoal font-abeezee">{txn.therapistName || 'Inconnu'}</td>
                  <td className="px-8 py-5 text-sm font-bold text-charcoal font-abeezee">{txn.amount.toLocaleString()} {currency}</td>
                  <td className="px-8 py-5 text-sm font-bold text-darkSage font-abeezee">+{txn.fee.toLocaleString()} {currency}</td>
                  <td className="px-8 py-5">
                    <Badge variant={txn.status === 'completed' || txn.status === 'succeeded' ? 'success' : 'neutral'}>
                      {txn.status === 'completed' || txn.status === 'succeeded' ? t('finance.table.success') : txn.status}
                    </Badge>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="w-8 h-8 rounded-full bg-lightSage/0 group-hover:bg-white flex items-center justify-center transition-all border border-transparent group-hover:border-lightSage shadow-sm group-hover:shadow-charcoal/5">
                       <ArrowUpRight size={16} className="text-mediumSage" />
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center text-mediumSage font-abeezee italic">
                    {t('users.detail.no_reservations')}
                  </td>
                </tr>
              )}
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
