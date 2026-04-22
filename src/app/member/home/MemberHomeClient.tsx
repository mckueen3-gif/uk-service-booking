"use client";

import DashboardHero from "./components/DashboardHero";
import BookingStatusPanel from "./components/BookingStatusPanel";
import DailyFeed from "./components/DailyFeed";
import AIStudyHub from "./components/AIStudyHub";
import { useTranslation } from "@/components/LanguageContext";
import Link from "next/link";
import { 
  Search, 
  MessageSquare, 
  Sparkles, 
  Wrench, 
  GraduationCap, 
  Scale, 
  Calculator,
  Layout,
  History
} from "lucide-react";

interface MemberHomeClientProps {
  userName: string;
  bookings: any[];
  merchants: any[];
  aiStats: {
    usedToday: number;
    limit: number;
    attempts: any[];
  };
}

export default function MemberHomeClient({
  userName,
  bookings,
  merchants,
  aiStats
}: MemberHomeClientProps) {
  const { t } = useTranslation();

  const quickActions = [
    { label: t.member_dashboard.quick_actions.findExpert, href: "/services", icon: <Search size={20} />, color: "var(--accent-color)" },
    { label: t.member_dashboard.quick_actions.chat, href: "/member/chat", icon: <MessageSquare size={20} />, color: "#10b981" },
    { label: t.member_dashboard.quick_actions.diagnosis, href: "/diagnosis", icon: <Sparkles size={20} />, color: "#8b5cf6" },
    { label: t.member_dashboard.quick_actions.equipment, href: "/member/equipment", icon: <Layout size={20} />, color: "#3b82f6" },
    { label: t.home.categories.education, href: "/services/results?cat=education", icon: <GraduationCap size={20} />, color: "#f59e0b" },
    { label: t.home.categories.legal, href: "/services/results?cat=legal", icon: <Scale size={20} />, color: "#ef4444" },
    { label: t.home.categories.accounting, href: "/services/results?cat=accounting", icon: <Calculator size={20} />, color: "#06b6d4" },
  ];

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
            {quickActions.map((action) => (
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
          {/* AI Study Hub (right) - Replacing the placeholder tips or sitting next to it */}
          <AIStudyHub 
            usedToday={aiStats.usedToday} 
            limit={aiStats.limit} 
            recentAttempts={aiStats.attempts} 
            bookings={bookings}
          />
        </div>

        {/* ── Section 4: Daily Expert Feed ─────────────────────── */}
        <section>
          <DailyFeed merchants={safeMerchants} />
        </section>
      </div>
    </div>
  );
}
