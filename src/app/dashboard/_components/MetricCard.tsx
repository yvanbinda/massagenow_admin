import React from 'react';
import { LucideIcon } from "lucide-react";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  bgColor: string;
  borderColor: string;
  iconBgColor: string;
  iconColor: string;
  trend?: {
    value: string;
    isUp: boolean;
    color: string;
  };
  subtitle?: string;
  subtitleColor?: string;
}

export const MetricCard = ({ 
  title, 
  value, 
  icon: Icon, 
  bgColor,
  borderColor,
  iconBgColor, 
  iconColor, 
  trend, 
  subtitle,
  subtitleColor = "text-secondaryCharcoal"
}: MetricCardProps) => {
  return (
    <div className={cn(
      "rounded-2xl border p-6 transition-all hover:scale-[1.02] duration-300 group",
      bgColor,
      borderColor
    )}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-xl shadow-sm", iconBgColor)}>
          <Icon className={iconColor} size={20} />
        </div>
        <span className="text-[10px] font-bold font-abeezee text-charcoal/60 uppercase tracking-[0.15em] pt-1">
          {title}
        </span>
      </div>

      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-charcoal font-abeezee tracking-tight">
          {value}
        </h3>
        
        <div className="flex items-center gap-1.5 pt-1">
          {trend ? (
            <span className={cn("text-[11px] font-bold font-abeezee flex items-center", trend.color)}>
              {trend.isUp ? '↑' : '↓'} {trend.value}
            </span>
          ) : null}
          
          {subtitle && (
            <span className={cn("text-[11px] font-medium font-abeezee opacity-70", subtitleColor)}>
              {subtitle}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
