import React from 'react';

export const DashboardHeader = () => {
  return (
    <header className="flex justify-between items-center mb-12">
      <div>
        <h2 className="text-sm font-abeezee uppercase tracking-[0.2em] text-mediumSage mb-1">
          Super Admin Console
        </h2>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-sageGreen animate-pulse" />
          <span className="text-xs font-abeezee text-darkSage font-medium uppercase tracking-widest">
            System Active
          </span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col items-end mr-2 hidden md:block">
           <span className="text-sm font-bold text-charcoal font-abeezee">Admin User</span>
           <span className="text-xs text-mediumSage font-abeezee">Super Power</span>
        </div>
        <div className="w-10 h-10 rounded-full bg-brokenWhite flex items-center justify-center text-darkSage font-bold font-abeezee border border-darkSage/10 shadow-sm cursor-pointer hover:border-sageGreen transition-colors">
          AD
        </div>
      </div>
    </header>
  );
};
