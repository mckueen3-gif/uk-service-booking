"use client";

import { useState, useEffect } from 'react';
import { saveFullProfile } from '@/app/actions/user';
import { Save, User, Mail, Phone, Building2, FileText, CheckCircle2 } from 'lucide-react';
import { useTranslation } from '@/components/LanguageContext';

export default function ProfileForm({ user, isMerchant }: { user: any, isMerchant: boolean }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    city: user?.city || '',
    addressLine1: user?.addressLine1 || '',
    addressLine2: user?.addressLine2 || '',
    postcode: user?.postcode || '',
    businessName: user?.merchantProfile?.companyName || '',
    description: user?.merchantProfile?.description || ''
  });

  // 🚀 SYNC STATE WITH FRESH PROPS (FIXES STALE DATA BUG)
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        city: user.city || '',
        addressLine1: user.addressLine1 || '',
        addressLine2: user.addressLine2 || '',
        postcode: user.postcode || '',
        businessName: user.merchantProfile?.companyName || '',
        description: user.merchantProfile?.description || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    try {
      const result = await saveFullProfile(user.id, {
        name: formData.name,
        phone: formData.phone,
        city: formData.city,
        addressLine1: formData.addressLine1,
        addressLine2: formData.addressLine2,
        postcode: formData.postcode,
        businessName: formData.businessName,
        description: formData.description,
        isMerchant
      });

      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '2.5rem' }}>
      <div style={{ display: 'grid', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{t?.merchant?.profile?.sections?.basic || "Identity"}</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div style={{ display: 'grid', gap: '0.6rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <User size={14} /> {t?.merchant?.profile?.labels?.name || "Full Name"}
            </label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
              placeholder={t?.merchant?.profile?.labels?.placeholderName || "Your Name"}
              required
            />
          </div>

          <div style={{ display: 'grid', gap: '0.6rem' }}>
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Phone size={14} /> {t?.merchant?.profile?.labels?.phone || "Liaison #"}
            </label>
            <input 
              type="tel" 
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
              placeholder={t?.merchant?.profile?.labels?.placeholderPhone || "+44 XXXX XXXX"}
            />
          </div>
        </div>

        <div style={{ display: 'grid', gap: '0.6rem' }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Mail size={14} /> {t.merchant.profile.labels.emailReadOnly}
          </label>
          <input 
            type="email" 
            value={user.email || ''} 
            disabled
            style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'rgba(255,255,255,0.02)', color: 'var(--text-secondary)', fontSize: '0.95rem', cursor: 'not-allowed' }} 
          />
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1.25rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
         <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{t?.merchant?.profile?.sections?.address || "Geofence"}</h3>
         
         <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t.merchant.profile.labels.city}</label>
              <input 
                type="text" 
                value={formData.city}
                onChange={(e) => setFormData({...formData, city: e.target.value})}
                style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
                placeholder="London"
              />
            </div>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t.merchant.profile.labels.postcode}</label>
              <input 
                type="text" 
                value={formData.postcode}
                onChange={(e) => setFormData({...formData, postcode: e.target.value})}
                style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
                placeholder="SW1A 1AA"
              />
            </div>
         </div>

         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t.merchant.profile.labels.addressLine1}</label>
              <input 
                type="text" 
                value={formData.addressLine1}
                onChange={(e) => setFormData({...formData, addressLine1: e.target.value})}
                style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
                placeholder="123 Example St"
              />
            </div>
            <div style={{ display: 'grid', gap: '0.6rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{t.merchant.profile.labels.addressLine2}</label>
              <input 
                type="text" 
                value={formData.addressLine2}
                onChange={(e) => setFormData({...formData, addressLine2: e.target.value})}
                style={{ padding: '0.85rem 1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none' }}
                placeholder="Flat 4B"
              />
            </div>
         </div>
      </div>

      {isMerchant && (
        <div style={{ display: 'grid', gap: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{t.merchant.profile.sections.business}</h3>
          
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Building2 size={16} /> {t.merchant.profile.labels.businessName}
            </label>
            <input 
              type="text" 
              value={formData.businessName}
              onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none' }}
              placeholder={t.merchant.profile.labels.businessNamePlaceholder}
            />
          </div>

          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileText size={16} /> {t.merchant.profile.labels.bio}
            </label>
            <textarea 
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              style={{ padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', fontSize: '1rem', outline: 'none', resize: 'vertical' }}
              placeholder={t.merchant.profile.labels.bioPlaceholder}
            />
          </div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
        <button 
          type="submit" 
          disabled={loading}
          className="btn btn-primary"
          style={{ padding: '1rem 2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700 }}
        >
          {loading ? (t?.merchant?.profile?.status?.saving || "Syncing...") : (
            <>
              <Save size={18} /> {t?.merchant?.profile?.save || "Update Node"}
            </>
          )}
        </button>

        {success && (
          <div style={{ color: '#facc15', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, animation: 'fade-in 0.3s' }}>
            <CheckCircle2 size={20} /> {t?.merchant?.profile?.status?.success || "Node Persistent"}
          </div>
        )}
      </div>
    </form>
  );
}
