import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Home, Plus, MapPin, Info, Trash2, Edit3, Droplets, Shield, Calendar, ArrowRight } from "lucide-react";
import { getProperties } from "@/app/actions/properties";
import AddPropertyForm from "./AddPropertyForm";

export default async function PropertiesPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const { properties, error } = await getProperties() as any;

  if (error) return <div>Error loading properties: {error}</div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div className="animate-fade-up">
        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
          我的房產 <span style={{ color: 'var(--accent-color)' }}>Properties</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>管理您的各處物業，追蹤鍋爐、屋頂與設施狀態。</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Statistics & Quick Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel animate-fade-up delay-100" style={{ padding: '2rem', borderRadius: '24px', background: 'white' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={24} color="var(--accent-color)" /> 新增房產
            </h2>
            <AddPropertyForm />
          </div>

          <div className="glass-panel animate-fade-up delay-200" style={{ padding: '1.5rem', borderRadius: '24px', background: '#f0f9ff', border: '1px solid #bae6fd' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
               <Shield size={24} color="#0284c7" />
               <h3 style={{ fontSize: '1rem', fontWeight: 800, color: '#075985' }}>房產保險提醒</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: '#0369a1' }}>請確保您的房產資料與保險單一致。資料越完整，服務商報價越精確。</p>
          </div>
        </div>

        {/* Property List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {properties.length === 0 ? (
            <div className="glass-panel" style={{ padding: '4rem', textAlign: 'center', color: '#94a3b8', borderRadius: '24px' }}>
              <Home size={64} style={{ marginBottom: '1rem', opacity: 0.2 }} />
              <p>目前尚無紀錄的房產。</p>
            </div>
          ) : (
            properties.map((prop: any, index: number) => (
              <div 
                key={prop.id} 
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
                    <div style={{ backgroundColor: '#fdf2f2', padding: '1rem', borderRadius: '1rem' }}>
                      <Home size={32} color="#991b1b" />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{prop.address}</h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
                        <MapPin size={14} />
                        <span>{prop.type || "Residential"}</span>
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
                        <Droplets size={14} color="#3b82f6" /> 鍋爐年限 (Boiler)
                      </div>
                      <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b' }}>
                        {prop.boilerAge ? `${prop.boilerAge} 年` : "未知 (N/A)"}
                      </div>
                   </div>
                   <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', marginBottom: '0.25rem' }}>
                        <Shield size={14} color="#10b981" /> 屋頂類型 (Roof)
                      </div>
                      <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#1e293b' }}>
                        {prop.roofType || "Standard/Tile"}
                      </div>
                   </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn btn-primary" style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', fontSize: '0.85rem', fontWeight: 700, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                    預約修繕服務 <ArrowRight size={16} />
                  </button>
                  <button style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #e2e8f0', background: 'white', fontSize: '0.85rem', fontWeight: 600 }}>
                    維護日誌
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
