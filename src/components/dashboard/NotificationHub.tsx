"use client";

import { useState, useEffect } from "react";
import { getNotifications, markAsRead, markAllAsRead } from "@/app/actions/notifications";
import { Bell, Check, X, Info, AlertCircle, CheckCircle2, Loader2, ExternalLink } from "lucide-react";
import Link from "next/link";

export default function NotificationHub() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  async function fetchNotifications() {
    const { notifications: data, error } = await getNotifications() as any;
    if (!error && data) {
      setNotifications(data);
      setUnreadCount(data.filter((n: any) => !n.isRead).length);
    }
  }

  const handleMarkRead = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await markAsRead(id);
    fetchNotifications();
  };

  const handleMarkAllRead = async () => {
    setLoading(true);
    await markAllAsRead();
    fetchNotifications();
    setLoading(false);
  };

  const getTypeStyles = (type: string) => {
    switch(type) {
      case 'SUCCESS': return { bg: '#ecfdf5', icon: <CheckCircle2 size={16} color="#10b981" /> };
      case 'WARNING': return { bg: '#fffbeb', icon: <AlertCircle size={16} color="#f59e0b" /> };
      case 'ALERT': return { bg: '#fef2f2', icon: <AlertCircle size={16} color="#ef4444" /> };
      default: return { bg: '#f0f9ff', icon: <Info size={16} color="#0ea5e9" /> };
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Icon */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          background: 'none', 
          border: 'none', 
          cursor: 'pointer', 
          position: 'relative',
          padding: '0.5rem',
          color: 'var(--text-primary)'
        }}
      >
        <Bell size={24} />
        {unreadCount > 0 && (
          <span style={{ 
            position: 'absolute', 
            top: '4px', 
            right: '4px', 
            backgroundColor: '#ef4444', 
            color: 'white', 
            fontSize: '0.65rem', 
            fontWeight: 800, 
            padding: '2px 5px', 
            borderRadius: '10px',
            border: '2px solid var(--bg-primary)'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Backdrop */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }}
        />
      )}

      {/* Dropdown Panel */}
      {isOpen && (
        <div style={{ 
          position: 'absolute', 
          top: '120%', 
          right: '-10px', 
          width: '360px', 
          maxHeight: '480px', 
          backgroundColor: 'var(--surface-1)', 
          borderRadius: '1.5rem', 
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid var(--border-color)',
          zIndex: 999,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }} className="animate-scale-in">
          
          <div style={{ padding: '1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>通知中心 <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 500 }}>Notifications</span></h3>
            <button 
              onClick={handleMarkAllRead}
              disabled={loading || unreadCount === 0}
              style={{ background: 'none', border: 'none', color: 'var(--accent-color)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
            >
              {loading ? <Loader2 size={12} className="animate-spin" /> : <><Check size={14} /> 全部標記為已讀</>}
            </button>
          </div>

          <div style={{ overflowY: 'auto', flex: 1, backgroundColor: 'var(--surface-1)' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <Bell size={48} style={{ opacity: 0.1, marginBottom: '1rem' }} />
                <p style={{ fontSize: '0.9rem' }}>目前沒有任何通知</p>
              </div>
            ) : (
              notifications.map((n) => {
                const styles = getTypeStyles(n.type);
                return (
                  <div 
                    key={n.id}
                    onClick={() => { if(n.link) window.location.href = n.link; setIsOpen(false); }}
                    style={{ 
                      padding: '1.25rem', 
                      borderBottom: '1px solid var(--border-color)', 
                      display: 'flex', 
                      gap: '1rem', 
                      transition: 'all 0.2s',
                      cursor: 'pointer',
                      backgroundColor: n.isRead ? 'transparent' : 'var(--accent-soft)',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--surface-2)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = n.isRead ? 'transparent' : 'var(--accent-soft)'}
                  >
                    {!n.isRead && (
                      <div style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--accent-color)' }} />
                    )}
                    
                    <div style={{ 
                      flexShrink: 0, 
                      width: '32px', 
                      height: '32px', 
                      borderRadius: '8px', 
                      backgroundColor: styles.bg, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center' 
                    }}>
                      {styles.icon}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{n.title}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{n.message}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                        {n.link && <span style={{ color: 'var(--accent-color)', display: 'flex', alignItems: 'center', gap: '2px' }}>查看詳情 <ExternalLink size={10} /></span>}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div style={{ padding: '0.75rem', textAlign: 'center', backgroundColor: 'var(--surface-2)', borderTop: '1px solid var(--border-color)' }}>
               <Link href="/dashboard" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textDecoration: 'none' }}>查看所有紀錄</Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
