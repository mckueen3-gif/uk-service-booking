"use client";

import { useState, useEffect } from 'react';
import { 
  getMerchantCoupons, 
  createMerchantCoupon, 
  deleteMerchantCoupon 
} from '@/app/actions/merchant_dashboard';
import { 
  Plus, Trash2, Tag, Calendar, 
  Percent, CircleDollarSign, Loader2,
  CheckCircle2, AlertCircle, Sparkles,
  Info, Users, ArrowRight
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/components/LanguageContext';

export default function PromotionsPage() {
  const { t } = useTranslation();
  const p = t.merchant_dashboard.promotions;

  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'PERCENT' as 'PERCENT' | 'FIXED',
    value: 0,
    expiry: ''
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadCoupons();
  }, []);

  const loadCoupons = async () => {
    setLoading(true);
    const res = await getMerchantCoupons();
    if (res.coupons) {
      setCoupons(res.coupons);
    }
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code || newCoupon.value <= 0) return;
    
    setIsCreating(true);
    const res = await createMerchantCoupon(newCoupon);
    if (res.success) {
      setMessage({ type: 'success', text: p.success_create });
      setNewCoupon({ code: '', discountType: 'PERCENT', value: 0, expiry: '' });
      loadCoupons();
    } else {
      setMessage({ type: 'error', text: res.error || "Failed to create coupon" });
    }
    setIsCreating(false);
  };

  const handleDelete = async (id: string) => {
    const res = await deleteMerchantCoupon(id);
    if (res.success) {
      loadCoupons();
    }
  };

  return (
    <div className="promotions-wrapper" style={{ maxWidth: '1000px' }}>
      <header style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '12px', letterSpacing: '-0.02em' }}>
          {p.title} <span style={{ color: 'var(--accent-color)' }}>{p.hub}</span>
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px' }}>
          {p.desc}
        </p>

        <div style={{ marginTop: '24px', display: 'flex', gap: '16px' }}>
          <Link href="/merchant/promotions/referral" style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            padding: '12px 20px', 
            backgroundColor: 'rgba(56, 189, 248, 0.1)', 
            borderRadius: '14px', 
            color: '#38bdf8', 
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 700,
            border: '1px solid rgba(56, 189, 248, 0.2)',
            transition: 'all 0.2s'
          }} className="hover-lift">
            <Users size={18} /> {p.referral_btn} <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      {message && (
        <div style={{ 
          padding: '16px 20px', 
          borderRadius: '16px', 
          backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: message.type === 'success' ? '#22c55e' : '#ef4444',
          border: `1px solid ${message.type === 'success' ? 'rgba(34, 197, 94, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          animation: 'fadeIn 0.4s ease-out'
        }}>
          {message.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          <span style={{ fontWeight: 600 }}>{message.text}</span>
        </div>
      )}

      <div className="promotion-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '40px' }}>
        
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <Tag size={24} className="text-gold" />
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>{p.active_coupons}</h2>
            <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, var(--border-color), transparent)', marginLeft: '12px' }} />
          </div>

          {loading ? (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <Loader2 className="animate-spin" size={40} style={{ color: 'var(--accent-color)', margin: '0 auto' }} />
            </div>
          ) : coupons.length === 0 ? (
            <div style={{ 
              padding: '60px', 
              textAlign: 'center', 
              background: 'var(--glass-bg)', 
              borderRadius: '24px', 
              border: '1px dashed var(--border-color)',
              color: 'var(--text-muted)'
            }}>
              <Sparkles size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p style={{ fontSize: '1.1rem' }}>{p.no_coupons}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gap: '16px' }}>
              {coupons.map((coupon: any) => (
                <div key={coupon.id} style={{ 
                  background: 'var(--glass-bg)', 
                  padding: '24px', 
                  borderRadius: '20px', 
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  transition: 'all 0.3s'
                }} className="coupon-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ 
                      width: '64px', 
                      height: '64px', 
                      borderRadius: '16px', 
                      background: 'linear-gradient(135deg, var(--accent-color), #b8860b)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      boxShadow: '0 8px 16px rgba(212, 175, 55, 0.2)'
                    }}>
                      {coupon.discountType === 'PERCENT' ? <Percent size={28} /> : <CircleDollarSign size={28} />}
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.05em', color: 'var(--text-primary)' }}>{coupon.code}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                        {coupon.discountType === 'PERCENT' ? `${coupon.value}% Off` : `£${coupon.value} Off`}
                        {coupon.expiry && ` • Expires ${new Date(coupon.expiry).toLocaleDateString()}`}
                      </p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDelete(coupon.id)}
                    style={{ 
                      padding: '10px', 
                      borderRadius: '12px', 
                      background: 'rgba(239, 68, 68, 0.1)', 
                      color: '#ef4444',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    className="hover-shake"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <aside>
          <div style={{ 
            background: 'var(--bg-secondary)', 
            padding: '32px', 
            borderRadius: '24px', 
            border: '1px solid var(--border-color)',
            position: 'sticky',
            top: '120px'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Plus size={20} style={{ color: 'var(--accent-color)' }} /> {p.new_promo}
            </h3>

            <form onSubmit={handleCreate} style={{ display: 'grid', gap: '20px' }}>
              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>{p.code_label}</label>
                <input 
                  type="text" 
                  value={newCoupon.code}
                  onChange={e => setNewCoupon({...newCoupon, code: e.target.value.toUpperCase()})}
                  placeholder={p.code_placeholder}
                  style={{ 
                    width: '100%', 
                    padding: '14px 16px', 
                    borderRadius: '12px', 
                    background: 'var(--bg-primary)', 
                    border: '1px solid var(--border-color)',
                    fontSize: '1rem',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}
                />
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>{p.type_label}</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button 
                    type="button"
                    onClick={() => setNewCoupon({...newCoupon, discountType: 'PERCENT'})}
                    style={{ 
                      padding: '12px', 
                      borderRadius: '12px', 
                      background: newCoupon.discountType === 'PERCENT' ? 'var(--accent-color)' : 'var(--bg-primary)',
                      color: newCoupon.discountType === 'PERCENT' ? 'black' : 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {p.type_percent}
                  </button>
                  <button 
                    type="button"
                    onClick={() => setNewCoupon({...newCoupon, discountType: 'FIXED'})}
                    style={{ 
                      padding: '12px', 
                      borderRadius: '12px', 
                      background: newCoupon.discountType === 'FIXED' ? 'var(--accent-color)' : 'var(--bg-primary)',
                      color: newCoupon.discountType === 'FIXED' ? 'black' : 'var(--text-muted)',
                      border: '1px solid var(--border-color)',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    {p.type_fixed}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px' }}>{p.value_label}</label>
                <input 
                  type="number" 
                  value={newCoupon.value}
                  onChange={e => setNewCoupon({...newCoupon, value: parseFloat(e.target.value)})}
                  style={{ 
                    width: '100%', 
                    padding: '14px 16px', 
                    borderRadius: '12px', 
                    background: 'var(--bg-primary)', 
                    border: '1px solid var(--border-color)',
                    fontSize: '1rem',
                    fontWeight: 700
                  }}
                />
              </div>

              <button 
                type="submit" 
                disabled={isCreating}
                className="btn-premium"
                style={{ width: '100%', padding: '16px', marginTop: '12px' }}
              >
                {isCreating ? <Loader2 size={24} className="animate-spin" /> : p.publish_btn}
              </button>
              
              <div style={{ 
                marginTop: '16px', 
                padding: '12px', 
                background: 'rgba(212, 175, 55, 0.05)', 
                borderRadius: '12px',
                display: 'flex',
                gap: '10px'
              }}>
                <Info size={16} className="text-gold" style={{ flexShrink: 0, marginTop: '2px' }} />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: 1.4 }}>
                  {p.ai_info}
                </p>
              </div>
            </form>
          </div>
        </aside>
      </div>

      <style jsx>{`
        .coupon-item:hover {
          border-color: var(--accent-color);
          transform: translateY(-2px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }
        .text-gold { color: var(--accent-color); }
        .hover-shake:hover { transform: scale(1.1); }
        .btn-premium {
          background: var(--accent-color);
          color: black;
          border: none;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-premium:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(212, 175, 55, 0.2);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
