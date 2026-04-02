"use client";

import { useState, useEffect } from "react";
import { 
  Plus, Search, Edit2, Trash2, 
  Sparkles, TrendingUp, Info, 
  Loader2, CheckCircle2, AlertCircle,
  Wrench, ScrollText, DollarSign,
  Briefcase
} from 'lucide-react';
import { getMerchantServices, upsertService, deleteService } from "@/app/actions/services";
import { getPricingBenchmark } from "@/app/actions/pricing-ai";

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [merchantCity, setMerchantCity] = useState("London"); // Default
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    category: "Plumbing",
    description: "",
    price: 0,
    compareCity: "" // City to compare against
  });

  // AI Pricing State
  const [aiBenchmark, setAiBenchmark] = useState<any>(null);
  const [fetchingAi, setFetchingAi] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await getMerchantServices();
    if (res.services) setServices(res.services);
    if (res.city) {
      setMerchantCity(res.city);
      setFormData(prev => ({ ...prev, compareCity: res.city }));
    }
    setLoading(false);
  }

  function openEdit(service: any) {
    setCurrentService(service);
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description || "",
      price: service.price,
      compareCity: merchantCity
    });
    setAiBenchmark(null);
    setModalOpen(true);
  }

  function openNew() {
    setCurrentService(null);
    setFormData({ name: "", category: "Plumbing", description: "", price: 0, compareCity: merchantCity });
    setAiBenchmark(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await upsertService({ ...formData, id: currentService?.id });
    if (res.success) {
      setModalOpen(false);
      load();
    }
  }

  async function handleDelete(id: string) {
    if (confirm("確定要刪除此服務項目嗎？")) {
      const res = await deleteService(id);
      if (res.success) load();
    }
  }

  async function handleAiPricing() {
    if (!formData.name) return alert("請先輸入服務名稱，AI 才能進行對比");
    setFetchingAi(true);
    // Use the custom compare city if provided, otherwise default to merchant's city
    const targetCity = formData.compareCity || merchantCity;
    const res = await getPricingBenchmark(formData.name, targetCity);
    if (res.benchmark) {
      setAiBenchmark(res.benchmark);
    }
    setFetchingAi(false);
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
    </div>
  );

  return (
    <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
           <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)' }}>服務項目管理 (Services)</h1>
           <p style={{ color: 'var(--text-secondary)' }}>設定您提供的服務內容、計費標準與 AI 定價參考</p>
        </div>
        <button className="btn btn-primary" onClick={openNew} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           <Plus size={18} /> 新增服務項目
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
         {services.map(s => (
           <div key={s.id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                 <div style={{ padding: '0.5rem', borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.1)', color: 'var(--accent-color)' }}>
                    <Briefcase size={20} />
                 </div>
                 <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button onClick={() => openEdit(s)} className="hover-bright" style={{ color: 'var(--text-secondary)', padding: '0.25rem' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(s.id)} className="hover-bright" style={{ color: '#ef4444', padding: '0.25rem' }}><Trash2 size={16} /></button>
                 </div>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.25rem' }}>{s.name}</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.75rem' }}>{s.category}</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', flex: 1, marginBottom: '1.5rem', lineHeight: 1.5 }}>{s.description || "暫無描述"}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                 <div style={{ fontSize: '1.25rem', fontWeight: 800 }}>£{s.price.toFixed(2)}</div>
                 <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>/ 小時起</div>
              </div>
           </div>
         ))}
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
           <div className="glass-panel animate-slide-in" style={{ width: '100%', maxWidth: '500px', height: '100%', borderRadius: 0, padding: '2.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                 <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{currentService ? "編輯服務" : "新增服務"}</h2>
                 <button onClick={() => setModalOpen(false)} style={{ color: 'var(--text-secondary)' }}>Close</button>
              </div>

              <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>服務名稱</label>
                    <input 
                      required
                      className="input-field" 
                      placeholder="例如：緊急鍋爐維修" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                       <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>類別</label>
                       <select 
                         className="input-field"
                         value={formData.category}
                         onChange={e => setFormData({...formData, category: e.target.value})}
                       >
                          <option>Plumbing</option>
                          <option>Renovation</option>
                          <option>Electrical</option>
                          <option>Gardening</option>
                          <option>Cleaning</option>
                       </select>
                    </div>
                    <div>
                       <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>基本定價 (GBP)</label>
                       <input 
                         required
                         type="number"
                         className="input-field" 
                         value={formData.price}
                         onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                       />
                    </div>
                 </div>

                 {/* AI Pricing Assistant Section */}
                 <div style={{ padding: '1.25rem', borderRadius: '16px', backgroundColor: 'rgba(99, 102, 241, 0.05)', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', fontWeight: 800, fontSize: '0.85rem' }}>
                          <Sparkles size={16} /> AI 價格行情參考
                       </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                       <input 
                         className="input-field"
                         placeholder="輸入地區 (如: London, Manchester)" 
                         style={{ fontSize: '0.75rem', padding: '0.4rem 0.75rem' }}
                         value={formData.compareCity}
                         onChange={e => setFormData({...formData, compareCity: e.target.value})}
                       />
                       <button 
                         type="button"
                         onClick={handleAiPricing}
                         disabled={fetchingAi}
                         className="btn btn-primary"
                         style={{ fontSize: '0.75rem', padding: '0.4rem 1rem', whiteSpace: 'nowrap' }}
                       >
                          {fetchingAi ? <Loader2 className="animate-spin" size={14} /> : "即時比價"}
                       </button>
                    </div>

                    {aiBenchmark ? (
                      <div className="animate-fade-in">
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1rem' }}>
                            <div style={{ textAlign: 'center', padding: '0.5rem', borderRadius: '8px', backgroundColor: 'rgba(16, 185, 129, 0.1)' }}>
                               <p style={{ fontSize: '0.65rem', color: '#facc15' }}>Entry</p>
                               <p style={{ fontWeight: 800 }}>£{aiBenchmark.low}</p>
                            </div>
                            <div style={{ textAlign: 'center', padding: '0.5rem', borderRadius: '8px', backgroundColor: 'rgba(99, 102, 241, 0.1)', border: '1px solid var(--accent-color)' }}>
                               <p style={{ fontSize: '0.65rem', color: 'var(--accent-color)' }}>Average</p>
                               <p style={{ fontWeight: 800 }}>£{aiBenchmark.average}</p>
                            </div>
                            <div style={{ textAlign: 'center', padding: '0.5rem', borderRadius: '8px', backgroundColor: 'rgba(245, 158, 11, 0.1)' }}>
                               <p style={{ fontSize: '0.65rem', color: '#f59e0b' }}>Premium</p>
                               <p style={{ fontWeight: 800 }}>£{aiBenchmark.high}</p>
                            </div>
                         </div>
                         <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                            <Info size={12} style={{ display: 'inline', marginBottom: '2px' }} /> {aiBenchmark.insight}
                         </p>
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>點擊「即時比價」來獲取當前倫敦市場的收費基準。</p>
                    )}
                 </div>

                 <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>詳細描述</label>
                    <textarea 
                      rows={4}
                      className="input-field" 
                      placeholder="簡要說明服務內容與包含的項目..." 
                      style={{ resize: 'none' }}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                    />
                 </div>

                 <button type="submit" className="btn btn-primary" style={{ marginTop: 'auto', padding: '1rem' }}>
                    {currentService ? "保存變更" : "立即發布"}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
