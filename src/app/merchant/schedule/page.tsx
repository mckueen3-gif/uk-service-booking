"use client";

import { useState, useEffect } from 'react';
import { 
  getMerchantBookings, 
  rescheduleBooking 
} from '@/app/actions/merchant_dashboard';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Users, Clock, MapPin, MessageSquare, 
  ExternalLink, Loader2, Sparkles, X,
  Save, AlertCircle, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/components/LanguageContext';

export default function MerchantSchedulePage() {
  const { t } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    async function load() {
      const res = await getMerchantBookings();
      if (res.bookings) {
        setBookings(res.bookings);
      }
      setLoading(false);
    }
    load();
  }, []);

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const handleReschedule = async () => {
    if (!newDate || !selectedBooking) return;
    setSaving(true);
    const res = await rescheduleBooking(selectedBooking.id, newDate);
    if (res.success) {
      setBookings(prev => prev.map(b => b.id === selectedBooking.id ? { ...b, scheduledDate: new Date(newDate) } : b));
      setMsg({ type: 'success', text: t.merchant.merchant_schedule.reschedule.success });
      setTimeout(() => {
        setModalOpen(false);
        setMsg(null);
      }, 2000);
    } else {
      setMsg({ type: 'error', text: t.merchant.merchant_schedule.reschedule.failed });
      setSaving(false);
    }
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const days = daysInMonth(year, month);
    const firstDay = firstDayOfMonth(year, month);
    const calendarDays = [];

    // Empty slots before first day
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} style={{ height: '140px', backgroundColor: 'var(--bg-secondary)', opacity: 0.3, border: '1px solid var(--border-color)' }}></div>);
    }

    // Days with bookings
    for (let d = 1; d <= days; d++) {
      const dateStr = new Date(year, month, d).toDateString();
      const dailyBookings = bookings.filter(b => new Date(b.scheduledDate).toDateString() === dateStr);
      const isToday = new Date().toDateString() === dateStr;

      calendarDays.push(
        <div key={d} style={{ 
          height: '140px', 
          padding: '0.75rem', 
          backgroundColor: isToday ? 'rgba(212, 175, 55, 0.05)' : 'var(--surface-1)', 
          border: isToday ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          position: 'relative',
          transition: 'all 0.2s',
          overflow: 'hidden'
        }} className="hover:shadow-lg">
          <div style={{ 
            fontSize: '1rem', 
            fontWeight: 800, 
            color: isToday ? 'var(--accent-color)' : 'var(--text-primary)',
            display: 'flex',
            justifyContent: 'space-between'
          }}>
            {d}
            {isToday && <span style={{ fontSize: '0.65rem', backgroundColor: 'var(--accent-color)', color: 'black', padding: '1px 6px', borderRadius: '4px' }}>TODAY</span>}
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto', flex: 1 }}>
            {dailyBookings.map(b => (
              <button 
                key={b.id}
                onClick={() => {
                  setSelectedBooking(b);
                  setNewDate(new Date(b.scheduledDate).toISOString().slice(0, 16));
                  setModalOpen(true);
                }}
                style={{ 
                  textAlign: 'left',
                  fontSize: '0.7rem', 
                  padding: '4px 8px', 
                  borderRadius: '6px', 
                  backgroundColor: b.status === 'PENDING' ? '#f59e0b22' : '#10b98122',
                  color: b.status === 'PENDING' ? '#f59e0b' : '#10b981',
                  border: `1px solid ${b.status === 'PENDING' ? '#f59e0b44' : '#10b98144'}`,
                  fontWeight: 800,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  cursor: 'pointer'
                }}
              >
                {new Date(b.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {b.customer?.name}
              </button>
            ))}
          </div>
        </div>
      );
    }

    return calendarDays;
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
      <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            {t.merchant.merchant_schedule.title.split(' ')[0]} <span style={{ color: 'var(--accent-color)' }}>{t.merchant.merchant_schedule.title.split(' ')[1] || ""}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
            {t.merchant.merchant_schedule.subtitle}
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', backgroundColor: 'var(--surface-1)', padding: '0.75rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
          <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronLeft size={20} /></button>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, minWidth: '180px', textAlign: 'center' }}>
            {currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' })}
          </div>
          <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronRight size={20} /></button>
        </div>
      </header>

      <div className="glass-panel" style={{ padding: '2rem', borderRadius: '32px', overflow: 'hidden' }}>
        {/* Calendar Grid Header */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', marginBottom: '1.5rem' }}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
            <div key={day} style={{ fontSize: '0.8rem', fontWeight: 900, color: 'var(--text-muted)', letterSpacing: '0.1em' }}>{day}</div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '1px', backgroundColor: 'var(--border-color)', border: '1px solid var(--border-color)', borderRadius: '16px', overflow: 'hidden' }}>
          {renderCalendar()}
        </div>
      </div>

      <div style={{ marginTop: '2.5rem', display: 'flex', gap: '2rem', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#f59e0b22', border: '1px solid #f59e0b44' }}></div>
          {t.merchant.merchant_schedule.pending}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: '#10b98122', border: '1px solid #10b98144' }}></div>
          {t.merchant.merchant_schedule.confirmed}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(212, 175, 55, 0.05)', border: '1px solid var(--accent-color)' }}></div>
          {t.merchant.merchant_schedule.today}
        </div>
      </div>

      {/* Booking Detail & Reschedule Modal */}
      {modalOpen && selectedBooking && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div className="glass-panel animate-scale-in" style={{ width: '100%', maxWidth: '600px', padding: '3rem', borderRadius: '40px', backgroundColor: 'var(--surface-1)', border: '1.5px solid var(--border-color)', position: 'relative' }}>
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={24} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '20px', backgroundColor: 'var(--accent-soft)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.5rem' }}>
                {selectedBooking.customer?.name?.[0]}
              </div>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 950, marginBottom: '0.25rem' }}>{selectedBooking.customer?.name}</h2>
                <div style={{ fontSize: '1rem', color: 'var(--accent-color)', fontWeight: 800 }}>{selectedBooking.service?.name}</div>
              </div>
            </div>

            {msg && (
              <div style={{ 
                padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem', 
                backgroundColor: msg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: msg.type === 'success' ? '#10b981' : '#ef4444',
                border: '1px solid',
                display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700
              }}>
                {msg.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                {msg.text}
              </div>
            )}

            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gap: '0.8rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  <Clock size={20} /> 
                  <span>{t.merchant.merchant_schedule.details.current}: {new Date(selectedBooking.scheduledDate).toLocaleString()}</span>
                </div>
                {selectedBooking.customer?.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    <MapPin size={20} /> 
                    <span>{t.merchant.merchant_schedule.details.phone}: {selectedBooking.customer.phone}</span>
                  </div>
                )}
              </div>

               <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '24px', border: '1.5px solid var(--border-color)' }}>
                <label style={{ display: 'block', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-primary)' }}>{t.merchant.merchant_schedule.reschedule.title}</label>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input 
                    type="datetime-local" 
                    value={newDate} 
                    onChange={e => setNewDate(e.target.value)}
                    style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 700 }}
                  />
                  <button 
                    onClick={handleReschedule}
                    disabled={saving}
                    className="btn btn-primary"
                    style={{ padding: '0 2rem', borderRadius: '12px' }}
                  >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  </button>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>{t.merchant.merchant_schedule.notice}</p>
              </div>

               <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href={`/dashboard/chat?customerId=${selectedBooking.customerId}`} style={{ flex: 1, textDecoration: 'none' }}>
                  <button className="btn" style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', border: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 800 }}>
                    <MessageSquare size={20} /> {t.merchant.merchant_schedule.details.chat}
                  </button>
                </Link>
                <Link href={`/webhook/mock/stripe-checkout?bookingId=${selectedBooking.id}`} style={{ flex: 1, textDecoration: 'none' }}>
                  <button className="btn" style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', border: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', fontWeight: 800 }}>
                    <ExternalLink size={20} /> {t.merchant.merchant_schedule.details.viewOrder}
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
