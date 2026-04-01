"use client";

import { useState, useEffect } from "react";
import { User, Mail, Phone, Shield, Camera, Save, Building2, LayoutGrid, Loader2 } from "lucide-react";
import ProfileForm from "../components/ProfileForm";
import Link from 'next/link';

export default function ProfileContent({ initialUser }: { initialUser: any }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    // 🚀 STEP 1: LOAD FROM CACHE (INSTANT)
    const cached = localStorage.getItem('profile_data');
    if (cached) {
      try {
        setUser(JSON.parse(cached));
        setLoading(false);
      } catch (e) {
        console.error("Profile cache corrupted");
      }
    }

    // 🚀 STEP 2: SILENT BACKGROUND SYNC
    async function fetchProfile() {
      setSyncing(true);
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          setUser(data);
          // SAVE TO CACHE
          localStorage.setItem('profile_data', JSON.stringify(data));
        }
      } catch (e) {
        console.error("Profile refresh failed", e);
      } finally {
        setLoading(false);
        setSyncing(false);
      }
    }
    fetchProfile();
  }, []);

  if (!user && loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', width: '100%' }}>
        <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
      </div>
    );
  }

  const isMerchant = user?.role === "MERCHANT";

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.2fr', gap: '2.5rem', alignItems: 'start' }}>
      
      {/* Left Side: Photo & Quick Status */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', textAlign: 'center' }}>
           <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem' }}>
              <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', border: '2px solid var(--accent-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', fontWeight: 800, color: 'var(--accent-color)' }}>
                 {user?.name?.[0] || "U"}
              </div>
              <button style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: 'var(--accent-color)', color: 'white', border: 'none', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' }}>
                 <Camera size={18} />
              </button>
           </div>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{user?.name}</h2>
           <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{user?.email}</p>
           
           <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.35rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                 <Shield size={14} /> 已驗證
              </span>
              <span style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', color: '#6366f1', padding: '0.35rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700 }}>
                 {user?.role}
              </span>
           </div>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
           <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <LayoutGrid size={20} color="var(--accent-color)" /> 帳戶摘要
           </h3>
           <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                 <span style={{ color: 'var(--text-secondary)' }}>註冊日期</span>
                 <span style={{ fontWeight: 600 }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '---'}</span>
              </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>推薦獎勵點數</span>
                  <span style={{ fontWeight: 600, color: 'var(--accent-color)' }}>£{(user?.referralCredits ?? 0).toFixed(2)}</span>
               </div>
            </div>
            
            <Link href="/dashboard/profile/assets" style={{ 
              marginTop: '1.5rem', 
              padding: '0.75rem', 
              borderRadius: '12px', 
              backgroundColor: 'rgba(99, 102, 241, 0.1)', 
              color: '#6366f1', 
              textAlign: 'center', 
              display: 'block', 
              textDecoration: 'none', 
              fontWeight: 600,
              fontSize: '0.9rem',
              border: '1px solid rgba(99, 102, 241, 0.2)'
            }}>
              管理車輛與物業資產 🚗🏠
            </Link>
         </div>
      </div>

      {/* Right Side: Update Form */}
      <section className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px' }}>
         <ProfileForm user={user} isMerchant={isMerchant} />
      </section>

    </div>
  );
}
