"use client";

import React, { use } from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  User, 
  Mail, 
  Calendar, 
  Home, 
  Euro, 
  Zap, 
  Clock, 
  AlertTriangle, 
  CreditCard, 
  Ticket,
  History,
  MessageSquare,
  Trash2,
  Users
} from "lucide-react";
import { t } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function PatientDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  // Mock data for the patient
  const patient = {
    id: id,
    name: "Sophie Martin",
    email: "sophie.martin@email.com",
    status: "flagged",
    memberSince: "15 Janvier 2024",
    preferences: {
      environment: "Mobile (À domicile)",
      maxBudget: "100 €",
      technique: "Suédois / Relaxation",
      genderPref: "Femme uniquement"
    },
    metrics: {
      ltv: "2 100 €",
      cancellationRate: "22%",
      noShowCount: 2,
      totalSessions: 24
    },
    bookings: [
      { id: 'b1', therapist: "Sarah Chen", date: "10 Nov 2024", status: "completed" },
      { id: 'b2', therapist: "Sarah Chen", date: "03 Nov 2024", status: "cancelled" },
      { id: 'b3', therapist: "Mark Wilson", date: "25 Oct 2024", status: "completed" },
    ],
    paymentMethods: [
      { id: 'pm1', type: 'Mastercard', last4: '1234' },
      { id: 'pm2', type: 'Visa', last4: '5678' }
    ],
    promoCodes: [
      { code: "ZEN20", discount: "20%", status: "active" }
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
      </div>

      {/* Main Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-abeezee text-charcoal tracking-tight">
          {t('users.detail.profile_title_patient')}: {patient.name}
        </h1>
        <Badge variant="warning" className="px-4 py-1.5 text-sm uppercase tracking-widest">
          {t('users.status_flagged')}
        </Badge>
      </div>

      {/* 3-Column Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Column 1: Matchmaking Blueprint (Left) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="flex flex-col items-center text-center p-8">
            <div className="w-24 h-24 rounded-full ring-4 ring-sageGreen/20 ring-offset-4 ring-offset-white overflow-hidden mb-6">
               <div className="w-full h-full bg-darkSage flex items-center justify-center text-white text-3xl font-bold font-abeezee">
                 {patient.name.charAt(0)}
               </div>
            </div>
            <h3 className="text-xl font-bold text-charcoal font-abeezee mb-1">{patient.name}</h3>
            <p className="text-xs text-mediumSage font-medium uppercase tracking-widest mb-6">
              {t('users.detail.member_since')} {patient.memberSince}
            </p>
            
            <div className="w-full space-y-4 text-left border-t border-lightSage pt-6">
               <div className="flex items-center gap-3 text-secondaryCharcoal">
                 <Mail size={16} className="text-mediumSage" />
                 <span className="text-sm font-abeezee break-all">{patient.email}</span>
               </div>
            </div>
          </Card>

          <Card className="p-6 space-y-6">
             <h4 className="text-xs font-bold text-charcoal uppercase tracking-widest font-abeezee border-b border-lightSage pb-4">
               {t('users.detail.matchmaking_blueprint')}
             </h4>
             <div className="space-y-4">
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-mediumSage uppercase tracking-widest flex items-center gap-2">
                     <Home size={12} /> {t('users.detail.environment')}
                   </p>
                   <p className="text-sm font-bold text-charcoal font-abeezee">{patient.preferences.environment}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-mediumSage uppercase tracking-widest flex items-center gap-2">
                     <Euro size={12} /> {t('users.detail.max_budget')}
                   </p>
                   <p className="text-sm font-bold text-charcoal font-abeezee">{patient.preferences.maxBudget}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-mediumSage uppercase tracking-widest flex items-center gap-2">
                     <Zap size={12} /> {t('users.detail.technique')}
                   </p>
                   <p className="text-sm font-bold text-charcoal font-abeezee">{patient.preferences.technique}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-mediumSage uppercase tracking-widest flex items-center gap-2">
                     <Users size={12} /> {t('users.detail.gender_pref')}
                   </p>
                   <p className="text-sm font-bold text-charcoal font-abeezee">{patient.preferences.genderPref}</p>
                </div>
             </div>
          </Card>
        </div>

        {/* Column 2: Behavioral History (Center) */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider font-abeezee mb-6 border-b border-lightSage pb-4 flex items-center justify-between">
              {t('users.detail.behavioral_history')}
              <Badge variant="neutral">{patient.metrics.totalSessions} Sessions</Badge>
            </h4>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
               <div className="p-4 bg-warning/5 border border-warning/10 rounded-2xl">
                  <p className="text-[10px] font-bold text-warning uppercase tracking-widest mb-1">{t('users.detail.cancellation_rate')}</p>
                  <p className="text-2xl font-bold text-warning font-abeezee">{patient.metrics.cancellationRate}</p>
               </div>
               <div className="p-4 bg-error/5 border border-error/10 rounded-2xl">
                  <p className="text-[10px] font-bold text-error uppercase tracking-widest mb-1">{t('users.detail.no_show_count')}</p>
                  <p className="text-2xl font-bold text-error font-abeezee">{patient.metrics.noShowCount}</p>
               </div>
            </div>

            <div className="space-y-6">
               <h5 className="text-[10px] font-bold text-mediumSage uppercase tracking-[0.2em] font-abeezee">Timeline de Réservation</h5>
               <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-lightSage">
                  {patient.bookings.map((booking, index) => (
                    <div key={index} className="relative flex items-start gap-4">
                       <div className={`absolute -left-[19px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm ${
                         booking.status === 'completed' ? 'bg-success' : 'bg-error'
                       }`} />
                       <div className="flex-1 bg-creamWhite/30 p-4 rounded-xl border border-lightSage/50">
                          <div className="flex justify-between items-center mb-1">
                             <span className="text-sm font-bold text-charcoal font-abeezee">{booking.therapist}</span>
                             <Badge variant={booking.status === 'completed' ? 'success' : 'error'} className="text-[10px]">
                                {booking.status === 'completed' ? 'Complété' : 'Annulé'}
                             </Badge>
                          </div>
                          <span className="text-xs text-mediumSage flex items-center gap-1.5">
                             <Calendar size={12} /> {booking.date}
                          </span>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          </Card>

          <Card>
            <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider font-abeezee mb-6 border-b border-lightSage pb-4 flex items-center justify-between">
              {t('users.detail.support_tickets')}
              <MessageSquare size={18} className="text-mediumSage" />
            </h4>
            <div className="flex flex-col items-center justify-center p-8 text-center bg-creamWhite/20 rounded-xl border border-dashed border-lightSage">
               <p className="text-sm text-mediumSage font-abeezee">Aucun ticket de support actif pour ce patient.</p>
            </div>
          </Card>
        </div>

        {/* Column 3: LTV & Payment (Right) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-6 space-y-4">
             <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider font-abeezee">
               {t('users.detail.ltv_label')}
             </h4>
             <div className="p-6 bg-darkSage/5 rounded-2xl border border-darkSage/10 text-center">
                <p className="text-3xl font-bold text-darkSage font-abeezee mb-1">{patient.metrics.ltv}</p>
                <p className="text-[10px] text-mediumSage font-bold uppercase tracking-widest">{t('users.detail.total_spent')}</p>
             </div>
          </Card>

          <Card className="p-6">
             <h4 className="text-xs font-bold text-charcoal uppercase tracking-widest font-abeezee mb-6 flex items-center justify-between">
               {t('users.detail.payment_vault')}
               <CreditCard size={16} className="text-mediumSage" />
             </h4>
             <div className="space-y-3">
                {patient.paymentMethods.map((pm, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-creamWhite/50 rounded-xl border border-lightSage/50 group">
                     <div className="flex items-center gap-3">
                        <div className="p-2 bg-white rounded-lg shadow-sm">
                           <CreditCard size={14} className="text-darkSage" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-xs font-bold text-charcoal">{pm.type}</span>
                           <span className="text-[10px] text-mediumSage">•••• {pm.last4}</span>
                        </div>
                     </div>
                     <button className="p-2 text-mediumSage hover:text-error opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={14} />
                     </button>
                  </div>
                ))}
             </div>
          </Card>

          <Card className="p-6">
             <h4 className="text-xs font-bold text-charcoal uppercase tracking-widest font-abeezee mb-6 flex items-center justify-between">
               {t('users.detail.promo_codes')}
               <Ticket size={16} className="text-mediumSage" />
             </h4>
             <div className="space-y-3">
                {patient.promoCodes.map((promo, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-success/5 rounded-xl border border-success/10">
                     <span className="text-xs font-bold text-success font-abeezee tracking-wider">{promo.code}</span>
                     <Badge variant="success" className="text-[10px]">{promo.discount}</Badge>
                  </div>
                ))}
             </div>
          </Card>

          <Card className="p-6 bg-error/5 border-none">
             <h4 className="text-xs font-bold text-error uppercase tracking-widest font-abeezee mb-4">
               {t('users.detail.danger_zone')}
             </h4>
             <Button variant="outline" className="w-full border-error/20 text-error hover:bg-error/10 hover:border-error/40 font-bold">
               {t('users.detail.suspend')}
             </Button>
          </Card>
        </div>

      </div>
    </div>
  );
}
