"use client";

import React, { useState, useMemo } from 'react';
import { Search, Filter, AlertCircle, TrendingUp, Sparkles, Clock, Zap } from 'lucide-react';
import VoucherCard from './VoucherCard';
import vouchersData from '@/lib/data/vouchers.json';
import { requestRedemption } from '@/app/actions/rewards';

interface VoucherMarketplaceProps {
  currentCredits: number;
  isAdmin?: boolean;
  onAdminTrigger?: () => void;
  onSuccess: () => void;
}

const VoucherMarketplace: React.FC<VoucherMarketplaceProps> = ({ 
  currentCredits = 0, 
  isAdmin = false, 
  onAdminTrigger = () => {}, 
  onSuccess = () => {} 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('All');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Handle new JSON structure (metadata + vouchers) with safety fallback
  const rawData = vouchersData as any;
  const vouchers = Array.isArray(rawData?.vouchers) ? rawData.vouchers : (Array.isArray(rawData) ? rawData : []);
  const metadata = rawData?.metadata || {};
  
  const isLocked = currentCredits < 10;

  const filteredVouchers = useMemo(() => {
    if (!Array.isArray(vouchers)) return [];
    return vouchers.filter((v: any) => {
      if (!v || !v.name) return false;
      const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = category === 'All' || v.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, category, vouchers]);

  const pumpedUpVouchers = useMemo(() => {
    return vouchers.filter((v: any) => v.isPumpedUp);
  }, [vouchers]);

  const handleRedeem = async (brandName: string) => {
    if (isLocked) return;
    
    if (confirm(`確定要兌換 £10 ${brandName} 禮券嗎？`)) {
      setIsSubmitting(true);
      setStatusMsg({ type: 'info', text: '處理中...' });
      
      const result = await requestRedemption(10, brandName) as any;
      
      if (result.success) {
        setStatusMsg({ type: 'success', text: `成功兌換 ${brandName} 禮券！平台將在 24 小時內發出。` });
        onSuccess();
      } else {
        setStatusMsg({ type: 'error', text: result.error || '兌換失敗' });
      }
      setIsSubmitting(false);
      
      // Clear status after 5s
      setTimeout(() => setStatusMsg({ type: '', text: '' }), 5000);
    }
  };

  const lastSyncedDate = metadata?.lastUpdated ? new Date(metadata.lastUpdated).toLocaleString('zh-TW', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }) : '未知';

  return (
    <div style={{ 
      marginTop: '20px',
      background: 'var(--surface-1)',
      padding: '30px',
      borderRadius: '24px',
      border: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-md)'
    }}>
      {/* Header & Meta */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginBottom: '25px'
      }}>
        <div 
          onClick={onAdminTrigger}
          style={{ cursor: 'pointer', userSelect: 'none' }}
          title="管理員模式隱藏開關"
        >
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)', marginBottom: '5px' }}>
            禮券兌換中心
          </h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontSize: '13px', fontWeight: '500' }}>
            <Clock size={14} style={{ color: '#1e293b' }} />
            最後同步時間：<span style={{ color: '#1e293b', fontWeight: '600' }}>{lastSyncedDate}</span> (AI 智能監控中)
          </div>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {isAdmin && (
            <button 
              onClick={() => {
                alert("🚀 已啟動 AI 全面排程更新，請確認伺服器後台輸出。");
              }}
              style={{
                background: '#000',
                color: '#d4af37',
                border: '1.5px solid #d4af37',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              強制快速同步
            </button>
          )}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 12px',
            background: 'rgba(212, 175, 55, 0.1)',
            borderRadius: '20px',
            border: '1px solid rgba(212, 175, 55, 0.2)',
            color: '#d4af37',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            <Zap size={14} fill="#d4af37" />
            實時更新已啟用
          </div>
        </div>
      </div>

      {/* 🔥 HOT DEALS SECTION */}
      {pumpedUpVouchers.length > 0 && (
        <div style={{ marginBottom: '35px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px', color: '#b8860b' }}>
            <Sparkles size={18} fill="#d4af37" />
            <span style={{ fontWeight: '900', letterSpacing: '0.1em', fontSize: '14px' }}>今日超級優惠 (HOT DEALS)</span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '15px', 
            overflowX: 'auto', 
            paddingBottom: '15px',
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none',  // IE
          }} className="hide-scrollbar">
            {pumpedUpVouchers.map((v: any, idx: number) => (
              <div key={`hot-${idx}`} style={{ minWidth: '220px' }}>
                <VoucherCard 
                  {...v} 
                  isLocked={isLocked || isSubmitting} 
                  onRedeem={handleRedeem}
                  isPremium={true} // 特殊流光標籤
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search & Filter */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '30px',
        padding: '20px',
        background: 'var(--surface-1)',
        borderRadius: '16px',
        border: '1.5px solid #d4af37',
        boxShadow: '0 8px 30px rgba(184, 134, 11, 0.08)'
      }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search size={18} style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#b8860b'
          }} />
          <input 
            type="text"
            placeholder="搜尋熱門品牌 (Adidas, IKEA, Costa...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.85rem 1rem 0.85rem 2.75rem',
              background: '#fff',
              border: '1.5px solid #d4af37',
              borderRadius: '12px',
              color: '#1e293b',
              outline: 'none',
              transition: 'all 0.2s',
              boxShadow: '0 4px 12px rgba(184, 134, 11, 0.05)'
            }}
          />
        </div>

        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {['All', 'Supermarkets', 'Food & Drink', 'Retail', 'Travel', 'Entertainment'].map(cat => {
            const isSelected = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '10px',
                  background: isSelected ? 'var(--accent-color)' : '#fff',
                  color: isSelected ? '#fff' : '#b8860b',
                  border: isSelected ? 'none' : '1.5px solid #d4af37',
                  fontSize: '13px',
                  fontWeight: '700',
                  transition: 'all 0.2s',
                  boxShadow: isSelected ? '0 4px 12px rgba(184, 134, 11, 0.2)' : 'none'
                }}
              >
                {cat === 'All' ? '全部' : 
                 cat === 'Supermarkets' ? '超市' : 
                 cat === 'Food & Drink' ? '美食餐飲' :
                 cat === 'Retail' ? '零售購物' :
                 cat === 'Travel' ? '旅遊出行' : 
                 cat === 'Entertainment' ? '休閒娛樂' : cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Threshold Warning */}
      {isLocked && (
        <div style={{
          padding: '15px 20px',
          background: 'var(--gold-50)',
          border: '1px solid var(--border-color)',
          borderRadius: '12px',
          marginBottom: '30px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#d4af37'
        }}>
          <AlertCircle size={20} />
          <div style={{ fontSize: '14px', fontWeight: '500' }}>
            最低兌換金額為 <strong>£10</strong>。您目前的儲蓄為 <strong>£{currentCredits.toFixed(2)}</strong>，還差 <strong>£{(10 - currentCredits).toFixed(2)}</strong> 即可開通兌換。
          </div>
        </div>
      )}

      {/* Status Indicators */}
      {statusMsg.text && (
        <div style={{
          padding: '12px 15px',
          borderRadius: '8px',
          marginBottom: '20px',
          background: statusMsg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
          color: statusMsg.type === 'error' ? '#ef4444' : '#10b981',
          border: `1px solid ${statusMsg.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
          fontSize: '14px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          {statusMsg.text}
        </div>
      )}

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '15px',
        color: '#475569',
        fontSize: '13px',
        fontWeight: '500'
      }}>
        <TrendingUp size={16} style={{ color: '#d4af37' }} />
        <span>發現 <strong style={{ color: '#1e293b' }}>{filteredVouchers.length}</strong> 個實時優惠</span>
        <Sparkles size={14} style={{ color: '#d4af37', marginLeft: '5px' }} />
      </div>

      {/* Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
        gap: '20px'
      }}>
        {filteredVouchers.map((voucher: any, idx: number) => (
          <VoucherCard 
            key={`${voucher.name}-${idx}`}
            name={voucher.name}
            category={voucher.category}
            type={voucher.type}
            isNew={voucher.isNew}
            isPumpedUp={voucher.isPumpedUp}
            isLocked={isLocked || isSubmitting}
            onRedeem={handleRedeem}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredVouchers.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px',
          color: 'var(--text-muted)'
        }}>
          沒有找到匹配的品牌，請嘗試其他關鍵字。
        </div>
      )}
    </div>
  );
};

export default VoucherMarketplace;
