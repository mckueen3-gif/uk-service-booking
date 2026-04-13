"use client";

import { useState } from 'react';
import { updateBankDetails } from '@/app/actions/finance';
import { Loader2, Landmark, CheckCircle2, ShieldCheck, CreditCard, Info } from 'lucide-react';

interface BankFormProps {
  initialSortCode?: string;
  initialAccountNumber?: string;
}

import { useTranslation } from '@/components/LanguageContext';

export default function BankForm({ initialSortCode = "", initialAccountNumber = "" }: BankFormProps) {
  const { t } = useTranslation();
  const [sortCode, setSortCode] = useState(initialSortCode);
  const [accountNumber, setAccountNumber] = useState(initialAccountNumber);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaved(false);

    const result = await updateBankDetails(sortCode, accountNumber);
    setLoading(false);

    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '0.875rem 1rem',
    borderRadius: '14px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(212, 175, 55, 0.15)',
    color: '#fff',
    fontSize: '1rem',
    fontWeight: 500,
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
    fontFamily: 'monospace',
    letterSpacing: '1px'
  };

  const labelStyle = {
    fontSize: '0.7rem',
    fontWeight: 800,
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.1em',
    marginBottom: '0.5rem',
    display: 'block'
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#fff' }}>
          <Landmark size={20} color="#d4af37" /> {t.merchant.merchant_wallet.banking.title}
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.7rem', color: '#666', fontWeight: 700, textTransform: 'uppercase' }}>
          <ShieldCheck size={14} color="#059669" /> {t.merchant.merchant_wallet.banking.encrypted}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ gridColumn: 'span 1' }}>
          <label style={labelStyle}>{t.merchant.merchant_wallet.banking.sortCode}</label>
          <div style={{ position: 'relative' }}>
            <input 
              type="text" 
              placeholder="XX-XX-XX" 
              value={sortCode}
              onChange={(e) => setSortCode(e.target.value)}
              style={inputStyle}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#d4af37';
                e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)';
                e.currentTarget.style.boxShadow = '0 0 0 4px rgba(212, 175, 55, 0.1)';
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)';
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            />
          </div>
        </div>
        <div style={{ gridColumn: 'span 1' }}>
          <label style={labelStyle}>{t.merchant.merchant_wallet.banking.accountNumber}</label>
          <input 
            type="text" 
            placeholder="XXXXXXXX" 
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            style={inputStyle}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = '#d4af37';
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)';
              e.currentTarget.style.boxShadow = '0 0 0 4px rgba(212, 175, 55, 0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          />
        </div>
      </div>
      
      <p style={{ fontSize: '0.75rem', color: '#555', marginTop: '-0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Info size={14} /> {t.merchant.merchant_wallet.banking.tip}
      </p>

      <button 
        type="submit" 
        disabled={loading}
        style={{ 
          backgroundColor: saved ? 'rgba(5, 150, 105, 0.1)' : 'transparent', 
          color: saved ? '#10b981' : '#d4af37', 
          border: `1px solid ${saved ? '#10b981' : '#d4af37'}`, 
          padding: '0.875rem', 
          borderRadius: '14px', 
          fontWeight: 900, 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.6rem',
          transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          fontSize: '0.95rem',
          textTransform: 'uppercase',
          letterSpacing: '0.05em'
        }}
        onMouseOver={(e) => {
          if (!saved) {
            e.currentTarget.style.backgroundColor = '#d4af37';
            e.currentTarget.style.color = '#000';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(212, 175, 55, 0.25)';
          }
        }}
        onMouseOut={(e) => {
          if (!saved) {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#d4af37';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }
        }}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={20} />
        ) : saved ? (
          <>
            <CheckCircle2 size={20} /> {t.merchant.merchant_wallet.banking.saved}
          </>
        ) : (
          <>
            <CreditCard size={20} /> {t.merchant.merchant_wallet.banking.update}
          </>
        )}
      </button>
    </form>
  );
}
