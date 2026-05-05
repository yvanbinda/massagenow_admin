"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { 
  Search, 
  Shield, 
  UserPlus, 
  User as UserIcon, 
  ArrowRight,
  CreditCard,
  X,
  Loader2,
  Users
} from "lucide-react";
import { t } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommandPalette = ({ isOpen, onClose }: CommandPaletteProps) => {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<{
    therapists: any[],
    users: any[],
    transactions: any[]
  }>({ therapists: [], users: [], transactions: [] });
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search logic
  useEffect(() => {
    if (!search || search.length < 2) {
      setResults({ therapists: [], users: [], transactions: [] });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/admin/search?q=${encodeURIComponent(search)}`);
        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        // Triggering is handled by DynamicHeader, but we handle Escape here
      }
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onClose]);

  const handleNavigate = (path: string) => {
    onClose();
    router.push(path);
    setSearch("");
  };

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
          {isLoading ? (
            <Loader2 className="text-darkSage mr-4 animate-spin" size={22} />
          ) : (
            <Search className="text-mediumSage mr-4" size={22} />
          )}
          <input
            autoFocus
            className="flex-1 bg-transparent border-none outline-none text-charcoal font-abeezee text-lg placeholder:text-mediumSage/50"
            placeholder={t('header.search_placeholder')}
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
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-6 scrollbar-hide">
          {!search ? (
            <>
              {/* Quick Actions Group */}
              <div>
                <h3 className="px-3 text-[10px] font-bold text-mediumSage uppercase tracking-[0.2em] mb-3">
                  {t('header.quick_actions')}
                </h3>
                <div className="space-y-1">
                  <ActionItem 
                    icon={Shield} 
                    label={t('sidebar.kyc')} 
                    shortcut="G K" 
                    onClick={() => handleNavigate('/dashboard/kyc')}
                  />
                  <ActionItem 
                    icon={CreditCard} 
                    label={t('sidebar.payments')} 
                    shortcut="G F" 
                    onClick={() => handleNavigate('/dashboard/payments')}
                  />
                  <ActionItem 
                    icon={Users} 
                    label={t('sidebar.users')} 
                    shortcut="G U" 
                    onClick={() => handleNavigate('/dashboard/users')}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Search Result Categorization */}
              {results.therapists.length > 0 && (
                <div>
                  <h3 className="px-3 text-[10px] font-bold text-mediumSage uppercase tracking-[0.2em] mb-3">
                    {t('header.therapists')}
                  </h3>
                  <div className="space-y-1">
                    {results.therapists.map(tData => (
                      <ResultItem 
                        key={tData.id}
                        label={tData.professionalName || tData.name} 
                        sublabel={`${tData.status} • ${tData.email}`} 
                        onClick={() => handleNavigate(`/dashboard/users/therapist/${tData.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {results.users.length > 0 && (
                <div>
                  <h3 className="px-3 text-[10px] font-bold text-mediumSage uppercase tracking-[0.2em] mb-3">
                    {t('users.tab_patients')}
                  </h3>
                  <div className="space-y-1">
                    {results.users.map(u => (
                      <ResultItem 
                        key={u.id}
                        label={u.name} 
                        sublabel={u.email} 
                        onClick={() => handleNavigate(`/dashboard/users/patient/${u.id}`)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {results.transactions.length > 0 && (
                <div>
                  <h3 className="px-3 text-[10px] font-bold text-mediumSage uppercase tracking-[0.2em] mb-3">
                    {t('header.transactions')}
                  </h3>
                  <div className="space-y-1">
                    {results.transactions.map(txn => (
                      <ResultItem 
                        key={txn.id}
                        label={`Txn: ${txn.id.substring(0, 8)}...`} 
                        sublabel={`${txn.clientName} → ${txn.therapistName}`} 
                        onClick={() => handleNavigate('/dashboard/payments')}
                      />
                    ))}
                  </div>
                </div>
              )}

              {!isLoading && results.therapists.length === 0 && results.users.length === 0 && results.transactions.length === 0 && (
                <div className="py-12 text-center">
                  <p className="text-sm text-mediumSage italic">Aucun résultat trouvé pour "{search}"</p>
                </div>
              )}
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

const ActionItem = ({ icon: Icon, label, shortcut, onClick }: { icon: any, label: string, shortcut: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-lightSage transition-all group"
  >
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

const ResultItem = ({ label, sublabel, onClick }: { label: string, sublabel: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-lightSage transition-all group text-left"
  >
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-lightSage flex items-center justify-center text-darkSage group-hover:bg-white transition-colors">
        <UserIcon size={20} />
      </div>
      <div className="flex flex-col">
        <span className="text-sm font-bold text-charcoal font-abeezee">{label}</span>
        <span className="text-[10px] text-mediumSage font-bold">{sublabel}</span>
      </div>
    </div>
    <ArrowRight size={16} className="text-mediumSage opacity-0 group-hover:opacity-100 transition-opacity" />
  </button>
);
