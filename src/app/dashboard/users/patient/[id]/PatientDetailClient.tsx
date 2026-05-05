"use client";

import React from 'react';
import Link from 'next/link';
import { 
  ChevronLeft, 
  Mail, 
  Calendar, 
  Home, 
  DollarSign, 
  Zap, 
  Clock, 
  CreditCard, 
  Ticket,
  MessageSquare,
  Trash2,
  Users,
  Star,
  Flag
} from "lucide-react";
import { t } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface PatientDetailClientProps {
  patient: any;
}

export default function PatientDetailClient({ patient }: PatientDetailClientProps) {
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
      </div>

      {/* Main Page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold font-abeezee text-charcoal tracking-tight">
          {t('users.detail.profile_title_patient')}: {patient.name}
        </h1>
        <Badge variant={patient.isCertified ? "success" : "neutral"} className="px-4 py-1.5 text-sm uppercase tracking-widest">
          {patient.isCertified ? "Thérapeute Certifié" : t('users.status_active')}
        </Badge>
      </div>

      {/* 3-Column Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Column 1: Matchmaking Blueprint (Left) */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="flex flex-col items-center text-center p-8">
            <div className="w-24 h-24 rounded-full ring-4 ring-sageGreen/20 ring-offset-4 ring-offset-white overflow-hidden mb-6">
               {patient.avatarUrl ? (
                 <img src={patient.avatarUrl} alt={patient.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-darkSage flex items-center justify-center text-white text-3xl font-bold font-abeezee">
                   {patient.name?.charAt(0) || 'U'}
                 </div>
               )}
            </div>
            <h3 className="text-xl font-bold text-charcoal font-abeezee mb-1">{patient.name}</h3>
            <p className="text-xs text-mediumSage font-medium uppercase tracking-widest mb-6">
              {t('users.detail.member_since')} {patient.createdAt ? new Date(patient.createdAt).toLocaleDateString('fr-FR') : 'N/A'}
            </p>
            
            <div className="w-full space-y-4 text-left border-t border-lightSage pt-6">
               <div className="flex items-center gap-3 text-secondaryCharcoal">
                 <Mail size={16} className="text-mediumSage" />
                 <span className="text-sm font-abeezee break-all">{patient.email}</span>
               </div>
               {patient.phoneNumber && (
                 <div className="flex items-center gap-3 text-secondaryCharcoal">
                   <Users size={16} className="text-mediumSage" />
                   <span className="text-sm font-abeezee">{patient.phoneNumber}</span>
                 </div>
               )}
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
                   <p className="text-sm font-bold text-charcoal font-abeezee">{patient.profiling?.environment || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-mediumSage uppercase tracking-widest flex items-center gap-2">
                     <DollarSign size={12} /> {t('users.detail.max_budget')}
                   </p>
                   <p className="text-sm font-bold text-charcoal font-abeezee">{patient.profiling?.maxPrice ? `${patient.profiling.maxPrice} ${currency}` : 'N/A'}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-mediumSage uppercase tracking-widest flex items-center gap-2">
                     <Zap size={12} /> {t('users.detail.technique')}
                   </p>
                   <p className="text-sm font-bold text-charcoal font-abeezee">{patient.profiling?.preferredTechnique || 'N/A'}</p>
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] font-bold text-mediumSage uppercase tracking-widest flex items-center gap-2">
                     <Users size={12} /> {t('users.detail.gender_pref')}
                   </p>
                   <p className="text-sm font-bold text-charcoal font-abeezee">{patient.profiling?.genderPreference || 'Aucune'}</p>
                </div>
             </div>
          </Card>
        </div>

        {/* Column 2: Behavioral History (Center) */}
        <div className="lg:col-span-6 space-y-6">
          <Card>
            <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider font-abeezee mb-6 border-b border-lightSage pb-4 flex items-center justify-between">
              {t('users.detail.behavioral_history')}
              <Badge variant="neutral">{patient.bookings?.length || 0} Sessions</Badge>
            </h4>
            
            <div className="space-y-6">
               <h5 className="text-[10px] font-bold text-mediumSage uppercase tracking-[0.2em] font-abeezee">{t('users.detail.timeline_title')}</h5>
               {patient.bookings?.length > 0 ? (
                 <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-lightSage">
                    {patient.bookings.map((booking: any, index: number) => (
                      <div key={index} className="relative flex items-start gap-4">
                         <div className={cn(
                           "absolute -left-[19px] top-1.5 w-3 h-3 rounded-full border-2 border-white shadow-sm",
                           booking.status === 'completed' ? 'bg-success' : 'bg-error'
                         )} />
                         <div className="flex-1 bg-creamWhite/30 p-4 rounded-xl border border-lightSage/50">
                            <div className="flex justify-between items-center mb-1">
                               <span className="text-sm font-bold text-charcoal font-abeezee">{booking.serviceTitleSnapshot}</span>
                               <Badge variant={booking.status === 'completed' ? 'success' : 'error'} className="text-[10px]">
                                  {booking.status}
                               </Badge>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-mediumSage flex items-center gap-1.5">
                                 <Calendar size={12} /> {new Date(booking.startTime).toLocaleDateString('fr-FR')}
                              </span>
                              <span className="text-xs font-bold text-darkSage">{booking.priceSnapshot} {currency}</span>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
               ) : (
                 <div className="text-center py-8 text-mediumSage font-abeezee italic border border-dashed border-lightSage rounded-xl">
                    {t('users.detail.no_reservations')}
                 </div>
               )}
            </div>
          </Card>

          <Card>
            <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider font-abeezee mb-6 border-b border-lightSage pb-4 flex items-center justify-between">
              {t('users.detail.avis_title')}
              <Badge variant="neutral">{patient.reviews?.length || 0} Émis</Badge>
            </h4>
            <div className="space-y-6">
               {patient.reviews?.length > 0 ? patient.reviews.map((review: any) => (
                 <div key={review.id} className="flex gap-4 group border-b border-lightSage/30 pb-4 last:border-0">
                    <div className="flex-1 space-y-1">
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-charcoal">Avis sur Réservation #{review.bookingId.substring(0,6)}</span>
                          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button className="p-1.5 text-mediumSage hover:text-error transition-colors"><Flag size={14} /></button>
                             <button className="p-1.5 text-mediumSage hover:text-error transition-colors"><Trash2 size={14} /></button>
                          </div>
                       </div>
                       <div className="flex gap-0.5 text-warning mb-1">
                          {Array.from({ length: 5 }).map((_, s) => (
                            <Star key={s} size={10} className={cn(s < review.rating ? "fill-warning" : "text-lightSage")} />
                          ))}
                       </div>
                       <p className="text-xs text-secondaryCharcoal leading-relaxed font-abeezee italic">
                         "{review.text}"
                       </p>
                    </div>
                 </div>
               )) : (
                 <div className="flex flex-col items-center justify-center p-8 text-center bg-creamWhite/20 rounded-xl border border-dashed border-lightSage">
                    <p className="text-sm text-mediumSage font-abeezee">{t('users.detail.no_avis')}</p>
                 </div>
               )}
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
                <p className="text-3xl font-bold text-darkSage font-abeezee mb-1">{patient.totalSpent?.toLocaleString() || 0} {currency}</p>
                <p className="text-[10px] text-mediumSage font-bold uppercase tracking-widest">{t('users.detail.total_spent')}</p>
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
