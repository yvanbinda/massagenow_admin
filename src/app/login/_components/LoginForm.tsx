"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { t } from "@/lib/i18n";

export const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. PHASE: Client Authentication
      let userCredential;
      try {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } catch (firebaseErr: any) {
        // Obfuscate technical Firebase codes
        console.warn("[Auth] Client sign-in failed:", firebaseErr.code);
        
        // This usually means wrong email/password or provider disabled
        if (firebaseErr.code === 'auth/invalid-credential' || 
            firebaseErr.code === 'auth/user-not-found' || 
            firebaseErr.code === 'auth/wrong-password') {
          throw new Error(t('login.error_invalid_credentials'));
        }
        throw new Error(t('login.error_generic'));
      }

      // 2. PHASE: Token Handshake
      const idToken = await userCredential.user.getIdToken();

      // Send token to our secure API to bake the Session Cookie
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        // If password was right, but user isn't an admin (Custom Claim check failed)
        if (response.status === 403) {
          throw new Error(t('login.error_unauthorized'));
        }
        throw new Error(data.error || t('login.error_generic'));
      }

      // 3. PHASE: Navigation
      router.push("/dashboard");
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      // Safety: sign out if partially authenticated
      await auth.signOut().catch(() => {});
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-abeezee font-bold text-charcoal mb-2">
          {t('login.title')}
        </h2>
        <p className="text-mediumSage">
          {t('login.subtitle')}
        </p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 p-4 rounded-xl flex items-center gap-3 text-error animate-in fade-in zoom-in duration-200 shadow-sm">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-xs font-bold font-abeezee leading-relaxed">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          type="email"
          label={t('login.email_label')}
          placeholder="admin@massagenow.ca"
          icon={<Mail size={18} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />

        <Input
          id="password"
          type="password"
          label={t('login.password_label')}
          placeholder="••••••••"
          icon={<Lock size={18} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isLoading}
        />

        <Button
          type="submit"
          className="w-full py-4 font-abeezee"
          isLoading={isLoading}
        >
          {t('login.button')}
        </Button>
      </form>

      <div className="pt-8 text-center">
        <p className="text-sm text-mediumSage italic font-abeezee">
          "{t('login.quote')}"
        </p>
      </div>
    </div>
  );
};
