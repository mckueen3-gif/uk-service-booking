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

  if (loading && services.length === 0) {
    return <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>Loading services...</div>;
  }

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1000px' }}>
      <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Link href="/dashboard/merchant" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
            <ArrowLeft size={16} /> 返回控制台 Back
          </Link>
          <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>
            服務管理 <span style={{ color: 'var(--accent-color)' }}>Catalog</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>在此定義您提供的服務、定價與服務細節。</p>
        </div>
        <button 
          onClick={() => { setEditingService(null); setShowAddModal(true); }}
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} /> 新增服務 Add Service
        </button>
      </header>

      {/* Templates Quick Start */}
      {!showTemplates ? (
        <div 
          onClick={() => setShowTemplates(true)}
          style={{ 
            backgroundColor: '#f0f9ff', border: '1px dashed #7dd3fc', borderRadius: '16px', 
            padding: '1.5rem', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', 
            alignItems: 'center', marginBottom: '2rem', transition: 'all 0.2s' 
          }}
        >
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Briefcase color="#0369a1" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0369a1' }}>從標準模板快速新增 Quick Templates</h3>
              <p style={{ fontSize: '0.85rem', color: '#0369a1', opacity: 0.8 }}>一鍵添加專業會計、修理等標準服務內容與預設價格。</p>
            </div>
          </div>
          <ChevronRight color="#0369a1" />
        </div>
      ) : (
        <div className="glass-panel animate-scale-in" style={{ padding: '1.5rem', borderRadius: '24px', marginBottom: '2rem' }}>
           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>選擇服務模板 Select Template</h3>
              <button onClick={() => setShowTemplates(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X size={20} /></button>
           </div>
           
           <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {SERVICE_TEMPLATES.map(t => (
                <div key={t.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-color)', textTransform: 'uppercase' }}>{t.category}</div>
                    <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>建議價: £{t.defaultPrice}</div>
                  </div>
                  <button 
                    onClick={() => handleAddFromTemplate(t)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer' }}
                  >
                    <PlusCircle size={24} />
                  </button>
                </div>
              ))}
           </div>
        </div>
      )}

      {/* Active Services List */}
      <section style={{ display: 'grid', gap: '1.25rem' }}>
        {services.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>
            <Tag size={48} style={{ margin: '0 auto 1rem' }} />
            <p>目前尚未建立任何服務內容。</p>
          </div>
        ) : (
          services.map(s => (
            <div key={s.id} className="glass-panel" style={{ padding: '1.25rem', borderRadius: '20px', display: 'grid', gridTemplateColumns: '1fr 150px 100px', alignItems: 'center', gap: '1.5rem' }}>
              <div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.25rem' }}>
                   <span style={{ fontSize: '0.7rem', fontWeight: 800, backgroundColor: 'var(--bg-secondary)', padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>{s.category}</span>
                   <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>{s.name}</h3>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{s.description}</p>
              </div>
              
              <div style={{ textAlign: 'right' }}>
                 <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--accent-color)' }}>£{s.price}</div>
                 <div style={{ fontSize: '0.75rem', opacity: 0.5 }}>Base Price</div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
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
                   style={{ padding: '0.5rem', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: 'white', cursor: 'pointer' }}
                 >
                   <Edit3 size={18} />
                 </button>
                 <button 
                   onClick={() => handleDelete(s.id)}
                   style={{ padding: '0.5rem', borderRadius: '10px', border: '1px solid var(--border-color)', backgroundColor: '#fef2f2', color: '#ef4444', cursor: 'pointer' }}
                 >
                   <Trash2 size={18} />
                 </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* Upsert Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', padding: '2rem', borderRadius: '24px', backgroundColor: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{editingService ? '編輯服務 Edit' : '手動新增服務 Manual Add'}</h3>
              <button onClick={() => setShowAddModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}><X /></button>
            </div>

            <form onSubmit={handleUpsert} style={{ display: 'grid', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>服務名稱 Service Name</label>
                <input required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-color)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>類別 Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <option value="Accounting">Accounting & Tax</option>
                  <option value="Plumbing">Plumbing</option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Education">Education & Tutoring</option>
                  <option value="Technology">Technology & AI</option>
                  <option value="Legal">Legal Services</option>
                </select>
              </div>

              {formData.category === 'Education' && (
                <div className="animate-fade-in" style={{ padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.75rem', color: 'var(--accent-color)' }}>
                    <GraduationCap size={18} />
                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>專業教育賽道標籤 Specialized Tracks</span>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>專攻學科/技能 (e.g. Maths, AI, ADHD Support)</label>
                    <input 
                      required={formData.category === 'Education'}
                      value={formData.subjects} 
                      onChange={e => setFormData({...formData, subjects: e.target.value})} 
                      placeholder="關鍵字會影響搜尋排名..."
                      style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }} 
                    />
                  </div>

                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    提示：建議在名稱或學科中包含 <strong>STEM</strong>, <strong>SEN</strong>, 或 <strong>Academic</strong> 等關鍵字。
                  </div>
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>服務價格 Price (£)</label>
                <input required type="number" value={formData.price} onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-color)' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.4rem' }}>描述 Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-color)', height: '100px', resize: 'none' }} />
              </div>
              
              <button type="submit" className="btn btn-primary" style={{ padding: '1rem', marginTop: '0.5rem' }}>
                 儲存變更 Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
