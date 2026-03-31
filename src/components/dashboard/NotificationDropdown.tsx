'use client';

import React from 'react';
import { Bell, Sparkles, Wrench, ShieldCheck, ChevronRight, X, Clock } from 'lucide-react';
import Link from 'next/link';

interface Notification {
  id: string;
  type: 'AI_MAINTENANCE' | 'SYSTEM' | 'BOOKING';
  title: string;
  description: string;
  time: string;
  link?: string;
  isUrgent?: boolean;
}

const sampleNotifications: Notification[] = [
  {
    id: '1',
    type: 'AI_MAINTENANCE',
    title: '車輛年度檢查建議 MOT Due',
    description: '您的 VW Golf 距離上次檢查已接近一年。AI 建議在本月完成檢查，避免逾期罰款。',
    time: '2 小時前',
    link: '/book/mot-service',
    isUrgent: true
  },
  {
    id: '2',
    type: 'AI_MAINTENANCE',
    title: '鍋爐效能優化提醒 Boiler',
    description: '基於能源數據分析，建議清潔換熱器以節省約 8% 的供暖支出。',
    time: '昨天',
    link: '/services?q=boiler'
  },
  {
    id: '3',
    type: 'BOOKING',
    title: '預約已確認 Confirmation',
    description: '您與 Premium Service Ltd 的清潔預約已成功確認。',
    time: '2 天前'
  }
];

export default function NotificationDropdown({ onClose }: { onClose: () => void }) {
  return (
    <div className="glass-panel" style={{ 
      position: 'absolute', 
      top: 'calc(100% + 15px)', 
      right: '0', 
      width: '380px', 
      maxHeight: '520px', 
      overflowY: 'auto', 
      zIndex: 100, 
      padding: '1.5rem',
      background: 'rgba(255, 255, 255, 0.95)',
      boxShadow: 'var(--shadow-lg), 0 0 0 1px rgba(0,0,0,0.05)',
      borderRadius: '24px'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          通知中心 Notifications <span style={{ fontSize: '0.7rem', backgroundColor: 'var(--accent-color)', color: 'white', padding: '0.2rem 0.5rem', borderRadius: '8px' }}>{sampleNotifications.length}</span>
        </h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
          <X size={18} />
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {sampleNotifications.map((notif) => (
          <div key={notif.id} style={{ 
            padding: '1.25rem', 
            borderRadius: '18px', 
            backgroundColor: notif.type === 'AI_MAINTENANCE' ? 'var(--emerald-50)' : 'var(--surface-2)',
            border: `1px solid ${notif.type === 'AI_MAINTENANCE' ? 'rgba(5, 150, 105, 0.1)' : 'transparent'}`,
            position: 'relative',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }} className="hover-scale">
            {notif.isUrgent && (
              <div style={{ position: 'absolute', top: '10px', right: '10px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
            )}
            
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ 
                padding: '0.6rem', 
                backgroundColor: 'white', 
                borderRadius: '12px', 
                boxShadow: 'var(--shadow-sm)',
                display: 'flex'
              }}>
                {notif.type === 'AI_MAINTENANCE' ? <Sparkles size={16} color="var(--accent-color)" /> : <Clock size={16} color="var(--text-muted)" />}
              </div>
              
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>{notif.title}</h4>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>{notif.time}</span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.75rem' }}>{notif.description}</p>
                
                {notif.link && (
                  <Link href={notif.link} style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: 900, color: 'var(--accent-color)', textDecoration: 'none' }}>
                    立刻處理 Take Action <ChevronRight size={14} />
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <button style={{ background: 'none', border: 'none', fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-muted)', cursor: 'pointer' }}>
          標記所有為已讀 Mark all as read
        </button>
      </div>
    </div>
  );
}
