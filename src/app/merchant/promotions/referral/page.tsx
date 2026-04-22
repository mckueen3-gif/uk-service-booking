"use client";

import { useState, useEffect } from "react";
import { 
  Users, 
  Gift, 
  ArrowRight, 
  Info, 
  Save, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  TrendingUp,
  Share2,
  Copy
} from "lucide-react";
import { getReferralVoucher, updateReferralVoucher } from "@/app/actions/merchant_dashboard";
import { useTranslation } from "@/components/LanguageContext";

export default function MerchantReferralPage() {
  const { t } = useTranslation();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [amount, setAmount] = useState(10);
  const [type, setType] = useState<'PERCENT' | 'FIXED'>('FIXED');
  const [active, setActive] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function load() {
      const res = await getReferralVoucher();
      if (!res.error && res.referralVoucher) {
        setAmount(res.referralVoucher.amount);
        setType(res.referralVoucher.type);
        setActive(res.referralVoucher.active);
      }
      setLoading(false);
    }
    load();
  }, []);

  const rp = t?.merchant_dashboard?.referral_program || t?.merchant?.referral_program || {};

  const handleSave = async () => {
    setSaving(true);
    const res = await updateReferralVoucher({ amount, type, active });
    if (res.success) {
      setMessage({ type: 'success', text: rp.success_update });
      setTimeout(() => setMessage(null), 5000);
    } else {
      setMessage({ type: 'error', text: res.error || "Failed to update campaign." });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <Loader2 className="animate-spin" size={32} color="#38bdf8" />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1000px', margin: '0 auto', color: 'var(--text-primary)' }}>
      <header style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '0.5rem' }}>
          <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.1)', padding: '0.75rem', borderRadius: '16px' }}>
            <Users size={28} color="#38bdf8" />
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900 }}>{rp.title} <span style={{ color: '#38bdf8' }}>{rp.subtitle}</span></h1>
        </div>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px' }}>
          {rp.desc}
        </p>
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
          {/* Campaign Logic */}
          <section style={{ backgroundColor: 'var(--surface-1)', borderRadius: '28px', border: '1px solid var(--border-color)', padding: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Gift size={24} color="#38bdf8" /> 
              {rp.campaign_title}
            </h2>
            
            <div style={{ display: 'grid', gap: '2rem' }}>
              <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '4px' }}>{rp.campaign_status}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{rp.campaign_status_note}</p>
                </div>
                <Switch isOn={active} onToggle={() => setActive(!active)} color="#38bdf8" />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>{rp.voucher_value}</label>
                  <div style={{ position: 'relative' }}>
                    <input 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value))}
                      style={{ 
                        width: '100%', 
                        padding: '1rem 1.25rem', 
                        borderRadius: '14px', 
                        backgroundColor: 'var(--bg-primary)', 
                        border: '1px solid var(--border-color)',
                        color: 'var(--text-primary)',
                        fontSize: '1.25rem',
                        fontWeight: 800
                      }}
                    />
                    <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: '#38bdf8' }}>
                      {type === 'FIXED' ? '£' : '%'}
                    </div>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>{rp.incentive_type}</label>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    {['FIXED', 'PERCENT'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setType(t as any)}
                        style={{
                          flex: 1,
                          padding: '1rem',
                          borderRadius: '14px',
                          border: type === t ? '1px solid #38bdf8' : '1px solid var(--border-color)',
                          backgroundColor: type === t ? 'rgba(56, 189, 248, 0.1)' : 'var(--bg-primary)',
                          color: type === t ? '#38bdf8' : 'var(--text-muted)',
                          fontWeight: 800,
                          cursor: 'pointer'
                        }}
                      >
                        {t === 'FIXED' ? 'Flat £' : 'Percent %'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  <strong>{rp.how_it_works_title}</strong> {rp.how_it_works_desc} <span style={{ color: '#38bdf8', fontWeight: 800 }}>{type === 'FIXED' ? `£${amount}` : `${amount}%`}</span>
                </p>
              </div>
            </div>
          </section>

          <button 
                onClick={handleSave}
                disabled={saving}
                style={{ 
                  backgroundColor: '#38bdf8', 
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
                {saving ? <Loader2 size={24} className="animate-spin" /> : <><Save size={20} /> {rp.deploy_btn}</>}
          </button>
        </div>

        <aside style={{ display: 'grid', gap: '2rem' }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', borderRadius: '28px', padding: '2rem', border: '1px solid var(--border-color)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="#38bdf8" /> {rp.perf_title}
            </h3>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{rp.perf_clicks}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 900 }}>142</p>
              </div>
              <div style={{ height: '1px', backgroundColor: 'var(--border-color)' }} />
              <div>
                <p style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{rp.perf_conversion}</p>
                <p style={{ fontSize: '1.75rem', fontWeight: 900 }}>8.4%</p>
                <p style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700 }}>{rp.perf_avg}</p>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: 'rgba(56, 189, 248, 0.05)', borderRadius: '24px', padding: '1.5rem', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '1rem' }}>
              <Share2 size={18} color="#38bdf8" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: '0.85rem', fontWeight: 700 }}>{rp.link_title}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input 
                readOnly 
                value={`https://concierge.ai/m/your-id?ref=elite`}
                style={{ flex: 1, backgroundColor: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}
              />
              <button style={{ padding: '0.5rem', borderRadius: '8px', border: 'none', backgroundColor: '#38bdf8', color: 'black' }}><Copy size={14}/></button>
            </div>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(56, 189, 248, 0.2);
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
