"use client";

import React, { useState } from 'react';
import { 
  TrendingDown, TrendingUp, Info, MessageCircle, BarChart3, 
  ChevronDown, ChevronUp, Sparkles, CheckCircle
} from 'lucide-react';

interface AIPricingAnalysisProps {
  merchantName: string;
  merchantPrice: number;
  location: string;
}

export default function AIPricingAnalysis({ merchantName, merchantPrice, location }: AIPricingAnalysisProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showChat, setShowChat] = useState(false);
  
  // Mock Market Data (In production, this would be derived from the database)
  const marketMin = 85;
  const marketMax = 145;
  const marketAvg = 112;
  const historicTransactions = 47;
  
  // Logic
  const priceDiff = ((merchantPrice - marketAvg) / marketAvg) * 100;
  const isCheaper = priceDiff < 0;
  
  // Determine color/status
  let statusColor = "#facc15"; // Green (Good/Low)
  let statusText = "市場競爭力強";
  if (merchantPrice > marketAvg * 1.1) {
    statusColor = "#ef4444"; // Red (High)
    statusText = "高於市場平均價";
  } else if (merchantPrice > marketAvg) {
    statusColor = "#f59e0b"; // Amber (Mid)
    statusText = "市場中等區間";
  }

  // Calculate position on the bar (0-100%)
  const barRange = marketMax - marketMin;
  const barPos = Math.min(Math.max(((merchantPrice - marketMin) / barRange) * 100, 0), 100);

  return (
    <div style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ 
          width: '100%', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          backgroundColor: '#f8fafc',
          padding: '1.25rem 1.5rem',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          cursor: 'pointer',
          transition: 'all 0.2s'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ backgroundColor: '#ccfbf1', padding: '0.6rem', borderRadius: '8px' }}>
            <BarChart3 size={20} color="#0f766e" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              AI 市場價格深度分析 <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b', marginLeft: '0.5rem' }}>(Powered by Claude)</span>
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '2px' }}>📍 {location} 地區市場參考價</p>
          </div>
        </div>
        {isExpanded ? <ChevronUp size={20} color="#94a3b8" /> : <ChevronDown size={20} color="#94a3b8" />}
      </button>

      {isExpanded && (
        <div className="animate-fade-up" style={{ 
          backgroundColor: '#ffffff', 
          border: '1px solid #e2e8f0', 
          borderTop: 'none',
          borderRadius: '0 0 12px 12px', 
          padding: '2rem',
          boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
        }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
            {/* Stats View */}
            <div>
              <div style={{ marginBottom: '1.5rem' }}>
                 <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>市場報價範圍 (30日)</p>
                 <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
                    £{marketMin} – £{marketMax}
                 </div>
                 <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                   共分析了 {historicTransactions} 筆真實成交數據
                 </p>
              </div>
              <div>
                 <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>地區平均價 vs 此商戶</p>
                 <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>£{marketAvg}</span>
                    <span style={{ 
                      fontSize: '0.9rem', 
                      fontWeight: 700, 
                      color: isCheaper ? '#d4af37' : '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      {isCheaper ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
                      {isCheaper ? `比市場平 ${Math.abs(Math.round(priceDiff))}%` : `高出市場 ${Math.round(priceDiff)}%`}
                    </span>
                 </div>
              </div>
            </div>

            {/* Visualize Meter */}
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#facc15' }}>低 (L)</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#f59e0b' }}>中 (M)</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#ef4444' }}>高 (H)</span>
               </div>
               
               <div style={{ position: 'relative', height: '12px', borderRadius: '6px', background: 'linear-gradient(to right, #facc15, #f59e0b, #ef4444)', marginBottom: '1rem' }}>
                  {/* Current Merchant Indicator */}
                  <div style={{ 
                    position: 'absolute', 
                    left: `${barPos}%`, 
                    top: '50%', 
                    transform: 'translate(-50%, -50%)',
                    width: '24px',
                    height: '24px',
                    backgroundColor: '#ffffff',
                    border: '4px solid #0f172a',
                    borderRadius: '50%',
                    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                    zIndex: 2
                  }} />
               </div>
               
               <div style={{ backgroundColor: '#f8fafc', padding: '1rem', borderRadius: '8px', borderLeft: `4px solid ${statusColor}` }}>
                  <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                    裁決階段：{statusText}
                  </p>
               </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', marginBottom: '2rem' }} />

          {/* AI Summary Section */}
          <div style={{ display: 'flex', gap: '1.5rem' }}>
             <div style={{ backgroundColor: '#f0f9ff', padding: '1rem', borderRadius: '12px', alignSelf: 'flex-start' }}>
                <Sparkles size={24} color="#0ea5e9" />
             </div>
             <div style={{ flex: 1 }}>
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>AI 即時客製化診斷</h4>
                <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                  「根據你描述嘅水管維修問題與倫敦當前行情，平均每小時報價約為 £112。呢個商戶歷史報價記錄均低於市場水平，且具備 Gas Safe 認證，**建議你可以直接預約，或在溝通窗詢問是否包含零件費用。**」
                </p>
                <button 
                  onClick={() => setShowChat(true)}
                  className="btn btn-primary" 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.6rem', 
                    padding: '0.75rem 1.5rem', 
                    borderRadius: '8px', 
                    fontWeight: 700,
                    boxShadow: '0 10px 15px -3px rgba(15, 118, 110, 0.2)'
                  }}
                >
                  <MessageCircle size={18} /> 問 AI：呢個價錢合理嗎？
                </button>
              </div>
          </div>
        </div>
      )}

      {/* AI Bot Audit Modal (Mock) */}
      {showChat && (
        <div style={{ 
          position: 'fixed', 
          inset: 0, 
          backgroundColor: 'rgba(0,0,0,0.6)', 
          backdropFilter: 'blur(4px)',
          zIndex: 1000, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          padding: '1rem'
        }}>
          <div className="animate-scale-in" style={{ 
            backgroundColor: '#ffffff', 
            width: '100%', 
            maxWidth: '500px', 
            borderRadius: '24px', 
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <div style={{ backgroundColor: '#0f172a', padding: '1.5rem', color: '#ffffff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ backgroundColor: '#334155', padding: '0.5rem', borderRadius: '10px' }}>
                    <Sparkles size={20} color="#38bdf8" />
                  </div>
                  <span style={{ fontWeight: 700 }}>AI 價格深度稽核 (Smart Audit)</span>
               </div>
               <button onClick={() => setShowChat(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                  <X size={24} />
               </button>
            </div>
            
            <div style={{ padding: '2rem', height: '400px', overflowY: 'auto' }}>
               <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0f766e', flexShrink: 0 }}></div>
                  <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '0 16px 16px 16px', fontSize: '0.9rem', color: '#1e293b' }}>
                    Hello! 我係 AI 稽核小助手。請描述一下你件工程嘅具體情況（例如：係咪需要零件、邊個地區、係咪急件？），我會為你進行精準比價。
                  </div>
               </div>
               
               <div style={{ textAlign: 'right', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'inline-block', backgroundColor: '#0f766e', color: '#ffffff', padding: '1rem', borderRadius: '16px 16px 0 16px', fontSize: '0.9rem' }}>
                    我屋企廚房個水龍頭滲水，而家係半夜，想知 £60 係咪正常？
                  </div>
               </div>

               <div style={{ display: 'flex', gap: '1rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0f766e', flexShrink: 0 }}></div>
                  <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '0 16px 16px 16px', fontSize: '0.9rem', color: '#1e293b' }}>
                    <div style={{ fontWeight: 700, marginBottom: '0.5rem', color: '#0f766e' }}>分析結果出爐：</div>
                    倫敦地區半夜緊急維修的平均行情為 £80-£120 出車費。**£60 屬於極具競爭力（便宜 25%）的價格。**<br/><br/>
                    建議確認：對方是否另收零件費。
                  </div>
               </div>
            </div>

            <div style={{ padding: '1.25rem', borderTop: '1px solid #f1f5f9', backgroundColor: '#f8fafc' }}>
               <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input 
                    type="text" 
                    placeholder="輸入你嘅工程情況..." 
                    style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', outline: 'none' }}
                  />
                  <button style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '0.75rem', borderRadius: '12px', border: 'none' }}>
                    <CheckCircle size={20} />
                  </button>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function X({ size, color }: { size: number, color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12"/>
    </svg>
  );
}
