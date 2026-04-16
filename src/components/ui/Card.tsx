import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'white' | 'glass' | 'sage';
}

export const Card = ({
  className,
  variant = 'white',
  children,
  ...props
}: CardProps) => {
  const variants = {
    white: 'bg-white border border-brokenWhite shadow-sm',
    glass: 'bg-white/80 backdrop-blur-md border border-white/20 shadow-xl',
    sage: 'bg-darkSage text-white border-none shadow-lg',
  };

  return (
    <div
      className={cn(
        'rounded-2xl p-6 transition-all',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
