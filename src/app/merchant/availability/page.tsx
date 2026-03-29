"use client";

import { useState, useEffect } from 'react';
import { Clock, Calendar, Save, Loader2, CheckCircle2, XCircle, Info, Settings2 } from 'lucide-react';
import { getMerchantAvailability, updateMerchantAvailability, AvailabilityInput } from '@/app/actions/availability';

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const CHINESE_DAYS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

export default function AvailabilityPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const [availability, setAvailability] = useState<AvailabilityInput[]>(
    DAYS.map((_, i) => ({ dayOfWeek: i, startTime: "09:00", endTime: "17:00", isOpen: true }))
  );
  const [slotDuration, setSlotDuration] = useState(60);
  const [maxDaily, setMaxDaily] = useState(8);

  useEffect(() => {
    async function load() {
      const res = await getMerchantAvailability();
      if (res.availability && (res.availability as any[]).length > 0) {
        // Merge with defaults to ensure all days are present
        const merged = DAYS.map((_, i) => {
          const existing = (res.availability as any[])?.find(a => (a as any).dayOfWeek === i);
          return existing ? {
            dayOfWeek: i,
            startTime: existing.startTime,
            endTime: existing.endTime,
            isOpen: existing.isOpen
          } : { dayOfWeek: i, startTime: "09:00", endTime: "17:00", isOpen: true };
        });
        setAvailability(merged);
      }
      if (res.merchant) {
        setSlotDuration((res.merchant as any).slotDuration);
        setMaxDaily((res.merchant as any).maxDailyBookings);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleToggleDay = (index: number) => {
    const next = [...availability];
    next[index].isOpen = !next[index].isOpen;
    setAvailability(next);
  };

  const handleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const next = [...availability];
    next[index][field] = value;
    setAvailability(next);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await updateMerchantAvailability(availability, slotDuration, maxDaily);
      if (res.success) {
        setMessage({ type: 'success', text: '設定已成功儲存！' });
      } else {
        setMessage({ type: 'error', text: '儲存失敗，請稍後再試。' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: '發生錯誤：' + (err as any).message });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', opacity: 0.5 }}>
        <Loader2 className="animate-spin" size={48} />
        <p style={{ marginTop: '1rem' }}>正在讀取您的時間表...</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '6rem', paddingBottom: '6rem', maxWidth: '1000px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
           <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>服務時間管理</h1>
           <p style={{ color: 'var(--text-secondary)' }}>設定您的每週營業時段與接單規則，確保預約不衝突。</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 2.5rem' }}
        >
          {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {saving ? '儲存中...' : '儲存變更'}
        </button>
      </div>

      {message && (
        <div style={{ 
          padding: '1.5rem', 
          borderRadius: '1rem', 
          marginBottom: '2rem', 
          backgroundColor: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
          color: message.type === 'success' ? '#16a34a' : '#dc2626',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          fontWeight: 700
        }}>
          {message.type === 'success' ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '3rem', alignItems: 'start' }}>
        
        {/* Weekly Schedule */}
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
            <Calendar size={20} color="var(--accent-color)" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800 }}>每週預約時段</h2>
          </div>

          <div style={{ display: 'grid', gap: '1rem' }}>
            {availability.map((day, i) => (
              <div key={i} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.5rem', 
                padding: '1.25rem', 
                borderRadius: '1rem', 
                backgroundColor: day.isOpen ? 'var(--bg-secondary)' : 'transparent',
                border: day.isOpen ? '1px solid var(--border-color)' : '1px dashed var(--border-color)',
                opacity: day.isOpen ? 1 : 0.6,
                transition: 'all 0.2s'
              }}>
                <div style={{ width: '100px', fontWeight: 700 }}>{CHINESE_DAYS[i]}</div>
                
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {day.isOpen ? (
                    <>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} opacity={0.5} />
                        <input 
                          type="time" 
                          value={day.startTime} 
                          onChange={(e) => handleTimeChange(i, 'startTime', e.target.value)}
                          style={{ border: 'none', background: 'white', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#0f172a' }}
                        />
                      </div>
                      <span style={{ opacity: 0.3 }}>—</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Clock size={16} opacity={0.5} />
                        <input 
                          type="time" 
                          value={day.endTime} 
                          onChange={(e) => handleTimeChange(i, 'endTime', e.target.value)}
                          style={{ border: 'none', background: 'white', padding: '0.4rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.9rem', color: '#0f172a' }}
                        />
                      </div>
                    </>
                  ) : (
                    <span style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>當日不開放預約 (休息日)</span>
                  )}
                </div>

                <div 
                  onClick={() => handleToggleDay(i)}
                  style={{ 
                    cursor: 'pointer',
                    padding: '0.4rem 1rem',
                    borderRadius: '2rem',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    backgroundColor: day.isOpen ? '#dcfce7' : '#f1f5f9',
                    color: day.isOpen ? '#166534' : '#64748b',
                    border: '1px solid ' + (day.isOpen ? '#bbf7d0' : '#e2e8f0')
                  }}
                >
                  {day.isOpen ? '開發預約' : '關閉中'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Global Settings Sidebar */}
        <aside style={{ display: 'grid', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Settings2 size={18} color="var(--accent-color)" />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>接單規則</h3>
            </div>

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>平均服務時長 (分鐘)</label>
                <select 
                  value={slotDuration} 
                  onChange={(e) => setSlotDuration(parseInt(e.target.value))}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'white' }}
                >
                  <option value={30}>30 分鐘</option>
                  <option value={60}>1 小時</option>
                  <option value={90}>1.5 小時</option>
                  <option value={120}>2 小時</option>
                </select>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>這將決定預約系統中每個時段的間隔。</p>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem' }}>每日最高接單量</label>
                <input 
                  type="number" 
                  value={maxDaily} 
                  onChange={(e) => setMaxDaily(parseInt(e.target.value))}
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-secondary)', color: 'white' }}
                />
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>達到此數量後，當日將不再接受新預約。</p>
              </div>
            </div>
          </div>

          <div style={{ padding: '1.5rem', backgroundColor: '#eff6ff', borderRadius: '1rem', border: '1px solid #dbeafe' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e40af', marginBottom: '0.75rem' }}>
              <Info size={18} />
              <span style={{ fontWeight: 800, fontSize: '0.9rem' }}>專業提示</span>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#1e40af', lineHeight: 1.5, opacity: 0.8 }}>
              設定合理的服務間隔與每日上限，能幫助您提供更高品質的服務，並降低被取消或遲到的機率。
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}
