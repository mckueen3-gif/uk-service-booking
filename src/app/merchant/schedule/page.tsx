"use client";

import { useState, useEffect } from 'react';
import { 
  getMerchantBookings, 
  rescheduleBooking 
} from '@/app/actions/merchant_dashboard';
import { 
  getCustomScheduleSlots,
  addCustomScheduleSlot,
  removeCustomScheduleSlot
} from '@/app/actions/availability';
import { 
  Calendar as CalendarIcon, ChevronLeft, ChevronRight, 
  Users, Clock, MapPin, MessageSquare, 
  ExternalLink, Loader2, Sparkles, X,
  Save, AlertCircle, CheckCircle2, Plus, Trash2,
  UserPlus
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/components/LanguageContext';

export default function MerchantSchedulePage() {
  const { t, isRTL } = useTranslation();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [customSlots, setCustomSlots] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Selection
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  
  // Booking modal state
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [newDate, setNewDate] = useState('');
  
  // Custom Slot State
  const [customAction, setCustomAction] = useState<"ADD" | "BLOCK" | "MANUAL">("ADD");
  const [customStart, setCustomStart] = useState("10:00");
  const [customEnd, setCustomEnd] = useState("11:00");
  const [customDetails, setCustomDetails] = useState({
    title: "", customerName: "", customerPhone: "", notes: ""
  });
  const [saving, setSaving] = useState(false);

  const [msg, setMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  useEffect(() => {
    loadData();
  }, [currentDate]);

  async function loadData() {
    setLoading(true);
    // Fetch Bookings Month
    const res = await getMerchantBookings();
    if (res.bookings) {
      setBookings(res.bookings);
    }
    setLoading(false);
  }

  // Load specific custom slots when a day is clicked
  useEffect(() => {
    if (selectedDay) {
      loadCustomSlotsForDay(selectedDay);
    }
  }, [selectedDay]);

  const loadCustomSlotsForDay = async (d: number) => {
    const dDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), d);
    // format as YYYY-MM-DD
    const dStr = dDate.toISOString().split('T')[0];
    const cRes = await getCustomScheduleSlots(dStr);
    if (cRes.success) {
      setCustomSlots(cRes.slots);
    }
  };

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
      setMsg({ type: 'success', text: t?.merchant?.merchant_schedule?.reschedule?.success || "Schedule updated successfully" });
      setTimeout(() => {
        setBookingModalOpen(false);
        setMsg(null);
      }, 2000);
    } else {
      setMsg({ type: 'error', text: t?.merchant?.merchant_schedule?.reschedule?.failed || "Update failed" });
      setSaving(false);
    }
  };

  const handleAddCustom = async () => {
    if (!selectedDay) return;
    setSaving(true);
    const dDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay);
    const dStr = dDate.toISOString().split('T')[0];
    
    // If ADD, it's an available slot. If BLOCK or MANUAL, it's a blocked (unavailable) slot.
    const isAvail = customAction === "ADD";
    
    // Optional details if it's a manual booking
    let details = {};
    if (customAction === "MANUAL") {
      details = { ...customDetails };
    } else if (customAction === "BLOCK") {
      details = { title: "Blocked" };
    }

    const res = await addCustomScheduleSlot(dStr, customStart, customEnd, isAvail, details);
    
    if (res.success) {
      setMsg({ type: 'success', text: "Schedule updated successfully." });
      setCustomDetails({ title: "", customerName: "", customerPhone: "", notes: "" });
      await loadCustomSlotsForDay(selectedDay);
      setTimeout(() => setMsg(null), 2000);
    } else {
      setMsg({ type: 'error', text: "Failed to update schedule." });
    }
    setSaving(false);
  };

  const handleRemoveCustom = async (id: string) => {
    setSaving(true);
    const res = await removeCustomScheduleSlot(id);
    if (res.success) {
      setMsg({ type: 'success', text: "Removed slot successfully." });
      if (selectedDay) await loadCustomSlotsForDay(selectedDay);
      setTimeout(() => setMsg(null), 2000);
    } else {
      setMsg({ type: 'error', text: "Failed to remove slot." });
    }
    setSaving(false);
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
      
      // Look for manual bookings in the future? Wait, customSlots is only loaded for selectedDay.
      // We could ideally load ALL custom slots for the month later, but for now we'll just show normal bookings.
      
      const isToday = new Date().toDateString() === dateStr;
      const isSelected = selectedDay === d;

      calendarDays.push(
        <div key={d} 
          onClick={() => setSelectedDay(d)}
          style={{ 
          height: '140px', 
          padding: '0.75rem', 
          backgroundColor: isSelected ? 'rgba(99, 102, 241, 0.08)' : isToday ? 'rgba(212, 175, 55, 0.05)' : 'var(--surface-1)', 
          border: isSelected ? '2px solid #6366f1' : isToday ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
          position: 'relative',
          transition: 'all 0.2s',
          overflow: 'hidden',
          cursor: 'pointer'
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
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedBooking(b);
                  setNewDate(new Date(b.scheduledDate).toISOString().slice(0, 16));
                  setBookingModalOpen(true);
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
            {dailyBookings.length === 0 && <span style={{fontSize: '0.7rem', color: 'var(--text-muted)'}}>{t?.common?.noData || "No Bookings"}</span>}
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
    <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', direction: isRTL ? 'rtl' : 'ltr' }}>
      <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.03em', textAlign: isRTL ? 'right' : 'left' }}>
            {(t?.merchant?.merchant_schedule?.title || "Staff Schedule").split(' ')[0]} <span style={{ color: 'var(--accent-color)' }}>{(t?.merchant?.merchant_schedule?.title || "").split(' ')[1] || ""}</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', textAlign: isRTL ? 'right' : 'left' }}>
            {t?.merchant?.merchant_schedule?.subtitle || "Coordinate your service portfolio and availability."}
          </p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', backgroundColor: 'var(--surface-1)', padding: '0.75rem 1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
          <button onClick={prevMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronLeft size={20} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} /></button>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, minWidth: '180px', textAlign: 'center' }}>
            {currentDate.toLocaleDateString([], { month: 'long', year: 'numeric' })}
          </div>
          <button onClick={nextMonth} className="p-2 hover:bg-white/5 rounded-full transition-colors"><ChevronRight size={20} style={{ transform: isRTL ? 'rotate(180deg)' : 'none' }} /></button>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: selectedDay ? (isRTL ? '400px 1fr' : '1fr 400px') : '1fr', gap: '2rem', transition: 'all 0.3s' }}>
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

        {selectedDay && (
          <div className="glass-panel animate-fade-left" style={{ padding: '2rem', borderRadius: '32px', backgroundColor: 'var(--surface-1)', display: 'flex', flexDirection: 'column', gap: '2rem', overflowY: 'auto', maxHeight: 'calc(100vh - 150px)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  Day Management
                </h3>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  {new Date(currentDate.getFullYear(), currentDate.getMonth(), selectedDay).toDateString()}
                </div>
              </div>
              <button onClick={() => setSelectedDay(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {msg && (
              <div style={{ 
                padding: '1rem', borderRadius: '12px', 
                backgroundColor: msg.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: msg.type === 'success' ? '#10b981' : '#ef4444',
                border: '1px solid',
                display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.85rem'
              }}>
                {msg.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                {msg.text}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div style={{ padding: '1.25rem', backgroundColor: 'var(--surface-2)', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Add Manual Details</h4>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  
                  {/* Action Type Selector */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
                    <button type="button" onClick={() => setCustomAction("ADD")} style={{padding: '0.5rem', borderRadius: '8px', border: '1px solid ' + (customAction==="ADD" ? '#10b981' : 'var(--border-color)'), backgroundColor: customAction==="ADD" ? '#10b98122' : 'transparent', color: customAction==="ADD" ? '#10b981' : 'var(--text-muted)', fontWeight: 800, fontSize: '0.75rem'}}>Add Free Slot</button>
                    <button type="button" onClick={() => setCustomAction("BLOCK")} style={{padding: '0.5rem', borderRadius: '8px', border: '1px solid ' + (customAction==="BLOCK" ? '#ef4444' : 'var(--border-color)'), backgroundColor: customAction==="BLOCK" ? '#ef444422' : 'transparent', color: customAction==="BLOCK" ? '#ef4444' : 'var(--text-muted)', fontWeight: 800, fontSize: '0.75rem'}}>Block Slot</button>
                    <button type="button" onClick={() => setCustomAction("MANUAL")} style={{padding: '0.5rem', borderRadius: '8px', border: '1px solid ' + (customAction==="MANUAL" ? '#6366f1' : 'var(--border-color)'), backgroundColor: customAction==="MANUAL" ? '#6366f122' : 'transparent', color: customAction==="MANUAL" ? '#6366f1' : 'var(--text-muted)', fontWeight: 800, fontSize: '0.75rem'}}>Manual Booking</button>
                  </div>
                  
                  {/* Time Selector */}
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input type="time" value={customStart} onChange={e => setCustomStart(e.target.value)} className="input-field" style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', backgroundColor: 'var(--bg-primary)' }} />
                    <span style={{ color: 'var(--text-muted)' }}>-</span>
                    <input type="time" value={customEnd} onChange={e => setCustomEnd(e.target.value)} className="input-field" style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', backgroundColor: 'var(--bg-primary)' }} />
                  </div>

                  {/* Manual Booking Extra Details */}
                  {customAction === "MANUAL" && (
                    <div className="animate-scale-in" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                      <input 
                        type="text" 
                        placeholder="Service Name (e.g. Haircut)" 
                        value={customDetails.title}
                        onChange={e => setCustomDetails({...customDetails, title: e.target.value})}
                        className="input-field" 
                        style={{ padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }} 
                      />
                      <input 
                        type="text" 
                        placeholder="Customer Name" 
                        value={customDetails.customerName}
                        onChange={e => setCustomDetails({...customDetails, customerName: e.target.value})}
                        className="input-field" 
                        style={{ padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }} 
                      />
                      <input 
                        type="text" 
                        placeholder="Phone or Email" 
                        value={customDetails.customerPhone}
                        onChange={e => setCustomDetails({...customDetails, customerPhone: e.target.value})}
                        className="input-field" 
                        style={{ padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }} 
                      />
                      <textarea 
                        placeholder="Additional Notes" 
                        value={customDetails.notes}
                        onChange={e => setCustomDetails({...customDetails, notes: e.target.value})}
                        className="input-field" 
                        style={{ padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', minHeight: '60px' }} 
                      />
                    </div>
                  )}

                  <button onClick={handleAddCustom} disabled={saving} className="btn btn-primary" style={{ padding: '0.6rem', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                    {saving ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />} Save Entry
                  </button>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Custom Blocks Assigned</h4>
                {customSlots.length === 0 ? (
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-primary)', borderRadius: '12px' }}>
                    No custom schedule slots found for this date.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '0.75rem' }}>
                    {customSlots.map(c => (
                      <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '1rem', borderRadius: '12px', border: `1px solid ${c.isAvailable ? '#10b98144' : c.customerName ? '#6366f144' : '#ef444444'}`, backgroundColor: c.isAvailable ? '#10b98111' : c.customerName ? '#6366f111' : '#ef444411' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: c.isAvailable ? '#10b981' : c.customerName ? '#6366f1' : '#ef4444', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            {c.isAvailable ? "Availability Override" : c.customerName ? "Offline Booking" : "Blocked Time"}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-primary)', fontWeight: 800, paddingBottom: '0.25rem' }}>
                            {c.startTime} - {c.endTime}
                          </div>
                          
                          {c.customerName && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                              <div style={{ fontWeight: 700 }}><UserPlus size={12} className="inline mr-1"/>{c.customerName}</div>
                              {c.customerPhone && <div>{c.customerPhone}</div>}
                              {c.title && <div style={{ color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.25rem' }}>Service: {c.title}</div>}
                            </div>
                          )}
                          {!c.customerName && c.title && (
                             <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{c.title}</div>
                          )}
                        </div>
                        <button onClick={() => handleRemoveCustom(c.id)} disabled={saving} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '0.5rem', borderRadius: '8px' }} className="hover:bg-red-500/10">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Detail Modal (Skipped to save space, unchanged) */}
      {bookingModalOpen && selectedBooking && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, direction: isRTL ? 'rtl' : 'ltr' }}>
          <div className="glass-panel animate-scale-in" style={{ width: '100%', maxWidth: '600px', padding: '3rem', borderRadius: '40px', backgroundColor: 'var(--surface-1)', border: '1.5px solid var(--border-color)', position: 'relative' }}>
            <button onClick={() => setBookingModalOpen(false)} style={{ position: 'absolute', top: '2rem', right: isRTL ? 'auto' : '2rem', left: isRTL ? '2rem' : 'auto', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <X size={24} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
              <div style={{ width: '70px', height: '70px', borderRadius: '20px', backgroundColor: 'var(--accent-soft)', color: 'var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.5rem' }}>
                {selectedBooking.customer?.name?.[0]}
              </div>
              <div>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 950, marginBottom: '0.25rem', textAlign: isRTL ? 'right' : 'left' }}>{selectedBooking.customer?.name}</h2>
                <div style={{ fontSize: '1rem', color: 'var(--accent-color)', fontWeight: 800, textAlign: isRTL ? 'right' : 'left' }}>{selectedBooking.service?.name}</div>
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
              <div style={{ display: 'grid', gap: '0.8rem', textAlign: isRTL ? 'right' : 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                  <Clock size={20} /> 
                  <span>{t?.merchant?.merchant_schedule?.details?.current || "Current"}: {new Date(selectedBooking.scheduledDate).toLocaleString()}</span>
                </div>
                {selectedBooking.customer?.phone && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    <MapPin size={20} /> 
                    <span>{t?.merchant?.merchant_schedule?.details?.phone || "Phone"}: {selectedBooking.customer.phone}</span>
                  </div>
                )}
              </div>

               <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '2rem', borderRadius: '24px', border: '1.5px solid var(--border-color)', textAlign: isRTL ? 'right' : 'left' }}>
                <label style={{ display: 'block', fontWeight: 900, marginBottom: '1rem', color: 'var(--text-primary)' }}>{t?.merchant?.merchant_schedule?.reschedule?.title || "Reschedule Deployment"}</label>
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
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
