"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, Clock, Save, 
  Settings, Loader2, CheckCircle2, 
  AlertCircle, Moon, Sun, 
  Coffee, Users, Info
} from 'lucide-react';
import { getMerchantAvailability, updateMerchantAvailability, AvailabilityInput } from "@/app/actions/availability";

import { useTranslation } from "@/components/LanguageContext";

const DAYS = [
  "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];


export default function AvailabilityPage() {
  const { t, locale } = useTranslation();
  const [availability, setAvailability] = useState<AvailabilityInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [slotDuration, setSlotDuration] = useState(60);
  const [maxDaily, setMaxDaily] = useState(8);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const mt = t?.merchant?.merchant_availability; // Helper for shorter access

  useEffect(() => {
    async function load() {
      const res = await getMerchantAvailability();
      if (res.availability) {
        // Ensure all days are represented
        const fullList: AvailabilityInput[] = DAYS.map((_, i) => {
          const existing = res.availability.find((a: any) => a.dayOfWeek === i);
          return existing ? {
            dayOfWeek: i,
            startTime: existing.startTime,
            endTime: existing.endTime,
            isOpen: existing.isOpen
          } : {
            dayOfWeek: i,
            startTime: "09:00",
            endTime: "17:00",
            isOpen: true
          };
        });
        setAvailability(fullList);
      }
      if (res.merchant) {
        setSlotDuration(res.merchant.slotDuration || 60);
        setMaxDaily(res.merchant.maxDailyBookings || 8);
      }
      setLoading(false);
    }
    load();
  }, []);

  const handleToggle = (index: number) => {
    const next = [...availability];
    next[index].isOpen = !next[index].isOpen;
    setAvailability(next);
  };

  const handleTimeChange = (index: number, field: 'startTime' | 'endTime', value: string) => {
    const next = [...availability];
    next[index][field] = value;
    setAvailability(next);
  };

  const onSave = async () => {
    setSaving(true);
    setMessage(null);
    const res = await updateMerchantAvailability(availability, slotDuration, maxDaily);
    if (res.success) {
      setMessage({ type: 'success', text: mt?.saved || "Availability settings synchronized successfully." });
    } else {
      setMessage({ type: 'error', text: mt?.failed || "Failed to synchronize availability." });
    }
    setSaving(false);
    setTimeout(() => setMessage(null), 3000);
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
           <h1 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>{mt?.title || "Availability Control"}</h1>
           <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{mt?.subtitle || "Configure your service window and daily capacity."}</p>
        </div>
        <button 
          onClick={onSave} 
          disabled={saving}
          className="btn btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem', borderRadius: '12px' }}
        >
           {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
           {saving ? (mt?.saving || "Saving...") : (mt?.save || "Sync Protocol")}
        </button>
      </div>

      {message && (
        <div className="animate-bounce-in" style={{ backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: message.type === 'success' ? '#facc15' : '#ef4444', padding: '1rem', borderRadius: '12px', border: `1px solid ${message.type === 'success' ? '#facc15' : '#ef4444'}`, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}>
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {availability.map((day, i) => (
            <div key={i} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', opacity: day.isOpen ? 1 : 0.6, transition: 'all 0.3s', backgroundColor: day.isOpen ? 'var(--surface-1)' : 'var(--bg-secondary)', border: '1.5px solid var(--border-color)' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <div style={{ width: '80px' }}>
                    <div style={{ fontWeight: 900, color: 'var(--text-primary)' }}>
                      {locale === 'zh-TW' ? ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'][day.dayOfWeek] : DAYS[day.dayOfWeek]}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{DAYS[day.dayOfWeek]}</div>
                  </div>
                  
                  {day.isOpen ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div className="flex items-center gap-2">
                         <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800 }}>{mt?.start || "Start"}</div>
                         <input 
                           type="time" 
                           value={day.startTime} 
                           onChange={e => handleTimeChange(i, 'startTime', e.target.value)}
                           className="input-field"
                           style={{ padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.9rem' }}
                         />
                      </div>
                      <div style={{ color: 'var(--text-secondary)' }}>—</div>
                      <div className="flex items-center gap-2">
                         <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 800 }}>{mt?.end || "End"}</div>
                         <input 
                           type="time" 
                           value={day.endTime} 
                           onChange={e => handleTimeChange(i, 'endTime', e.target.value)}
                           className="input-field"
                           style={{ padding: '0.4rem', border: '1px solid var(--border-color)', borderRadius: '8px', fontSize: '0.9rem' }}
                         />
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.9rem' }}>
                       <Moon size={16} /> {mt?.closedLabel || "Rest Day (Closed)"}
                    </div>
                  )}
               </div>

               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button 
                    onClick={() => handleToggle(i)}
                    style={{ 
                      padding: '0.4rem 1rem', 
                      borderRadius: '8px', 
                      fontSize: '0.8rem', 
                      fontWeight: 800,
                      backgroundColor: day.isOpen ? '#fecaca' : '#dcfce7',
                      color: day.isOpen ? '#dc2626' : '#166534',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    {day.isOpen ? (mt?.closeBtn || "Mark Closed") : (mt?.openBtn || "Mark Open")}
                  </button>
               </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
           <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', border: '1.5px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Settings size={18} color="var(--accent-color)" /> {mt?.settings?.title || "Global Settings"}
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                 <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t.merchant.merchant_availability.settings.interval}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <Clock size={16} color="var(--text-secondary)" />
                       <input 
                         type="number" 
                         value={slotDuration}
                         onChange={e => setSlotDuration(parseInt(e.target.value))}
                         className="input-field" 
                         style={{ flex: 1 }}
                       />
                    </div>
                 </div>

                 <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{t.merchant.merchant_availability.settings.maxDaily}</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                       <Users size={16} color="var(--text-secondary)" />
                       <input 
                         type="number" 
                         value={maxDaily}
                         onChange={e => setMaxDaily(parseInt(e.target.value))}
                         className="input-field" 
                         style={{ flex: 1 }}
                       />
                    </div>
                 </div>

                 <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: '12px', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                   <Info size={14} style={{ display: 'inline', marginBottom: '2px' }} /> {mt?.settings?.hint || "Longer service windows help mitigate unforeseen UK traffic fluctuations."}
                 </div>
              </div>
           </div>

           <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', backgroundColor: 'var(--accent-soft)', border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <Sun size={24} />
                <div>
                   <p style={{ fontWeight: 800, marginBottom: '0.25rem' }}>{mt?.tipTitle || "Expert Tip"}</p>
                   <p style={{ fontSize: '0.8rem', lineHeight: 1.5 }}>
                      {mt?.tipContent || "Maintaining consistent availability significantly increases your system ranking and visibility."}
                   </p>
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
