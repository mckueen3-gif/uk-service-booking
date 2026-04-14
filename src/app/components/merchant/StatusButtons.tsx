"use client";

import { useState } from 'react';
import { updateBookingStatus } from '@/app/actions/merchant_dashboard';
import { useTranslation } from '@/components/LanguageContext';

export default function StatusButtons({ bookingId, currentStatus }: { bookingId: string, currentStatus: string }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState<string | null>(null);

  const handleUpdate = async (status: string) => {
    setLoading(status);
    try {
      await updateBookingStatus(bookingId, status);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const statusMap: Record<string, { label: string, next: string | null, color: string }> = {
    'PENDING': { 
      label: t.merchant.status.waiting, 
      next: 'IN_PROGRESS', 
      color: 'var(--accent-color)' 
    },
    'IN_PROGRESS': { 
      label: t.merchant.status.repairing, 
      next: 'FIXED', 
      color: '#f59e0b' 
    },
    'FIXED': { 
      label: t.merchant.status.ready, 
      next: 'COMPLETED', 
      color: '#facc15' 
    },
    'COMPLETED': { 
      label: t.merchant.status.completed, 
      next: null, 
      color: '#64748b' 
    },
    'CANCELLED': { 
      label: t.merchant.status.cancelled, 
      next: null, 
      color: '#ef4444' 
    }
  };

  const current = statusMap[currentStatus] || { label: currentStatus, next: null, color: 'var(--text-secondary)' };

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
       {/* Current Status Display */}
       <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.75rem', border: `1px solid ${current.color}` }}>
          <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: current.color }} className={current.next ? "animate-pulse" : ""} />
          <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{t.merchant.status.currentStatus}：{current.label}</span>
       </div>

       {/* Next Action Button */}
       {current.next && (
          <button 
            onClick={() => handleUpdate(current.next!)}
            disabled={loading !== null}
            className="btn btn-primary"
            style={{ 
               padding: '1rem', 
               fontSize: '1rem', 
               fontWeight: 800, 
               display: 'flex', 
               alignItems: 'center', 
               justifyContent: 'center', 
               gap: '0.75rem',
               backgroundColor: statusMap[current.next].color,
               border: 'none',
               boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }}
          >
             {loading ? t.merchant.status.updating : `${t.merchant.status.clickToUpdate}：${statusMap[current.next].label}`}
          </button>
       )}

       {currentStatus === 'PENDING' && (
          <button 
             onClick={() => handleUpdate('CANCELLED')}
             disabled={loading !== null}
             className="btn btn-secondary"
             style={{ opacity: 0.6, fontSize: '0.85rem' }}
          >
             {t.merchant.status.cancelBtn}
          </button>
       )}
    </div>
  );
}
