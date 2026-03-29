import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Car, Plus, Calendar, ShieldCheck, History, Fuel, Info, Trash2, Edit3, Search, AlertTriangle } from "lucide-react";
import { getVehicles } from "@/app/actions/garage";
import AddVehicleForm from "./AddVehicleForm";

export default async function GaragePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const { vehicles, error } = await getVehicles() as any;

  if (error) return <div>Error loading garage: {error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="animate-fade-up">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          我的車庫 <span style={{ color: 'var(--accent-color)' }}>Garage</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>管理您的所有車輛，追蹤 MOT 與保養狀態。</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Statistics & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel animate-fade-up delay-100" style={{ padding: '2rem', borderRadius: '24px', background: 'white' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={24} color="var(--accent-color)" /> 新增車輛
            </h2>
            <AddVehicleForm />
          </div>

          <div className="glass-panel animate-fade-up delay-200" style={{ padding: '1.5rem', borderRadius: '24px', background: 'linear-gradient(135deg, #fef2f2 0%, #fff1f2 100%)', border: '1px solid #fecaca' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
               <AlertTriangle size={24} color="#dc2626" />
               <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#991b1b' }}>即將到期的提醒</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#b91c1c' }}>您有 1 輛車的 MOT 即將在 30 天內到期。請儘快安排檢查。</p>
          </div>
        </div>

        {/* Vehicle List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {vehicles.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', borderRadius: '24px' }}>
              <Car size={64} style={{ marginBottom: '1rem', opacity: 0.2 }} />
              <p>車庫目前空空如也，趕快新增您的第一部愛車吧！</p>
            </div>
          ) : (
            vehicles.map((vehicle: any, index: number) => (
              <div 
                key={vehicle.id} 
                className={`glass-panel animate-fade-up delay-${(index + 2) * 100}`}
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
                    <div style={{ backgroundColor: '#f1f5f9', padding: '1rem', borderRadius: '1rem' }}>
                      <Car size={32} color="#475569" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{vehicle.make} {vehicle.model}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b' }}>
                        <span style={{ backgroundColor: '#fbbf24', color: 'black', padding: '0.1rem 0.5rem', borderRadius: '4px', fontWeight: 800, letterSpacing: '0.05em' }}>
                          {vehicle.reg || "N/A"}
                        </span>
                        <span>• {vehicle.year} Year</span>
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
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.25rem' }}>MOT DUE</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                        {vehicle.motDate ? new Date(vehicle.motDate).toLocaleDateString() : "N/A"}
                      </div>
                   </div>
                   <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.25rem' }}>LAST SERVICE</div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                        {vehicle.lastService ? new Date(vehicle.lastService).toLocaleDateString() : "Pending"}
                      </div>
                   </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700 }}>
                    這台車要預約 (Book Service)
                  </button>
                  <button style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontSize: '0.85rem', fontWeight: 600 }}>
                    履歷
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
