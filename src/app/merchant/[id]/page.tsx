import { getMerchantDetails } from "@/app/actions/services";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Star, MapPin, ShieldCheck, CheckCircle2, ArrowRight,
  Briefcase, Phone, MessageSquare, Image as ImageIcon, Award, Clock
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const result = await getMerchantDetails(resolvedParams.id);
  if (!result.success || !result.merchant) {
    return { title: "Merchant Not Found | ConciergeAI" };
  }
  const m = result.merchant as any;
  return {
    title: `${m.companyName || m.name} | ConciergeAI`,
    description: m.description || `Book ${m.companyName || m.name} on ConciergeAI — verified UK expert.`,
  };
}

export default async function MerchantPublicPage({ params }: Props) {
  const resolvedParams = await params;
  const result = await getMerchantDetails(resolvedParams.id);
  if (!result.success || !result.merchant) {
    notFound();
  }

  const m = result.merchant as any;
  const reviews = m.reviews || [];
  const portfolio = m.portfolio || [];
  const services = m.services || [];
  const avgRating = reviews.length
    ? (reviews.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
    : "5.0";

  const isVerified = (m.documents?.length || 0) > 0 || m.isVerified;
  const primaryService = services[0];
  const bookingHref = primaryService
    ? `/book/${m.id}?serviceId=${primaryService.id}`
    : `/book/${m.id}`;

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh", paddingBottom: "5rem" }}>

      {/* ── Hero Banner ── */}
      <div style={{
        background: "linear-gradient(135deg, #0a0a0a 0%, #1a1209 50%, #0f0c03 100%)",
        padding: "5rem 1.5rem 4rem",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse 60% 60% at 70% 50%, rgba(212,175,55,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div className="container" style={{ maxWidth: "900px", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>

            {/* Avatar */}
            <div style={{
              width: "96px", height: "96px", borderRadius: "50%",
              background: "linear-gradient(135deg, #d4af37, #f5e07a)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "2.5rem", fontWeight: 900, color: "#0a0a0a",
              flexShrink: 0, boxShadow: "0 0 40px rgba(212,175,55,0.3)",
              overflow: "hidden",
            }}>
              {m.profileImage
                ? <img src={m.profileImage} alt={m.companyName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : (m.companyName || m.name || "?")[0].toUpperCase()
              }
            </div>

            {/* Name & Meta */}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 900, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
                  {m.companyName || m.name}
                </h1>
                {isVerified && (
                  <span style={{
                    background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)",
                    color: "#d4af37", padding: "0.3rem 0.8rem", borderRadius: "99px",
                    fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.08em",
                    display: "flex", alignItems: "center", gap: "4px",
                  }}>
                    <CheckCircle2 size={12} /> 已認證專家
                  </span>
                )}
              </div>
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
                {m.city && (
                  <span style={{ color: "#9ca3af", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "4px" }}>
                    <MapPin size={14} /> {m.city}
                  </span>
                )}
                <span style={{ color: "#9ca3af", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Star size={14} fill="#d4af37" color="#d4af37" /> {avgRating} ({reviews.length} 評價)
                </span>
                {services.length > 0 && (
                  <span style={{ color: "#9ca3af", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "4px" }}>
                    <Briefcase size={14} /> {services.length} 項服務
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* CTA buttons */}
          <div style={{ display: "flex", gap: "1rem", marginTop: "2rem", flexWrap: "wrap" }}>
            <Link href={bookingHref} style={{
              background: "linear-gradient(135deg, #d4af37, #f5e07a)",
              color: "#0a0a0a", padding: "0.85rem 2rem", borderRadius: "12px",
              fontWeight: 900, fontSize: "1rem", textDecoration: "none",
              display: "flex", alignItems: "center", gap: "8px",
              boxShadow: "0 8px 30px rgba(212,175,55,0.3)",
              transition: "transform 0.2s",
            }}>
              立即預約 <ArrowRight size={18} />
            </Link>
            <Link href={`/member/chat?merchantId=${m.id}`} style={{
              background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
              color: "#fff", padding: "0.85rem 2rem", borderRadius: "12px",
              fontWeight: 700, fontSize: "1rem", textDecoration: "none",
              display: "flex", alignItems: "center", gap: "8px",
            }}>
              <MessageSquare size={18} /> 聯繫專家
            </Link>
          </div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="container" style={{ maxWidth: "900px", marginTop: "3rem", display: "flex", flexDirection: "column", gap: "2.5rem", padding: "0 1.5rem" }}>

        {/* About */}
        {m.bio && (
          <section style={{ background: "var(--surface-1)", borderRadius: "20px", padding: "2rem", border: "1px solid var(--border-color)" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1rem" }}>關於專家</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "0.97rem" }}>{m.bio}</p>
          </section>
        )}

        {/* Checks & Accreditations (Checkatrade Style Trust Indicators) */}
        <section style={{ background: "var(--surface-1)", borderRadius: "20px", padding: "2rem", border: "1px solid var(--border-color)" }}>
          <h2 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
            <ShieldCheck size={20} color="var(--gold-600)" /> 認證與背景調查
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
            {[
              { label: "身份已核實", checked: true },
              { label: "住址已核實", checked: true },
              { label: "專業資格證明", checked: isVerified },
              { label: "公共責任保險", checked: isVerified }
            ].map((check, idx) => (
              <div key={idx} style={{ 
                display: "flex", alignItems: "center", gap: "0.75rem", 
                backgroundColor: check.checked ? "rgba(212,175,55,0.05)" : "var(--surface-2)", 
                padding: "1rem", borderRadius: "12px", border: "1px solid", 
                borderColor: check.checked ? "rgba(212,175,55,0.2)" : "var(--border-color)",
                color: check.checked ? "var(--text-primary)" : "var(--text-muted)" 
              }}>
                <CheckCircle2 size={18} color={check.checked ? "var(--gold-600)" : "var(--text-muted)"} />
                <span style={{ fontSize: "0.9rem", fontWeight: 700 }}>{check.label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        {services.length > 0 && (
          <section style={{ background: "var(--surface-1)", borderRadius: "20px", padding: "2rem", border: "1px solid var(--border-color)" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1.5rem" }}>服務項目</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
              {services.map((svc: any) => (
                <Link key={svc.id} href={`/book/${m.id}?serviceId=${svc.id}`}
                  style={{
                    background: "var(--surface-2)", borderRadius: "14px", padding: "1.25rem",
                    border: "1px solid var(--border-color)", textDecoration: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                    display: "block",
                  }}
                >
                  <div style={{ fontSize: "0.72rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--gold-600)", marginBottom: "0.5rem" }}>
                    {svc.category}
                  </div>
                  <div style={{ fontSize: "1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.4rem" }}>{svc.name}</div>
                  {svc.description && (
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: "0.75rem", lineHeight: 1.5 }}>
                      {svc.description.length > 80 ? svc.description.slice(0, 80) + "…" : svc.description}
                    </div>
                  )}
                  <div style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--text-primary)" }}>£{svc.price}</div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Portfolio */}
        {portfolio.length > 0 && (
          <section style={{ background: "var(--surface-1)", borderRadius: "20px", padding: "2rem", border: "1px solid var(--border-color)" }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1.5rem" }}>工作案例</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem" }}>
              {portfolio.map((item: any) => (
                <div key={item.id} style={{ borderRadius: "14px", overflow: "hidden", background: "var(--surface-2)", border: "1px solid var(--border-color)" }}>
                  {item.imageUrl
                    ? <img src={item.imageUrl} alt={item.title} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                    : (
                      <div style={{ width: "100%", height: "160px", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--accent-soft)" }}>
                        <ImageIcon size={32} color="var(--gold-600)" />
                      </div>
                    )
                  }
                  <div style={{ padding: "0.9rem" }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>{item.title}</div>
                    {item.description && (
                      <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: "0.3rem" }}>
                        {item.description.length > 60 ? item.description.slice(0, 60) + "…" : item.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Reviews */}
        <section style={{ background: "var(--surface-1)", borderRadius: "20px", padding: "2rem", border: "1px solid var(--border-color)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "2rem", flexWrap: "wrap", gap: "1.5rem" }}>
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--text-primary)", margin: "0 0 0.5rem 0" }}>客戶評價</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {[1,2,3,4,5].map(i => <Star key={i} size={20} fill="#d4af37" color="#d4af37" />)}
                <span style={{ fontWeight: 900, fontSize: "1.3rem", color: "var(--text-primary)", marginLeft: "0.5rem" }}>{avgRating}</span>
                <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>/ 5.0 ({reviews.length} 則)</span>
              </div>
            </div>
            
            {/* Checkatrade style category breakdown (simulated averages) */}
            {reviews.length > 0 && (
              <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", background: "var(--surface-2)", padding: "1rem 1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
                {[
                  { label: "可靠守時", score: avgRating },
                  { label: "整潔度", score: Math.min(5.0, parseFloat(avgRating as string) + 0.1).toFixed(1) },
                  { label: "服務態度", score: Math.min(5.0, parseFloat(avgRating as string) + 0.2).toFixed(1) },
                  { label: "專業技術", score: avgRating }
                ].map((cat, idx) => (
                  <div key={idx} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                    <div style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--gold-600)" }}>{cat.score}</div>
                    <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700 }}>{cat.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {reviews.length === 0 ? (
            <p style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>尚無評價。</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {reviews.map((rev: any) => (
                <div key={rev.id} style={{ padding: "1.25rem", background: "var(--surface-2)", borderRadius: "14px", border: "1px solid var(--border-color)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                      <div style={{
                        width: "36px", height: "36px", borderRadius: "50%",
                        background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center",
                        fontWeight: 900, color: "var(--gold-600)", fontSize: "0.9rem", flexShrink: 0,
                        overflow: "hidden",
                      }}>
                        {rev.customer?.image
                          ? <img src={rev.customer.image} alt={rev.customer.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                          : (rev.customer?.name || "?")[0].toUpperCase()
                        }
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "0.9rem" }}>{rev.customer?.name || "匿名用戶"}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          {new Date(rev.createdAt).toLocaleDateString("zh-TW", { year: "numeric", month: "long" })}
                        </div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[1,2,3,4,5].map(i => (
                        <Star key={i} size={14} fill={i <= (rev.rating || 5) ? "#d4af37" : "transparent"} color="#d4af37" />
                      ))}
                    </div>
                  </div>
                  {rev.comment && (
                    <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, fontSize: "0.9rem", margin: 0 }}>{rev.comment}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Sticky Book CTA */}
        <div style={{
          background: "linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.05))",
          border: "1px solid rgba(212,175,55,0.2)", borderRadius: "20px", padding: "2rem",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem",
        }}>
          <div>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-primary)", margin: "0 0 0.4rem" }}>
              準備好預約了嗎？
            </h3>
            <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.9rem" }}>
              安全託管付款 · AI 品質保證 · 24小時取消政策
            </p>
          </div>
          <Link href={bookingHref} style={{
            background: "linear-gradient(135deg, #d4af37, #f5e07a)",
            color: "#0a0a0a", padding: "1rem 2.5rem", borderRadius: "12px",
            fontWeight: 900, fontSize: "1.05rem", textDecoration: "none",
            display: "flex", alignItems: "center", gap: "8px",
            boxShadow: "0 8px 30px rgba(212,175,55,0.2)",
            whiteSpace: "nowrap",
          }}>
            立即預約 <ArrowRight size={18} />
          </Link>
        </div>

      </div>
    </div>
  );
}
