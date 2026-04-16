"use client";

import React, { useState, useEffect } from 'react';
import { Bell, Search, Command } from "lucide-react";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { CommandPalette } from "./CommandPalette";
import { HeaderAlerts } from "./HeaderAlerts";
import { IdentityMenu } from "./IdentityMenu";
import { t } from "@/lib/i18n";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const DynamicHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState(false);
  const [isIdentityOpen, setIsIdentityOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header 
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 px-8 py-4 flex items-center justify-between",
          isScrolled 
            ? "bg-white/70 backdrop-blur-md border-b border-lightSage shadow-sm" 
            : "bg-transparent border-b border-transparent"
        )}
      >
        {/* Left: Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm font-abeezee font-medium">
          <span className="text-secondaryCharcoal/60">{t('sidebar.dashboard')}</span>
          <span className="text-secondaryCharcoal/30">/</span>
          <span className="text-secondaryCharcoal">Vue d'ensemble</span>
        </div>

        {/* Center: Search Command Bar Trigger */}
        <button 
          onClick={() => setIsSearchOpen(true)}
          className="hidden md:flex items-center gap-3 bg-lightSage px-6 py-2.5 rounded-full w-96 group hover:ring-2 hover:ring-sageGreen/20 transition-all text-left"
        >
          <Search size={18} className="text-mediumSage group-hover:text-darkSage" />
          <span className="flex-1 text-mediumSage/60 font-abeezee text-sm">
            {t('header.search_placeholder')}
          </span>
          <div className="flex items-center gap-1 bg-white/50 px-2 py-0.5 rounded border border-white text-[10px] text-mediumSage font-bold uppercase tracking-tighter">
            <Command size={10} /> K
          </div>
        </button>

        {/* Right: Notifications & Avatar */}
        <div className="flex items-center gap-6 relative">
          <button 
            onClick={() => {
              setIsAlertsOpen(!isAlertsOpen);
              setIsIdentityOpen(false);
            }}
            className={cn(
              "relative p-2 rounded-full transition-colors group",
              isAlertsOpen ? "bg-lightSage" : "hover:bg-lightSage"
            )}
          >
            <Bell size={22} className={cn("transition-colors", isAlertsOpen ? "text-darkSage" : "text-secondaryCharcoal group-hover:text-darkSage")} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-white animate-pulse" />
          </button>
          
          <div className="flex items-center gap-3 pl-2 border-l border-lightSage">
            <div className="flex flex-col items-end mr-1 hidden lg:flex">
               <span className="text-xs font-bold text-charcoal font-abeezee uppercase tracking-wider">{t('header.role_badge')}</span>
               <span className="text-[10px] text-mediumSage font-abeezee">Contrôle Système</span>
            </div>
            <button 
              onClick={() => {
                setIsIdentityOpen(!isIdentityOpen);
                setIsAlertsOpen(false);
              }}
              className={cn(
                "w-9 h-9 rounded-full ring-2 ring-offset-2 ring-offset-creamWhite overflow-hidden cursor-pointer hover:scale-105 transition-all",
                isIdentityOpen ? "ring-darkSage" : "ring-sageGreen"
              )}
            >
               <div className="w-full h-full bg-darkSage flex items-center justify-center text-white text-xs font-bold font-abeezee">
                  AD
               </div>
            </button>
          </div>

          {/* Popovers */}
          <HeaderAlerts isOpen={isAlertsOpen} onClose={() => setIsAlertsOpen(false)} />
          <IdentityMenu isOpen={isIdentityOpen} onClose={() => setIsIdentityOpen(false)} />
        </div>
      </header>

      {/* Overlays */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
