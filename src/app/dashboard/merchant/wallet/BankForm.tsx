"use client";

import { useState } from 'react';
import { updateBankDetails } from '@/app/actions/finance';
import { Loader2, Landmark, CheckCircle2 } from 'lucide-react';

interface BankFormProps {
  initialSortCode?: string;
  initialAccountNumber?: string;
}

export default function BankForm({ initialSortCode = "", initialAccountNumber = "" }: BankFormProps) {
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

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Landmark size={18} /> 指定銀行帳戶 (UK Bank Account)
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '0.75rem' }}>
        <div style={{ display: 'grid', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>SORT CODE</label>
          <input 
            type="text" 
            placeholder="00-00-00" 
            value={sortCode}
            onChange={(e) => setSortCode(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 600 }}
          />
        </div>
        <div style={{ display: 'grid', gap: '0.4rem' }}>
          <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>ACCOUNT NUMBER</label>
          <input 
            type="text" 
            placeholder="12345678" 
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #e2e8f0', fontSize: '0.9rem', fontWeight: 600 }}
          />
        </div>
      </div>
      
      <button 
        type="submit" 
        disabled={loading}
        style={{ 
          backgroundColor: saved ? '#facc15' : 'var(--text-primary)', 
          color: 'white', 
          border: 'none', 
          padding: '0.75rem', 
          borderRadius: '10px', 
          fontWeight: 700, 
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          transition: 'all 0.3s'
        }}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : saved ? <><CheckCircle2 size={18} /> 已儲存</> : "儲存銀行資訊"}
      </button>
    </form>
  );
}
