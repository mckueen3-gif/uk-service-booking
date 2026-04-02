'use client';

import { useState } from 'react';
import { updateMerchantCommissionRate } from '@/app/actions/admin_commission';
import { RefreshCw, Check, Percent, Gift } from 'lucide-react';

export default function CommissionEditor({ 
  merchantId, 
  initialRate, 
  initialFreeOrders 
}: { 
  merchantId: string; 
  initialRate: number; 
  initialFreeOrders: number 
}) {
  const [rate, setRate] = useState(initialRate * 100);
  const [freeOrders, setFreeOrders] = useState(initialFreeOrders);
  const [isUpdating, setIsUpdating] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleUpdate = async () => {
    setIsUpdating(true);
    setStatus('idle');
    try {
      const res1 = await updateMerchantCommissionRate(merchantId, rate / 100);
      
      if (res1.success) {
        setStatus('success');
        setTimeout(() => setStatus('idle'), 3000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
      <div style={{ position: 'relative' }}>
        <input 
          type="number" 
          value={rate} 
          onChange={(e) => setRate(Number(e.target.value))}
          style={{ 
            width: '70px', 
            padding: '0.4rem 0.5rem 0.4rem 1.5rem', 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '0.5rem',
            color: 'white',
            fontSize: '0.85rem'
          }}
        />
        <Percent size={12} style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
      </div>

      {/* Free Orders Input Temporarily Disabled for Schema Sync */}
      <div style={{ position: 'relative', opacity: 0.3, cursor: 'not-allowed' }}>
        <input 
          type="number" 
          value={freeOrders} 
          disabled
          style={{ 
            width: '70px', 
            padding: '0.4rem 0.5rem 0.4rem 1.5rem', 
            background: 'rgba(255,255,255,0.05)', 
            border: '1px solid rgba(255,255,255,0.1)', 
            borderRadius: '0.5rem',
            color: 'white',
            fontSize: '0.85rem'
          }}
        />
        <Gift size={12} style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
      </div>

      <button 
        onClick={handleUpdate}
        disabled={isUpdating}
        style={{ 
          padding: '0.4rem 0.75rem', 
          background: status === 'success' ? '#facc15' : 'rgba(99, 102, 241, 0.2)', 
          border: 'none', 
          borderRadius: '0.5rem',
          color: 'white',
          cursor: isUpdating ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          fontSize: '0.8rem',
          transition: 'all 0.2s'
        }}
      >
        {isUpdating ? <RefreshCw size={14} className="animate-spin" /> : (status === 'success' ? <Check size={14} /> : '更新')}
      </button>
    </div>
  );
}
