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

export default function DashboardPage() {
  return (
    <div className="space-y-10">
      {/* Top Welcome Section */}
      <WelcomeSection />

      {/* 5-Card KPI Grid - Soft-Tint Aesthetic */}
      <section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        <MetricCard 
          title="Total Revenue" 
          value="$24,500" 
          icon={Wallet} 
          bgColor="bg-success/10" 
          borderColor="border-success/20"
          iconBgColor="bg-success/20" 
          iconColor="text-success"
          trend={{ value: "12% this week", isUp: true, color: "text-success" }}
        />
        
        <MetricCard 
          title="Active Pros" 
          value="142" 
          icon={Users} 
          bgColor="bg-darkSage/10" 
          borderColor="border-darkSage/20"
          iconBgColor="bg-darkSage/20" 
          iconColor="text-darkSage"
          subtitle="Across 4 cities"
        />

        <MetricCard 
          title="Active Patients" 
          value="1,840" 
          icon={UserCheck} 
          bgColor="bg-sageGreen/15" 
          borderColor="border-sageGreen/30"
          iconBgColor="bg-sageGreen/20" 
          iconColor="text-sageGreen"
          trend={{ value: "New registrations", isUp: true, color: "text-sageGreen" }}
        />

        <MetricCard 
          title="Pending KYC" 
          value="8" 
          icon={ShieldCheck} 
          bgColor="bg-warning/10" 
          borderColor="border-warning/20"
          iconBgColor="bg-warning/20" 
          iconColor="text-warning"
          trend={{ value: "Requires review", isUp: false, color: "text-warning" }}
        />

        <MetricCard 
          title="Match Health" 
          value="94%" 
          icon={Heart} 
          bgColor="bg-mediumSage/10" 
          borderColor="border-mediumSage/20"
          iconBgColor="bg-mediumSage/20" 
          iconColor="text-mediumSage"
          subtitle="Avg connection score"
        />
      </section>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ActivityChart />
        </div>
        <div className="space-y-6">
           <KycPendingBox />
           <RecentAlerts />
        </div>
      </div>
    </div>
  );
}
