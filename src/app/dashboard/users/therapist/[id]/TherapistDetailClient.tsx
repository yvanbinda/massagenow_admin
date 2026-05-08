"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
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
  Flag,
  Calendar,
  AlertTriangle,
  Loader2,
  UserX
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
  const router = useRouter();
  const currency = t('common.currency');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/admin/users/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          uid: therapist.id, 
          action: 'delete',
          name: therapist.name 
        }),
      });

      if (!response.ok) throw new Error('Delete failed');

      setShowDeleteModal(false);
      router.push('/dashboard/users');
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la suppression.");
    } finally {
      setIsDeleting(false);
    }
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
               {therapist.avatarUrl ? (
                 <img src={therapist.avatarUrl} alt={therapist.name} className="w-full h-full object-cover" />
               ) : (
                 <div className="w-full h-full bg-darkSage flex items-center justify-center text-white text-3xl font-bold font-abeezee">
                   {therapist.name?.charAt(0) || 'T'}
                 </div>
               )}
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
             <Link href="/dashboard/kyc" className="w-full">
               <Button variant="outline" className="w-full gap-2 border-success/20 text-success hover:bg-success/5">
                  <ExternalLink size={14} />
                  Documents KYC
               </Button>
             </Link>
          </Card>

          <Card className="p-6 bg-error/5 border-none">
             <h4 className="text-xs font-bold text-error uppercase tracking-widest font-abeezee mb-4">
               {t('users.detail.danger_zone')}
             </h4>
             <div className="space-y-3">
                <Button variant="outline" className="w-full border-error/20 text-error hover:bg-error/10 hover:border-error/40 font-bold">
                  {t('users.detail.suspend')}
                </Button>
                <button 
                  onClick={() => setShowDeleteModal(true)}
                  className="w-full text-center text-[10px] font-bold text-error/60 hover:text-error uppercase tracking-widest transition-colors"
                >
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

          <Card>
            <h4 className="text-sm font-bold text-charcoal uppercase tracking-wider font-abeezee mb-6 border-b border-lightSage pb-4 flex items-center justify-between">
              {t('users.detail.timeline_title')}
              <Badge variant="neutral">{therapist.bookings?.length || 0} Sessions</Badge>
            </h4>
            <div className="space-y-6">
               {therapist.bookings?.length > 0 ? (
                 <div className="relative pl-6 space-y-8 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-lightSage">
                    {therapist.bookings.slice(0, 5).map((booking: any, index: number) => (
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
              <Badge variant="neutral">{therapist.reviewCount || 0} Avis</Badge>
            </h4>
            <div className="space-y-6">
               {therapist.reviews?.length > 0 ? therapist.reviews.map((review: any) => (
                 <div key={review.id} className="flex gap-4 group">
                    <div className="w-8 h-8 rounded-full bg-lightSage shrink-0 overflow-hidden">
                       {review.reviewerAvatarUrl ? (
                         <img src={review.reviewerAvatarUrl} alt={review.reviewerName} className="w-full h-full object-cover" />
                       ) : (
                         <div className="w-full h-full flex items-center justify-center text-darkSage text-[10px] font-bold">
                           {review.reviewerName?.charAt(0) || 'C'}
                         </div>
                       )}
                    </div>
                    <div className="flex-1 space-y-1">
                       <div className="flex justify-between items-center">
                          <span className="text-xs font-bold text-charcoal">{review.reviewerName}</span>
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
                       <p className="text-xs text-secondaryCharcoal leading-relaxed font-abeezee">
                         "{review.text}"
                       </p>
                       <span className="text-[9px] text-mediumSage italic">
                         {new Date(review.createdAt).toLocaleDateString('fr-FR')}
                       </span>
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
                   <p className="text-xs font-bold text-charcoal uppercase">{therapist.stripeConnectId ? t('users.detail.stripe_active') : t('users.detail.stripe_not_connected')}</p>
                   <p className={cn("text-[10px] font-bold", therapist.stripeConnectId ? "text-success" : "text-warning")}>
                      {therapist.stripeConnectId ? t('users.detail.stripe_verified') : t('users.detail.stripe_restricted')}
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
               {t('users.detail.payouts_recent')}
             </h4>
             <div className="text-center py-4 text-xs text-mediumSage italic">
                Aucun virement récent.
             </div>
          </Card>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)} />
          <div className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200 text-center">
             <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <UserX size={40} className="text-error" />
             </div>
             <h3 className="text-2xl font-bold text-charcoal font-abeezee mb-2">Confirmer la suppression</h3>
             <p className="text-mediumSage text-sm font-abeezee leading-relaxed mb-8">
               Êtes-vous sûr de vouloir supprimer <strong>{therapist.name}</strong> ? Cette action est irréversible et désactivera son accès.
             </p>
             <div className="flex flex-col gap-3">
                <Button 
                  className="w-full bg-error py-4 h-auto text-lg hover:bg-error/90" 
                  onClick={handleDelete}
                  isLoading={isDeleting}
                >
                   Oui, Supprimer le compte
                </Button>
                <button 
                  onClick={() => setShowDeleteModal(false)}
                  className="text-mediumSage font-bold text-sm uppercase tracking-widest hover:text-charcoal transition-colors py-2"
                >
                   Annuler
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
