"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Home, Calendar, Wallet, User, Settings, ShieldCheck, 
  Car, Home as HomeIcon, BarChart3, LayoutDashboard, ScrollText,
  MessageSquare, Clock, Briefcase
} from "lucide-react";

interface SidebarNavProps {
  isMerchant: boolean;
}

export default function SidebarNav({ isMerchant }: SidebarNavProps) {
  const pathname = usePathname();

  const navItems = [
    { href: "/dashboard", label: "總覽 (Overview)", icon: isMerchant ? LayoutDashboard : Home },
    { href: "/dashboard/bookings", label: "我的預約 (Bookings)", icon: Calendar },
    { href: "/dashboard/chat", label: "在線訊息 (Messages)", icon: MessageSquare },
  ];

  if (!isMerchant) {
    navItems.push(
      { href: "/dashboard/garage", label: "我的車庫 (My Garage)", icon: Car },
      { href: "/dashboard/properties", label: "我的房產 (Properties)", icon: HomeIcon }
    );
  }

  if (isMerchant) {
    navItems.push(
      { href: "/dashboard/services", label: "服務管理 (Services)", icon: ScrollText },
      { href: "/dashboard/merchant/availability", label: "可用時段 (Availability)", icon: Clock },
      { href: "/dashboard/analytics", label: "數據分析 (Analytics)", icon: BarChart3 },
      { href: "/dashboard/merchant/reviews", label: "客戶評價 (Reviews)", icon: MessageSquare },
      { href: "/dashboard/merchant/portfolio", label: "作品集 (Portfolio)", icon: Briefcase },
      { href: "/dashboard/earnings", label: "收入統計 (Earnings)", icon: Wallet },
      { href: "/dashboard/verification", label: "牌照審查 (Verification)", icon: ShieldCheck }
    );
  }

  navItems.push(
    { href: "/dashboard/profile", label: "個人資料 (Profile)", icon: User },
    { href: "/dashboard/settings", label: "帳號設定 (Settings)", icon: Settings }
  );

  return (
    <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link 
            key={item.href}
            href={item.href} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem', 
              padding: '0.75rem 1rem', 
              borderRadius: '8px', 
              backgroundColor: isActive ? 'rgba(15, 118, 110, 0.1)' : 'transparent', 
              color: isActive ? '#0f766e' : 'var(--text-secondary)', 
              fontWeight: isActive ? 700 : 500, 
              textDecoration: 'none',
              transition: 'all 0.2s',
              border: isActive ? '1px solid rgba(15, 118, 110, 0.2)' : '1px solid transparent'
            }}
            className={isActive ? "" : "hover-sidebar-item"}
          >
            <Icon size={18} color={isActive ? "#0f766e" : "var(--text-secondary)"} /> 
            {item.label}
          </Link>
        );
      })}
      
      <style jsx>{`
        .hover-sidebar-item:hover {
          background-color: rgba(255, 255, 255, 0.05);
          color: var(--text-primary) !important;
        }
      `}</style>
    </nav>
  );
}
