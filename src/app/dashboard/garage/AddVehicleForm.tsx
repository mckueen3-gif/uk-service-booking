"use client";

import { useState } from 'react';
import { lookupVehicle } from '@/app/actions/vehicle-lookup';
import { addVehicle } from '@/app/actions/garage';
import { Loader2, Search, Car, CheckCircle2, AlertCircle } from 'lucide-react';

interface Props {
  onVehicleAdded?: () => void;
}

export default function AddVehicleForm({ onVehicleAdded }: Props) {
  const [vrm, setVrm] = useState("");
  const [lookingUp, setLookingUp] = useState(false);
  const [adding, setAdding] = useState(false);
  const [vehicleData, setVehicleData] = useState<{ make: string, model: string, year: string } | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vrm.trim()) return;

    setLookingUp(true);
    setMessage(null);
    setVehicleData(null);

    try {
      const result = await lookupVehicle(vrm);
      if (result.success && result.data) {
        setVehicleData(result.data);
      } else {
        setMessage({ text: result.error || "找不到車輛資訊", type: 'error' });
      }
    } catch (e) {
      setMessage({ text: "查詢失敗，請重試", type: 'error' });
    } finally {
      setLookingUp(false);
    }
  };

  const handleAdd = async () => {
    if (!vehicleData) return;

    setAdding(true);
    try {
      const result = await addVehicle({
        make: vehicleData.make,
        model: vehicleData.model,
        year: vehicleData.year,
        reg: vrm.toUpperCase().trim()
      });

      if (result.success) {
        setMessage({ text: "✓ 車輛已成功加入車庫！", type: 'success' });
        setVrm("");
        setVehicleData(null);
        // Notify parent to re-fetch vehicle list
        onVehicleAdded?.();
      } else {
        setMessage({ text: (result as any).error || "加入失敗，請重試", type: 'error' });
      }
    } catch (e) {
      setMessage({ text: "加入失敗，請重試", type: 'error' });
    } finally {
      setAdding(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: '1.25rem' }}>
      {/* VRM Input & Lookup */}
      <form onSubmit={handleLookup} style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input
            type="text"
            placeholder="英國車牌 (例如: AB12CDE)"
            value={vrm}
            onChange={(e) => setVrm(e.target.value.toUpperCase())}
            disabled={lookingUp || adding}
            style={{
              width: '100%',
              padding: '0.85rem 1rem 0.85rem 2.8rem',
              borderRadius: '12px',
              border: '2px solid var(--border-color)',
              fontSize: '1rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              background: 'rgba(255,255,255,0.04)',
              outline: 'none',
              letterSpacing: '0.05em'
            }}
          />
          <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.9rem', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
        </div>
        <button
          type="submit"
          disabled={lookingUp || adding || !vrm.trim()}
          className="btn btn-primary"
          style={{ padding: '0 1.25rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.4rem', whiteSpace: 'nowrap' }}
        >
          {lookingUp ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : "查核"}
        </button>
      </form>

      {/* Discovery Result */}
      {vehicleData && (
        <div
          className="animate-fade-up"
          style={{
            backgroundColor: 'rgba(16, 185, 129, 0.06)',
            borderRadius: '16px',
            padding: '1.25rem',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '0.5rem',
              borderRadius: '0.75rem',
              border: '1px solid rgba(16, 185, 129, 0.2)'
            }}>
              <Car size={22} color="#facc15" />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#facc15', textTransform: 'uppercase', letterSpacing: '0.05em' }}>系統偵測結果</div>
              <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                {vehicleData.make} {vehicleData.model} ({vehicleData.year})
              </div>
            </div>
          </div>

          <button
            onClick={handleAdd}
            disabled={adding}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '10px',
              backgroundColor: '#facc15',
              color: 'white',
              border: 'none',
              fontWeight: 700,
              cursor: adding ? 'wait' : 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.9rem'
            }}
          >
            {adding ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={16} />}
            {adding ? '加入中...' : '確認加入我的車庫'}
          </button>
        </div>
      )}

      {/* Feedback Message */}
      {message && (
        <div
          className="animate-fade-up"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            padding: '0.875rem 1rem',
            borderRadius: '10px',
            fontSize: '0.875rem',
            fontWeight: 600,
            backgroundColor: message.type === 'success' ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
            color: message.type === 'success' ? '#facc15' : '#ef4444',
            border: `1px solid ${message.type === 'success' ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`
          }}
        >
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
