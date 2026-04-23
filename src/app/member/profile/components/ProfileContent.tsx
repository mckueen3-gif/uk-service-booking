"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/components/LanguageContext";
import { User, Mail, Phone, Shield, Camera, Save, Building2, LayoutGrid, Loader2 } from "lucide-react";
import ProfileForm from "../components/ProfileForm";
import Link from 'next/link';

export default function ProfileContent({ initialUser }: { initialUser: any }) {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // 🚀 STEP 1: LOAD FROM CACHE (INSTANT)
    const cached = localStorage.getItem('profile_data');
    if (cached) {
      try {
        setUser(JSON.parse(cached));
      } catch (e) {
        console.error("Cache parse failed:", e);
      }
    }

    // 🚀 STEP 2: SYNC FROM SERVER (BACKGROUND)
    const fetchUser = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
          localStorage.setItem('profile_data', JSON.stringify(data));
        }
      } catch (error) {
        console.error("Profile sync failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading && !user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem', width: '100%' }}>
        <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
      </div>
    );
  }

  const isMerchant = user?.role === "MERCHANT" || user?.role === "ADMIN";

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.2fr', gap: '2.5rem', alignItems: 'start' }}>
      
      {/* Sidebar: User Info Card */}
      <div style={{ position: 'sticky', top: '100px' }}>
         <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '24px', textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ position: 'relative', width: '120px', height: '120px', margin: '0 auto 1.5rem', borderRadius: '50%', padding: '4px', border: '2px solid var(--accent-color)' }}>
               {user?.image ? (
                  <img src={user.image} alt={user.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
               ) : (
                  <div style={{ width: '100%', height: '100%', borderRadius: '50%', background: 'var(--accent-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     <User size={48} color="var(--accent-color)" />
                  </div>
               )}
               <button className="hover-lift" style={{ 
                 position: 'absolute', bottom: '0', right: '0', background: 'var(--accent-color)', color: 'white', 
                 border: 'none', borderRadius: '50%', padding: '0.6rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)' 
               }}>
                  <Camera size={16} />
               </button>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{user?.email}</p>
            
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
               <span style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#facc15', padding: '0.35rem 0.75rem', borderRadius: '2rem', fontSize: '0.75rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <Shield size={14} /> {t?.profile?.verified || "Verified"}
               </span>
               <span style={{ 
                 backgroundColor: user?.role === 'ADMIN' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(99, 102, 241, 0.1)', 
                 color: user?.role === 'ADMIN' ? '#ef4444' : '#6366f1', 
                 padding: '0.35rem 0.75rem', 
                 borderRadius: '2rem', 
                 fontSize: '0.75rem', 
                 fontWeight: 700 
               }}>
                  {user?.role === 'ADMIN' ? (t?.profile?.roles?.admin || "System Admin") : user?.role === 'MERCHANT' ? (t?.profile?.roles?.merchant || "Verified Pro") : (t?.profile?.roles?.member || "Elite Member")}
               </span>
            </div>
         </div>

         <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
               <LayoutGrid size={20} color="var(--accent-color)" /> {t?.profile?.summary || "Account Summary"}
            </h3>
            <div style={{ display: 'grid', gap: '1rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{t?.profile?.memberSince || "Member Since"}</span>
                  <span style={{ fontWeight: 600 }}>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '2024'}</span>
               </div>
               <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>{t?.profile?.status || "Account Status"}</span>
                  <span style={{ color: 'var(--success-color)', fontWeight: 600 }}>{t?.profile?.active || "Active"}</span>
               </div>
               {isMerchant && (
                 <Link href="/merchant" className="hover-lift" style={{ 
                   marginTop: '1rem', background: 'var(--accent-color)', color: 'white', padding: '0.8rem', 
                   borderRadius: '12px', textAlign: 'center', textDecoration: 'none', fontWeight: 700, fontSize: '0.9rem' 
                 }}>
                   {t?.common?.merchantPortal?.displayName || t?.common?.merchantPortal || "Merchant Dashboard"}
                 </Link>
               )}
            </div>
         </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
         <ProfileForm user={user} isMerchant={isMerchant} />
      </div>

    </div>
  );
}
