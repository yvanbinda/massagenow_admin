"use client";

import React, { useState } from 'react';
import { 
  X, 
  User, 
  Maximize2, 
  RotateCw, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";

interface KycRecord {
  id: string;
  name: string;
  email: string;
  date: string;
  docs: ('id' | 'license')[];
  status: 'pending' | 'approved' | 'rejected' | 'resubmit';
}

interface KycReviewPanelProps {
  record: KycRecord | null;
  onClose: () => void;
}

export const KycReviewPanel = ({ record, onClose }: KycReviewPanelProps) => {
  const [activeTab, setActiveTab] = useState<'id' | 'license'>('id');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [reason, setReason] = useState("");

  if (!record) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-charcoal/30 backdrop-blur-sm z-[100] transition-opacity" 
        onClick={onClose}
      />
      
      {/* Slide-out Panel */}
      <div className="fixed inset-y-0 right-0 w-full sm:max-w-[600px] bg-white z-[110] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-lightSage flex items-center justify-between bg-creamWhite/20">
          <div>
            <h2 className="text-xl font-bold text-charcoal font-abeezee leading-tight">
              {t('kyc.review_panel_title')}
            </h2>
            <p className="text-xs text-mediumSage font-medium font-abeezee uppercase tracking-widest mt-1">
              {t('kyc.application_no')} #{record.id}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-lightSage rounded-full transition-colors text-mediumSage"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          {/* Section 1: Applicant Context */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-lightSage flex items-center justify-center text-darkSage border-2 border-white shadow-sm">
                <User size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-charcoal font-abeezee">{record.name}</h3>
                <p className="text-sm text-mediumSage font-abeezee">{record.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('kyc.selfie_label')}</span>
                <div className="aspect-square rounded-xl bg-lightSage/50 border border-lightSage flex items-center justify-center relative overflow-hidden group">
                  <div className="text-[10px] text-mediumSage/40 font-bold uppercase tracking-tighter">Selfie Image</div>
                </div>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('kyc.id_face_label')}</span>
                <div className="aspect-square rounded-xl bg-lightSage/50 border border-lightSage flex items-center justify-center relative overflow-hidden group">
                  <div className="text-[10px] text-mediumSage/40 font-bold uppercase tracking-tighter">ID Photo</div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Document Viewer */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-charcoal font-abeezee uppercase tracking-wider">
                {t('kyc.doc_viewer_title')}
              </h3>
              <div className="flex bg-lightSage/50 p-1 rounded-lg border border-lightSage">
                <button 
                  onClick={() => setActiveTab('id')}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                    activeTab === 'id' ? "bg-white text-darkSage shadow-sm" : "text-mediumSage hover:text-darkSage"
                  )}
                >
                  {t('kyc.tab_id')}
                </button>
                <button 
                  onClick={() => setActiveTab('license')}
                  className={cn(
                    "px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all",
                    activeTab === 'license' ? "bg-white text-darkSage shadow-sm" : "text-mediumSage hover:text-darkSage"
                  )}
                >
                  {t('kyc.tab_license')}
                </button>
              </div>
            </div>

            <div className="relative bg-charcoal rounded-2xl h-[340px] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
              <div className="text-white/20 font-bold font-abeezee text-sm tracking-widest uppercase italic">
                {activeTab === 'id' ? 'Government ID Image' : 'Professional License Image'}
              </div>
              
              {/* Floating Controls */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-charcoal/80 backdrop-blur-md border border-white/10 p-2 rounded-xl">
                <ControlButton icon={Maximize2} />
                <ControlButton icon={RotateCw} />
                <div className="w-px h-4 bg-white/10 mx-1" />
                <ControlButton icon={Download} />
              </div>
            </div>
          </section>
        </div>

        {/* Section 3: Decision Action Bar */}
        <div className="p-6 border-t border-lightSage bg-white space-y-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
          {showRequestForm && (
            <div className="animate-in slide-in-from-bottom-2 duration-300 space-y-3 pb-2">
              <div className="flex items-center gap-2 text-warning">
                <MessageSquare size={16} />
                <span className="text-xs font-bold font-abeezee uppercase tracking-widest">
                  {t('kyc.request_changes_btn')}
                </span>
              </div>
              <textarea 
                className="w-full bg-creamWhite border border-warning/20 rounded-xl p-4 text-sm font-abeezee text-charcoal placeholder:text-mediumSage/40 outline-none focus:ring-2 focus:ring-warning/20 transition-all min-h-[100px]"
                placeholder={t('kyc.reason_placeholder')}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-warning text-white hover:bg-warning/90"
                  onClick={() => setShowRequestForm(false)}
                >
                  {t('kyc.send_request')}
                </Button>
                <Button 
                  variant="ghost" 
                  className="px-4"
                  onClick={() => setShowRequestForm(false)}
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {!showRequestForm && (
            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-darkSage text-white font-bold font-abeezee hover:bg-darkSage/90 transition-all shadow-lg shadow-darkSage/10"
              >
                <CheckCircle2 size={18} />
                {t('kyc.approve_btn')}
              </button>
              
              <div className="flex gap-2 flex-1 sm:flex-none">
                <button 
                  onClick={() => setShowRequestForm(true)}
                  className="flex-1 sm:flex-none py-4 px-6 rounded-xl border border-warning text-warning font-bold font-abeezee hover:bg-warning/5 transition-all"
                >
                  {t('kyc.request_changes_btn')}
                </button>
                <button 
                  className="p-4 rounded-xl text-error hover:bg-error/5 transition-all"
                  title={t('kyc.reject_btn')}
                >
                  <AlertCircle size={22} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

const ControlButton = ({ icon: Icon }: { icon: any }) => (
  <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all">
    <Icon size={18} />
  </button>
);

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
