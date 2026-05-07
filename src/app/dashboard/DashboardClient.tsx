"use client";

import React from 'react';
import { 
  Wallet, 
  Users, 
  UserCheck,
  ShieldCheck, 
  Heart 
} from "lucide-react";
import { MetricCard } from "./_components/MetricCard";
import { ActivityChart } from "./_components/ActivityChart";
import { RecentAlerts } from "./_components/RecentAlerts";
import { KycPendingBox } from "./_components/KycPendingBox";
import { WelcomeSection } from "./_components/WelcomeSection";
import { t } from "@/lib/i18n";
import { AuditLog } from "@/types/models";

interface DashboardClientProps {
  stats: {
    userCount: number;
    therapistCount: number;
    bookingCount: number;
    totalRevenue: number;
    platformComm: number;
    pendingKycCount: number;
    chartData: { name: string, count: number }[];
    recentLogs: AuditLog[];
  };
}

export default function DashboardClient({ stats }: DashboardClientProps) {
  const currency = t('common.currency');

  return (
    <div className="space-y-10">
      {/* Top Welcome Section */}
      <WelcomeSection />

      {/* 5-Card KPI Grid - Real-Time Data */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        <MetricCard 
          title={t('dashboard.stats.revenue')} 
          value={`${stats.totalRevenue.toLocaleString()} ${currency}`} 
          icon={Wallet} 
          bgColor="bg-success/10" 
          borderColor="border-success/20"
          iconBgColor="bg-success/20" 
          iconColor="text-success"
          trend={{ value: t('dashboard.stats.vs_last_30'), isUp: true, color: "text-success" }}
        />
        
        <MetricCard 
          title={t('dashboard.stats.therapists')} 
          value={stats.therapistCount} 
          icon={Users} 
          bgColor="bg-darkSage/10" 
          borderColor="border-darkSage/20"
          iconBgColor="bg-darkSage/20" 
          iconColor="text-darkSage"
          subtitle={t('dashboard.stats.qualified')}
        />

        <MetricCard 
          title={t('users.tab_patients')} 
          value={stats.userCount} 
          icon={UserCheck} 
          bgColor="bg-sageGreen/15" 
          borderColor="border-sageGreen/30"
          iconBgColor="bg-sageGreen/20" 
          iconColor="text-sageGreen"
          trend={{ value: t('dashboard.stats.active_users'), isUp: true, color: "text-sageGreen" }}
        />

        <MetricCard 
          title={t('kyc.pending_title')} 
          value={stats.pendingKycCount} 
          icon={ShieldCheck} 
          bgColor="bg-warning/10" 
          borderColor="border-warning/20"
          iconBgColor="bg-warning/20" 
          iconColor="text-warning"
          trend={{ value: t('dashboard.stats.action_required'), isUp: false, color: "text-warning" }}
        />

        <MetricCard 
          title={t('finance.receipt.commission')} 
          value={`${stats.platformComm.toLocaleString()} ${currency}`} 
          icon={Heart} 
          bgColor="bg-mediumSage/10" 
          borderColor="border-mediumSage/20"
          iconBgColor="bg-mediumSage/20" 
          iconColor="text-mediumSage"
          subtitle={t('dashboard.stats.platform_profit')}
        />
      </section>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-[450px]">
          <ActivityChart data={stats.chartData} />
        </div>
        <div className="flex flex-col gap-6 h-[450px]">
           <KycPendingBox count={stats.pendingKycCount} />
           <div className="flex-1 min-h-0">
              <RecentAlerts logs={stats.recentLogs} />
           </div>
        </div>
      </div>
    </div>
  );
}
