"use client";

import { useState } from 'react';
import { requestWithdrawal } from '@/app/actions/finance';
import { Loader2, ArrowRight, AlertCircle, CheckCircle2, DollarSign, Wallet } from 'lucide-react';

interface WithdrawFormProps {
  availableBalance: number;
}

import { useTranslation } from '@/components/LanguageContext';

export default function WithdrawForm({ availableBalance }: WithdrawFormProps) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);

    if (isNaN(numAmount) || numAmount < 10) {
      setMessage({ text: t.merchant.merchant_wallet.payout.minAlert, type: 'error' });
      return;
    }

    if (numAmount > availableBalance) {
      setMessage({ text: t.merchant.merchant_wallet.payout.insufficient, type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    const result = await requestWithdrawal(numAmount);
    setLoading(false);

    if (result.success) {
      setMessage({ text: t.merchant.merchant_wallet.payout.success, type: 'success' });
      setAmount("");
    } else {
      setMessage({ text: result.error || t.merchant.merchant_wallet.payout.failed, type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.merchant.merchant_wallet.payout.amount}</label>
          <span style={{ fontSize: '0.7rem', color: '#d4af37', fontWeight: 700 }}>{t.merchant.merchant_wallet.payout.max}: £{availableBalance.toFixed(2)}</span>
        </div>
        
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
              padding: '1.25rem 1.25rem 1.25rem 3.5rem', 
              borderRadius: '20px', 
              backgroundColor: 'rgba(212, 175, 55, 0.03)',
              border: '2px solid rgba(212, 175, 55, 0.2)', 
              fontSize: '2rem',
              fontWeight: 900,
              color: '#fff',
              outline: 'none',
              transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.08)';
              e.currentTarget.style.boxShadow = '0 0 30px rgba(212, 175, 55, 0.1), inset 0 2px 4px rgba(0,0,0,0.5)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.2)';
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.03)';
              e.currentTarget.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.5)';
            }}
          />
          <span style={{ 
            position: 'absolute', 
            left: '1.25rem', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            fontSize: '1.5rem', 
            fontWeight: 900, 
            color: '#d4af37',
            opacity: 0.8
          }}>£</span>
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={loading || !amount}
        style={{ 
          width: '100%', 
          padding: '1.25rem', 
          borderRadius: '16px', 
          backgroundColor: '#d4af37',
          color: '#000',
          border: 'none',
          fontSize: '1.1rem',
          fontWeight: 900,
          cursor: 'pointer',
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          gap: '0.75rem',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          boxShadow: '0 10px 20px rgba(212, 175, 55, 0.2)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow = '0 15px 30px rgba(212, 175, 55, 0.3)';
          e.currentTarget.style.filter = 'brightness(1.1)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 10px 20px rgba(212, 175, 55, 0.2)';
          e.currentTarget.style.filter = 'brightness(1)';
        }}
      >
        {loading ? <Loader2 size={22} className="animate-spin" /> : <><ArrowRight size={22} /> {t.merchant.merchant_wallet.payout.confirm}</>}
      </button>

      {message && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.8rem', 
          padding: '1.25rem', 
          borderRadius: '16px', 
          fontSize: '0.95rem',
          fontWeight: 700,
          backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: message.type === 'success' ? '#10b981' : '#ef4444',
          border: `1px solid ${message.type === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
        }} className="animate-fade-up">
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <div style={{ flex: 1 }}>{message.text}</div>
        </div>
      )}
    </form>
  );
}
