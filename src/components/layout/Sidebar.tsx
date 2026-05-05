"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  ShieldCheck, 
  CreditCard, 
  Settings, 
  LogOut,
  Database
} from "lucide-react";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";
import { t } from "@/lib/i18n";

export const Sidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { name: t('sidebar.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('sidebar.kyc'), href: '/dashboard/kyc', icon: ShieldCheck },
    { name: t('sidebar.users'), href: '/dashboard/users', icon: Users },
    { name: t('sidebar.payments'), href: '/dashboard/payments', icon: CreditCard },
    { name: t('header.audit_logs'), href: '/dashboard/audit-logs', icon: Database },
    { name: t('sidebar.settings'), href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <aside className="w-72 bg-darkSage h-screen flex flex-col fixed left-0 top-0 text-white shadow-2xl z-50">
      <div className="p-8">
        <Logo theme="dark" iconSize={28} />
      </div>

      <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto scrollbar-hide">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-abeezee text-sm group",
                isActive 
                  ? "bg-sageGreen/20 text-white font-medium shadow-inner" 
                  : "text-brokenWhite/60 hover:text-white hover:bg-white/5"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-colors",
                isActive ? "text-sageGreen" : "text-brokenWhite/40 group-hover:text-brokenWhite"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-6 border-t border-white/10">
        <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-brokenWhite/60 hover:text-red-300 hover:bg-red-500/10 transition-all font-abeezee text-sm group">
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          {t('sidebar.signout')}
        </button>
      </div>
    </aside>
  );
};
