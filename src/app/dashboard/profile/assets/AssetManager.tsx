"use client";

import { useState, useEffect } from "react";
import { addVehicle, addProperty, getUserAssets, deleteVehicle, deleteProperty } from "@/app/actions/profile_actions";
import { Car, Home, Plus, Trash2, Loader2, Info, CheckCircle2 } from "lucide-react";

export default function AssetManager() {
  const [activeTab, setActiveTab] = useState<'vehicles' | 'properties'>('vehicles');
  const [assets, setAssets] = useState<any>({ vehicles: [], properties: [] });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Form states
  const [vehicleForm, setVehicleForm] = useState({ make: '', model: '', year: '', reg: '' });
  const [propertyForm, setPropertyForm] = useState({ address: '', type: 'House', boilerAge: '' });

  useEffect(() => {
    loadAssets();
  }, []);

  async function loadAssets() {
    setLoading(true);
    try {
      const data = await getUserAssets();
      setAssets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const handleAddVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addVehicle(vehicleForm);
      setVehicleForm({ make: '', model: '', year: '', reg: '' });
      setMessage("Vehicle added successfully!");
      loadAssets();
    } catch (err) {
      alert("Error adding vehicle");
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleAddProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addProperty({ ...propertyForm, boilerAge: parseInt(propertyForm.boilerAge) || undefined });
      setPropertyForm({ address: '', type: 'House', boilerAge: '' });
      setMessage("Property added successfully!");
      loadAssets();
    } catch (err) {
      alert("Error adding property");
    } finally {
      setSubmitting(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleDelete = async (id: string, type: 'vehicle' | 'property') => {
    if (!confirm("Are you sure?")) return;
    try {
      if (type === 'vehicle') await deleteVehicle(id);
      else await deleteProperty(id);
      loadAssets();
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <Loader2 className="animate-spin" color="var(--accent-color)" size={32} />
    </div>
  );

  return (
    <div className="animate-fade-up">
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <button 
          onClick={() => setActiveTab('vehicles')}
          style={{ 
            flex: 1, padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', 
            backgroundColor: activeTab === 'vehicles' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
            color: 'white', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem'
          }}
        >
          <Car size={20} /> 我的車庫 (Garage)
        </button>
        <button 
          onClick={() => setActiveTab('properties')}
          style={{ 
            flex: 1, padding: '1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', 
            backgroundColor: activeTab === 'properties' ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)',
            color: 'white', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem'
          }}
        >
          <Home size={20} /> 我的物業 (Properties)
        </button>
      </div>

      {message && (
        <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#facc15', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} /> {message}
        </div>
      )}

      {/* Content */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
        
        {/* Form Column */}
        <section className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <Plus size={20} color="var(--accent-color)" /> {activeTab === 'vehicles' ? '新增車輛' : '新增物業'}
          </h3>
          
          <form onSubmit={activeTab === 'vehicles' ? handleAddVehicle : handleAddProperty} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {activeTab === 'vehicles' ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>廠牌 (Make)</label>
                    <input required value={vehicleForm.make} onChange={e => setVehicleForm({...vehicleForm, make: e.target.value})} placeholder="Toyota" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                  </div>
                  <div className="input-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>型號 (Model)</label>
                    <input required value={vehicleForm.model} onChange={e => setVehicleForm({...vehicleForm, model: e.target.value})} placeholder="Camry" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>年份 (Year)</label>
                    <input required value={vehicleForm.year} onChange={e => setVehicleForm({...vehicleForm, year: e.target.value})} placeholder="2022" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                  </div>
                  <div className="input-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>車牌 (Registration)</label>
                    <input value={vehicleForm.reg} onChange={e => setVehicleForm({...vehicleForm, reg: e.target.value})} placeholder="ABC-123" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="input-group">
                  <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>完整地址 (Full Address)</label>
                  <input required value={propertyForm.address} onChange={e => setPropertyForm({...propertyForm, address: e.target.value})} placeholder="123 High St, London" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>類型 (Type)</label>
                    <select value={propertyForm.type} onChange={e => setPropertyForm({...propertyForm, type: e.target.value})} style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }}>
                      <option>House</option>
                      <option>Flat/Apartment</option>
                      <option>Office</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>鍋爐機齡 (Boiler Age)</label>
                    <input type="number" value={propertyForm.boilerAge} onChange={e => setPropertyForm({...propertyForm, boilerAge: e.target.value})} placeholder="Years" style={{ width: '100%', padding: '0.8rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                  </div>
                </div>
              </>
            )}
            
            <button 
              disabled={submitting}
              style={{ padding: '1rem', borderRadius: '14px', backgroundColor: 'var(--accent-color)', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', marginTop: '1rem' }}
            >
              {submitting ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20}/> 立即保存</>}
            </button>
          </form>
        </section>

        {/* List Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(activeTab === 'vehicles' ? assets.vehicles : assets.properties).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '24px', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Info size={32} color="#64748b" />
              </div>
              <p style={{ color: '#64748b' }}>目前沒有任何{activeTab === 'vehicles' ? '車輛' : '物業'}記錄。</p>
            </div>
          ) : (
            (activeTab === 'vehicles' ? assets.vehicles : assets.properties).map((item: any) => (
              <div key={item.id} className="glass-panel" style={{ padding: '1.25rem 1.5rem', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', backgroundColor: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {activeTab === 'vehicles' ? <Car color="#818cf8" size={24} /> : <Home color="#818cf8" size={24} />}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{activeTab === 'vehicles' ? `${item.make} ${item.model}` : item.address}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      {activeTab === 'vehicles' ? `Reg: ${item.reg || 'N/A'} • Year: ${item.year}` : `Type: ${item.type} • Boiler: ${item.boilerAge || 'N/A'}yrs`}
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => handleDelete(item.id, activeTab === 'vehicles' ? 'vehicle' : 'property')}
                  style={{ background: 'none', border: 'none', padding: '0.5rem', cursor: 'pointer', color: '#64748b', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#64748b'}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
