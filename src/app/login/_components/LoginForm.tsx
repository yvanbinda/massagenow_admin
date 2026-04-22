"use client";

import React, { useState } from 'react';
import { useRouter } from "next/navigation";
import { Mail, Lock, AlertCircle } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

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
      // 1. Sign in with Firebase Client SDK
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      // 2. Send token to our secure API to bake the Session Cookie
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Authentication failed on server.");
      }

      // 3. Success! Redirect to dashboard
      router.push("/dashboard");
      router.refresh(); // Refresh to ensure layout server component picks up the cookie

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "An unexpected error occurred.");
      // Optional: Sign out from client if server failed
      await auth.signOut();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-abeezee font-bold text-charcoal mb-2">
          Accès Sécurisé
        </h2>
        <p className="text-mediumSage">
          Identifiez-vous pour accéder au centre de commande.
        </p>
      </div>

      {error && (
        <div className="bg-error/10 border border-error/20 p-4 rounded-xl flex items-center gap-3 text-error animate-in fade-in zoom-in duration-200">
          <AlertCircle size={20} />
          <p className="text-xs font-bold font-abeezee">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          type="email"
          label="Email de l'administrateur"
          placeholder="admin@massagenow.com"
          icon={<Mail size={18} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isLoading}
        />

        <Input
          id="password"
          type="password"
          label="Mot de passe"
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
          Se connecter au tableau de bord
        </Button>
      </form>

      <div className="pt-8 text-center">
        <p className="text-sm text-mediumSage italic font-abeezee">
          "L'excellence n'est pas une compétence. C'est une attitude."
        </p>
      </div>
    </div>
  );
};
