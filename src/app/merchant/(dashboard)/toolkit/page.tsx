"use client";

import { useState, useEffect } from "react";
import { 
  Wand2, 
  Tag, 
  Calculator, 
  Zap, 
  ShieldCheck, 
  Info,
  ChevronRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Share2,
  MessageSquare,
  Search
} from "lucide-react";
import { getMerchantDashboardStats, updateFeatureToggle } from "@/app/actions/merchant_dashboard";
import { useTranslation } from "@/components/LanguageContext";
import Link from "next/link";

export default function ToolkitPortal() {
  const { t } = useTranslation();
  const tkDict = (t as any).merchant.toolkit;
  
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const res = await getMerchantDashboardStats();
      if (!res.error) setStats(res);
      setLoading(false);
    }
    load();
  }, []);

  const handleToggle = async (feature: string, currentStatus: boolean) => {
    setToggling(feature);
    const res = await updateFeatureToggle(feature, !currentStatus);
    if (res.success) {
      setStats((prev: any) => ({
        ...prev,
        featureFlags: {
          ...prev.featureFlags,
          [feature]: !currentStatus
        }
      }));
    } else {
      alert(res.error || "Failed to update feature state.");
    }
    setToggling(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', backgroundColor: 'var(--bg-primary)' }}>
        <Loader2 className="animate-spin" size={32} color="#d4af37" />
      </div>
    );
  }

  const modules = [
    {
      id: "aura_secretary",
      icon: <Wand2 size={24} />,
      title: tkDict.modules.aura_secretary.title,
      desc: tkDict.modules.aura_secretary.desc,
      impact: tkDict.modules.aura_secretary.impact,
      color: "#d4af37",
      active: !!stats?.featureFlags?.aura_secretary,
      link: "/merchant/ai-secretary"
    },
    {
      id: "promotion_hub",
      icon: <Tag size={24} />,
      title: tkDict.modules.promotion_hub.title,
      desc: tkDict.modules.promotion_hub.desc,
      impact: tkDict.modules.promotion_hub.impact,
      color: "#38bdf8",
      active: !!stats?.featureFlags?.promotion_hub,
      link: "/merchant/promotions"
    },
    {
      id: "accounting_ledger",
      icon: <Calculator size={24} />,
      title: tkDict.modules.accounting_ledger.title,
      desc: tkDict.modules.accounting_ledger.desc,
      impact: tkDict.modules.accounting_ledger.impact,
      color: "#10b981",
      active: !!stats?.featureFlags?.accounting_ledger,
      link: "/merchant/accounting"
    },
    {
      id: "social_toolkit",
      icon: <Share2 size={24} />,
      title: tkDict.modules.social_toolkit.title,
      desc: tkDict.modules.social_toolkit.desc,
      impact: tkDict.modules.social_toolkit.impact,
      color: "#f472b6",
      active: !!stats?.featureFlags?.social_toolkit,
      link: "/merchant/toolkit/social"
    },
    {
      id: "ai_diagnosis",
      icon: <Sparkles size={24} />,
      title: tkDict.modules.ai_diagnosis.title,
      desc: tkDict.modules.ai_diagnosis.desc,
      impact: tkDict.modules.ai_diagnosis.impact,
      color: "#3b82f6",
      active: true,
      link: "/merchant/toolkit/diagnosis"
    },
    {
      id: "whatsapp_connect",
      icon: <MessageSquare size={24} />,
      title: tkDict.modules.whatsapp_connect.title,
      desc: tkDict.modules.whatsapp_connect.desc,
      impact: tkDict.modules.whatsapp_connect.impact,
      color: "#10b981",
      active: true,
      link: "/merchant/toolkit/whatsapp"
    },
    {
      id: "seo_expert",
      icon: <Search size={24} />,
      title: tkDict.modules.seo_expert.title,
      desc: tkDict.modules.seo_expert.desc,
      impact: tkDict.modules.seo_expert.impact,
      color: "#f59e0b",
      active: true,
      link: "/merchant/toolkit/seo"
    },
    {
      id: "audit_vault",
      icon: <ShieldCheck size={24} />,
      title: tkDict.modules.audit_vault.title,
      desc: tkDict.modules.audit_vault.desc,
      impact: tkDict.modules.audit_vault.impact,
      color: "#8b5cf6",
      active: !!stats?.featureFlags?.audit_vault,
      link: "/merchant/toolkit/vault"
    }
  ];

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1100px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <header style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
          <Sparkles size={24} color="#d4af37" />
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>{tkDict.title}</h1>
        </div>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
          {tkDict.subtitle}
        </p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {modules.map((mod) => (
          <div 
            key={mod.id}
            style={{ 
              backgroundColor: 'var(--surface-1)', 
              borderRadius: '24px', 
              border: mod.active ? `1px solid ${mod.color}44` : '1px solid var(--border-color)',
              padding: '1.75rem',
              display: 'flex',
              flexDirection: 'column',
              transition: 'all 0.3s ease',
              boxShadow: mod.active ? `0 10px 30px ${mod.color}11` : 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
              <div style={{ 
                backgroundColor: mod.active ? `${mod.color}22` : 'var(--bg-secondary)', 
                padding: '0.75rem', 
                borderRadius: '16px',
                color: mod.active ? mod.color : 'var(--text-muted)'
              }}>
                {mod.icon}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 900, 
                  color: mod.active ? mod.color : 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {mod.active ? tkDict.active : tkDict.inactive}
                </span>
                <Switch 
                  isOn={mod.active} 
                  onToggle={() => handleToggle(mod.id, mod.active)} 
                  color={mod.color}
                  disabled={toggling === mod.id}
                />
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem' }}>{mod.title}</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem', flexGrow: 1 }}>
              {mod.desc}
            </p>

            <div style={{ 
              backgroundColor: 'var(--bg-secondary)', 
              padding: '0.75rem 1rem', 
              borderRadius: '14px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '10px',
              marginBottom: '1.5rem'
            }}>
              <Zap size={14} color={mod.color} />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: mod.color }}>{mod.impact}</span>
            </div>

            {mod.link && mod.active && (
              <Link 
                href={mod.link}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '8px',
                  padding: '0.85rem',
                  borderRadius: '14px',
                  backgroundColor: 'var(--bg-primary)',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  border: '1px solid var(--border-color)',
                  transition: 'all 0.2s'
                }}
                className="hover-lift"
              >
                {t?.merchant?.toolkit?.configure || "Configure Module"} <ChevronRight size={16} />
              </Link>
            )}
          </div>
        ))}
      </div>

      <footer style={{ marginTop: '4rem', padding: '2rem', borderTop: '1px solid var(--border-color)', display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '1rem', borderRadius: '50%' }}>
            <ShieldCheck size={32} color="#d4af37" />
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>{t?.merchant?.toolkit?.privacy?.title || "Elite Privacy Framework"}</h4>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', maxWidth: '500px' }}>
              {t?.merchant?.toolkit?.privacy?.desc || "ConciergeAI only activates AI specialized context when you enable these modules. Your internal business logic remains encrypted and isolated at all times."}
            </p>
          </div>
      </footer>

      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-2px);
          background-color: var(--surface-2) !important;
          border-color: var(--accent-color) !important;
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
        width: '44px',
        height: '24px',
        borderRadius: '20px',
        backgroundColor: isOn ? color : 'var(--bg-secondary)',
        padding: '2px',
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
        width: '20px',
        height: '20px',
        borderRadius: '50%',
        backgroundColor: '#fff',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
        transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
      }} />
    </div>
  );
}
