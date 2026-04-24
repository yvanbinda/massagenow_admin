"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  ShieldCheck, 
  AlertTriangle, 
  Star, 
  Clock, 
  CreditCard,
  ExternalLink,
  Trash2,
  Flag
} from "lucide-react";
import { t } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function TherapistDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // En production, nous irions chercher les données via Firebase avec params.id
  const therapist = {
    id: id,
    name: "Sarah Chen",
    status: "active",
    email: "sarah.chen@pro-massage.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris + 20km",
    memberSince: "12 Mars 2024",
    matchScore: 94,
    revenue: "14 500 $",
    commission: "2 175 $",
    stripeStatus: "active",
    services: [
      { name: "Deep Tissue Recovery", duration: "60 mins", price: "120 $" },
      { name: "Massage Suédois", duration: "90 mins", price: "150 $" },
      { name: "Réflexologie", duration: "45 mins", price: "85 $" },
    ],
    recentPayouts: [
      { date: "15 Nov 2024", amount: "1 240 $", status: "completed" },
      { date: "08 Nov 2024", amount: "980 $", status: "completed" },
      { date: "01 Nov 2024", amount: "1 150 $", status: "completed" },
    ]
  };

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
        <Badge variant="success" className="px-4 py-1.5 text-sm uppercase tracking-widest">
          {t('users.status_active')}
        </Badge>
      </div>

      {/* 3-Column Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Column 1: Identity & Compliance (Left) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="flex flex-col items-center text-center p-8">
            <div className="w-24 h-24 rounded-full ring-4 ring-sageGreen/20 ring-offset-4 ring-offset-white overflow-hidden mb-6">
               <div className="w-full h-full bg-darkSage flex items-center justify-center text-white text-3xl font-bold font-abeezee">
                 {therapist.name.charAt(0)}
               </div>
            </div>
            <h3 className="text-xl font-bold text-charcoal font-abeezee mb-1">{therapist.name}</h3>
            <p className="text-xs text-mediumSage font-medium uppercase tracking-widest mb-6">
              {t('users.detail.member_since')} {therapist.memberSince}
            </p>
            
            <div className="w-full space-y-4 text-left border-t border-lightSage pt-6">
               <div className="flex items-center gap-3 text-secondaryCharcoal">
                 <MapPin size={16} className="text-mediumSage" />
                 <span className="text-sm font-abeezee">{therapist.location}</span>
               </div>
               <div className="flex items-center gap-3 text-secondaryCharcoal">
                 <Phone size={16} className="text-mediumSage" />
                 <span className="text-sm font-abeezee">{therapist.phone}</span>
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
              {therapist.services.map((service, index) => (
                <div key={index} className="py-4 flex justify-between items-center group">
                   <div className="flex flex-col">
                      <span className="text-sm font-bold text-charcoal font-abeezee">{service.name}</span>
                      <span className="text-xs text-mediumSage font-abeezee">{service.duration}</span>
                   </div>
                   <span className="text-sm font-bold text-darkSage font-abeezee">{service.price}</span>
                </div>
              ))}
            </div>
          </Card>

          <Card className="bg-creamWhite/30">
            <div className="flex items-center justify-between mb-8">
               <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider font-abeezee">
                 Score de Santé Match
               </h4>
               <div className="flex items-center gap-1.5 px-3 py-1 bg-white border border-lightSage rounded-full">
                  <Star size={14} className="text-warning fill-warning" />
                  <span className="text-sm font-bold text-charcoal">{therapist.matchScore}%</span>
               </div>
            </div>
            {/* Visual Gauge Placeholder */}
            <div className="h-3 w-full bg-lightSage rounded-full overflow-hidden">
               <div className="h-full bg-darkSage" style={{ width: `${therapist.matchScore}%` }} />
            </div>
            <p className="mt-4 text-xs text-mediumSage font-abeezee leading-relaxed italic">
              Ce score reflète l'alignement des services du thérapeute avec la demande locale des patients.
            </p>
          </Card>

          <Card>
            <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider font-abeezee mb-6 border-b border-lightSage pb-4 flex items-center justify-between">
              Avis & Signalements
              <Badge variant="neutral">12 Avis</Badge>
            </h4>
            <div className="space-y-6">
               {[1, 2].map((i) => (
                 <div key={i} className="flex gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-lightSage shrink-0" />
                    <div className="flex-1 space-y-1">
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-charcoal">Patient #{1024 + i}</span>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-1.5 text-mediumSage hover:text-error transition-colors"><Flag size={14} /></button>
                             <button className="p-1.5 text-mediumSage hover:text-error transition-colors"><Trash2 size={14} /></button>
                          </div>
                       </div>
                       <div className="flex gap-0.5 text-warning mb-1">
                          {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} className="fill-warning" />)}
                       </div>
                       <p className="text-xs text-secondaryCharcoal leading-relaxed font-abeezee">
                         "Une session incroyable. Très professionnelle et à l'écoute de mes besoins spécifiques pour mon dos."
                       </p>
                    </div>
                 </div>
               ))}
            </div>
          </Card>
        </div>

        {/* Column 3: Financials (Right) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6">
             <h4 className="text-[10px] font-bold text-mediumSage uppercase tracking-[0.2em] font-abeezee mb-4">
               {t('users.detail.stripe_status')}
             </h4>
             <div className="flex items-center gap-3 p-3 bg-success/5 rounded-xl border border-success/10">
                <div className="p-2 bg-success/10 rounded-lg">
                   <CreditCard size={18} className="text-success" />
                </div>
                <div>
                   <p className="text-xs font-bold text-charcoal uppercase">Compte Actif</p>
                   <p className="text-[10px] text-success font-bold">Vérifié par Stripe</p>
                </div>
             </div>
          </Card>

          <Card className="p-6 space-y-8">
             <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider font-abeezee">
               {t('users.detail.financials_title')}
             </h4>
             
             <div className="space-y-1">
                <p className="text-[10px] font-bold text-mediumSage uppercase tracking-widest">{t('users.detail.total_processed')}</p>
                <p className="text-2xl font-bold text-charcoal font-abeezee">{therapist.revenue}</p>
             </div>

             <div className="space-y-1 p-4 bg-darkSage/5 rounded-xl border border-darkSage/10">
                <p className="text-[10px] font-bold text-darkSage uppercase tracking-widest">{t('users.detail.platform_commission')}</p>
                <p className="text-2xl font-bold text-darkSage font-abeezee">{therapist.commission}</p>
             </div>
          </Card>

          <Card className="p-6">
             <h4 className="text-xs font-bold text-charcoal uppercase tracking-widest font-abeezee mb-6">
               Derniers Virements
             </h4>
             <div className="space-y-4">
                {therapist.recentPayouts.map((payout, index) => (
                  <div key={index} className="flex justify-between items-center">
                     <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-charcoal">{payout.date}</span>
                        <span className="text-[10px] text-success font-medium uppercase tracking-tighter">Complété</span>
                     </div>
                     <span className="text-xs font-bold text-charcoal">{payout.amount}</span>
                  </div>
                ))}
             </div>
          </Card>
        </div>

      </div>
    </div>
  );
}
