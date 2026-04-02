"use client";

import { useState } from 'react';
import { requestWithdrawal } from '@/app/actions/finance';
import { Loader2, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react';

interface WithdrawFormProps {
  availableBalance: number;
}

export default function WithdrawForm({ availableBalance }: WithdrawFormProps) {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount < 10) {
      setMessage({ text: "最低提領金額為 £10.00 (Minimum £10.00)", type: 'error' });
      return;
    }

    if (numAmount > availableBalance) {
      setMessage({ text: "餘額不足 (Insufficient balance)", type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const result = await requestWithdrawal(numAmount);
    setLoading(false);

    if (result.success) {
      setMessage({ text: "提現申請已提交，預計 3-5 個工作日入帳。", type: 'success' });
      setAmount("");
    } else {
      setMessage({ text: result.error || "提現失敗", type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ position: 'relative' }}>
        <input 
          type="number" 
          step="0.01"
          placeholder="0.00" 
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '1rem 1rem 1rem 2.5rem', 
            borderRadius: '12px', 
            border: '2px solid #f1f5f9', 
            fontSize: '1.5rem',
            fontWeight: 800,
            color: 'var(--text-primary)'
          }}
        />
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1.25rem', fontWeight: 800, color: '#94a3b8' }}>£</span>
      </div>
      
      <button 
        type="submit" 
        disabled={loading || !amount}
        className="btn btn-primary"
        style={{ width: '100%', padding: '1rem', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <><ArrowRight size={18} /> 提交提現申請</>}
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
