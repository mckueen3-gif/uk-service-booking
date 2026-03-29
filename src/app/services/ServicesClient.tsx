"use client";

import { useState } from 'react';
import { 
  Search, MapPin, Star, Filter, Grid, Map as MapIcon, 
  ChevronRight, Calendar, Clock, Shield, Award, Check,
  BarChart3, List, ChevronDown, CheckCircle2, ShieldCheck, ThumbsUp, ArrowRight
} from 'lucide-react';
import Link from 'next/link';

interface ServicesClientProps {
  initialMerchants: any[];
}

const CATEGORIES = [
  { id: 'all', name: '所有類別', count: null },
  { id: 'plumber', name: '水電工', count: null },
  { id: 'auto', name: '汽車維修', count: null },
  { id: 'accounting', name: '會計服務', count: null },
  { id: 'renovation', name: '房屋裝修', count: null },
];

export default function ServicesClient({ initialMerchants }: ServicesClientProps) {
  const [merchants, setMerchants] = useState(initialMerchants);
  const [activeCategory, setActiveCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  const isListView = viewMode === 'list';
  
  // Filtering logic
  const filteredMerchants = merchants.filter(m => {
     if (activeCategory === 'all') return true;
     return m.services.some((s: any) => s.category.toLowerCase().includes(activeCategory.toLowerCase()));
  });

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '4rem' }}>
      <style jsx>{`
        .services-container {
          display: flex;
          gap: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
        }
        .sidebar {
          width: 280px;
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
        }
        .main-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        .merchant-card {
          display: flex;
          padding: 1.5rem;
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          transition: all 0.3s;
          overflow: hidden;
        }
        .merchant-image-container {
          width: 240px;
          height: 180px;
          border-radius: 12px;
          overflow: hidden;
          flex-shrink: 0;
          margin-right: 1.5rem;
        }
        .merchant-info {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .merchant-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid #f1f5f9;
        }

        @media (max-width: 1024px) {
          .services-container {
            flex-direction: column;
          }
          .sidebar {
            width: 100%;
            flex-direction: row;
            overflow-x: auto;
            padding-bottom: 0.5rem;
          }
          .sidebar > div {
            min-width: 250px;
          }
        }

        @media (max-width: 768px) {
          .merchant-card {
            flex-direction: column;
            padding: 1rem;
          }
          .merchant-image-container {
            width: 100%;
            height: 200px;
            margin-right: 0;
            margin-bottom: 1rem;
          }
          .merchant-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 1.25rem;
          }
          .price-cta {
            width: 100%;
            justify-content: space-between !important;
          }
          .btn-book {
             width: 100%;
             justify-content: center;
          }
        }
      `}</style>

      <div className="services-container">
        
        {/* Left Sidebar Filters */}
        <aside className="sidebar">
          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1.25rem', color: '#0f172a' }}>服務類別</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {CATEGORIES.map(cat => (
                <button 
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  style={{ 
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                    padding: '0.6rem 0.75rem', borderRadius: '8px', border: activeCategory === cat.id ? '1px solid #0f766e' : '1px solid transparent',
                    backgroundColor: activeCategory === cat.id ? '#f0fdfa' : 'transparent',
                    color: activeCategory === cat.id ? '#0f766e' : '#475569',
                    fontWeight: activeCategory === cat.id ? 700 : 500,
                    cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                  }}
                >
                  <span>{cat.name}</span>
                  {activeCategory === cat.id && <Check size={16} />}
                </button>
              ))}
            </div>
          </div>
          
          <div className="glass-panel" style={{ padding: '1.5rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
             <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem' }}>專業認證</h3>
             <label style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', fontSize: '0.9rem', color: '#475569' }}>
                <input type="checkbox" style={{ width: '18px', height: '18px' }} defaultChecked />
                僅顯示已驗證商戶
             </label>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="main-content">
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
               找到 <span style={{ color: '#0f766e' }}>{filteredMerchants.length}</span> 家符合條件的專家
            </h2>
            <div style={{ display: 'flex', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
               <button onClick={() => setViewMode('list')} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: isListView ? '#ffffff' : 'transparent', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', boxShadow: isListView ? '0 1px 3px rgba(0,0,0,0.1)' : 'none' }}>
                  列表
               </button>
               <button onClick={() => setViewMode('map')} disabled style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', backgroundColor: !isListView ? '#ffffff' : 'transparent', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', opacity: 0.5 }}>
                  地圖
               </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {filteredMerchants.map(merchant => (
              <div key={merchant.id} className="animate-fade-up merchant-card">
                
                {/* Image Section */}
                <div className="merchant-image-container">
                   <img 
                     src={merchant.services[0]?.category.toLowerCase().includes('car') 
                        ? "https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=600&q=80" 
                        : "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=600&q=80"} 
                     alt={merchant.companyName} 
                     style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                   />
                </div>

                {/* Info Section */}
                <div className="merchant-info">
                   <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                         <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
                               <Link href={`/merchant/${merchant.id}`} style={{ textDecoration: 'none' }}>
                                  <h3 className="hover-underline" style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{merchant.companyName}</h3>
                               </Link>
                               {merchant.isVerified && (
                                  <span style={{ backgroundColor: '#ccfbf1', color: '#0f766e', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '2px' }}>
                                     <CheckCircle2 size={12} /> 已認證
                                  </span>
                               )}
                            </div>
                            <p style={{ fontSize: '0.9rem', color: '#64748b', margin: 0 }}>{merchant.description || "專業服務供應商"}</p>
                         </div>
                         <div style={{ textAlign: 'right' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f172a', fontWeight: 800, fontSize: '1.1rem', justifyContent: 'flex-end' }}>
                               <Star size={18} fill="#f59e0b" color="#f59e0b" /> {merchant.averageRating}
                            </div>
                            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{merchant.totalReviews} 則評價</span>
                         </div>
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', flexWrap: 'wrap' }}>
                         <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <MapPin size={16} color="#0f766e" /> {merchant.city}
                         </div>
                         <div style={{ fontSize: '0.85rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <ShieldCheck size={16} color="#0f766e" /> 已投保
                         </div>
                         <div style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <ThumbsUp size={16} /> AI 價格稽核：合理
                         </div>
                      </div>
                   </div>

                   <div className="merchant-footer">
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                         {Array.from(new Set<string>(merchant.services.map((s: any) => s.category))).map((cat) => (
                            <span key={cat} style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', padding: '0.3rem 0.75rem', borderRadius: '2rem', color: '#475569', fontWeight: 600 }}>
                               {cat}
                            </span>
                         ))}
                      </div>
                      <div className="price-cta" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                         <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>預估起步價</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>£{merchant.basePrice}</div>
                         </div>
                         <Link href={`/merchant/${merchant.id}`} className="btn btn-primary btn-book" style={{ padding: '0.75rem 1.5rem', borderRadius: '10px', fontSize: '0.95rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                            查看詳情 <ArrowRight size={18} />
                         </Link>
                      </div>
                   </div>
                </div>

              </div>
            ))}
            {filteredMerchants.length === 0 && (
               <div style={{ padding: '5rem', textAlign: 'center', backgroundColor: '#ffffff', borderRadius: '20px', border: '2px dashed #e2e8f0' }}>
                  <Search size={48} color="#94a3b8" style={{ margin: '0 auto 1.5rem' }} />
                  <h3 style={{ color: '#0f172a', fontWeight: 800 }}>找不到匹配的商戶</h3>
                  <p style={{ color: '#64748b' }}>請嘗試調整過濾條件或搜尋其他地區。</p>
               </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
