"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { 
  Settings, 
  LogOut, 
  ChevronRight,
  Database,
  Loader2
} from "lucide-react";
import { t } from "@/lib/i18n";
import { auth } from "@/lib/firebase";

interface IdentityMenuProps {
  isOpen: boolean;
  onClose: () => void;
  adminData: {
    name: string;
    email: string;
  } | null;
}

export const IdentityMenu = ({ isOpen, onClose, adminData }: IdentityMenuProps) => {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (!isOpen) return null;

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error("Logout failed on server.");
      await auth.signOut();
      onClose();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const navigateTo = (path: string) => {
    onClose();
    router.push(path);
  };

  const initials = adminData?.name 
    ? adminData.name.split(' ').map(n => n[0]).join('').toUpperCase()
    : 'AD';

  return (
    <>
      <div className="fixed inset-0 z-[60]" onClick={onClose} />
      <div className="absolute top-16 right-0 w-72 bg-white border border-lightSage rounded-2xl shadow-xl z-[70] overflow-hidden animate-in slide-in-from-right-2 duration-200">
        {/* Identity Header */}
        <div className="p-6 bg-creamWhite/50 flex flex-col items-center border-b border-lightSage text-center">
          <div className="w-16 h-16 rounded-full ring-4 ring-sageGreen/20 ring-offset-4 ring-offset-white overflow-hidden mb-4">
             <div className="w-full h-full bg-darkSage flex items-center justify-center text-white text-xl font-bold font-abeezee">
                {initials}
             </div>
          </div>
          <h4 className="text-base font-bold text-charcoal font-abeezee leading-tight">
            {adminData?.name || 'Administrateur'}
          </h4>
          <p className="text-xs text-mediumSage font-medium font-abeezee mb-3">
            {adminData?.email || 'N/A'}
          </p>
          <span className="inline-flex items-center px-3 py-1 bg-darkSage text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
            {t('header.role_badge')}
          </span>
        </div>

        {/* Menu Items */}
        <div className="p-2 space-y-1">
          <MenuItem 
            icon={Settings} 
            label={t('header.settings')} 
            onClick={() => navigateTo('/dashboard/settings')}
          />
          <MenuItem 
            icon={Database} 
            label={t('header.audit_logs')} 
            onClick={() => navigateTo('/dashboard/audit-logs')} 
          />
        </div>

        {/* Logout Footer */}
        <div className="p-2 border-t border-lightSage bg-creamWhite/20">
          <button 
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-error hover:bg-error/10 transition-all font-bold text-sm group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoggingOut ? (
              <Loader2 size={18} className="animate-spin mx-auto" />
            ) : (
              <>
                <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                {t('header.logout')}
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
};

const MenuItem = ({ icon: Icon, label, showBadge, onClick }: { icon: any, label: string, showBadge?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-lightSage transition-all group"
  >
    <div className="flex items-center gap-3">
      <div className="p-2 bg-creamWhite rounded-lg text-mediumSage group-hover:text-darkSage transition-colors group-hover:bg-white shadow-sm">
        <Icon size={18} />
      </div>
      <span className="text-sm font-bold text-charcoal font-abeezee leading-none">{label}</span>
    </div>
    {showBadge ? (
      <span className="w-2 h-2 rounded-full bg-sageGreen" />
    ) : (
      <ChevronRight size={14} className="text-lightSage group-hover:text-mediumSage" />
    )}
  </button>
);
