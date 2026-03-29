"use client";

import { useState } from 'react';
import { 
  Save, Plus, Trash2, Car, Settings, HardDrive, ShieldCheck, 
  AlertCircle, ArrowRightLeft, CreditCard 
} from 'lucide-react';

export default function AutoSettingsPage() {
  const [isSaved, setIsSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<'inventory' | 'pricing' | 'refunds'>('inventory');

  const [tires, setTires] = useState([
    { id: 1, brand: 'Michelin', model: 'Pilot Sport 4', price: 105, stock: 12 },
    { id: 2, brand: 'Bridgestone', model: 'Turanza T005', price: 92, stock: 8 },
    { id: 3, brand: 'Goodyear', model: 'Eagle F1', price: 88, stock: 15 },
  ]);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Car size={32} color="#0f766e" /> 汽車服務自訂中心
          </h1>
          <p style={{ color: '#64748b', marginTop: '0.25rem' }}>管理您的零件庫存、基準報價與退款規則</p>
        </div>
        <button 
          onClick={handleSave} 
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '8px' }}
        >
          <Save size={18} /> {isSaved ? "已儲存變更" : "儲存設定"}
        </button>
      </header>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid #e2e8f0', marginBottom: '2rem' }}>
        {[
          { id: 'inventory', label: '零件/輪胎庫存', icon: <HardDrive size={18} /> },
          { id: 'pricing', label: '服務基準報價', icon: <Settings size={18} /> },
          { id: 'refunds', label: '自動退款規則', icon: <ArrowRightLeft size={18} /> },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 0.5rem', border: 'none', background: 'none',
              borderBottom: activeTab === tab.id ? '2px solid #0f766e' : '2px solid transparent',
              color: activeTab === tab.id ? '#0f766e' : '#64748b',
              fontWeight: activeTab === tab.id ? 700 : 500,
              cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="animate-fade-up">
        {activeTab === 'inventory' && (
          <div className="glass-panel" style={{ padding: '2rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>輪胎品牌與定價清單</h3>
              <button style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f766e', background: 'none', border: 'none', fontWeight: 600, cursor: 'pointer' }}>
                <Plus size={18} /> 新增項目
              </button>
            </div>
            
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #f1f5f9', textAlign: 'left' }}>
                  <th style={{ padding: '1rem 0', color: '#64748b', fontWeight: 600 }}>品牌 (Brand)</th>
                  <th style={{ padding: '1rem 0', color: '#64748b', fontWeight: 600 }}>型號/系列</th>
                  <th style={{ padding: '1rem 0', color: '#64748b', fontWeight: 600 }}>基準售價 (Unit)</th>
                  <th style={{ padding: '1rem 0', color: '#64748b', fontWeight: 600 }}>當前庫存</th>
                  <th style={{ padding: '1rem 0', color: '#64748b', fontWeight: 600, textAlign: 'right' }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {tires.map(tire => (
                  <tr key={tire.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '1.25rem 0', fontWeight: 600 }}>{tire.brand}</td>
                    <td style={{ padding: '1.25rem 0', color: '#475569' }}>{tire.model}</td>
                    <td style={{ padding: '1.25rem 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        <span style={{ color: '#64748b' }}>£</span>
                        <input type="number" defaultValue={tire.price} style={{ width: '80px', padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                      </div>
                    </td>
                    <td style={{ padding: '1.25rem 0' }}>
                      <span style={{ padding: '0.25rem 0.5rem', backgroundColor: tire.stock < 10 ? '#fff7ed' : '#f0fdf4', color: tire.stock < 10 ? '#c2410c' : '#15803d', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>
                        {tire.stock} 件
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 0', textAlign: 'right' }}>
                      <button style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'pricing' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
            <div className="glass-panel" style={{ padding: '2rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.5rem', backgroundColor: '#ecfdf5', borderRadius: '8px' }}>
                  <ShieldCheck size={24} color="#059669" />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>MOT 檢驗設定</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={{ fontSize: '0.875rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>標準 MOT 費用 (英國法規上限 £54.85)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>£</span>
                    <input type="number" defaultValue="54.85" className="input-field" style={{ paddingLeft: '2.5rem' }} />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.875rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>全車安全檢查 (Add-on)</label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>£</span>
                    <input type="number" defaultValue="40" className="input-field" style={{ paddingLeft: '2.5rem' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '2rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.5rem', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
                  <Settings size={24} color="#2563eb" />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>定期保養 Package</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {['Silver', 'Gold', 'Platinum'].map(level => (
                  <div key={level} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', border: '1px solid #f1f5f9', borderRadius: '8px' }}>
                    <span style={{ fontWeight: 600 }}>{level} Service</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: '#64748b' }}>£</span>
                      <input type="number" defaultValue={level === 'Silver' ? 89 : level === 'Gold' ? 149 : 229} style={{ width: '80px', padding: '0.4rem', border: '1px solid #e2e8f0', borderRadius: '4px' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'refunds' && (
          <div className="glass-panel" style={{ padding: '2rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '16px', maxWidth: '800px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ padding: '0.75rem', backgroundColor: '#fff7ed', borderRadius: '12px' }}>
                <CreditCard size={32} color="#c2410c" />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>智能差額退款系統</h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>開啟後，若最終結算價低於託管金，差額將自動返還予客戶</p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>自動切片退款 (Partial Refund)</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>由 Stripe 執行，省去人工轉帳手續費</div>
                </div>
                <div style={{ width: '48px', height: '24px', backgroundColor: '#0f766e', borderRadius: '12px', position: 'relative', cursor: 'pointer' }}>
                  <div style={{ position: 'absolute', right: '2px', top: '2px', width: '20px', height: '20px', backgroundColor: '#ffffff', borderRadius: '50%' }}></div>
                </div>
              </div>

              <div style={{ padding: '1rem', backgroundColor: '#f0f9ff', borderRadius: '8px', border: '1px solid #bae6fd', display: 'flex', gap: '0.75rem' }}>
                 <AlertCircle size={20} color="#0284c7" />
                 <div style={{ fontSize: '0.85rem', color: '#0369a1', lineHeight: 1.5 }}>
                   <strong>系統邏輯提醒：</strong><br/>
                   1. 師傅在 Variations Flow 中輸入<strong>下修後</strong>的金額。<br/>
                   2. 客戶確認後，系統僅捕捉 (Capture) 該部分金額。<br/>
                   3. 剩下的託管金將由原支付渠道退回，商戶無需手動點擊退款。
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>


    </div>
  );
}
