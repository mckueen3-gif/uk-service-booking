"use client";

import { useState, useEffect, useCallback } from "react";
import { useTranslation } from "@/components/LanguageContext";
import { Car, Plus, AlertTriangle, Edit3, Trash2, Loader2, RefreshCw, WrenchIcon } from "lucide-react";
import AddVehicleForm from "../AddVehicleForm";

export default function GarageContent() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { t } = useTranslation();

  const syncGarage = useCallback(async () => {
    try {
      const res = await fetch('/api/garage', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        const vList = data.vehicles || [];
        setVehicles(vList);
        localStorage.setItem('garage_data', JSON.stringify(vList));
        setSynced(true);
      }
    } catch (e) {
      console.error("Garage sync failed", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Load from cache instantly
    const cached = localStorage.getItem('garage_data');
    if (cached) {
      try {
        setVehicles(JSON.parse(cached));
        setLoading(false);
      } catch (e) { /* ignore */ }
    }

    // Fetch fresh from server
    syncGarage();

    // Poll every 60 seconds (garage changes infrequently)
    const interval = setInterval(syncGarage, 60_000);
    return () => clearInterval(interval);
  }, [syncGarage]);

  // Called by AddVehicleForm after a vehicle is successfully added
  const handleVehicleAdded = useCallback(() => {
    localStorage.removeItem('garage_data');
    setSynced(false);
    setLoading(true);
    syncGarage();
  }, [syncGarage]);

  const handleDelete = async (id: string) => {
    if (!confirm(t?.garage?.confirmDelete || 'Confirm deletion of this vehicle?')) return;
    setDeleting(id);
    try {
      const { deleteVehicle } = await import('@/app/actions/garage');
      const result = await deleteVehicle(id);
      if (result.success) {
        setVehicles(prev => prev.filter(v => v.id !== id));
        localStorage.setItem('garage_data', JSON.stringify(vehicles.filter(v => v.id !== id)));
      }
    } catch (e) {
      console.error("Delete vehicle failed", e);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="animate-fade-up">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          {(t?.garage?.pageTitle || "My Garage").split(' ')[0]} <span style={{ color: 'var(--accent-color)' }}>{(t?.garage?.pageTitle || "Garage").split(' ')[1] || "Garage"}</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{t?.garage?.pageSubtitle || "Manage all your vehicles and track MOT/service status."}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>

      {/* Left: Quick Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

        {/* Add Vehicle Panel */}
        <div className="glass-panel" style={{
          padding: '2rem',
          borderRadius: '24px',
          background: 'var(--bg-primary, rgba(255,255,255,0.05))',
          border: '1px solid var(--border-color)'
        }}>
          <h2 style={{
            fontSize: '1.15rem',
            fontWeight: 800,
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: 'var(--text-primary)'
          }}>
            <Plus size={22} color="var(--accent-color)" />
            {t?.garage?.addVehicle || "Add Vehicle"}
          </h2>
          <AddVehicleForm onVehicleAdded={handleVehicleAdded} />
        </div>

        {/* Sync Status */}
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: '12px',
          backgroundColor: 'rgba(255,255,255,0.04)',
          border: '1px solid var(--border-color)',
          fontSize: '0.8rem',
          color: synced ? '#facc15' : 'var(--text-secondary)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem'
        }}>
          {loading && !synced
            ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
            : <RefreshCw size={14} />
          }
          <span>{synced ? (t?.garage?.synced || '● Garage data is up to date') : (t?.garage?.syncing || '○ Synchronizing garage...')}</span>
          <button
            onClick={() => syncGarage()}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.78rem' }}
          >
            {t?.merchant?.refresh || "Refresh"}
          </button>
        </div>

        {/* MOT Reminder */}
        <div style={{
          padding: '1.5rem',
          borderRadius: '24px',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          background: 'rgba(254, 242, 242, 0.05)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <AlertTriangle size={20} color="#dc2626" />
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ef4444' }}>{t?.garage?.alerts?.title || "Upcoming Reminders"}</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#f87171', lineHeight: 1.5 }}>
            {vehicles.length > 0
              ? (t?.garage?.alerts?.checkMot || 'Please check your MOT and service dates regularly.')
              : (t?.garage?.alerts?.empty || 'Once you add a vehicle, MOT reminders will appear here.')
            }
          </p>
        </div>
      </div>

      {/* Right: Vehicle List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {loading && vehicles.length === 0 ? (
          [1, 2].map(i => (
            <div key={i} style={{
              height: '12rem',
              borderRadius: '24px',
              background: 'rgba(255,255,255,0.04)',
              animation: 'pulse 2s ease-in-out infinite'
            }} />
          ))
        ) : vehicles.length === 0 ? (
          <div className="glass-panel" style={{
            padding: '5rem 2rem',
            textAlign: 'center',
            borderRadius: '24px',
            border: '1px solid var(--border-color)'
          }}>
            <Car size={64} style={{ margin: '0 auto 1.25rem', opacity: 0.12, color: 'var(--accent-color)' }} />
            <h3 style={{ fontWeight: 800, fontSize: '1.15rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
              {t?.garage?.empty || "Your garage is currently empty"}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {t?.garage?.emptyDesc || "Use the form on the left to add your first vehicle!"}
            </p>
          </div>
        ) : (
          vehicles.map((vehicle: any) => (
            <div
              key={vehicle.id}
              className="glass-panel animate-fade-up"
              style={{
                padding: '2rem',
                borderRadius: '24px',
                border: '1px solid var(--border-color)',
                background: 'rgba(255,255,255,0.03)',
                position: 'relative'
              }}
            >
              {/* Vehicle header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    padding: '0.875rem',
                    borderRadius: '1rem'
                  }}>
                    <Car size={28} color="var(--accent-color)" />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                      {vehicle.make} {vehicle.model}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.25rem' }}>
                      <span style={{
                        backgroundColor: '#fbbf24',
                        color: '#1c1917',
                        padding: '0.15rem 0.6rem',
                        borderRadius: '6px',
                        fontWeight: 900,
                        letterSpacing: '0.08em',
                        fontSize: '0.85rem'
                      }}>
                        {vehicle.reg || 'N/A'}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                        · {vehicle.year} {t?.common?.year || "Year"}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => handleDelete(vehicle.id)}
                    disabled={deleting === vehicle.id}
                    style={{
                      padding: '0.5rem',
                      borderRadius: '8px',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      background: 'rgba(254, 242, 242, 0.05)',
                      color: '#ef4444',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                    title={t?.common?.delete || "Delete"}
                  >
                    {deleting === vehicle.id
                      ? <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                      : <Trash2 size={16} />
                    }
                  </button>
                </div>
              </div>

              {/* MOT & Service Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  padding: '1rem',
                  borderRadius: '1rem',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    {t?.garage?.motDate || "MOT Expiry"}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {vehicle.motDate ? new Date(vehicle.motDate).toLocaleDateString() : (t?.common?.notSet || 'Not set')}
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  padding: '1rem',
                  borderRadius: '1rem',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    {t?.garage?.lastService || "Last Service"}
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {vehicle.lastService ? new Date(vehicle.lastService).toLocaleDateString() : (t?.common?.noData || 'Pending')}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a
                  href="/find"
                  className="btn btn-primary"
                  style={{
                    flex: 1,
                    padding: '0.75rem',
                    borderRadius: '12px',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <WrenchIcon size={16} />
                  {t?.home?.categories?.repairs || "Book Repair"}
                </a>
              </div>

              {vehicle.notes && (
                <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  {t?.common?.notes || "Notes"}: {vehicle.notes}
                </p>
              )}
            </div>
          ))
        )}
      </div>

      <style jsx global>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
