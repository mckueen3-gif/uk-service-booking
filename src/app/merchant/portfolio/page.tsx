"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Trash2, Sparkles, 
  Loader2, X, Camera
} from 'lucide-react';
import { getMerchantPortfolio, addPortfolioItem, deletePortfolioItem } from "@/app/actions/portfolio";
import { generateProjectDescription } from "@/app/actions/portfolio-ai";
import { useTranslation } from "@/components/LanguageContext";

export default function MerchantPortfolioPage() {
  const { t } = useTranslation();
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generating, setGenerating] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "General"
  });

  useEffect(() => {
    loadPortfolio();
  }, []);

  async function loadPortfolio() {
    setLoading(true);
    const res = await getMerchantPortfolio(""); 
    if (res.portfolio) setPortfolio(res.portfolio);
    setLoading(false);
  }

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await addPortfolioItem(formData);
    if (res.success) {
      await loadPortfolio();
      setIsModalOpen(false);
      setFormData({ title: "", description: "", imageUrl: "", category: "General" });
    } else {
      alert(t.merchant.portfolio_mgr.addError + ": " + res.error);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t.merchant.portfolio_mgr.deleteConfirm)) return;
    const res = await deletePortfolioItem(id);
    if (res.success) {
      await loadPortfolio();
    }
  };

  const handleAIGenerate = async () => {
    if (!formData.title) {
        alert(t.merchant.portfolio_mgr.aiError);
        return;
    }
    setGenerating(true);
    const res = await generateProjectDescription(formData.title, formData.category);
    if (res.success && res.description) {
      setFormData({ ...formData, description: res.description });
    }
    setGenerating(false);
  };

  if (loading && !portfolio.length) return (
     <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
       <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
     </div>
  );

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{t.merchant.portfolio_mgr.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>{t.merchant.portfolio_mgr.subtitle}</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.9rem 1.8rem', borderRadius: '14px', fontSize: '1rem', fontWeight: 900 }}
        >
          <Plus size={20} /> {t.merchant.portfolio_mgr.addBtn}
        </button>
      </div>

      {portfolio.length === 0 ? (
        <div className="glass-panel" style={{ padding: '6rem 2rem', textAlign: 'center', border: '2px dashed var(--border-color)', borderRadius: '24px' }}>
           <Camera size={64} style={{ margin: '0 auto 1.5rem', opacity: 0.1 }} />
           <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>{t.merchant.portfolio_mgr.emptyTitle}</h2>
           <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{t.merchant.portfolio_mgr.emptyDesc}</p>
           <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">{t.merchant.portfolio_mgr.addBtn}</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
           {portfolio.map(item => (
             <div key={item.id} className="glass-panel hover-scale" style={{ borderRadius: '24px', backgroundColor: 'var(--surface-1)/50', border: '1.5px solid var(--border-color)', overflow: 'hidden', position: 'relative' }}>
                <img src={item.imageUrl} alt={item.title} style={{ width: '100%', aspectRatio: '4/3', objectFit: 'cover' }} />
                <div style={{ padding: '1.25rem' }}>
                   <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent-color)', textTransform: 'uppercase' }}>{item.category}</span>
                      <button onClick={() => handleDelete(item.id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={16} /></button>
                   </div>
                   <h3 style={{ fontSize: '1.2rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.75rem' }}>{item.title}</h3>
                   <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{item.description}</p>
                </div>
             </div>
           ))}
        </div>
      )}

      {/* Add Project Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(6px)' }}>
          <div className="glass-panel animate-scale-in" style={{ maxWidth: '600px', width: '100%', padding: '2.5rem', borderRadius: '28px', backgroundColor: 'var(--surface-1)', position: 'relative', border: '1.5px solid var(--border-color)', boxShadow: 'var(--shadow-2xl)', maxHeight: '90vh', overflowY: 'auto' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={24} /></button>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '2rem', color: 'var(--text-primary)' }}>{t.merchant.portfolio_mgr.modal.title}</h2>
            
            <form onSubmit={handleAdd} style={{ display: 'grid', gap: '1.5rem' }}>
               <div>
                  <label style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.6rem', display: 'block' }}>{t.merchant.portfolio_mgr.modal.itemTitle}</label>
                  <input placeholder={t.merchant.portfolio_mgr.modal.itemTitlePlaceholder} required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="input-field" style={{ border: '2px solid var(--border-color)', borderRadius: '14px' }} />
               </div>
               
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.6rem', display: 'block' }}>{t.merchant.portfolio_mgr.modal.category}</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="input-field" style={{ borderRadius: '12px' }}>
                       <option value="Mechanical">Mechanical</option>
                       <option value="Electrical">Electrical</option>
                       <option value="Renovation">Renovation</option>
                       <option value="Deep Clean">Deep Clean</option>
                       <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.6rem', display: 'block' }}>{t.merchant.portfolio_mgr.modal.uploadPhoto}</label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            alert(t.merchant.portfolio_mgr.modal.errorSize);
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            setFormData({...formData, imageUrl: reader.result as string});
                          };
                          reader.readAsDataURL(file);
                        }
                      }} 
                      className="input-field" 
                      style={{ borderRadius: '12px', padding: '0.6rem' }} 
                    />
                    {formData.imageUrl && (
                      <div style={{ marginTop: '0.5rem', borderRadius: '12px', overflow: 'hidden', height: '80px', width: '120px', border: '1px solid var(--border-color)' }}>
                         <img src={formData.imageUrl} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>
               </div>

               <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <label style={{ fontWeight: 800, fontSize: '0.9rem' }}>{t.merchant.portfolio_mgr.modal.details}</label>
                    <button 
                      type="button" 
                      onClick={handleAIGenerate}
                      disabled={generating}
                      style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-color)', backgroundColor: 'transparent', border: 'none', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer' }}
                    >
                      {generating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                      {generating ? t.merchant.portfolio_mgr.modal.aiGenerating : t.merchant.portfolio_mgr.modal.aiBtn}
                    </button>
                  </div>
                  <textarea placeholder={t.merchant.portfolio_mgr.modal.detailsPlaceholder} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="input-field" style={{ borderRadius: '16px', minHeight: '140px', resize: 'none', fontSize: '1rem', lineHeight: 1.5 }} />
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-secondary">{t.merchant.portfolio_mgr.modal.cancel}</button>
                  <button type="submit" disabled={isSubmitting} className="btn btn-primary" style={{ padding: '1rem', borderRadius: '14px', fontWeight: 900 }}>
                     {isSubmitting ? <Loader2 className="animate-spin" /> : t.merchant.portfolio_mgr.modal.publish}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
