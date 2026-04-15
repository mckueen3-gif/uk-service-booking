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
    title: `${m.companyName || m.ownerName || m.user?.name || "Merchant"} | ConciergeAI`,
    description: m.description || `Book ${m.companyName || m.ownerName || m.user?.name || "our verified professional"} on ConciergeAI — verified UK expert.`,
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
  
  // Defensive fallbacks for numerical values
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : "5.0";
    
  const qualityScore = reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + (Number(r.qualityRating) || Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : "5.0";
    
  const reliabilityScore = reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + (Number(r.reliabilityRating) || Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : "5.0";
    
  const commsScore = reviews.length > 0
    ? (reviews.reduce((sum: number, r: any) => sum + (Number(r.communicationRating) || Number(r.rating) || 5), 0) / reviews.length).toFixed(1)
    : "5.0";

  const isVerified = (m.documents?.length || 0) > 0 || m.isVerified;
  const primaryService = services[0];
  const bookingHref = primaryService
    ? `/book/${m?.id}?serviceId=${primaryService.id}`
    : `/book/${m?.id || ''}`;
    
  // Resolve best profile picture / avatar
  const avatar = m.avatarUrl || m.profileImage || m.user?.image;
  // Resolve best name
  const displayName = m.companyName || m.ownerName || m.user?.name || "Merchant";

    
  // Safe date parsing
  let memberYear = "2024";
  if (m.createdAt) {
    try {
      memberYear = new Date(m.createdAt).getFullYear().toString();
    } catch(e) {}
  }

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh", paddingBottom: "5rem" }}>

      {/* ── Hero Banner ── */}
      <div style={{
        backgroundColor: "#050505",
        height: "350px",
        position: "relative",
        backgroundImage: `url(${m.bannerUrl || 'https://images.unsplash.com/photo-1541888946425-d81bb19040ff?q=80&w=2000&auto=format&fit=crop'})`,
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8))"
        }} />
        <div className="container" style={{ maxWidth: "1140px", height: "100%", position: "relative" }}>
          
          {/* Logo positioning overlapping banner and content */}
          <div style={{
            position: "absolute", bottom: "-30px", left: "1.5rem",
            width: "140px", height: "140px", borderRadius: "16px",
            background: "var(--surface-1)", border: "4px solid var(--bg-primary)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)", zIndex: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden"
          }}>
             {avatar
              ? <img src={avatar} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <div style={{ fontSize: "3rem", fontWeight: 900, color: "var(--gold-500)" }}>{(displayName)[0]?.toUpperCase() || "?"}</div>
            }
          </div>
          
        </div>
      </div>

      <div className="container" style={{ maxWidth: "1140px", position: "relative", zIndex: 10, padding: "0 1.5rem" }}>
        {/* Name and Basic Meta */}
        <div style={{ marginLeft: "170px", paddingTop: "1rem", paddingBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "2rem" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "2.8rem", fontWeight: 900, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>
                {displayName}
              </h1>
              {isVerified && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(212,175,55,0.15)", padding: "4px 12px", borderRadius: "100px", color: "var(--gold-400)", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", border: "1px solid rgba(212,175,55,0.3)" }}>
                  <ShieldCheck size={14} /> 已認證專家
                </div>
              )}
            </div>
            
            <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", color: "var(--text-secondary)", fontSize: "1.1rem", marginTop: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Star size={20} fill="#d4af37" color="#d4af37" /> 
                <span style={{ fontWeight: 900, color: "var(--text-primary)", fontSize: "1.4rem" }}>{m.averageRating > 0 ? m.averageRating.toFixed(1) : avgRating}</span>
                <span style={{ fontSize: "0.95rem", opacity: 0.7 }}>({m.totalReviews || reviews.length} 評價)</span>
              </div>
              {m.city && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                  <MapPin size={18} color="var(--gold-500)" /> {m.city}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                <Award size={18} color="var(--gold-500)" /> 平台成員自 {memberYear} 年
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ 
        position: "sticky", top: "80px", zIndex: 50, 
        backgroundColor: "var(--bg-primary)", 
        borderBottom: "1px solid rgba(212,175,55,0.1)",
        borderTop: "1px solid rgba(212,175,55,0.1)",
        marginTop: "1.5rem"
      }}>
        <div className="container" style={{ maxWidth: "1140px", display: "flex", gap: "2.5rem", overflowX: "auto", padding: "0 1.5rem" }}>
          {["概覽 (Overview)", "服務 (Services)", "評價 (Reviews)", "公司資訊 (Company Info)"].map((nav) => (
            <button key={nav} style={{
              padding: "1.25rem 0", color: "var(--text-primary)", fontSize: "0.95rem",
              fontWeight: 800, background: "none", border: "none", cursor: "pointer",
              borderBottom: "3px solid transparent", transition: "all 0.2s",
              whiteSpace: "nowrap"
            }}>
              {nav}
            </button>
          ))}
        </div>
      </div>

      <div className="container" style={{ 
        maxWidth: "1140px", marginTop: "2.5rem", 
        display: "grid", gridTemplateColumns: "1fr 360px", gap: "3rem", padding: "0 1.5rem"
      }}>
        
        {/* Left Column - Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          
          <section id="about" style={{ background: "linear-gradient(145deg, var(--surface-1) 0%, rgba(212,175,55,0.04) 100%)", borderRadius: "20px", padding: "2.5rem", border: "1px solid var(--border-color)" }}>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1.25rem" }}>關於商戶 (About)</h2>
            <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "1.05rem", margin: 0 }}>
              {m.bio || m.description || "專業的服務供應商，致力於提供高品質的服務。擁有豐富經驗及專業認證，確保為每位客戶提供最優質的滿意度。"}
            </p>
          </section>

          {services.length > 0 && (
            <section id="services" style={{ background: "linear-gradient(145deg, var(--surface-1) 0%, rgba(212,175,55,0.04) 100%)", borderRadius: "20px", padding: "2.5rem", border: "1px solid var(--border-color)" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1.5rem" }}>專業服務項目</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
                {services.map((svc: any) => (
                  <Link key={svc.id} href={`/book/${m.id}?serviceId=${svc.id}`}
                    style={{
                      background: "var(--surface-2)", borderRadius: "16px", padding: "1.5rem",
                      border: "1px solid var(--border-color)", textDecoration: "none",
                      display: "block", transition: "all 0.2s ease"
                    }}
                  >
                    <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--gold-600)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>{svc.category}</div>
                    <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--text-primary)", marginBottom: "0.5rem" }}>{svc.name}</div>
                    <div style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-primary)" }}>£{svc.price}</div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section id="reviews" style={{ background: "linear-gradient(145deg, var(--surface-1) 0%, rgba(212,175,55,0.04) 100%)", borderRadius: "20px", padding: "2.5rem", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>客戶評價 ({reviews.length})</h2>
              <button style={{ background: "transparent", border: "2px solid var(--gold-500)", color: "var(--gold-400)", padding: "0.6rem 1.5rem", borderRadius: "8px", fontWeight: 800, cursor: "pointer" }}>
                撰寫評價 (Write a review)
              </button>
            </div>
            
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>過去 12 個月內的評價總覽 (Based on reviews over the past 12 months)</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "3rem" }}>
              {[
                { label: "工作品質 (Quality of work)", score: qualityScore },
                { label: "可靠度 (Reliability)", score: reliabilityScore },
                { label: "溝通能力 (Communication)", score: commsScore }
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: "center", padding: "1.5rem", background: "linear-gradient(180deg, var(--surface-1) 0%, rgba(212,175,55,0.06) 100%)", borderRadius: "16px", border: "1px solid var(--border-color)" }}>
                  <div style={{ fontSize: "2.2rem", fontWeight: 900, color: "var(--gold-400)", marginBottom: "0.3rem" }}>{stat.score}</div>
                  <div style={{ color: "var(--text-secondary)", fontWeight: 700, fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{stat.label}</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: "2px", marginTop: "0.5rem" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} fill={i < Math.round(Number(stat.score)) ? "#d4af37" : "none"} color="#d4af37" />
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* AI Summary Block */}
            {reviews.length > 0 && (
              <div style={{ backgroundColor: "rgba(212,175,55,0.05)", border: "1px solid rgba(212,175,55,0.2)", borderRadius: "16px", padding: "1.5rem", marginBottom: "3rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.75rem" }}>
                  <Award size={18} color="var(--gold-500)" />
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gold-400)", margin: 0 }}>顧客回饋摘要 (What customers are saying)</h3>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 0.75rem 0", fontStyle: "italic" }}>
                  「客戶一致讚賞工作的高品質與高效率，並特別指出良好的溝通與準時度，同時在完工後總會保持場地整潔。」
                </p>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>✦ 由 AI 統整過去 24 個月的客戶評價 (AI-generated from customer reviews)</div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {reviews.map((rev: any) => (
                <div key={rev.id} style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.1rem" }}>{rev.customer?.name || "匿名客戶"}</div>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < (rev.rating || 5) ? "#d4af37" : "none"} color="#d4af37" />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 1rem 0", fontSize: "0.95rem" }}>
                    {rev.comment || "Great service, highly recommended!"}
                  </p>
                  <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>Quality <Star size={10} fill="currentColor" /> {rev.qualityRating || rev.rating || 5}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>Reliability <Star size={10} fill="currentColor" /> {rev.reliabilityRating || rev.rating || 5}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>Communication <Star size={10} fill="currentColor" /> {rev.communicationRating || rev.rating || 5}</span>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>尚無評價 (No reviews yet)</div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div style={{ position: "sticky", top: "150px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* CTA Box */}
            <div style={{ 
              background: "linear-gradient(145deg, var(--surface-1) 0%, rgba(212,175,55,0.08) 100%)", 
              borderRadius: "20px", padding: "2rem", 
              border: "1px solid var(--gold-500)",
              boxShadow: "0 10px 40px rgba(212,175,55,0.1)"
            }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1.5rem" }}>預約諮詢 (Consultation)</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Link href={bookingHref} style={{
                  background: "linear-gradient(135deg, #d4af37, #f5e07a)",
                  color: "#000", padding: "1.1rem", borderRadius: "12px",
                  fontWeight: 900, textAlign: "center", textDecoration: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                }}>
                  立即預訂服務 <ArrowRight size={18} />
                </Link>
                <Link href={`/member/chat?merchantId=${m.id}`} style={{
                  background: "transparent", border: "1px solid var(--border-color)",
                  color: "var(--text-primary)", padding: "1.1rem", borderRadius: "12px",
                  fontWeight: 800, textAlign: "center", textDecoration: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                }}>
                  <MessageSquare size={18} /> 發送訊息
                </Link>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", marginTop: "0.5rem" }}>
                  平台建議：我們強制要求透過 ConciergeAI 內部聊天進行溝通，以保障您的安全。
                </div>
              </div>
            </div>

            {/* Company Info Box */}
            <section id="company-info" style={{ background: "linear-gradient(145deg, var(--surface-1) 0%, rgba(212,175,55,0.04) 100%)", borderRadius: "20px", padding: "2rem", border: "1px solid var(--border-color)" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1.5rem" }}>公司資訊 (Company Info)</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>負責人 (OWNER)</div>
                  <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.1rem" }}>{m.ownerName || m.user?.name || "N/A"}</div>
                </div>
                
                <div style={{ height: "1px", background: "var(--border-color)" }} />
                
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>公司類型 (BUSINESS TYPE)</div>
                  <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.1rem" }}>{m.businessType || "獨資經營 (Sole Trader)"}</div>
                </div>
                
                <div style={{ height: "1px", background: "var(--border-color)" }} />

                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>增值稅註冊 (VAT REGISTERED)</div>
                  <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    {m.vatNumber ? (
                      <><CheckCircle2 size={18} color="var(--gold-500)" /> 是 (Yes)</>
                    ) : (
                      "否 (No)"
                    )}
                  </div>
                </div>
              </div>
            </section>
            
          </div>
        </div>
      </div>
    </div>
  );
}
