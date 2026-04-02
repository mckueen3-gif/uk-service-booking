"use client";

import { useState } from 'react';
import { addProperty } from '@/app/actions/properties';
import { Loader2, Home, MapPin, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

export default function AddPropertyForm() {
  const [address, setAddress] = useState("");
  const [type, setType] = useState("Detached House");
  const [boilerAge, setBoilerAge] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setLoading(true);
    setMessage(null);

    const result = await addProperty({
      address,
      type,
      boilerAge: boilerAge ? parseInt(boilerAge) : undefined
    });
    
    setLoading(false);

    if (result.success) {
      setMessage({ text: "房產已成功加入清單！", type: 'success' });
      setAddress("");
      setBoilerAge("");
    } else {
      setMessage({ text: result.error || "加入失敗", type: 'error' });
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ position: 'relative' }}>
        <input 
          type="text" 
          placeholder="輸入地址 (例如: 123 London St, SW1A 1AA)" 
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          disabled={loading}
          style={{ 
            width: '100%', 
            padding: '0.85rem 1rem 0.85rem 2.5rem', 
            borderRadius: '12px', 
            border: '2px solid #f1f5f9', 
            fontSize: '0.9rem',
            fontWeight: 600
          }}
        />
        <MapPin size={18} color="#94a3b8" style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
        <select 
          value={type}
          onChange={(e) => setType(e.target.value)}
          disabled={loading}
          style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #f1f5f9', fontWeight: 600 }}
        >
          <option>Detached House</option>
          <option>Semi-Detached</option>
          <option>Terrace</option>
          <option>Flat/Apartment</option>
          <option>Commercial</option>
        </select>
        <input 
          type="number" 
          placeholder="鍋爐年齡 (年)" 
          value={boilerAge}
          onChange={(e) => setBoilerAge(e.target.value)}
          disabled={loading}
          style={{ padding: '0.75rem', borderRadius: '10px', border: '1px solid #f1f5f9', fontWeight: 600 }}
        />
      </div>
      
      <button 
        type="submit" 
        disabled={loading || !address}
        className="btn btn-primary"
        style={{ width: '100%', padding: '0.75rem', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
      >
        {loading ? <Loader2 size={18} className="animate-spin" /> : <><Plus size={18} /> 新增房產資產</>}
      </button>

      {message && (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.6rem', 
          padding: '1rem', 
          borderRadius: '10px', 
          fontSize: '0.85rem',
          fontWeight: 600,
          backgroundColor: message.type === 'success' ? '#ecfdf5' : '#fef2f2',
          color: message.type === 'success' ? '#d4af37' : '#dc2626',
          border: `1px solid ${message.type === 'success' ? '#facc15' : '#fca5a5'}`
        }} className="animate-fade-up">
          {message.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {message.text}
        </div>
      )}
    </form>
  );
}
