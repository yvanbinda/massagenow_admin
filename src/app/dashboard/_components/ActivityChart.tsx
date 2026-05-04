import React from 'react';
import { Card } from "@/components/ui/Card";
import { t } from "@/lib/i18n";

interface ActivityChartProps {
  data?: { name: string, count: number }[];
}

export const ActivityChart = ({ data = [] }: ActivityChartProps) => {
  const maxCount = Math.max(...data.map(d => d.count), 5);

  return (
    <Card className="h-[400px] flex flex-col p-8 bg-white shadow-sm shadow-charcoal/5 border-lightSage">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h4 className="text-xl font-bold font-abeezee text-charcoal tracking-tight">
            {t('dashboard.activity.title')}
          </h4>
          <p className="text-xs text-mediumSage font-medium uppercase tracking-widest mt-1">
            7 derniers jours
          </p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-darkSage" />
              <span className="text-[10px] font-bold text-mediumSage uppercase">Réservations</span>
           </div>
        </div>
      </div>

      <div className="flex-1 flex items-end justify-between gap-2 px-2">
        {data.map((day, index) => {
          const heightPercentage = (day.count / maxCount) * 100;
          
          return (
            <div key={index} className="flex-1 flex flex-col items-center gap-3 group">
              <div className="relative w-full flex flex-col items-center justify-end h-48">
                <div className="absolute -top-8 bg-charcoal text-white text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  {day.count}
                </div>
                
                <div 
                  className="w-full max-w-[40px] bg-lightSage rounded-t-lg group-hover:bg-darkSage transition-all duration-500 ease-out"
                  style={{ height: `${heightPercentage}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-mediumSage uppercase tracking-tighter">
                {day.name}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-lightSage/50 flex justify-end items-center">
         <div className="flex gap-1">
            {[1, 2, 3].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-lightSage" />)}
         </div>
      </div>
    </Card>
  );
};
