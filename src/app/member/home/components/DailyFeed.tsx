"use client";

import { Star, MapPin, ChevronRight, TrendingUp } from "lucide-react";
import Link from "next/link";

interface Merchant {
  id: string;
  companyName?: string | null;
  category?: string | null;
  city?: string | null;
  rating?: number | null;
  avatarUrl?: string | null;
  user?: { name?: string | null } | null;
}

interface DailyFeedProps {
  merchants: Merchant[];
}

const CATEGORY_TIPS: Record<string, string> = {
  Plumbing: "💧 天氣轉涼，記得定期檢查水管保溫！",
  Education: "📚 現在預約功課輔導，準備好下學期！",
  Legal: "⚖️ 租約快到期？諮詢律師保障您的權益。",
  Accounting: "🧾 自僱人士稅務申報截止日即將到來。",
  Cleaning: "✨ 換季大掃除，讓家居煥然一新！",
  Repairs: "🔧 秋冬前最佳時機檢查電器安全。",
  Renovation: "🏠 今年底前翻新，趕及年宵前完工！",
  Commercial: "💼 Q4 財務規劃，立即諮詢商業顧問。",
};

const FALLBACK_IMAGES: Record<string, string> = {
  plumbing: "https://images.unsplash.com/photo-1581578731548-c744c843509c?q=80&w=400&auto=format&fit=crop",
  education: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=400&auto=format&fit=crop",
  legal: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=400&auto=format&fit=crop",
  accounting: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=400&auto=format&fit=crop",
  cleaning: "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?q=80&w=400&auto=format&fit=crop",
  repairs: "https://images.unsplash.com/photo-1581094288338-2314dddb7bc3?q=80&w=400&auto=format&fit=crop",
  renovation: "https://images.unsplash.com/photo-1503387762-592dea58ef23?q=80&w=400&auto=format&fit=crop",
  commercial: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=400&auto=format&fit=crop",
  default: "https://images.unsplash.com/photo-1581578731548-c744c843509c?q=80&w=400&auto=format&fit=crop",
};

export default function DailyFeed({ merchants }: DailyFeedProps) {
  // Defensive: ensure always array
  const safeMerchants = Array.isArray(merchants) ? merchants.slice(0, 6) : [];

  return (
    <div>
      {/* Section Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.5rem",
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
            <TrendingUp size={18} />
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
              今日為您推薦
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0, fontWeight: 500 }}>
              頂尖專家 · 每日精選
            </p>
          </div>
        </div>
        <Link href="/services" style={{ textDecoration: "none" }}>
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
            全部 <ChevronRight size={13} />
          </button>
        </Link>
      </div>

      {/* Feed Cards Grid */}
      {safeMerchants.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            background: "var(--surface-1)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-color)",
            color: "var(--text-muted)",
          }}
        >
          <TrendingUp size={32} style={{ opacity: 0.4, marginBottom: "0.75rem" }} />
          <p style={{ margin: 0, fontWeight: 600 }}>正在載入推薦專家...</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {safeMerchants.map((m, idx) => {
            const displayName =
              m.companyName ?? m.user?.name ?? "Expert Specialist";
            const catKey = (m.category ?? "default").toLowerCase();
            const imgUrl =
              m.avatarUrl ?? FALLBACK_IMAGES[catKey] ?? FALLBACK_IMAGES.default;
            const tip =
              CATEGORY_TIPS[m.category ?? ""] ?? "立即預約，享受頂級服務體驗。";
            const rating = m.rating ?? (4.5 + (idx % 5) * 0.1);

            return (
              <Link
                key={m.id}
                href={`/merchant/${m.id}`}
                style={{ textDecoration: "none" }}
              >
                <div
                  style={{
                    background: "var(--surface-1)",
                    borderRadius: "var(--radius-lg)",
                    border: "1px solid var(--border-color)",
                    overflow: "hidden",
                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "var(--shadow-lg)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLElement).style.boxShadow = "none";
                  }}
                >
                  {/* Image */}
                  <div
                    style={{
                      height: "140px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    <img
                      src={imgUrl}
                      alt={displayName}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          FALLBACK_IMAGES.default;
                      }}
                    />
                    {/* Rating */}
                    <div
                      style={{
                        position: "absolute",
                        top: "0.75rem",
                        right: "0.75rem",
                        background: "rgba(13,13,13,0.75)",
                        backdropFilter: "blur(8px)",
                        padding: "0.3rem 0.65rem",
                        borderRadius: "999px",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontSize: "0.8rem",
                        fontWeight: 800,
                        color: "white",
                      }}
                    >
                      <Star size={12} fill="#fbbf24" color="#fbbf24" />
                      {rating.toFixed(1)}
                    </div>
                  </div>

                  {/* Content */}
                  <div style={{ padding: "1rem 1.25rem" }}>
                    <p
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 900,
                        color: "var(--accent-color)",
                        textTransform: "uppercase",
                        letterSpacing: "0.08em",
                        margin: "0 0 0.3rem",
                      }}
                    >
                      {m.category ?? "Specialist"}
                    </p>
                    <h4
                      style={{
                        fontSize: "0.97rem",
                        fontWeight: 800,
                        color: "var(--text-primary)",
                        margin: "0 0 0.4rem",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {displayName}
                    </h4>
                    <p
                      style={{
                        fontSize: "0.78rem",
                        color: "var(--text-muted)",
                        margin: "0 0 0.75rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.3rem",
                        fontWeight: 500,
                      }}
                    >
                      <MapPin size={12} />
                      {m.city ?? "London, UK"}
                    </p>
                    {/* Daily Tip */}
                    <p
                      style={{
                        fontSize: "0.8rem",
                        color: "var(--text-muted)",
                        margin: 0,
                        lineHeight: 1.5,
                        fontStyle: "italic",
                      }}
                    >
                      {tip}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
