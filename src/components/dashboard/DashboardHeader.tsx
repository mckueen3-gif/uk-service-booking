"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Bell, Search, User, LogOut, Settings, Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import NotificationDropdown from "./NotificationDropdown";

export default function DashboardHeader({ userName }: { userName: string }) {
  const pathname = usePathname();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isMerchant = pathname.startsWith('/merchant');
  const basePath = isMerchant ? "/merchant" : "/member";
  const baseLabel = isMerchant ? "專家控制台" : "會員控制台";

  // Format breadcrumbs from pathname
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = segments.map((s, i) => {
    const href = '/' + segments.slice(0, i + 1).join('/');
    return {
      label: s === 'merchant' || s === 'member' ? baseLabel : s.charAt(0).toUpperCase() + s.slice(1).replace(/-/g, ' '),
      href
    };
  });

  return (
    <header style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '1.25rem 2rem',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      borderRadius: '0 0 24px 24px',
      marginBottom: '2rem',
      boxShadow: 'var(--shadow-sm)'
    }}>
      {/* Breadcrumbs — only show sub-page name, not redundant "Dashboard" on root */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {breadcrumbs.length <= 1 ? (
            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{baseLabel}</span>
          ) : (
            <>
              <Link href={basePath} style={{ textDecoration: 'none', color: 'inherit' }}>{baseLabel}</Link>
              {breadcrumbs.slice(1).map((b, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ opacity: 0.4 }}>/</span>
                  <Link href={b.href} style={{
                    textDecoration: 'none',
                    color: i === breadcrumbs.slice(1).length - 1 ? 'var(--text-primary)' : 'inherit',
                    fontWeight: i === breadcrumbs.slice(1).length - 1 ? 700 : 400
                  }}>{b.label}</Link>
                </span>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} ref={dropdownRef}>
        {/* Search Simulation */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          backgroundColor: 'var(--surface-2)', 
          padding: '0.5rem 1rem', 
          borderRadius: '999px',
          border: '1px solid var(--border-color)',
          width: '260px'
        }}>
          <Search size={18} color="var(--text-muted)" />
          <input 
            type="text" 
            placeholder="搜尋預約或專家..." 
            style={{ 
              background: 'none', 
              border: 'none', 
              outline: 'none', 
              fontSize: '0.85rem', 
              width: '100%',
              color: 'var(--text-primary)'
            }} 
          />
        </div>

        {/* Notifications */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            style={{ 
              position: 'relative', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: '12px',
              backgroundColor: showNotifications ? 'var(--surface-2)' : 'transparent',
              transition: 'all 0.2s'
            }} 
            className="hover-sidebar-item"
          >
            <Bell size={22} color="var(--text-secondary)" />
            <span style={{ 
              position: 'absolute', 
              top: '4px', 
              right: '4px', 
              width: '10px', 
              height: '10px', 
              backgroundColor: '#ef4444', 
              borderRadius: '50%',
              border: '2px solid white',
              boxShadow: '0 0 10px rgba(239, 68, 68, 0.4)'
            }} className="float"></span>
          </button>
          
          {showNotifications && (
            <NotificationDropdown onClose={() => setShowNotifications(false)} />
          )}
        </div>

        {/* User Profile Dropdown Simulation */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1rem', borderLeft: '1px solid var(--border-color)' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-primary)' }}>{userName}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', fontWeight: 600 }}>Pro Member</div>
          </div>
          <div style={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '12px', 
            background: 'linear-gradient(135deg, var(--accent-color) 0%, var(--accent-hover) 100%)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: 'white',
            fontWeight: 800,
            fontSize: '1.1rem'
          }}>
            {userName.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  );
}
