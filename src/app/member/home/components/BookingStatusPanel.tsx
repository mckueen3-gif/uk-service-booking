"use client";

import { Calendar, Clock, CheckCircle2, AlertCircle, Loader2, ChevronRight, Video, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/components/LanguageContext";

type BookingStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "DISPUTED";

interface Booking {
  id: string;
  status: BookingStatus;
  scheduledDate: string;
  service?: { name?: string } | null;
  merchant?: { companyName?: string; user?: { name?: string } | null } | null;
  totalAmount?: number | null;
  googleMeetLink?: string | null;
  isEducation?: boolean;
}

interface BookingStatusProps {
  bookings: Booking[];
}

const STATUS_MAP: Record<BookingStatus, { color: string; bg: string; icon: React.ReactNode; key: string }> = {
  PENDING: {
    key: "pending",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    icon: <Clock size={14} />,
  },
  CONFIRMED: {
    key: "confirmed",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    icon: <CheckCircle2 size={14} />,
  },
  COMPLETED: {
    key: "completed",
    color: "var(--text-muted)",
    bg: "var(--surface-2)",
    icon: <CheckCircle2 size={14} />,
  },
  CANCELLED: {
    key: "cancelled",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    icon: <AlertCircle size={14} />,
  },
  DISPUTED: {
    key: "disputed",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    icon: <AlertCircle size={14} />,
  },
};

export default function BookingStatusPanel({ bookings }: BookingStatusProps) {
  const { t, format, language } = useTranslation();
  // Defensive: ensure we always have an array
  const safeBookings = Array.isArray(bookings) ? bookings : [];

  return (
    <div
      style={{
        background: "var(--surface-1)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--border-color)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: "1.5rem 2rem",
          borderBottom: "1px solid var(--border-color)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "0.75rem",
              background: "var(--accent-soft)",
              color: "var(--accent-color)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Calendar size={18} />
          </div>
          <div>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 800,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              {t.member_dashboard.bookings.title}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0, fontWeight: 500 }}>
              {format(t.member_dashboard.bookings.recentCount, { count: safeBookings.length })}
            </p>
          </div>
        </div>
        <Link href="/member" style={{ textDecoration: "none" }}>
          <button
            style={{
              padding: "0.45rem 1rem",
              borderRadius: "999px",
              border: "1px solid var(--border-color)",
              background: "transparent",
              color: "var(--text-muted)",
              fontSize: "0.8rem",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.3rem",
            }}
          >
            {t.member_dashboard.bookings.viewAll} <ChevronRight size={13} />
          </button>
        </Link>
      </div>

      {/* Bookings List */}
      <div style={{ padding: "1rem" }}>
        {safeBookings.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "2.5rem 1rem",
              color: "var(--text-muted)",
            }}
          >
            <Calendar size={32} style={{ opacity: 0.4, marginBottom: "0.75rem" }} />
            <p style={{ fontSize: "0.9rem", fontWeight: 600, margin: 0 }}>
              {t.member_dashboard.bookings.empty}
            </p>
            <Link href="/services" style={{ textDecoration: "none", display: "inline-block", marginTop: "1rem" }}>
              <button
                style={{
                  padding: "0.6rem 1.25rem",
                  borderRadius: "999px",
                  border: "none",
                  background: "var(--accent-color)",
                  color: "white",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                  {t.member_dashboard.bookings.bookNow}
              </button>
            </Link>
          </div>
        ) : (
          safeBookings.map((booking) => {
            const cfg = STATUS_MAP[booking.status] ?? STATUS_MAP.PENDING;
            const serviceName =
              booking.service?.name ?? t.common.status.unknown;
            const merchantName =
              booking.merchant?.companyName ??
              booking.merchant?.user?.name ??
              t.member_dashboard.quick_actions.findExpert; // Fallback to a general term
            const dateStr = booking.scheduledDate
              ? new Date(booking.scheduledDate).toLocaleDateString(language === 'en' ? 'en-GB' : language, {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : t.common.status.unknown;

            const statusLabel = (t.member_dashboard.bookings.status as any)[cfg.key] || cfg.key;

            return (
              <div
                key={booking.id}
                style={{
                  padding: "1rem",
                  borderRadius: "0.75rem",
                  marginBottom: "0.6rem",
                  background: "var(--surface-2)",
                  display: "flex",
                  alignItems: "center",
                  gap: "1rem",
                  transition: "background 0.2s ease",
                }}
              >
                {/* Status Badge */}
                <div
                  style={{
                    padding: "0.35rem 0.75rem",
                    borderRadius: "999px",
                    background: cfg.bg,
                    color: cfg.color,
                    fontSize: "0.75rem",
                    fontWeight: 800,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.3rem",
                    whiteSpace: "nowrap",
                    flexShrink: 0,
                  }}
                >
                  {cfg.icon}
                  {statusLabel}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.9rem",
                      fontWeight: 700,
                      color: "var(--text-primary)",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {serviceName}
                  </p>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.8rem",
                      color: "var(--text-muted)",
                      fontWeight: 500,
                    }}
                  >
                    {merchantName} · {dateStr}
                  </p>
                </div>

                {/* Right Actions (Amount + Meet) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  {booking.totalAmount != null && (
                    <span
                      style={{
                        fontSize: "1rem",
                        fontWeight: 800,
                        color: "var(--accent-color)",
                        flexShrink: 0,
                      }}
                    >
                      £{booking.totalAmount.toFixed(0)}
                    </span>
                  )}
                  
                  {/* 🎓 JOIN CLASSROOM BUTTON FOR EDUCATION - Time Window Check */}
                  {booking.isEducation && booking.googleMeetLink && (() => {
                    const startTime = new Date(booking.scheduledDate).getTime();
                    const now = new Date().getTime();
                    const fifteenMins = 15 * 60 * 1000;
                    const twoHours = 2 * 60 * 60 * 1000;
                    
                    const isWindowActive = now >= (startTime - fifteenMins) && now <= (startTime + twoHours);
                    
                    if (!isWindowActive) return null;

                    return (
                      <a 
                        href={booking.googleMeetLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ textDecoration: 'none' }}
                      >
                        <button
                          className="hover-scale"
                          style={{
                            padding: "0.45rem 0.85rem",
                            borderRadius: "10px",
                            background: "linear-gradient(135deg, #d4af37, #f1c40f)",
                            color: "#000",
                            border: "none",
                            fontSize: "0.75rem",
                            fontWeight: 900,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: "0 4px 12px rgba(212, 175, 55, 0.2)"
                          }}
                        >
                          <Video size={14} />
                          {t.member_dashboard.bookings.joinClass}
                        </button>
                      </a>
                    );
                  })()}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
