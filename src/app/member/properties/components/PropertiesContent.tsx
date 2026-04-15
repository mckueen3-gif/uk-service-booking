"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/components/LanguageContext";
import { Home, Plus, MapPin, Trash2, Edit3, Droplets, Shield, ArrowRight, Loader2 } from "lucide-react";
import AddPropertyForm from "../AddPropertyForm";

export default function PropertiesContent() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);
  const { t } = useTranslation();

  // 🚀 INSTANT FACTS: Load from local cache FIRST
  useEffect(() => {
    const cached = localStorage.getItem('properties_data');
    if (cached) {
      try {
        setProperties(JSON.parse(cached));
        setLoading(false);
      } catch (e) {
        console.error("Properties cache corrupted");
      }
    }

    // 🚀 BACKGROUND SYNC
    async function syncProperties() {
      try {
        const res = await fetch('/api/properties');
        if (res.ok) {
          const data = await res.json();
          setProperties(data.properties);
          localStorage.setItem('properties_data', JSON.stringify(data.properties));
          setSynced(true);
        }
      } catch (e) {
        console.error("Properties sync failed", e);
      } finally {
        setLoading(false);
      }
    }
    syncProperties();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="animate-fade-up">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          {(t?.properties?.pageTitle || "My Properties").split(' ')[0]} <span style={{ color: 'var(--accent-color)' }}>{(t?.properties?.pageTitle || "Properties").split(' ')[1] || "Properties"}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{t?.properties?.pageSubtitle || "Manage your various properties and track boiler, roof, and facility status."}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
      
      {/* Left: Quick Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', background: 'white' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={24} color="var(--accent-color)" /> {t?.properties?.addProperty || "Add Property"}
          </h2>
          <AddPropertyForm />
        </div>

        {/* Sync Indicator (Subtle/Professional) */}
        <div style={{ fontSize: '0.8rem', padding: '0.75rem 1rem', borderRadius: '12px', backgroundColor: 'rgba(255,255,255,0.05)', color: synced ? '#facc15' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
           {loading && !synced ? <Loader2 size={14} className="animate-spin" /> : null}
           {synced ? (t?.properties?.synced || "● Assets Synced") : (t?.properties?.syncing || "○ Syncing assets...")}
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px', background: '#f0f9ff', border: '1px solid #bae6fd' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
             <Shield size={24} color="#0284c7" />
             <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#075985' }}>{t?.properties?.insurance?.title || "Insurance Reminder"}</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#0369a1' }}>{t?.properties?.insurance?.desc || "Please ensure your property data matches your insurance policy. Complete information leads to more accurate quotes."}</p>
        </div>
      </div>

      {/* Right: Property List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading && properties.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
             <Loader2 size={48} color="var(--accent-color)" className="animate-spin" />
          </div>
        ) : properties.length === 0 ? (
          <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', borderRadius: '24px' }}>
            <Home size={64} style={{ marginBottom: '1rem', opacity: 0.2 }} />
            <p>{t?.properties?.empty || "No properties recorded yet."}</p>
          </div>
        ) : (
          properties.map((prop: any, index: number) => (
            <div 
              key={prop.id} 
              className="glass-panel animate-fade-up"
              style={{ 
                padding: '2rem', 
                borderRadius: '24px', 
                background: 'white',
                border: '1px solid rgba(0,0,0,0.05)',
                position: 'relative'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ backgroundColor: '#fdf2f2', padding: '1rem', borderRadius: '1rem' }}>
                    <Home size={32} color="#991b1b" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{prop.address}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
                      <MapPin size={14} />
                      <span>{prop.postcode} • {prop.type || t?.common?.residential || "Residential"}</span>
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #e2e8f0', background: 'white', cursor: 'pointer' }}><Edit3 size={18} /></button>
                  <button style={{ padding: '0.5rem', borderRadius: '8px', border: '1px solid #fee2e2', background: '#fef2f2', color: '#dc2626', cursor: 'pointer' }}><Trash2 size={18} /></button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.25rem' }}>
                      <Droplets size={14} color="#3b82f6" /> {t?.properties?.boilerAge || "Boiler Age"}
                    </div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
                      {prop.boilerAge ? `${prop.boilerAge} ${t?.common?.year || "Year"}` : t?.common?.noData || "N/A"}
                    </div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.25rem' }}>
                      <Shield size={14} color="#facc15" /> {t?.properties?.roofType || "Roof Type"}
                    </div>
                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                      {prop.roofType || "Standard/Tile"}
                    </div>
                  </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                  {t?.properties?.bookRepair || "Book Repair Service"} <ArrowRight size={16} />
                </button>
                <button style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontSize: '0.85rem', fontWeight: 600 }}>
                  {t?.properties?.maintenanceLogs || "Maintenance Logs"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      </div>
    </div>
  );
}
