import React from 'react';
import { Card } from "@/components/ui/Card";
import { Activity } from "lucide-react";

export const ActivityChart = () => {
  return (
    <Card className="h-[400px] flex flex-col justify-center items-center text-center p-12 bg-white/50 border-dashed border-2 border-brokenWhite">
      <div className="w-16 h-16 bg-creamWhite rounded-full flex items-center justify-center mb-6">
        <Activity className="text-brokenWhite" size={32} />
      </div>
      <h4 className="text-xl font-bold font-abeezee text-charcoal mb-2 tracking-tight">
        Platform Activity Chart
      </h4>
      <p className="text-mediumSage max-w-xs font-abeezee text-sm leading-relaxed">
        Visualization of daily booking spikes and therapist availability will be rendered here.
      </p>
    </Card>
  );
};
