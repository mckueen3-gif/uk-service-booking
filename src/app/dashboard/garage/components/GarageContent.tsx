"use client";

import { useState, useEffect, useCallback } from "react";
import { Car, Plus, AlertTriangle, Edit3, Trash2, Loader2, RefreshCw, WrenchIcon } from "lucide-react";
import AddVehicleForm from "../AddVehicleForm";

export default function GarageContent() {
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [synced, setSynced] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

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
    if (!confirm('確認刪除此車輛？')) return;
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
            新增車輛
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
          <span>{synced ? '● 車庫資料已是最新' : '○ 正在載入車庫...'}</span>
          <button
            onClick={() => syncGarage()}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '0.78rem' }}
          >
            刷新
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
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ef4444' }}>即將到期的提醒</h3>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#f87171', lineHeight: 1.5 }}>
            {vehicles.length > 0
              ? '請定期檢查車輛 MOT 及保養日期，保持車況良好。'
              : '新增您的車輛後，MOT 到期提醒將顯示在此。'
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
              車庫目前空空如也
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              使用左側表單新增您的第一部愛車！
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
                        · {vehicle.year} 年
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
                    title="刪除車輛"
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
                    MOT 到期
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {vehicle.motDate ? new Date(vehicle.motDate).toLocaleDateString('zh-HK') : '未設定'}
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255,255,255,0.04)',
                  padding: '1rem',
                  borderRadius: '1rem',
                  border: '1px solid var(--border-color)'
                }}>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.4rem' }}>
                    上次保養
                  </div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {vehicle.lastService ? new Date(vehicle.lastService).toLocaleDateString('zh-HK') : '待記錄'}
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
                  預約維修
                </a>
              </div>

              {vehicle.notes && (
                <p style={{ marginTop: '1rem', fontSize: '0.82rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  備註：{vehicle.notes}
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
