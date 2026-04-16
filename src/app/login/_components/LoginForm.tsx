"use client";

import React from 'react';
import { useRouter } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export const LoginForm = () => {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real scenario, we would validate credentials with Firebase here.
    // For now, we simulate a successful login and redirect to the dashboard.
    router.push("/dashboard");
  };

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-abeezee font-bold text-charcoal mb-2">
          Secure Access
        </h2>
        <p className="text-mediumSage">
          Identify yourself to proceed to the command center.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          type="email"
          label="Administrator Email"
          placeholder="admin@massagenow.com"
          icon={<Mail size={18} />}
          required
        />

        <Input
          id="password"
          type="password"
          label="Password"
          placeholder="••••••••"
          icon={<Lock size={18} />}
          required
        />

        <button
          type="submit"
          className="btn-primary w-full py-4 shadow-lg shadow-darkSage/20 font-abeezee"
        >
          Sign In to Dashboard
        </button>
      </form>

      <div className="pt-8 text-center">
        <p className="text-sm text-mediumSage italic font-abeezee">
          "Excellence is not a skill. It is an attitude."
        </p>
      </div>
    </div>
  );
};
