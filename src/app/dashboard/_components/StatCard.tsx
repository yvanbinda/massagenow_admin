import React from 'react';
import { Card } from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isUp: boolean;
  };
  description?: string;
}

export const StatCard = ({ title, value, icon: Icon, trend, description }: StatCardProps) => {
  return (
    <Card className="hover:shadow-md transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-mediumSage uppercase tracking-wider mb-1 font-abeezee">
            {title}
          </p>
          <h3 className="text-3xl font-bold text-charcoal font-abeezee">
            {value}
          </h3>
        </div>
        <div className="p-3 bg-creamWhite rounded-xl border border-brokenWhite/50">
          <Icon className="text-darkSage" size={24} />
        </div>
      </div>
      
      {(trend || description) && (
        <div className="mt-6 flex items-center gap-2">
          {trend && (
            <span className={cn(
              "text-xs font-bold px-2 py-1 rounded-full font-abeezee",
              trend.isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            )}>
              {trend.isUp ? '+' : '-'}{Math.abs(trend.value)}%
            </span>
          )}
          {description && (
            <span className="text-xs text-mediumSage font-medium font-abeezee">
              {description}
            </span>
          )}
        </div>
      )}
    </Card>
  );
};
