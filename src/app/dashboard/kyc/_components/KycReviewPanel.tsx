"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { 
  X, 
  User, 
  Maximize2, 
  RotateCw, 
  Download, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Loader2,
  ShieldCheck
} from "lucide-react";
import { t } from "@/lib/i18n";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface KycRecord {
  id: string;
  name: string;
  email: string;
  professionalName: string;
  bio: string;
  experienceLevel: string;
  specialties: string[];
  operationMode: string;
  date: string;
  docs: {
    idFront: string;
    idBack: string;
    selfie: string;
    license?: string | null;
  };
  status: 'pending' | 'approved' | 'rejected' | 'resubmit';
}

interface KycReviewPanelProps {
  record: KycRecord | null;
  onClose: () => void;
}

export const KycReviewPanel = ({ record, onClose }: KycReviewPanelProps) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'idFront' | 'idBack' | 'selfie' | 'license'>('idFront');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [reason, setReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!record) return null;

  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      const response = await fetch('/api/admin/kyc/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: record.id, email: record.email }),
      });

      if (!response.ok) throw new Error('Approval failed');

      setShowConfirmModal(false);
      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(t('kyc.error_approve'));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!reason) return;
    try {
      setIsProcessing(true);
      const response = await fetch('/api/admin/kyc/reject', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: record.id, reason }),
      });

      if (!response.ok) throw new Error('Rejection failed');

      onClose();
      router.refresh();
    } catch (error) {
      console.error(error);
      alert(t('kyc.error_reject'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-charcoal/30 backdrop-blur-sm z-[100] transition-opacity" onClick={onClose} />
      
      <div className="fixed inset-y-0 right-0 w-full sm:max-w-[600px] bg-white z-[110] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="px-8 py-6 border-b border-lightSage flex items-center justify-between bg-creamWhite/20">
          <div>
            <h2 className="text-xl font-bold text-charcoal font-abeezee leading-tight">
              {t('kyc.review_panel_title')}
            </h2>
            <p className="text-xs text-mediumSage font-medium font-abeezee uppercase tracking-widest mt-1">
              {t('kyc.application_no')} #{record.id.substring(0,8)}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-lightSage rounded-full transition-colors text-mediumSage">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-hide">
          {/* Section 1: Professional Context */}
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-lightSage flex items-center justify-center text-darkSage border-2 border-white shadow-sm overflow-hidden">
                {record.docs.selfie ? (
                   <img src={record.docs.selfie} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                   <User size={28} />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-charcoal font-abeezee">{record.professionalName}</h3>
                <p className="text-sm text-mediumSage font-abeezee">{record.name} • {record.email}</p>
              </div>
            </div>

            <div className="bg-creamWhite/50 rounded-2xl p-5 border border-lightSage space-y-4">
               <div>
                  <span className="text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('kyc.specialties_label')}</span>
                  <div className="flex flex-wrap gap-2 mt-2">
                     {record.specialties?.map((s, i) => (
                       <span key={i} className="px-3 py-1 bg-white border border-lightSage rounded-full text-[10px] font-bold text-darkSage">{s}</span>
                     ))}
                  </div>
               </div>
               <div>
                  <span className="text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('kyc.bio_label')}</span>
                  <p className="text-xs text-secondaryCharcoal leading-relaxed mt-1 font-abeezee italic">"{record.bio}"</p>
               </div>
            </div>
          </section>

          {/* Section 2: Document Viewer */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-charcoal font-abeezee uppercase tracking-wider">
                {t('kyc.doc_viewer_title')}
              </h3>
              <div className="flex bg-lightSage/50 p-1 rounded-lg border border-lightSage overflow-x-auto scrollbar-hide">
                <TabBtn active={activeTab === 'idFront'} onClick={() => setActiveTab('idFront')} label={t('kyc.id_recto')} />
                <TabBtn active={activeTab === 'idBack'} onClick={() => setActiveTab('idBack')} label={t('kyc.id_verso')} />
                <TabBtn active={activeTab === 'selfie'} onClick={() => setActiveTab('selfie')} label={t('kyc.selfie_tab')} />
                {record.docs.license && <TabBtn active={activeTab === 'license'} onClick={() => setActiveTab('license')} label={t('kyc.license_tab')} />}
              </div>
            </div>

            <div className="relative bg-charcoal rounded-2xl h-[400px] flex items-center justify-center overflow-hidden border-4 border-white shadow-lg group">
              {/* @ts-ignore */}
              {record.docs[activeTab] ? (
                 <img 
                    src={(record.docs as any)[activeTab]} 
                    alt="Verification Document" 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                 />
              ) : (
                 <div className="text-white/20 text-center space-y-2">
                    <AlertCircle size={48} className="mx-auto" />
                    <p className="text-xs">Document non disponible</p>
                 </div>
              )}
            </div>
          </section>
        </div>

        {/* Section 3: Action Bar */}
        <div className="p-6 border-t border-lightSage bg-white space-y-4 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
          {showRequestForm ? (
            <div className="animate-in slide-in-from-bottom-2 duration-300 space-y-3 pb-2">
              <textarea 
                className="w-full bg-creamWhite border border-warning/20 rounded-xl p-4 text-sm font-abeezee text-charcoal placeholder:text-mediumSage/40 outline-none focus:ring-2 focus:ring-warning/20 min-h-[100px]"
                placeholder={t('kyc.reason_placeholder')}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <div className="flex gap-2">
                <Button 
                  className="flex-1 bg-warning text-white hover:bg-warning/90" 
                  onClick={handleReject}
                  isLoading={isProcessing}
                  disabled={!reason}
                >
                  {t('kyc.send_request')}
                </Button>
                <Button variant="ghost" onClick={() => setShowRequestForm(false)}>{t('common.cancel')}</Button>
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmModal(true)}
                disabled={isProcessing}
                className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-xl bg-darkSage text-white font-bold font-abeezee hover:bg-darkSage/90 transition-all shadow-lg shadow-darkSage/10"
              >
                <CheckCircle2 size={18} />
                {t('kyc.approve_btn')}
              </button>
              
              <button 
                onClick={() => setShowRequestForm(true)}
                disabled={isProcessing}
                className="py-4 px-6 rounded-xl border border-warning text-warning font-bold font-abeezee hover:bg-warning/5 transition-all"
              >
                {t('kyc.request_changes_btn')}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={() => setShowConfirmModal(false)} />
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
             <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShieldCheck size={40} className="text-success" />
             </div>
             <h3 className="text-2xl font-bold text-charcoal font-abeezee mb-2">{t('kyc.confirm_title')}</h3>
             <p className="text-mediumSage text-sm font-abeezee leading-relaxed mb-8">
               {t('kyc.confirm_body').replace('{name}', record.professionalName)}
             </p>
             <div className="flex flex-col gap-3">
                <Button 
                  className="w-full bg-darkSage py-4 h-auto text-lg" 
                  onClick={handleApprove}
                  isLoading={isProcessing}
                >
                   {t('kyc.confirm_btn')}
                </Button>
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="text-mediumSage font-bold text-sm uppercase tracking-widest hover:text-charcoal transition-colors py-2"
                >
                   {t('common.cancel')}
                </button>
             </div>
          </div>
        </div>
      )}
    </>
  );
};

const TabBtn = ({ active, onClick, label }: { active: boolean, onClick: () => void, label: string }) => (
  <button onClick={onClick} className={cn("px-4 py-2 rounded-md text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap", active ? "bg-white text-darkSage shadow-sm" : "text-mediumSage hover:text-darkSage")}>
    {label}
  </button>
);

const ControlButton = ({ icon: Icon }: { icon: any }) => (
  <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-all"><Icon size={18} /></button>
);
