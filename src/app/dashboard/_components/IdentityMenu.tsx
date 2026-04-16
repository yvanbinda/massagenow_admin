"use client";

import React from 'react';
import { 
  Settings, 
  Users, 
  Moon, 
  LogOut, 
  ShieldCheck, 
  ChevronRight,
  Database
} from "lucide-react";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface IdentityMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IdentityMenu = ({ isOpen, onClose }: IdentityMenuProps) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60]" onClick={onClose} />
      <div className="absolute top-16 right-0 w-72 bg-white border border-lightSage rounded-2xl shadow-xl z-[70] overflow-hidden animate-in slide-in-from-right-2 duration-200">
        {/* Identity Header */}
        <div className="p-6 bg-creamWhite/50 flex flex-col items-center border-b border-lightSage text-center">
          <div className="w-16 h-16 rounded-full ring-4 ring-sageGreen/20 ring-offset-4 ring-offset-white overflow-hidden mb-4">
             <div className="w-full h-full bg-darkSage flex items-center justify-center text-white text-xl font-bold font-abeezee">
                AD
             </div>
          </div>
          <h4 className="text-base font-bold text-charcoal font-abeezee leading-tight">
            Marie-Pier Denis
          </h4>
          <p className="text-xs text-mediumSage font-medium font-abeezee mb-3">
            admin@massagenow.com
          </p>
          <span className="inline-flex items-center px-3 py-1 bg-darkSage text-white text-[10px] font-bold uppercase tracking-widest rounded-full">
            Super Administrator
          </span>
        </div>

        {/* Menu Items */}
        <div className="p-2 space-y-1">
          <MenuItem icon={Settings} label="Platform Settings" />
          <MenuItem icon={Users} label="Manage Admin Access" />
          <MenuItem icon={Database} label="Audit Logs" />
          <MenuItem icon={Moon} label="Toggle Dark Mode" showBadge />
        </div>

        {/* Logout Footer */}
        <div className="p-2 border-t border-lightSage bg-creamWhite/20">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[#BC5353] hover:bg-[#BC5353]/10 transition-all font-bold text-sm group">
            <LogOut size={18} className="group-hover:-translate-x-0.5 transition-transform" />
            Secure Logout
          </button>
        </div>
      </div>
    </>
  );
};

const MenuItem = ({ icon: Icon, label, showBadge }: { icon: any, label: string, showBadge?: boolean }) => (
  <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-lightSage transition-all group">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-creamWhite rounded-lg text-mediumSage group-hover:text-darkSage transition-colors group-hover:bg-white shadow-sm">
        <Icon size={18} />
      </div>
      <span className="text-sm font-bold text-charcoal/80 group-hover:text-charcoal font-abeezee leading-none">{label}</span>
    </div>
    {showBadge ? (
      <span className="w-2 h-2 rounded-full bg-sageGreen" />
    ) : (
      <ChevronRight size={14} className="text-lightSage group-hover:text-mediumSage" />
    )}
  </button>
);
