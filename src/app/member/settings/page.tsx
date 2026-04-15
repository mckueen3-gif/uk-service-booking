"use client";

import { Settings } from "lucide-react";
import { useTranslation } from "@/components/LanguageContext";

export default function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="animate-fade-up">
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{t?.settings?.title || "Settings"}</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>{t?.settings?.subtitle || "Manage your notification preferences, password security, and system settings."}</p>
      
      <div className="glass-panel" style={{ padding: '4rem 2rem', borderRadius: '16px', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', border: '2px dashed var(--border-color)' }}>
         <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
           <Settings size={32} color="#94a3b8" />
         </div>
         <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>{t?.common?.comingSoon || "Coming Soon"}</h2>
         <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>{t?.settings?.comingSoonDesc || "Advanced modules including email notifications and multi-factor authentication (MFA) are being integrated to provide bank-grade account protection."}</p>
      </div>
    </div>
  );
}
