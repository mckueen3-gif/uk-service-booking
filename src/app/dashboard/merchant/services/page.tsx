"use client";

import { useEffect, useState } from 'react';
import { 
  getMerchantServices, 
  addServiceFromTemplate, 
  upsertService, 
  deleteService 
} from '@/app/actions/merchant_services';
import { SERVICE_TEMPLATES } from '@/lib/constants/service_templates';
import { 
  Plus, Trash2, Edit3, Check, X, 
  Search, Briefcase, Info, AlertCircle,
  Tag, ChevronRight, PlusCircle, ArrowLeft, GraduationCap
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/components/LanguageContext';

export default function MerchantServicesPage() {
  const { t } = useTranslation();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  // Form State
  const [editingService, setEditingService] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Accounting',
    price: 0,
    description: '',
    subjects: ''
  });

  const loadServices = async () => {
    setLoading(true);
    const res = await getMerchantServices();
    if (res.success) {
      setServices(res.services);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleUpsert = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await upsertService({
      id: editingService?.id,
      ...formData
    });
    if (res.success) {
      loadServices();
      setShowAddModal(false);
      setEditingService(null);
      setFormData({ name: '', category: 'Accounting', price: 0, description: '', subjects: '' });
    }
  };

  const handleAddFromTemplate = async (template: any) => {
    const res = await addServiceFromTemplate(template.id, template.defaultPrice);
    if (res.success) {
      loadServices();
      setShowTemplates(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('確定要刪除這項服務嗎？')) {
      const res = await deleteService(id);
      if (res.success) loadServices();
    }
  };

  const premiumInputStyle = {
    width: '100%',
    padding: '0.875rem 1.25rem',
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(212, 175, 55, 0.15)',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 500,
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  };

  const premiumLabelStyle = {
    display: 'block',
    fontSize: '0.75rem',
    fontWeight: 800,
    color: '#666',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    marginBottom: '0.6rem',
    marginLeft: '0.4rem'
  };

  if (loading && services.length === 0) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
       <Loader2 className="animate-spin" size={48} color="#d4af37" />
    </div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1000px' }}>
      <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link href="/dashboard/merchant" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> 返回控制台 Back
          </Link>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff' }}>
            服務管理 <span style={{ color: '#d4af37' }}>Catalog</span>
          </h1>
          <p style={{ color: '#666' }}>在此定義您提供的服務、定價與服務細節。</p>
        </div>
        <button 
          onClick={() => { setEditingService(null); setShowAddModal(true); }}
          className="btn btn-primary" 
          style={{ padding: '1rem 2rem' }}
        >
          <Plus size={18} /> 新增服務 Add Service
        </button>
      </header>

      {/* Active Services List */}
      <section style={{ display: 'grid', gap: '1.5rem' }}>
        {services.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '5rem', opacity: 0.3 }}>
            <Tag size={64} style={{ margin: '0 auto 1.5rem' }} />
            <p style={{ fontSize: '1.1rem' }}>目前尚未建立任何服務內容。</p>
          </div>
        ) : (
          services.map(s => (
            <div key={s.id} className="glass-panel" style={{ padding: '1.5rem 2rem', borderRadius: '28px', backgroundColor: 'rgba(12, 12, 12, 0.5)', border: '1px solid rgba(212, 175, 55, 0.1)', display: 'grid', gridTemplateColumns: '1fr 150px 100px', alignItems: 'center', gap: '2rem' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginBottom: '0.5rem' }}>
                   <span style={{ fontSize: '0.7rem', fontWeight: 900, backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#d4af37', padding: '3px 10px', borderRadius: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.category}</span>
                   <h3 style={{ fontWeight: 800, fontSize: '1.25rem', color: '#fff' }}>{s.name}</h3>
                </div>
                <p style={{ fontSize: '0.9rem', color: '#888', lineHeight: 1.5 }}>{s.description}</p>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                 <div style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>£{s.price}</div>
                 <div style={{ fontSize: '0.75rem', color: '#d4af37', fontWeight: 700, opacity: 0.6 }}>Base Payout</div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                 <button 
                   onClick={() => { 
                     setEditingService(s); 
                     setFormData({ 
                       name: s.name, 
                       category: s.category, 
                       price: s.price, 
                       description: s.description || '',
                       subjects: s.subjects || ''
                     }); 
                     setShowAddModal(true); 
                   }}
                   style={{ padding: '0.6rem', borderRadius: '12px', border: '1px solid #222', backgroundColor: '#111', color: '#fff', cursor: 'pointer' }}
                 >
                   <Edit3 size={18} />
                 </button>
                 <button 
                   onClick={() => handleDelete(s.id)}
                   style={{ padding: '0.6rem', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.2)', backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', cursor: 'pointer' }}
                 >
                   <Trash2 size={18} />
                 </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Upsert Modal - Improved Full-Height Side Panel */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(15px)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', zIndex: 1000 }}>
          <div className="animate-slide-in" style={{ width: '100%', maxWidth: '550px', height: '100%', padding: '3.5rem', borderRadius: '0', backgroundColor: '#050505', borderLeft: '1px solid rgba(212, 175, 55, 0.2)', display: 'flex', flexDirection: 'column', boxShadow: '-20px 0 60px rgba(0,0,0,0.8)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
              <div>
                <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff' }}>{editingService ? '編輯服務 Edit' : '新增專業服務'}</h3>
                <p style={{ color: '#666', marginTop: '0.5rem' }}>設定您的服務細節，讓客戶更了解您的專業。</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)} 
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)', 
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: '#fff',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.borderColor = '#d4af37'}
                onMouseOut={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleUpsert} style={{ display: 'grid', gap: '2rem', overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scrollbar">
              <div>
                <label style={premiumLabelStyle}>服務名稱 (Service Name)</label>
                <input 
                  required 
                  placeholder="例如：緊急水管維修"
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  style={premiumInputStyle} 
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'; }}
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <label style={premiumLabelStyle}>服務類別 (Category)</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    style={{ ...premiumInputStyle, appearance: 'none' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'; }}
                  >
                    <option value="Accounting">Accounting & Tax</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Education">Education & Tutoring</option>
                    <option value="Technology">Technology & AI</option>
                    <option value="Legal">Legal Services</option>
                    <option value="Electrical">Electrical</option>
                  </select>
                </div>
                <div>
                  <label style={premiumLabelStyle}>基本定價 (£/hr)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: '#d4af37' }}>£</span>
                    <input 
                      required 
                      type="number" 
                      step="0.01"
                      value={formData.price} 
                      onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} 
                      style={{ ...premiumInputStyle, paddingLeft: '2.2rem' }} 
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'; }}
                    />
                  </div>
                </div>
              </div>

              {formData.category === 'Education' && (
                <div className="animate-fade-in" style={{ padding: '1.5rem', backgroundColor: 'rgba(212,175,55,0.03)', borderRadius: '20px', border: '1px solid rgba(212,175,55,0.1)' }}>
                  <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', marginBottom: '1rem', color: '#d4af37' }}>
                    <GraduationCap size={20} />
                    <span style={{ fontSize: '0.9rem', fontWeight: 900 }}>專家教育賽道 Specialized Tracks</span>
                  </div>
                  <input 
                    required={formData.category === 'Education'}
                    value={formData.subjects} 
                    onChange={e => setFormData({...formData, subjects: e.target.value})} 
                    placeholder="專攻學科 (例如: GCSE Maths, AI Prep)"
                    style={premiumInputStyle} 
                  />
                </div>
              )}

              <div>
                <label style={premiumLabelStyle}>詳細描述 (Description)</label>
                <textarea 
                  value={formData.description} 
                  onChange={e => setFormData({...formData, description: e.target.value})} 
                  placeholder="請簡單說明服務包含的內容..."
                  style={{ ...premiumInputStyle, height: '140px', resize: 'none' }} 
                  onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'; }}
                />
              </div>
              
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ padding: '1.25rem', marginTop: '1rem', fontSize: '1.1rem', boxShadow: '0 10px 40px rgba(212,175,55,0.2)' }}
              >
                 {editingService ? '保存並更新 Save Changes' : '立即發布服務項目 Publish'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { Loader2 } from 'lucide-react';
