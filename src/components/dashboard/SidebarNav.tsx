"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Calendar, Wallet, User, Settings, ShieldCheck, 
  Car, Home as HomeIcon, BarChart3, LayoutDashboard, ScrollText,
  MessageSquare, Clock, Briefcase, ChevronRight, LogOut, Sparkles,
  Zap, Star, Calculator
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "@/components/ThemeContext";

interface SidebarNavProps {
  isMerchant: boolean;
  userName: string;
}

export default function SidebarNav({ isMerchant, userName }: SidebarNavProps) {
  const pathname = usePathname();
  const { theme } = useTheme();

  const mainItems = [
    { href: "/dashboard", label: "總覽 (Overview)", icon: isMerchant ? LayoutDashboard : Home },
    { href: "/dashboard/bookings", label: "我的預約 (Bookings)", icon: Calendar },
    { href: "/dashboard/chat", label: "在線訊息 (Messages)", icon: MessageSquare },
  ];

  const businessItems = isMerchant ? [
    { href: "/dashboard/merchant/schedule", label: "預約日程 (Schedule)", icon: Calendar },
    { href: "/dashboard/services", label: "服務管理 (Services)", icon: ScrollText },
    { href: "/dashboard/merchant/availability", label: "可用時段 (Availability)", icon: Clock },
    { href: "/dashboard/analytics", label: "績效分析 (Analytics)", icon: BarChart3 },
    { href: "/dashboard/merchant/accounting", label: "會計與稅務 (Tax & Accounting)", icon: Calculator },
    { href: "/dashboard/earnings", label: "收入錢包 (Wallet)", icon: Wallet },
  ] : [
    { href: "/dashboard/garage", label: "我的車庫 (Garage)", icon: Car },
    { href: "/dashboard/properties", label: "我的房產 (Properties)", icon: HomeIcon },
    { href: "/dashboard/wallet", label: "獎勵積分 (Rewards)", icon: Star },
  ];

  const accountItems = [
    { href: "/dashboard/profile", label: "個人資料 (Profile)", icon: User },
    { href: "/dashboard/settings", label: "帳號設定 (Settings)", icon: Settings },
  ];

  const renderNavSection = (title: string, items: typeof mainItems) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <p style={{ 
        fontSize: '10px', 
        fontWeight: 900, 
        color: 'var(--text-muted)', 
        textTransform: 'uppercase', 
        letterSpacing: '0.12em', 
        paddingLeft: '1rem', 
        marginBottom: '0.75rem' 
      }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {items.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link 
              key={item.href}
              href={item.href} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                padding: '0.85rem 1rem', 
                borderRadius: '14px', 
                backgroundColor: isActive ? 'rgba(212, 175, 55, 0.1)' : 'transparent', 
                color: isActive ? '#d4af37' : 'var(--text-secondary)', 
                fontWeight: isActive ? 800 : 500, 
                textDecoration: 'none',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                border: isActive ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid transparent'
              }}
              className={isActive ? "" : "hover-sidebar-item"}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Icon size={18} color={isActive ? "#d4af37" : "var(--text-secondary)"} /> 
                <span style={{ fontSize: '0.9rem' }}>{item.label}</span>
              </div>
              {isActive && <ChevronRight size={14} color="#d4af37" />}
            </Link>
          );
        })}
      </div>
    </div>
  );

  return (
    <nav style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '100%', 
      paddingTop: '0.5rem' 
    }}>
      {/* Main Actions */}
      {renderNavSection("Main Terminal", mainItems)}
      
      {/* Role-specific Actions */}
      {renderNavSection(isMerchant ? "Elite Business" : "Assets & Rewards", businessItems)}
      
      {/* Account Actions */}
      {renderNavSection("Expert Account", accountItems)}

      {/* Pro Membership / Verification status footer card */}
      <div style={{ 
        marginTop: 'auto', 
        padding: '1.25rem', 
        backgroundColor: theme === 'dark' ? '#111' : 'var(--surface-1)', 
        borderRadius: '20px', 
        border: theme === 'dark' ? '1px solid #222' : '1px solid var(--border-color)',
        marginBottom: '1rem',
        boxShadow: theme === 'dark' ? '0 4px 12px rgba(0,0,0,0.2)' : 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
          <div style={{ backgroundColor: '#d4af37', padding: '0.5rem', borderRadius: '10px' }}>
            <ShieldCheck size={18} color="#000" />
          </div>
          <div>
            <p style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--text-primary)' }}>Trust Verified</p>
            <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ConciergeAI Expert</p>
          </div>
        </div>
        <div style={{ 
          backgroundColor: theme === 'dark' ? '#000' : 'var(--accent-soft)', 
          padding: '0.5rem', 
          borderRadius: '10px', 
          fontSize: '0.75rem', 
          color: '#d4af37', 
          fontWeight: 800, 
          textAlign: 'center',
          cursor: 'pointer',
          border: '1px solid rgba(212, 175, 55, 0.3)'
        }} className="hover-lift">
          <Zap size={14} style={{ marginRight: '4px', verticalAlign: 'middle' }} /> Boost Reach
        </div>
      </div>

      {/* Logout */}
      <button 
        onClick={() => signOut()}
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.85rem', 
          padding: '1rem', 
          backgroundColor: 'transparent',
          border: 'none',
          color: '#ef4444',
          fontWeight: 700,
          fontSize: '0.9rem',
          cursor: 'pointer',
          borderRadius: '14px',
          width: '100%',
          textAlign: 'left',
          transition: 'all 0.2s'
        }}
        className="hover-sidebar-item-red"
      >
        <LogOut size={18} /> 登出系統 Logout
      </button>

      <style jsx>{`
        .hover-sidebar-item:hover {
          background-color: rgba(212, 175, 55, 0.05);
          color: var(--accent-color) !important;
          transform: translateX(4px);
        }
        .hover-sidebar-item-red:hover {
          background-color: rgba(239, 68, 68, 0.05);
          transform: translateX(4px);
        }
        .hover-lift:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.1);
          border-color: #d4af37 !important;
        }
      `}</style>
    </nav>
  );
}
