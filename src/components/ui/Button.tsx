import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button = ({
  className,
  variant = 'primary',
  isLoading,
  children,
  ...props
}: ButtonProps) => {
  const variants = {
    primary: 'bg-darkSage text-white hover:bg-opacity-90 shadow-lg shadow-darkSage/20',
    secondary: 'bg-sageGreen text-white hover:bg-mediumSage',
    outline: 'border border-brokenWhite bg-transparent hover:bg-creamWhite text-charcoal',
    ghost: 'bg-transparent hover:bg-brokenWhite/20 text-mediumSage',
  };

  return (
    <button
      className={cn(
        'px-6 py-3 rounded-lg font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2',
        variants[variant],
        className
      )}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        children
      )}
    </button>
  );
};
