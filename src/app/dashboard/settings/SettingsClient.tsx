"use client";

import React, { useState } from 'react';
import { 
  Globe, 
  Wallet, 
  Users, 
  UserPlus, 
  Trash2,
  AlertCircle
} from "lucide-react";
import { t } from "@/lib/i18n";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

type SettingsSection = 'general' | 'financials' | 'team';

interface SettingsClientProps {
  initialSettings: any;
  teamMembers: any[];
}

export default function SettingsClient({ initialSettings, teamMembers }: SettingsClientProps) {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [hasChanges, setHasChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState(initialSettings);

  const handleToggle = (key: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: !prev[key] }));
    setHasChanges(true);
  };

  const handleInputChange = (key: string, value: string) => {
    setSettings((prev: any) => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const discardChanges = () => {
    setSettings(initialSettings);
    setHasChanges(false);
  };

  const saveChanges = async () => {
    try {
      setIsSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to save settings');

      setHasChanges(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la sauvegarde des paramètres.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-32">
      <section>
        <h1 className="text-4xl font-bold font-abeezee text-charcoal mb-2 tracking-tight">
          {t('settings.title')}
        </h1>
        <p className="text-mediumSage text-lg font-abeezee leading-relaxed max-w-xl">
          {t('settings.subtitle')}
        </p>
      </section>

      <div className="flex flex-col md:flex-row gap-12 mt-6">
        <aside className="w-full md:w-64 shrink-0 space-y-1">
          <NavButton 
            active={activeSection === 'general'} 
            onClick={() => setActiveSection('general')} 
            icon={Globe} 
            label={t('settings.nav_general')} 
          />
          <NavButton 
            active={activeSection === 'financials'} 
            onClick={() => setActiveSection('financials')} 
            icon={Wallet} 
            label={t('settings.nav_financials')} 
          />
          <NavButton 
            active={activeSection === 'team'} 
            onClick={() => setActiveSection('team')} 
            icon={Users} 
            label={t('settings.nav_team')} 
          />
        </aside>

        <main className="flex-1 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
          
          {activeSection === 'general' && (
            <div className="space-y-6">
              <Card className="p-0 overflow-hidden shadow-sm border-lightSage">
                <div className="p-6 border-b border-lightSage bg-creamWhite/20">
                  <h3 className="font-bold text-charcoal font-abeezee uppercase tracking-wider text-sm">
                    {t('settings.general.title')}
                  </h3>
                </div>
                <div className="p-6 space-y-8">
                  <SettingToggle 
                    title={t('settings.general.guest_mode')}
                    description={t('settings.general.guest_mode_sub')}
                    enabled={settings.guestMode}
                    onToggle={() => handleToggle('guestMode')}
                  />
                  <div className="h-px bg-lightSage" />
                  <SettingToggle 
                    title={t('settings.general.maintenance_mode')}
                    description={t('settings.general.maintenance_mode_sub')}
                    enabled={settings.maintenanceMode}
                    onToggle={() => handleToggle('maintenanceMode')}
                    variant="warning"
                  />
                  <div className="h-px bg-lightSage" />
                  <SettingToggle 
                    title={t('settings.general.therapist_onboarding')}
                    description={t('settings.general.therapist_onboarding_sub')}
                    enabled={settings.therapistOnboarding}
                    onToggle={() => handleToggle('therapistOnboarding')}
                  />
                </div>
              </Card>
            </div>
          )}

          {activeSection === 'financials' && (
            <div className="space-y-6">
              <Card className="p-0 overflow-hidden shadow-sm border-lightSage">
                <div className="p-6 border-b border-lightSage bg-creamWhite/20">
                  <h3 className="font-bold text-charcoal font-abeezee uppercase tracking-wider text-sm">
                    {t('settings.financials.title')}
                  </h3>
                </div>
                <div className="p-6 space-y-8">
                  <SettingInput 
                    label={t('settings.financials.commission_label')}
                    description={t('settings.financials.commission_sub')}
                    value={settings.commission}
                    onChange={(val) => handleInputChange('commission', val)}
                    suffix="%"
                  />
                  <div className="h-px bg-lightSage" />
                  <SettingInput 
                    label={t('settings.financials.min_price_label')}
                    description={t('settings.financials.min_price_sub')}
                    value={settings.minPrice}
                    onChange={(val) => handleInputChange('minPrice', val)}
                    suffix={t('common.currency')}
                  />
                </div>
              </Card>
            </div>
          )}

          {activeSection === 'team' && (
            <div className="space-y-6">
              <Card className="p-0 overflow-hidden shadow-sm border-lightSage">
                <div className="p-6 border-b border-lightSage bg-creamWhite/20 flex justify-between items-center">
                  <h3 className="font-bold text-charcoal font-abeezee uppercase tracking-wider text-sm">
                    {t('settings.team.title')}
                  </h3>
                  <Button variant="outline" className="h-9 gap-2 text-xs border-darkSage/20 text-darkSage hover:bg-darkSage/5">
                    <UserPlus size={14} />
                    {t('settings.team.invite_btn')}
                  </Button>
                </div>
                <div className="p-6 space-y-4">
                  {teamMembers.map((member) => (
                    <TeamMember 
                      key={member.id}
                      name={member.name} 
                      email={member.email} 
                      role={t('settings.team.role_super')} 
                    />
                  ))}
                </div>
              </Card>
            </div>
          )}

        </main>
      </div>

      {hasChanges && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-8 duration-500">
          <div className="bg-charcoal text-white rounded-2xl px-8 py-5 shadow-2xl flex items-center gap-10 border border-white/10 backdrop-blur-lg">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-warning" />
              <span className="text-sm font-bold font-abeezee tracking-wide whitespace-nowrap">
                {t('settings.unsaved_changes')}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={discardChanges}
                disabled={isSaving}
                className="text-sm font-bold text-brokenWhite/60 hover:text-white transition-colors disabled:opacity-50"
              >
                {t('settings.discard')}
              </button>
              <Button 
                onClick={saveChanges}
                isLoading={isSaving}
                className="bg-darkSage hover:bg-darkSage/90 px-6 py-2.5 h-auto text-sm"
              >
                {t('settings.save')}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const NavButton = ({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) => (
  <button 
    onClick={onClick}
    className={cn(
      "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-bold text-sm font-abeezee text-left",
      active 
        ? "bg-darkSage text-white shadow-lg shadow-darkSage/10" 
        : "text-mediumSage hover:bg-lightSage/50 hover:text-darkSage"
    )}
  >
    <Icon size={18} />
    {label}
  </button>
);

const SettingToggle = ({ title, description, enabled, onToggle, variant = 'primary' }: { title: string, description: string, enabled: boolean, onToggle: () => void, variant?: 'primary' | 'warning' }) => (
  <div className="flex items-center justify-between gap-8 group">
    <div className="space-y-1">
      <h4 className="text-sm font-bold text-charcoal font-abeezee">{title}</h4>
      <p className="text-xs text-mediumSage leading-relaxed max-w-md">{description}</p>
    </div>
    <button 
      onClick={onToggle}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
        enabled 
          ? (variant === 'warning' ? "bg-warning" : "bg-darkSage") 
          : "bg-lightSage"
      )}
    >
      <span 
        className={cn(
          "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
          enabled ? "translate-x-5" : "translate-x-0"
        )} 
      />
    </button>
  </div>
);

const SettingInput = ({ label, description, value, onChange, suffix }: { label: string, description: string, value: string, onChange: (v: string) => void, suffix?: string }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
    <div className="space-y-1">
      <h4 className="text-sm font-bold text-charcoal font-abeezee">{label}</h4>
      <p className="text-xs text-mediumSage leading-relaxed max-w-md">{description}</p>
    </div>
    <div className="flex items-center gap-3">
      <div className="bg-creamWhite border border-lightSage rounded-2xl px-4 py-3 flex items-center min-w-[100px] shadow-inner">
        <input 
          type="text" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-right font-bold text-charcoal focus:outline-none font-abeezee text-lg"
        />
      </div>
      {suffix && (
        <span className="text-xs font-bold text-mediumSage uppercase tracking-widest min-w-[20px]">
          {suffix}
        </span>
      )}
    </div>
  </div>
);

const TeamMember = ({ name, email, role, isCurrent }: { name: string, email: string, role: string, isCurrent?: boolean }) => (
  <div className="flex items-center justify-between p-4 rounded-2xl hover:bg-lightSage/20 transition-all group">
    <div className="flex items-center gap-4">
      <div className="w-10 h-10 rounded-full bg-lightSage flex items-center justify-center text-darkSage font-bold text-xs group-hover:bg-white transition-colors">
        {name.charAt(0)}
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-charcoal font-abeezee">{name}</span>
          {isCurrent && <Badge variant="sage" className="text-[8px] py-0 px-1.5 uppercase">Vous</Badge>}
        </div>
        <span className="text-xs text-mediumSage font-medium font-abeezee">{email}</span>
      </div>
    </div>
    <div className="flex items-center gap-4">
      <span className="text-[10px] font-bold text-mediumSage uppercase tracking-widest">{role}</span>
      {!isCurrent && (
        <button className="p-2 text-mediumSage hover:text-error opacity-0 group-hover:opacity-100 transition-all">
          <Trash2 size={16} />
        </button>
      )}
    </div>
  </div>
);
