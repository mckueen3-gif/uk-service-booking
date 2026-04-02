"use client";

import { useState } from 'react';
import { redeemVoucher } from '@/app/actions/wallet';
import { Loader2, Ticket, CheckCircle2, AlertCircle } from 'lucide-react';

export default function VoucherForm() {
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
      setMessage({ text: `成功兌換 £${result.value.toFixed(2)} 點數！`, type: 'success' });
      setCode("");
    } else {
      setMessage({ text: result.error || "兌換失敗", type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ position: 'relative' }}>
        <input 
          type="text" 
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="例如: SAVE20, UKPROMO..." 
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '1rem 1rem 1rem 3rem', 
            borderRadius: '12px', 
            border: '2px solid #f1f5f9', 
            fontSize: '1rem',
            fontWeight: 600,
            textTransform: 'uppercase'
          }}
        />
        <Ticket size={20} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
      </div>
      
      <button 
        type="submit" 
        disabled={loading || !code}
        className="btn btn-primary"
        style={{ width: '100%', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : "立即兌換"}
      </button>

      {message && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.6rem', 
          padding: '1rem', 
          borderRadius: '10px', 
          fontSize: '0.9rem',
          fontWeight: 600,
          backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
          color: message.type === 'success' ? '#d4af37' : '#dc2626',
          border: `1px solid ${message.type === 'success' ? '#facc15' : '#fca5a5'}`
        }} className="animate-fade-up">
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}
    </form>
  );
}
