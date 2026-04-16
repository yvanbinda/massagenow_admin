import React from 'react';
import { ShieldCheck } from "lucide-react";
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface LogoProps {
  className?: string;
  iconSize?: number;
  showText?: boolean;
  theme?: 'light' | 'dark';
}

export const Logo = ({ 
  className, 
  iconSize = 32, 
  showText = true, 
  theme = 'dark' 
}: LogoProps) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <ShieldCheck 
        size={iconSize} 
        className={theme === 'dark' ? "text-sageGreen" : "text-darkSage"} 
      />
      {showText && (
        <span className={cn(
          "font-abeezee font-bold tracking-tight",
          theme === 'dark' ? "text-white" : "text-charcoal"
        )}>
          MassageNOW
        </span>
      )}
    </div>
  );
};
