"use client";

import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Shield, 
  UserPlus, 
  User, 
  ArrowRight,
  CreditCard,
  X
} from "lucide-react";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // This logic depends on parent state, but we toggle via prop
      }
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh] p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white border border-lightSage rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Search Input Area */}
        <div className="flex items-center px-6 py-4 border-b border-lightSage bg-creamWhite/30">
          <Search className="text-mediumSage mr-4" size={22} />
          <input
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-charcoal font-abeezee text-lg placeholder:text-mediumSage/50"
            placeholder="Type a command or search platform..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button 
            onClick={onClose}
            className="p-1 hover:bg-lightSage rounded-md transition-colors text-mediumSage"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results / Suggestions */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6">
          {!search ? (
            <>
              {/* Quick Actions Group */}
              <div>
                <h3 className="px-3 text-[10px] font-bold text-mediumSage uppercase tracking-[0.2em] mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-1">
                  <ActionItem icon={Shield} label="Review Pending KYC" shortcut="G K" />
                  <ActionItem icon={UserPlus} label="Add New Administrator" shortcut="A N" />
                  <ActionItem icon={CreditCard} label="View Recent Transactions" shortcut="G T" />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Search Result Categorization */}
              <div>
                <h3 className="px-3 text-[10px] font-bold text-mediumSage uppercase tracking-[0.2em] mb-3">
                  Therapists
                </h3>
                <div className="space-y-1">
                  <ResultItem label="Sarah Chen" sublabel="Active • Vancouver" status="success" />
                  <ResultItem label="Sarah Jenkins" sublabel="Blocked • Toronto" status="error" />
                </div>
              </div>

              <div>
                <h3 className="px-3 text-[10px] font-bold text-mediumSage uppercase tracking-[0.2em] mb-3">
                  Transactions
                </h3>
                <div className="space-y-1">
                  <ResultItem label="Payout to Sarah Chen" sublabel="$340.00 • Processing" />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-creamWhite/50 border-t border-lightSage flex items-center justify-between text-[11px] text-mediumSage font-abeezee">
          <div className="flex gap-4">
            <span><kbd className="font-sans border border-lightSage px-1.5 py-0.5 rounded bg-white mr-1">↵</kbd> to select</span>
            <span><kbd className="font-sans border border-lightSage px-1.5 py-0.5 rounded bg-white mr-1">↑↓</kbd> to navigate</span>
          </div>
          <span className="opacity-60 italic">MassageNOW Command Palette</span>
        </div>
      </div>
    </div>
  );
};

const ActionItem = ({ icon: Icon, label, shortcut }: { icon: any, label: string, shortcut: string }) => (
  <button className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-lightSage transition-all group">
    <div className="flex items-center gap-3">
      <div className="p-2 bg-creamWhite rounded-lg text-darkSage group-hover:bg-white transition-colors">
        <Icon size={18} />
      </div>
      <span className="text-sm font-bold text-charcoal font-abeezee">{label}</span>
    </div>
    <span className="text-[10px] font-bold text-mediumSage/40 font-sans tracking-widest uppercase">
      {shortcut}
    </span>
  </button>
);

const ResultItem = ({ label, sublabel, status }: { label: string, sublabel: string, status?: string }) => (
  <button className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-lightSage transition-all group text-left">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-lightSage flex items-center justify-center text-darkSage group-hover:bg-white transition-colors">
        <User size={20} />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-charcoal font-abeezee">{label}</span>
        <span className="text-xs text-mediumSage font-abeezee">{sublabel}</span>
      </div>
    </div>
    <ArrowRight size={16} className="text-mediumSage opacity-0 group-hover:opacity-100 transition-opacity" />
  </button>
);
