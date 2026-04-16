"use client";

import DashboardHero from "./components/DashboardHero";
import BookingStatusPanel from "./components/BookingStatusPanel";
import DailyFeed from "./components/DailyFeed";
import Link from "next/link";
import {
  Search,
  MessageSquare,
  Sparkles,
  Wrench,
  GraduationCap,
  Scale,
  Calculator,
} from "lucide-react";

interface MemberHomeClientProps {
  userName: string;
  bookings: any[];
  merchants: any[];
}

const QUICK_ACTIONS = [
  { label: "搜尋專家", href: "/services", icon: <Search size={20} />, color: "var(--accent-color)" },
  { label: "我的對話", href: "/member/chat", icon: <MessageSquare size={20} />, color: "#10b981" },
  { label: "AI 診斷", href: "/diagnosis", icon: <Sparkles size={20} />, color: "#8b5cf6" },
  { label: "水電維修", href: "/services/results?cat=plumbing", icon: <Wrench size={20} />, color: "#3b82f6" },
  { label: "教育補習", href: "/services/results?cat=education", icon: <GraduationCap size={20} />, color: "#f59e0b" },
  { label: "法律諮詢", href: "/services/results?cat=legal", icon: <Scale size={20} />, color: "#ef4444" },
  { label: "會計報稅", href: "/services/results?cat=accounting", icon: <Calculator size={20} />, color: "#06b6d4" },
];

export default function MemberHomeClient({
  userName,
  bookings,
  merchants,
}: MemberHomeClientProps) {
  // Defensive: always arrays
  const safeBookings = Array.isArray(bookings) ? bookings : [];
  const safeMerchants = Array.isArray(merchants) ? merchants : [];

  return (
    <div
      style={{
        backgroundColor: "var(--bg-primary)",
        minHeight: "100vh",
        paddingBottom: "5rem",
      }}
    >
      <div
        className="container"
        style={{ maxWidth: "1200px", paddingTop: "2.5rem" }}
      >
        {/* ── Section 1: AI Companion Hero ─────────────────────── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <DashboardHero userName={userName} />
        </section>

        {/* ── Section 2: Quick Actions ──────────────────────────── */}
        <section style={{ marginBottom: "2.5rem" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))",
              gap: "1rem",
            }}
          >
            {QUICK_ACTIONS.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "var(--surface-1)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border-color)",
                    padding: "1.25rem 1rem",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "0.75rem",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    textAlign: "center",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(-3px)";
                    el.style.boxShadow = "var(--shadow-md)";
                    el.style.borderColor = action.color;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.transform = "translateY(0)";
                    el.style.boxShadow = "none";
                    el.style.borderColor = "var(--border-color)";
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "0.85rem",
                      background: `${action.color}15`,
                      color: action.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {action.icon}
                  </div>
                  <span
                    style={{
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                    }}
                  >
                    {action.label}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Section 3: Bookings + Feed ────────────────────────── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "2rem",
            marginBottom: "2.5rem",
          }}
          className="mobile-stack"
        >
          {/* Booking Status (left) */}
          <BookingStatusPanel bookings={safeBookings} />

          {/* Placeholder for future: Notifications / Tips */}
          <div
            style={{
              background: "var(--surface-1)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--border-color)",
              padding: "2rem",
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
            }}
          >
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              📋 英國生活小貼士
            </h3>
            {[
              "💡 記得每年更新您的 Boiler 年度服務，確保安全過冬。",
              "📅 Self-assessment 稅務申報截止日為 1月 31 日。",
              "🏠 租約到期前 2 個月通知房東，避免自動續約。",
              "🚗 MOT 到期前可提早最多 1 個月進行測試，有效期不變。",
            ].map((tip) => (
              <div
                key={tip}
                style={{
                  padding: "0.85rem 1rem",
                  background: "var(--surface-2)",
                  borderRadius: "0.75rem",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "var(--text-muted)",
                  lineHeight: 1.5,
                }}
              >
                {tip}
              </div>
            ))}
          </div>
        </div>

        {/* ── Section 4: Daily Expert Feed ─────────────────────── */}
        <section>
          <DailyFeed merchants={safeMerchants} />
        </section>
      </div>
    </div>
  );
}
