"use client";

import { useState, useEffect } from "react";
import { 
  Sparkles, 
  Wand2, 
  ShieldCheck, 
  Zap, 
  Info, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  MessageSquare,
  Coffee,
  Brain
} from "lucide-react";
import { getMerchantDashboardStats, updateFeatureToggle, updateAISettings } from "@/app/actions/merchant_dashboard";
import { useTranslation } from "@/components/LanguageContext";

export default function AISecretaryPage() {
  const { t } = useTranslation();
  const tkDict = (t as any).merchant.toolkit;
  
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [knowledgeBase, setKnowledgeBase] = useState("");
  const [tone, setTone] = useState("professional");
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function load() {
      const res = await getMerchantDashboardStats();
      if (!res.error) {
        setStats(res);
        setKnowledgeBase(res.aiKnowledgeBase || "");
        setTone(res.pricingPackages?.aiSettings?.tone || "professional");
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleToggle = async () => {
    const currentStatus = !!stats?.featureFlags?.aura_secretary;
    setToggling(true);
    const res = await updateFeatureToggle("aura_secretary", !currentStatus);
    if (res.success) {
      setStats((prev: any) => ({
        ...prev,
        featureFlags: {
          ...prev.featureFlags,
          aura_secretary: !currentStatus
        }
      }));
    } else {
      setMessage({ type: 'error', text: res.error || "Failed to toggle AI Secretary." });
    }
    setToggling(false);
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    const res = await updateAISettings({
      aiKnowledgeBase: knowledgeBase,
      aiTone: tone
    });
    if (res.success) {
      setMessage({ type: 'success', text: s.success_update });
      setTimeout(() => setMessage(null), 5000);
    } else {
      setMessage({ type: 'error', text: res.error || "Failed to update settings." });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <Loader2 className="animate-spin" size={32} color="#d4af37" />
      </div>
    );
  }

  const isActive = !!stats?.featureFlags?.aura_secretary;
  const s = t.merchant_dashboard.ai_secretary;

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
            <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.75rem', borderRadius: '16px' }}>
              <Sparkles size={28} color="#d4af37" />
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>{s.title} <span style={{ color: 'var(--accent-color)' }}>{s.subtitle}</span></h1>
          </div>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
            {s.desc}
          </p>
        </div>

        <div style={{ 
          backgroundColor: 'var(--surface-1)', 
          padding: '1.5rem', 
          borderRadius: '24px', 
          border: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div>
            <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{s.status_label}</p>
            <p style={{ fontSize: '1.1rem', fontWeight: 900, color: isActive ? '#10b981' : 'var(--text-muted)' }}>
              {isActive ? s.online : s.offline}
            </p>
          </div>
          <Switch isOn={isActive} onToggle={handleToggle} color="#d4af37" disabled={toggling} />
        </div>
      </header>

      {message && (
        <div style={{ 
          padding: '1rem 1.5rem', 
          borderRadius: '16px', 
          backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: message.type === 'success' ? '#22c55e' : '#ef4444',
          border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'slideDown 0.4s ease-out'
        }}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span style={{ fontWeight: 700 }}>{message.text}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem', alignItems: 'start' }}>
        <div style={{ display: 'grid', gap: '2rem' }}>
          {/* Knowledge Base */}
          <section style={{ backgroundColor: 'var(--surface-1)', borderRadius: '28px', border: '1px solid var(--border-color)', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <Brain size={24} color="#d4af37" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{s.knowledge_base_title}</h2>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
              {s.knowledge_base_desc}
            </p>
            <textarea 
              value={knowledgeBase}
              onChange={(e) => setKnowledgeBase(e.target.value)}
              placeholder={s.knowledge_placeholder}
              style={{ 
                width: '100%', 
                minHeight: '200px', 
                padding: '1.25rem', 
                borderRadius: '18px', 
                backgroundColor: 'var(--bg-primary)', 
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                lineHeight: 1.6,
                fontFamily: 'inherit',
                resize: 'vertical'
              }}
            />
          </section>

          {/* Persona Settings */}
          <section style={{ backgroundColor: 'var(--surface-1)', borderRadius: '28px', border: '1px solid var(--border-color)', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
              <MessageSquare size={24} color="#d4af37" />
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{s.persona_title}</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
              {[
                { id: 'professional', label: s.persona_professional, icon: <ShieldCheck size={18} /> },
                { id: 'friendly', label: s.persona_friendly, icon: <Coffee size={18} /> },
                { id: 'concise', label: s.persona_concise, icon: <Zap size={18} /> }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  style={{
                    padding: '1rem',
                    borderRadius: '16px',
                    border: tone === t.id ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                    backgroundColor: tone === t.id ? 'rgba(212, 175, 55, 0.1)' : 'var(--bg-primary)',
                    color: tone === t.id ? 'var(--accent-color)' : 'var(--text-secondary)',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'all 0.2s'
                  }}
                >
                  {t.icon}
                  {t.label}
                </button>
              ))}
            </div>
          </section>

          <button 
            onClick={handleSaveSettings}
            disabled={saving}
            style={{ 
              backgroundColor: 'var(--accent-color)', 
              color: 'black', 
              padding: '1.25rem', 
              borderRadius: '18px', 
              border: 'none', 
              fontSize: '1.1rem', 
              fontWeight: 800, 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              transition: 'all 0.3s'
            }}
            className="btn-save"
          >
            {saving ? <Loader2 size={24} className="animate-spin" /> : <><Save size={20} /> {s.deploy_button}</>}
          </button>
        </div>

        <aside style={{ display: 'grid', gap: '2rem' }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '28px', padding: '2rem', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="#d4af37" /> {s.impact_title}
            </h3>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{s.impact_inquiries}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 900 }}>24</p>
                <p style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>+12% this week</p>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{s.impact_revenue}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 900 }}>£1,240</p>
                <p style={{ fontSize: '0.75rem', color: '#d4af37', fontWeight: 700 }}>{s.impact_conversion}</p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.05)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem' }}>
              <Info size={18} color="#d4af37" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{s.security_policy_title}</p>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              {s.security_policy_desc}
            </p>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2);
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function Switch({ isOn, onToggle, color, disabled }: { isOn: boolean, onToggle: () => void, color: string, disabled?: boolean }) {
  return (
    <div 
      onClick={() => !disabled && onToggle()}
      style={{
        width: '56px',
        height: '32px',
        borderRadius: '24px',
        backgroundColor: isOn ? color : 'var(--bg-secondary)',
        padding: '4px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isOn ? 'flex-end' : 'flex-start',
        border: '1px solid var(--border-color)',
        opacity: disabled ? 0.5 : 1
      }}
    >
      <div style={{
        width: '24px',
        height: '24px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }} />
    </div>
  );
}
