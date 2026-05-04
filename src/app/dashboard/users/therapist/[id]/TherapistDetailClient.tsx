"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  Star, 
  CreditCard,
  ExternalLink,
  Trash2,
  Flag
} from "lucide-react";
import { t } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface TherapistDetailClientProps {
  therapist: any;
}

export default function TherapistDetailClient({ therapist }: TherapistDetailClientProps) {
  const currency = t('common.currency');

  return (
    <div className="space-y-8 pb-12">
      {/* Top Bar Navigation */}
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard/users" 
          className="flex items-center gap-2 text-mediumSage hover:text-darkSage transition-colors font-bold font-abeezee text-sm"
        >
          <ChevronLeft size={20} />
          {t('users.detail.back')}
        </Link>
        <div className="flex gap-3">
           <Button variant="outline" className="border-lightSage text-charcoal">
             Exporter le Dossier
           </Button>
        </div>
      </div>

      {/* Main Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-abeezee text-charcoal tracking-tight">
          {t('users.detail.profile_title')}: {therapist.name}
        </h1>
        <Badge variant={therapist.status === 'active' ? "success" : "error"} className="px-4 py-1.5 text-sm uppercase tracking-widest">
          {therapist.status === 'active' ? t('users.status_active') : t('users.status_suspended')}
        </Badge>
      </div>

      {/* 3-Column Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Column 1: Identity & Compliance (Left) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="flex flex-col items-center text-center p-8">
            <div className="w-24 h-24 rounded-full ring-4 ring-sageGreen/20 ring-offset-4 ring-offset-white overflow-hidden mb-6">
               <div className="w-full h-full bg-darkSage flex items-center justify-center text-white text-3xl font-bold font-abeezee">
                 {therapist.name?.charAt(0) || 'T'}
               </div>
            </div>
            <h3 className="text-xl font-bold text-charcoal font-abeezee mb-1">{therapist.name}</h3>
            <p className="text-xs text-mediumSage font-medium uppercase tracking-widest mb-6">
              {t('users.detail.member_since')} {therapist.memberSince ? new Date(therapist.memberSince).toLocaleDateString('fr-FR') : 'N/A'}
            </p>
            
            <div className="w-full space-y-4 text-left border-t border-lightSage pt-6">
               <div className="flex items-center gap-3 text-secondaryCharcoal">
                 <MapPin size={16} className="text-mediumSage" />
                 <span className="text-sm font-abeezee">{therapist.travelSettings?.baseAddress || 'Non renseigné'}</span>
               </div>
               <div className="flex items-center gap-3 text-secondaryCharcoal">
                 <Phone size={16} className="text-mediumSage" />
                 <span className="text-sm font-abeezee">{therapist.phone || 'N/A'}</span>
               </div>
               <div className="flex items-center gap-3 text-secondaryCharcoal">
                 <Mail size={16} className="text-mediumSage" />
                 <span className="text-sm font-abeezee break-all">{therapist.email}</span>
               </div>
            </div>
          </Card>

          <Card className="p-6 border-l-4 border-l-success">
             <div className="flex items-center justify-between mb-4">
                <h4 className="text-xs font-bold text-charcoal uppercase tracking-widest font-abeezee">
                  {t('users.detail.kyc_verified')}
                </h4>
                <ShieldCheck size={18} className="text-success" />
             </div>
             <Button variant="outline" className="w-full gap-2 border-success/20 text-success hover:bg-success/5">
                <ExternalLink size={14} />
                Documents KYC
             </Button>
          </Card>

          <Card className="p-6 bg-error/5 border-none">
             <h4 className="text-xs font-bold text-error uppercase tracking-widest font-abeezee mb-4">
               {t('users.detail.danger_zone')}
             </h4>
             <div className="space-y-3">
                <Button variant="outline" className="w-full border-error/20 text-error hover:bg-error/10 hover:border-error/40 font-bold">
                  {t('users.detail.suspend')}
                </Button>
                <button className="w-full text-center text-[10px] font-bold text-error/60 hover:text-error uppercase tracking-widest transition-colors">
                  {t('users.detail.remove')}
                </button>
             </div>
          </Card>
        </div>

        {/* Column 2: Operations & Quality (Center) */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider font-abeezee mb-6 border-b border-lightSage pb-4">
              {t('users.detail.services_title')}
            </h4>
            <div className="divide-y divide-lightSage/30">
              {therapist.services?.length > 0 ? therapist.services.map((service: any, index: number) => (
                <div key={index} className="py-4 flex justify-between items-center group">
                   <div className="flex flex-col">
                      <span className="text-sm font-bold text-charcoal font-abeezee">{service.title}</span>
                      <span className="text-xs text-mediumSage font-abeezee">{service.durationMinutes} mins</span>
                   </div>
                   <span className="text-sm font-bold text-darkSage font-abeezee">{service.price} {currency}</span>
                </div>
              )) : (
                <p className="py-4 text-sm text-mediumSage italic text-center">Aucun service configuré.</p>
              )}
            </div>
          </Card>

          <Card className="bg-creamWhite/30">
            <div className="flex items-center justify-between mb-8">
               <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider font-abeezee">
                 Score de Santé Match
               </h4>
               <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-lightSage rounded-full">
                  <Star size={14} className="text-warning fill-warning" />
                  <span className="text-sm font-bold text-charcoal">{(therapist.rating || 5.0) * 20}%</span>
               </div>
            </div>
            <div className="h-3 w-full bg-lightSage rounded-full overflow-hidden">
               <div className="h-full bg-darkSage" style={{ width: `${(therapist.rating || 5.0) * 20}%` }} />
            </div>
            <p className="mt-4 text-xs text-mediumSage font-abeezee leading-relaxed italic">
              Ce score reflète l'alignement des services du thérapeute avec la demande locale des patients.
            </p>
          </Card>

          <Card>
            <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider font-abeezee mb-6 border-b border-lightSage pb-4 flex items-center justify-between">
              Avis & Signalements
              <Badge variant="neutral">{therapist.reviewCount || 0} Avis</Badge>
            </h4>
            <div className="flex flex-col items-center justify-center p-8 text-center bg-creamWhite/20 rounded-xl border border-dashed border-lightSage">
               <p className="text-sm text-mediumSage font-abeezee">Aucun avis récent.</p>
            </div>
          </Card>
        </div>

        {/* Column 3: Financials (Right) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6">
             <h4 className="text-[10px] font-bold text-mediumSage uppercase tracking-[0.2em] font-abeezee mb-4">
               {t('users.detail.stripe_status')}
             </h4>
             <div className={cn(
               "flex items-center gap-3 p-3 rounded-xl border",
               therapist.stripeConnectId ? "bg-success/5 border-success/10" : "bg-warning/5 border-warning/10"
             )}>
                <div className={cn("p-2 rounded-lg", therapist.stripeConnectId ? "bg-success/10" : "bg-warning/10")}>
                   <CreditCard size={18} className={therapist.stripeConnectId ? "text-success" : "text-warning"} />
                </div>
                <div>
                   <p className="text-xs font-bold text-charcoal uppercase">{therapist.stripeConnectId ? 'Compte Actif' : 'Non Connecté'}</p>
                   <p className={cn("text-[10px] font-bold", therapist.stripeConnectId ? "text-success" : "text-warning")}>
                      {therapist.stripeConnectId ? 'Vérifié par Stripe' : 'Action requise'}
                   </p>
                </div>
             </div>
          </Card>

          <Card className="p-6 space-y-8">
             <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider font-abeezee">
               {t('users.detail.financials_title')}
             </h4>
             
             <div className="space-y-1">
                <p className="text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('users.detail.total_processed')}</p>
                <p className="text-2xl font-bold text-charcoal font-abeezee">{therapist.totalRevenue?.toLocaleString() || 0} {currency}</p>
             </div>

             <div className="space-y-1 p-4 bg-darkSage/5 rounded-xl border border-darkSage/10">
                <p className="text-[10px] font-bold text-darkSage uppercase tracking-widest">{t('users.detail.platform_commission')}</p>
                <p className="text-2xl font-bold text-darkSage font-abeezee">{therapist.platformComm?.toLocaleString() || 0} {currency}</p>
             </div>
          </Card>

          <Card className="p-6">
             <h4 className="text-xs font-bold text-charcoal uppercase tracking-widest font-abeezee mb-6">
               Derniers Reversements
             </h4>
             <div className="text-center py-4 text-xs text-mediumSage italic">
                Aucun virement récent.
             </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
