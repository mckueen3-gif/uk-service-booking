"use client";

import { useState } from 'react';
import { redeemVoucher } from '@/app/actions/wallet';
import { Loader2, Ticket, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTranslation } from "@/components/LanguageContext";

export default function VoucherForm() {
  const { t } = useTranslation();
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;

    setLoading(true);
    setMessage(null);

    const result = await redeemVoucher(code) as any;
    setLoading(false);

    if (result.success) {
      setMessage({ text: t.rewards_hub.redeemSuccess.replace("{value}", result.value.toFixed(2)), type: 'success' });
      setCode("");
    } else {
      setMessage({ text: result.error || t.rewards_hub.redeemFailed, type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.25rem' }}>
      <div style={{ position: 'relative' }}>
        <input 
          type="text" 
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder={t.rewards_hub.placeholderCode} 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '1.25rem 1.25rem 1.25rem 3.5rem', 
            borderRadius: '16px', 
            background: '#fff', 
            border: '1.5px solid #d4af37', 
            color: '#0f172a',
            fontSize: '1.1rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            outline: 'none',
            boxShadow: '0 4px 15px rgba(184, 134, 11, 0.08)',
            transition: 'all 0.3s ease'
          }}
          className="focus-gold-glow"
        />
        <Ticket size={24} color="#d4af37" style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.8 }} />
      </div>
      
      <button 
        type="submit" 
        disabled={loading || !code}
        style={{ 
          width: '100%', 
          padding: '1.25rem', 
          borderRadius: '16px', 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '0.75rem',
          background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)',
          color: '#000',
          fontSize: '1.1rem',
          fontWeight: 900,
          border: 'none',
          cursor: loading || !code ? 'not-allowed' : 'pointer',
          boxShadow: '0 10px 20px rgba(212,175,55,0.2)',
          transition: 'all 0.3s ease'
        }}
        className="hover-brighten"
      >
        {loading ? <Loader2 size={20} className="animate-spin" /> : t.rewards_hub.redeemBtn}
      </button>

      {message && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          padding: '1rem 1.25rem', 
          borderRadius: '12px', 
          fontSize: '0.95rem',
          fontWeight: 700,
          backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: message.type === 'success' ? '#22c55e' : '#ef4444',
          border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`
        }} className="animate-fade-up">
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}
    </form>
  );
}
