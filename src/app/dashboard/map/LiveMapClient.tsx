"use client";

import React, { useState, useMemo } from 'react';
import { 
  Map as MapIcon, 
  Search, 
  Navigation, 
  User, 
  Clock, 
  CheckCircle2, 
  PlayCircle,
  X,
  Maximize2,
  Filter,
  Layers
} from "lucide-react";
import { t } from "@/lib/i18n";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

interface LiveMapClientProps {
  activeBookings: any[];
}

export default function LiveMapClient({ activeBookings }: LiveMapClientProps) {
  const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
  const [viewMode, setViewMode] = useState<'all' | 'in_progress'>('all');

  const filteredBookings = useMemo(() => {
    if (viewMode === 'all') return activeBookings;
    return activeBookings.filter(b => b.status === 'in_progress');
  }, [activeBookings, viewMode]);

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col gap-6">
      {/* Map Control Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-darkSage/10 rounded-lg text-darkSage">
              <MapIcon size={20} />
            </div>
            <h1 className="text-3xl font-bold font-abeezee text-charcoal tracking-tight">
              Surveillance Live
            </h1>
          </div>
          <p className="text-mediumSage text-sm font-abeezee">
            {activeBookings.length} sessions actives sur le terrain actuellement.
          </p>
        </div>

        <div className="flex bg-white p-1 rounded-xl border border-lightSage shadow-sm">
           <button 
            onClick={() => setViewMode('all')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold font-abeezee transition-all",
              viewMode === 'all' ? "bg-darkSage text-white" : "text-mediumSage hover:text-darkSage"
            )}
           >
              Toutes les sessions
           </button>
           <button 
            onClick={() => setViewMode('in_progress')}
            className={cn(
              "px-4 py-2 rounded-lg text-xs font-bold font-abeezee transition-all",
              viewMode === 'in_progress' ? "bg-darkSage text-white" : "text-mediumSage hover:text-darkSage"
            )}
           >
              En cours uniquement
           </button>
        </div>
      </section>

      {/* Main Map Visualization Area */}
      <div className="flex-1 flex gap-6 min-h-0">
        
        {/* The "Map" (Stylized Interactive Canvas) */}
        <div className="flex-1 bg-creamWhite border border-lightSage rounded-3xl relative overflow-hidden shadow-inner group">
           {/* Abstract Map Background (Zen Grid) */}
           <div className="absolute inset-0 opacity-10 pointer-events-none" 
                style={{ backgroundImage: 'radial-gradient(#546A63 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
           
           {/* Floating City Labels (Dynamic) */}
           <div className="absolute top-1/4 left-1/3 text-[10px] font-bold text-mediumSage uppercase tracking-[0.3em] opacity-30">Montréal Nord</div>
           <div className="absolute bottom-1/3 right-1/4 text-[10px] font-bold text-mediumSage uppercase tracking-[0.3em] opacity-30">Vieux Port</div>

           {/* Live Pins */}
           {filteredBookings.map((booking) => {
             // Normalized position calculation for mock visualization 
             // (In real leaflet/google maps, these would be LatLng coords)
             const left = ((booking.clientLng + 74) * 500) % 80 + 10; 
             const top = ((booking.clientLat - 45) * 500) % 80 + 10;

             return (
               <button 
                key={booking.id}
                onClick={() => setSelectedBooking(booking)}
                className={cn(
                  "absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 hover:scale-125 z-20",
                  selectedBooking?.id === booking.id ? "scale-150 z-30" : ""
                )}
                style={{ left: `${left}%`, top: `${top}%` }}
               >
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center shadow-lg border-2 border-white animate-in zoom-in duration-300",
                    booking.status === 'in_progress' ? "bg-darkSage text-white" : "bg-white text-darkSage"
                  )}>
                    {booking.status === 'in_progress' ? (
                      <PlayCircle size={18} className="animate-pulse" />
                    ) : (
                      <Navigation size={18} />
                    )}
                  </div>
                  {selectedBooking?.id === booking.id && (
                    <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-charcoal text-white text-[10px] px-2 py-1 rounded-md whitespace-nowrap font-bold shadow-xl">
                      {booking.serviceTitleSnapshot}
                    </div>
                  )}
               </button>
             );
           })}

           {/* Zoom Controls */}
           <div className="absolute bottom-6 right-6 flex flex-col gap-2">
              <MapControlButton icon={Maximize2} />
              <MapControlButton icon={Layers} />
           </div>

           {/* Empty State Overlay */}
           {filteredBookings.length === 0 && (
             <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[2px]">
                <p className="text-mediumSage font-abeezee italic">Aucune session active détectée à ce moment.</p>
             </div>
           )}
        </div>

        {/* Selected Sidebar (Details) */}
        {selectedBooking && (
          <aside className="w-80 bg-white border border-lightSage rounded-3xl p-6 shadow-xl animate-in slide-in-from-right-4 duration-300 flex flex-col">
            <div className="flex items-start justify-between mb-6">
              <Badge variant={selectedBooking.status === 'in_progress' ? "success" : "sage"}>
                {selectedBooking.status === 'in_progress' ? "Session en cours" : "Confirmée"}
              </Badge>
              <button onClick={() => setSelectedBooking(null)} className="text-mediumSage hover:text-charcoal transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-6 flex-1">
              <div>
                <h3 className="text-lg font-bold text-charcoal font-abeezee leading-tight">
                  {selectedBooking.serviceTitleSnapshot}
                </h3>
                <p className="text-sm text-mediumSage mt-1">{selectedBooking.clientAddress || 'Adresse privée'}</p>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-4 border-t border-lightSage/50">
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-lightSage flex items-center justify-center text-darkSage">
                       <User size={16} />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-mediumSage uppercase tracking-tighter">Client</p>
                       <p className="text-xs font-bold text-charcoal">Utilisateur #{selectedBooking.clientId.substring(0,6)}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-darkSage flex items-center justify-center text-white">
                       <User size={16} />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-mediumSage uppercase tracking-tighter">Thérapeute</p>
                       <p className="text-xs font-bold text-charcoal">Thérapeute #{selectedBooking.therapistId.substring(0,6)}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-creamWhite flex items-center justify-center text-mediumSage">
                       <Clock size={16} />
                    </div>
                    <div>
                       <p className="text-[10px] font-bold text-mediumSage uppercase tracking-tighter">Timing</p>
                       <p className="text-xs font-bold text-charcoal">
                          {new Date(selectedBooking.startTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} 
                          - {new Date(selectedBooking.endTime).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                       </p>
                    </div>
                 </div>
              </div>
            </div>

            <div className="pt-6 border-t border-lightSage/50">
               <button 
                onClick={() => router.push(`/dashboard/users/therapist/${selectedBooking.therapistId}`)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-darkSage text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-darkSage/90 transition-all"
               >
                  Voir le profil complet
               </button>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}

const MapControlButton = ({ icon: Icon }: { icon: any }) => (
  <button className="w-10 h-10 bg-white border border-lightSage rounded-xl flex items-center justify-center text-mediumSage hover:text-darkSage hover:shadow-md transition-all">
    <Icon size={18} />
  </button>
);
