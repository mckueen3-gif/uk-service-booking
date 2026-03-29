"use client";

import { useState } from 'react';
import { 
  BarChart3, Calendar, FileText, Briefcase, CheckCircle2, 
  ChevronDown, ChevronUp, Zap, HelpCircle 
} from 'lucide-react';

export default function AccountingServices() {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'monthly' | 'oneoff' | 'specialist'>('monthly');

  const monthlyPackages = [
    { name: 'Basic', price: '89', target: 'Sole Trader', features: ['每月記賬', '銀行對賬 (1個帳戶)', '季度 P&L 報表'], note: '適合年營業額 < £85k' },
    { name: 'Standard', price: '149', target: 'Limited Company', features: ['全套記帳', 'VAT 申報', '每月對帳', '薪酬計算 (2人)'], note: '適合年營業額 £85k - £250k' },
    { name: 'Premium', price: '299', target: 'Scaling Ltd', features: ['全套記帳', '稅務籌劃', 'CFO 諮詢', 'HMRC 全面對接'], note: '適合高速成長公司' },
  ];

  return (
    <div style={{ marginTop: '2.5rem', marginBottom: '2rem' }}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
          padding: '1.25rem 1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', 
          borderRadius: '12px', cursor: 'pointer', outline: 'none' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ backgroundColor: '#eff6ff', padding: '0.4rem', borderRadius: '6px' }}>
            <BarChart3 size={20} color="#2563eb" />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>會計服務項目 (Accounting Services)</span>
        </div>
        {isOpen ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
      </button>

      {isOpen && (
        <div className="animate-fade-up" style={{ padding: '1.5rem', border: '1px solid #e2e8f0', borderTop: 'none', borderRadius: '0 0 12px 12px', backgroundColor: '#ffffff' }}>
          
          {/* AI Market Insight */}
          <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', padding: '0.875rem 1.25rem', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
             <div style={{ fontSize: '0.9rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={16} fill="#0369a1" /> London 地區同類服務市場平均：<strong>Monthly Bookkeeping £95–£150</strong>
             </div>
             <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#059669', backgroundColor: '#dcfce7', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                本商戶 £89 (平 12%)
             </div>
          </div>

          {/* Tabs Nav */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', backgroundColor: '#f1f5f9', padding: '4px', borderRadius: '10px' }}>
            {[
              { id: 'monthly', label: 'Monthly Packages', icon: <Calendar size={16} /> },
              { id: 'oneoff', label: 'One-off Projects', icon: <FileText size={16} /> },
              { id: 'specialist', label: 'Specialist Services', icon: <Briefcase size={16} /> },
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{ 
                  flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                  padding: '0.75rem', borderRadius: '8px', border: 'none',
                  backgroundColor: activeTab === tab.id ? '#ffffff' : 'transparent',
                  color: activeTab === tab.id ? '#0f172a' : '#64748b',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  boxShadow: activeTab === tab.id ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div style={{ minHeight: '300px' }}>
            {activeTab === 'monthly' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
                {monthlyPackages.map(pkg => (
                  <div key={pkg.name} className="animate-scale-in" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#2563eb', backgroundColor: '#eff6ff', padding: '0.25rem 0.6rem', borderRadius: '1rem', width: 'fit-content', marginBottom: '0.75rem' }}>
                      {pkg.target}
                    </span>
                    <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.25rem' }}>{pkg.name} Package</h4>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '1.25rem' }}>
                      £{pkg.price} <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 500 }}>/ 月</span>
                    </div>
                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.5rem 0', flex: 1 }}>
                      {pkg.features.map(f => (
                        <li key={f} style={{ fontSize: '0.875rem', color: '#475569', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                          <CheckCircle2 size={16} color="#059669" /> {f}
                        </li>
                      ))}
                    </ul>
                    <div style={{ padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '8px', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <HelpCircle size={14} /> {pkg.note}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'oneoff' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {[
                  { title: 'Self-Assessment Tax Return', price: '£129', scope: '個人報稅 • 截止日期前完成', label: '個人' },
                  { title: 'Company Year-End Accounts', price: '£399–£799', scope: '法定帳目製作 • 公司稅申報 • HMRC 二次核對', label: 'Ltd Co' },
                  { title: 'VAT Registration', price: '£49', scope: '增值稅號申請 • 代理授權設置', label: 'Business' },
                ].map(item => (
                   <div key={item.title} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.25rem', border: '1px solid #f1f5f9', borderRadius: '12px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                           <h4 style={{ fontSize: '1.05rem', fontWeight: 700 }}>{item.title}</h4>
                           <span style={{ fontSize: '0.7rem', color: '#64748b', border: '1px solid #e2e8f0', padding: '1px 6px', borderRadius: '4px' }}>{item.label}</span>
                        </div>
                        <p style={{ fontSize: '0.85rem', color: '#64748b' }}>{item.scope}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                         <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f766e' }}>{item.price}</div>
                         <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>預計 3-5 天完成</div>
                      </div>
                   </div>
                ))}
              </div>
            )}

            {activeTab === 'specialist' && (
              <div>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    {['Payroll Setup', 'CIS Returns', 'Company Formation', 'R&D Tax Credit Claim', 'Capital Gains Tax', 'Mortgage Letters'].map(tag => (
                      <span key={tag} style={{ padding: '0.5rem 1rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '0.85rem', color: '#475569', fontWeight: 600 }}>
                        {tag}
                      </span>
                    ))}
                 </div>
                 <div style={{ backgroundColor: '#fff7ed', border: '1px solid #ffedd5', padding: '1.25rem', borderRadius: '12px', display: 'flex', gap: '1rem' }}>
                    <Briefcase size={24} color="#c2410c" />
                    <div>
                       <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#9a3412', marginBottom: '0.4rem' }}>專項諮詢服務</h4>
                       <p style={{ fontSize: '0.875rem', color: '#9a3412', lineHeight: 1.5 }}>
                         複雜的稅務問題？我們可以提供針對性的解決方案，包括 R&D 研發稅收抵免、遺產稅規劃及復雜的公司架構重組。支持按小時或按效果計費。
                       </p>
                    </div>
                 </div>
              </div>
            )}
          </div>

          <button className="btn btn-primary" style={{ width: '100%', marginTop: '2.5rem', padding: '1rem', borderRadius: '10px', fontSize: '1.1rem', fontWeight: 700 }}>
             立即預約諮詢 (Book Consultation)
          </button>
        </div>
      )}
    </div>
  );
}
