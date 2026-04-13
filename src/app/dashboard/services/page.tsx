"use client";

  Briefcase, X, ChevronRight, MapPin, 
  Zap, Clock, ShieldAlert, Plus, Edit2, Trash2, TrendingUp, Info, Sparkles, Loader2
} from 'lucide-react';
import { useTranslation } from "@/components/LanguageContext";
import { getMerchantServices, upsertService, deleteService } from "@/app/actions/services";
import { getPricingBenchmark } from "@/app/actions/pricing-ai";

export default function ServicesPage() {
  const { t, format, isRTL } = useTranslation();
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
    compareCity: "", // City to compare against
    isEmergencyAble: false,
    emergencySurchargePercentage: 0,
    emergencyResponseTime: ""
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
      compareCity: merchantCity,
      isEmergencyAble: service.isEmergencyAble || false,
      emergencySurchargePercentage: service.emergencySurchargePercentage || 0,
      emergencyResponseTime: service.emergencyResponseTime || ""
    });
    setAiBenchmark(null);
    setModalOpen(true);
  }

  function openNew() {
    setCurrentService(null);
    setFormData({ 
      name: "", 
      category: "Plumbing", 
      description: "", 
      price: 0, 
      compareCity: merchantCity,
      isEmergencyAble: false,
      emergencySurchargePercentage: 0,
      emergencyResponseTime: ""
    });
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

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
      <Loader2 className="animate-spin" size={48} color="#d4af37" />
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ paddingBottom: '5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
           <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#fff', letterSpacing: '-0.02em' }}>
             服務管理 <span style={{ color: '#d4af37' }}>Catalog</span>
           </h1>
           <p style={{ color: '#666', fontSize: '1.1rem' }}>在此定義您提供的服務、定價與 AI 行情對比。</p>
        </div>
        <button className="btn btn-primary" onClick={openNew} style={{ padding: '1rem 2.5rem', fontSize: '1rem' }}>
           <Plus size={20} /> 新增服務項目
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '2rem' }}>
         {services.map(s => (
           <div key={s.id} className="glass-panel hover-lift" style={{ 
             padding: '2rem', 
             borderRadius: '32px', 
             display: 'flex', 
             flexDirection: 'column',
             backgroundColor: 'rgba(12, 12, 12, 0.6)',
             border: '1px solid rgba(212, 175, 55, 0.1)'
           }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                 <div style={{ 
                   padding: '0.75rem', 
                   borderRadius: '16px', 
                   backgroundColor: 'rgba(212, 175, 55, 0.05)', 
                   color: '#d4af37',
                   border: '1px solid rgba(212, 175, 55, 0.2)'
                 }}>
                    <Briefcase size={22} />
                 </div>
                 <div style={{ display: 'flex', gap: '0.6rem' }}>
                    <button onClick={() => openEdit(s)} className="haptic-press" style={{ color: '#666', backgroundColor: '#111', padding: '0.5rem', borderRadius: '10px', border: '1px solid #222' }}><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(s.id)} className="haptic-press" style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.05)', padding: '0.5rem', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.2)' }}><Trash2 size={16} /></button>
                 </div>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '0.4rem', color: '#fff' }}>{s.name}</h3>
              <p style={{ fontSize: '0.75rem', color: '#d4af37', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem', opacity: 0.8 }}>{s.category}</p>
              
              {s.isEmergencyAble && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '1rem' }}>
                  <div style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#d4af37', fontSize: '0.65rem', fontWeight: 900, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Zap size={10} fill="#d4af37" /> {t.search.emergencyReady}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#666', fontWeight: 600 }}>+{s.emergencySurchargePercentage}% {t.booking.labels.expressSurcharge}</span>
                </div>
              )}

              <p style={{ fontSize: '0.9rem', color: '#999', flex: 1, marginBottom: '2rem', lineHeight: 1.6 }}>{s.description || "尚未添加詳細描述..."}</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1.5rem', borderTop: '1px solid rgba(212, 175, 55, 0.1)' }}>
                 <div>
                    <span style={{ fontSize: '0.75rem', color: '#555', fontWeight: 700, display: 'block' }}>BASE PRICE</span>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff' }}>£{s.price.toFixed(2)}</div>
                 </div>
                 <div style={{ fontSize: '0.85rem', color: '#d4af37', fontWeight: 700, backgroundColor: 'rgba(212, 175, 55, 0.05)', padding: '0.4rem 0.8rem', borderRadius: '8px' }}>
                    Per Hour
                 </div>
              </div>
           </div>
         ))}
      </div>

      {modalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(20px)', zIndex: 1000, display: 'flex', justifyContent: 'flex-end' }}>
           <div className="animate-slide-in" style={{ 
             width: '100%', 
             maxWidth: '550px', 
             height: '100%', 
             backgroundColor: '#0a0a0a',
             borderLeft: '1px solid rgba(212, 175, 55, 0.2)',
             padding: '3rem', 
             display: 'flex', 
             flexDirection: 'column',
             boxShadow: '-20px 0 50px rgba(0,0,0,0.5)'
           }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                 <div>
                   <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#fff' }}>{currentService ? "編輯服務項目" : "新增服務項目"}</h2>
                   <p style={{ color: '#666', fontSize: '0.9rem' }}>{currentService ? "更新您的專業服務細節" : "開始在平台上提供您的專業技能"}</p>
                 </div>
                 <button 
                   onClick={() => setModalOpen(false)} 
                   style={{ 
                     color: '#fff', 
                     backgroundColor: '#1a1a1a', 
                     border: '1px solid #333', 
                     width: '40px', 
                     height: '40px', 
                     borderRadius: '50%', 
                     display: 'flex', 
                     alignItems: 'center', 
                     justifyContent: 'center',
                     cursor: 'pointer',
                     transition: 'all 0.2s'
                   }}
                   onMouseOver={(e) => e.currentTarget.style.borderColor = '#d4af37'}
                   onMouseOut={(e) => e.currentTarget.style.borderColor = '#333'}
                 >
                   <X size={20} />
                 </button>
              </div>

              <form onSubmit={handleSubmit} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.75rem', overflowY: 'auto', paddingRight: '0.5rem' }} className="custom-scrollbar">
                 <div>
                    <label style={premiumLabelStyle}>服務名稱 (Service Name)</label>
                    <input 
                      required
                      placeholder="例如：緊急鍋爐維修 / 進階稅務審計" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      style={premiumInputStyle}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'; }}
                    />
                 </div>

                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div>
                       <label style={premiumLabelStyle}>服務類別 (Category)</label>
                       <select 
                         value={formData.category}
                         onChange={e => setFormData({...formData, category: e.target.value})}
                         style={{ ...premiumInputStyle, appearance: 'none' }}
                         onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)'; }}
                         onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'; }}
                       >
                          <option value="Plumbing">Plumbing</option>
                          <option value="Renovation">Renovation</option>
                          <option value="Electrical">Electrical</option>
                          <option value="Gardening">Gardening</option>
                          <option value="Cleaning">Cleaning</option>
                          <option value="Accounting">Accounting & Tax</option>
                          <option value="Education">Education</option>
                       </select>
                    </div>
                    <div>
                       <label style={premiumLabelStyle}>基本定價 (£ / Hour)</label>
                       <div style={{ position: 'relative' }}>
                         <input 
                           required
                           type="number"
                           step="0.01"
                           value={formData.price}
                           onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                           style={{ ...premiumInputStyle, paddingLeft: '2rem' }}
                           onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)'; }}
                           onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'; }}
                         />
                         <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: '#d4af37' }}>£</span>
                       </div>
                    </div>
                 </div>

                 {/* AI Pricing Assistant Section - Premium "Neural" Design */}
                 <div style={{ 
                   padding: '2rem', 
                   borderRadius: '24px', 
                   backgroundColor: 'rgba(212, 175, 55, 0.03)', 
                   border: '1px solid rgba(212, 175, 55, 0.2)',
                   position: 'relative',
                   overflow: 'hidden'
                 }}>
                    <div style={{ position: 'absolute', top: '-20px', right: '-20px', opacity: 0.05 }}>
                       <Sparkles size={100} color="#d4af37" />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#d4af37', fontWeight: 900, fontSize: '0.9rem', marginBottom: '1.25rem' }}>
                       <Sparkles size={18} /> Concierge AI <span style={{ color: '#fff', opacity: 0.5 }}>Market Insights</span>
                    </div>

                    <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
                       <div style={{ position: 'relative', flex: 1 }}>
                         <MapPin size={14} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#d4af37' }} />
                         <input 
                           placeholder="輸入地區 (如: London, Manchester)" 
                           style={{ ...premiumInputStyle, fontSize: '0.85rem', padding: '0.6rem 1rem 0.6rem 2.2rem', borderRadius: '12px' }}
                           value={formData.compareCity}
                           onChange={e => setFormData({...formData, compareCity: e.target.value})}
                         />
                       </div>
                       <button 
                         type="button"
                         onClick={handleAiPricing}
                         disabled={fetchingAi}
                         style={{ 
                           backgroundColor: '#d4af37', 
                           color: '#000', 
                           border: 'none', 
                           padding: '0 1.5rem', 
                           borderRadius: '12px', 
                           fontWeight: 900, 
                           fontSize: '0.85rem',
                           cursor: 'pointer',
                           display: 'flex',
                           alignItems: 'center',
                           gap: '0.5rem'
                         }}
                       >
                          {fetchingAi ? <Loader2 className="animate-spin" size={16} /> : <><TrendingUp size={16} /> 即時分析</>}
                       </button>
                    </div>

                    {aiBenchmark ? (
                      <div className="animate-fade-up">
                         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            <div style={{ textAlign: 'center', padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #222' }}>
                               <p style={{ fontSize: '0.65rem', color: '#666', fontWeight: 800, textTransform: 'uppercase' }}>Entry</p>
                               <p style={{ fontWeight: 900, color: '#fff', fontSize: '1.1rem' }}>£{aiBenchmark.low}</p>
                            </div>
                            <div style={{ textAlign: 'center', padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(212, 175, 55, 0.05)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                               <p style={{ fontSize: '0.65rem', color: '#d4af37', fontWeight: 800, textTransform: 'uppercase' }}>Average</p>
                               <p style={{ fontWeight: 900, color: '#d4af37', fontSize: '1.25rem' }}>£{aiBenchmark.average}</p>
                            </div>
                            <div style={{ textAlign: 'center', padding: '0.75rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid #222' }}>
                               <p style={{ fontSize: '0.65rem', color: '#666', fontWeight: 800, textTransform: 'uppercase' }}>Premium</p>
                               <p style={{ fontWeight: 900, color: '#fff', fontSize: '1.1rem' }}>£{aiBenchmark.high}</p>
                            </div>
                         </div>
                         <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '1rem', borderRadius: '12px', backgroundColor: '#111', border: '1px solid #222' }}>
                            <Info size={16} color="#d4af37" style={{ marginTop: '2px' }} />
                            <p style={{ fontSize: '0.8rem', color: '#999', lineHeight: 1.5 }}>
                               {aiBenchmark.insight}
                            </p>
                         </div>
                      </div>
                    ) : (
                      <p style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Info size={14} /> 點擊「即時分析」獲取倫敦市場最新的服務收費大數據基準。
                      </p>
                    )}
                 </div>

                 {/* Emergency Support Configuration */}
                 <div style={{ 
                   padding: '1.75rem', 
                   borderRadius: '24px', 
                   backgroundColor: formData.isEmergencyAble ? 'rgba(212, 175, 55, 0.08)' : 'rgba(255, 255, 255, 0.02)', 
                   border: formData.isEmergencyAble ? '1px solid rgba(212, 175, 55, 0.4)' : '1px solid #222',
                   transition: 'all 0.3s ease'
                 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
                           <div style={{ 
                             width: '36px', height: '36px', borderRadius: '10px', 
                             backgroundColor: formData.isEmergencyAble ? '#d4af37' : '#1a1a1a', 
                             color: formData.isEmergencyAble ? '#000' : '#d4af37',
                             display: 'flex', alignItems: 'center', justifyContent: 'center',
                             transition: 'all 0.3s'
                           }}>
                              <Zap size={18} fill={formData.isEmergencyAble ? '#000' : 'none'} />
                           </div>
                           <div style={{ textAlign: isRTL ? 'right' : 'left' }}>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>{t.booking.labels.expressSupport}</h4>
                              <p style={{ fontSize: '0.75rem', color: '#666' }}>{isRTL ? 'تمكين خيارات الطوارئ' : 'Enable urgent service options'}</p>
                           </div>
                        </div>
                        <button 
                         type="button"
                         onClick={() => setFormData({...formData, isEmergencyAble: !formData.isEmergencyAble})}
                         style={{ 
                           width: '48px', height: '24px', borderRadius: '12px', 
                           backgroundColor: formData.isEmergencyAble ? '#d4af37' : '#333',
                           position: 'relative', cursor: 'pointer', border: 'none',
                           transition: 'all 0.3s'
                         }}
                        >
                           <div style={{ 
                              width: '18px', height: '18px', borderRadius: '50%', backgroundColor: '#fff',
                              position: 'absolute', top: '3px', 
                              left: formData.isEmergencyAble ? '27px' : '3px',
                              transition: 'all 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
                           }} />
                        </button>
                     </div>

                    {formData.isEmergencyAble && (
                      <div className="animate-fade-up" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(212, 175, 55, 0.2)', direction: isRTL ? 'rtl' : 'ltr' }}>
                         <div>
                            <label style={premiumLabelStyle}>{t.booking.labels.expressSurcharge} (%)</label>
                            <div style={{ position: 'relative' }}>
                               <input 
                                 type="number"
                                 value={formData.emergencySurchargePercentage}
                                 onChange={e => setFormData({...formData, emergencySurchargePercentage: parseFloat(e.target.value)})}
                                 style={{ ...premiumInputStyle, [isRTL ? 'paddingLeft' : 'paddingRight']: '2.5rem' }}
                                />
                                <span style={{ position: 'absolute', [isRTL ? 'left' : 'right']: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 900, color: '#d4af37' }}>%</span>
                            </div>
                         </div>
                         <div>
                            <label style={premiumLabelStyle}>{t.booking.labels.responseTime}</label>
                            <div style={{ position: 'relative' }}>
                               <input 
                                 placeholder="..." 
                                 value={formData.emergencyResponseTime}
                                 onChange={e => setFormData({...formData, emergencyResponseTime: e.target.value})}
                                 style={{ ...premiumInputStyle, [isRTL ? 'paddingRight' : 'paddingLeft']: '2.5rem' }}
                                />
                                <Clock size={16} style={{ position: 'absolute', [isRTL ? 'right' : 'left']: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#d4af37' }} />
                            </div>
                         </div>
                      </div>
                    )}
                  <div>
                    <label style={premiumLabelStyle}>詳細描述 (Description)</label>
                    <textarea 
                      rows={5}
                      placeholder="..." 
                      style={{ ...premiumInputStyle, resize: 'none' }}
                      value={formData.description}
                      onChange={e => setFormData({...formData, description: e.target.value})}
                      onFocus={(e) => { e.currentTarget.style.borderColor = '#d4af37'; e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.15)'; e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.03)'; }}
                    />
                 </div>

                 <button 
                  type="submit" 
                  className="btn btn-primary" 
                  style={{ 
                    marginTop: '1rem', 
                    padding: '1.25rem', 
                    fontSize: '1.1rem',
                    boxShadow: '0 10px 30px rgba(212, 175, 55, 0.2)'
                  }}
                 >
                    {currentService ? <><CheckCircle2 size={20} /> {t.common.copy}</> : <><Plus size={20} /> {t.onboarding.buttons.submit}</>}
                 </button>
              </form>
           </div>
        </div>
      )}
    </div>
  );
}
