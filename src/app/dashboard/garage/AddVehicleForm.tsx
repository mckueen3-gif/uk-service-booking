"use client";

import { useState } from 'react';
import { lookupVehicle } from '@/app/actions/vehicle-lookup';
import { addVehicle } from '@/app/actions/garage';
import { Loader2, Search, Car, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AddVehicleForm() {
  const [vrm, setVrm] = useState("");
  const [lookingUp, setLookingUp] = useState(false);
  const [adding, setAdding] = useState(false);
  const [vehicleData, setVehicleData] = useState<{ make: string, model: string, year: string } | null>(null);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!vrm) return;

    setLookingUp(true);
    setMessage(null);
    setVehicleData(null);

    const result = await lookupVehicle(vrm);
    setLookingUp(false);

    if (result.success && result.data) {
      setVehicleData(result.data);
    } else {
      setMessage({ text: result.error || "找不到車輛資訊", type: 'error' });
    }
  };

  const handleAdd = async () => {
    if (!vehicleData) return;

    setAdding(true);
    const result = await addVehicle({
      make: vehicleData.make,
      model: vehicleData.model,
      year: vehicleData.year,
      reg: vrm.toUpperCase()
    });
    setAdding(false);

    if (result.success) {
      setMessage({ text: "車輛已成功加入車庫！", type: 'success' });
      setVrm("");
      setVehicleData(null);
    } else {
      setMessage({ text: result.error || "加入失敗", type: 'error' });
    }
  };

  return (
    <div style={{ display: 'grid', gap: '1.5rem' }}>
      {/* VRM Input & Lookup */}
      <form onSubmit={handleLookup} style={{ display: 'flex', gap: '0.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <input 
            type="text" 
            placeholder="輸入英國車牌 (例如: AB12CDE)" 
            value={vrm}
            onChange={(e) => setVrm(e.target.value.toUpperCase())}
            disabled={lookingUp || adding}
            style={{ 
              width: '100%', 
              padding: '0.85rem 1rem 0.85rem 3rem', 
              borderRadius: '12px', 
              border: '2px solid #f1f5f9', 
              fontSize: '1rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              color: 'var(--text-primary)'
            }}
          />
          <Search size={20} color="#94a3b8" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
        </div>
        <button 
          type="submit" 
          disabled={lookingUp || adding || !vrm}
          className="btn btn-primary" 
          style={{ padding: '0 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          {lookingUp ? <Loader2 size={18} className="animate-spin" /> : "查核"}
        </button>
      </form>

      {/* Discovery Metadata */}
      {vehicleData && (
        <div 
          className="animate-fade-up"
          style={{ 
            backgroundColor: '#f8fafc', 
            borderRadius: '16px', 
            padding: '1.25rem', 
            border: '1px solid #e2e8f0',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'white', padding: '0.5rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
               <Car size={24} color="var(--accent-color)" />
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8' }}>系統自動偵測結果</div>
              <div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{vehicleData.make} {vehicleData.model} ({vehicleData.year})</div>
            </div>
          </div>
          
          <button 
            onClick={handleAdd}
            disabled={adding}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              borderRadius: '10px', 
              backgroundColor: '#10b981', 
              color: 'white', 
              border: 'none', 
              fontWeight: 700, 
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            {adding ? <Loader2 size={18} className="animate-spin" /> : "確認加入我的車庫"}
          </button>
        </div>
      )}

      {/* Feedback Message */}
      {message && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.6rem', 
          padding: '1rem', 
          borderRadius: '10px', 
          fontSize: '0.9rem',
          fontWeight: 600,
          backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
          color: message.type === 'success' ? '#059669' : '#dc2626',
          border: `1px solid ${message.type === 'success' ? '#10b981' : '#fca5a5'}`
        }} className="animate-fade-up">
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}
    </div>
  );
}
