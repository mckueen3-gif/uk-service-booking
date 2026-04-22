import ProfileActions from "@/components/merchant/ProfileActions";
import { getMerchantDetails } from "@/app/actions/services";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Star, MapPin, ShieldCheck, CheckCircle2, ArrowRight,
  Briefcase, Phone, MessageSquare, Image as ImageIcon, Award, Clock,
  Share2, Globe, Heart, Check, ThumbsUp
} from "lucide-react";
import { cookies } from "next/headers";
import { getDictionary, Locale } from "@/lib/i18n/dictionary";
import { interpolate } from "@/lib/i18n/interpolate";
import MerchantAIBot from "@/components/merchant/MerchantAIBot";
import EliteTrustSeal from "@/components/merchant/EliteTrustSeal";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ q?: string; cat?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const resolvedParams = await params;
  const result = await getMerchantDetails(resolvedParams.id);
  if (!result.success) {
    return { title: "Merchant Not Found | ConciergeAI" };
  }
  const m = result.merchant;
  return {
    title: `${m.companyName || m.ownerName || m.user?.name || "Merchant"} | ConciergeAI`,
    description: m.description || `Book ${m.companyName || m.ownerName || m.user?.name || "our verified professional"} on ConciergeAI — verified UK expert.`,
  };
}

export default async function MerchantPublicPage({ params, searchParams }: Props) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.q;
  const cat = resolvedSearchParams.cat;

  const result = await getMerchantDetails(resolvedParams.id);
  
  const cookieStore = await cookies();
  const locale = (cookieStore.get("user-locale")?.value || "en") as Locale;
  const t = getDictionary(locale);
  const tp = t?.merchant_public || (getDictionary("en").merchant_public);

  // DEBUG 🎯
  console.log("DEBUG: Params", { query, cat });

  if (!result.success) {
    // 🚀 SILENT RESILIENCE: Instead of a raw 500 or misleading 404, show a clean error state
    return (
      <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "2rem" }}>
        <div style={{ textAlign: "center", maxWidth: "400px" }}>
          <ShieldCheck size={48} color="var(--gold-500)" style={{ margin: "0 auto 1.5rem" }} />
          <h1 style={{ color: "var(--text-primary)", fontSize: "1.5rem", fontWeight: 800, marginBottom: "1rem" }}>{tp?.system_unavailable || "System Temporarily Unavailable"}</h1>
          <p style={{ color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "2rem" }}>
            {tp?.sync_notice || "Our expert directory is currently undergoing synchronization. Please try refreshing in a few moments."}
          </p>
          <a href="/" style={{ backgroundColor: "var(--gold-500)", color: "black", padding: "0.8rem 1.5rem", borderRadius: "8px", fontWeight: 800, textDecoration: "none" }}>
            {tp?.return_home || "Return Home"}
          </a>
        </div>
      </div>
    );
  }

  const m = result.merchant;
  // Filter out self-reviews (where reviewer userId matches the merchant's associated user id)
  const reviews = (m.reviews || []).filter((r: any) => r.userId !== m.userId);
  const portfolio = m.portfolio || [];
  const services = m.services || [];
  console.log("DEBUG: Services", services.map((s: any) => ({ id: s.id, name: s.name, category: s.category })));

  if (!m) {
    return (
      <div style={{ padding: '10rem', textAlign: 'center' }}>
        <h2>{tp?.not_found || "Merchant not found"}</h2>
        <Link href="/services/results" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>{tp?.back_to_search || "Back to Search"}</Link>
      </div>
    );
  }
  
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

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };
  const youtubeId = getYoutubeId(m.youtubeVideoUrl);

  // 🎯 Intelligent Matching Logic for the "Your Search" Badge
  let matchedServiceId: string | null = null;
  if (query && services.length > 0) {
    const q = query.toLowerCase();
    // 1. Try exact or partial name match
    const bestMatch = services.find((s: any) => s.name?.toLowerCase().includes(q) || q.includes(s.name?.toLowerCase()));
    if (bestMatch) {
      matchedServiceId = bestMatch.id;
    } else if (cat && cat !== "All") {
      // 2. Fallback to category match
      const catMatch = services.find((s: any) => s.category?.toLowerCase() === cat.toLowerCase());
      if (catMatch) matchedServiceId = catMatch.id;
    }
  } else if (!query && cat && cat !== "All") {
    // If only category matches
    const catMatch = services.find((s: any) => s.category?.toLowerCase() === cat.toLowerCase());
    if (catMatch) matchedServiceId = catMatch.id;
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
          
          {/* Logo container - Responsive positioning */}
          <div style={{
            position: "absolute", bottom: "-40px", left: "1.5rem",
            width: "clamp(100px, 20vw, 140px)", 
            height: "clamp(100px, 20vw, 140px)", 
            borderRadius: "16px",
            background: "var(--surface-1)", border: "4px solid var(--bg-primary)",
            boxShadow: "0 10px 40px rgba(0,0,0,0.5)", zIndex: 20,
            display: "flex", alignItems: "center", justifyContent: "center",
            overflow: "hidden"
          }} className="merchant-logo-resp">
             {avatar
              ? <img src={avatar} alt={displayName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : <div style={{ fontSize: "3rem", fontWeight: 900, color: "var(--gold-500)" }}>{(displayName)[0]?.toUpperCase() || "?"}</div>
            }
          </div>
          
        </div>
      </div>

      <div className="container" style={{ maxWidth: "1140px", position: "relative", zIndex: 10, padding: "0 1.5rem" }}>
        {/* Name and Basic Meta - Responsive Logic */}
        <div style={{ 
          paddingTop: "1rem", 
          paddingBottom: "1.5rem", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "flex-start", 
          flexWrap: "wrap", 
          gap: "1.5rem",
          paddingLeft: "clamp(0px, 22vw, 170px)" // Responsive offset for the logo
        }} className="merchant-header-content">
          <div style={{ flex: 1, minWidth: "280px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem", flexWrap: "wrap" }}>
              <h1 style={{ fontSize: "clamp(1.8rem, 5vw, 2.8rem)", fontWeight: 900, color: "var(--text-primary)", margin: 0, letterSpacing: "-0.02em" }}>
                {displayName}
              </h1>
              {isVerified && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", backgroundColor: "rgba(212,175,55,0.15)", padding: "4px 12px", borderRadius: "100px", color: "var(--gold-400)", fontWeight: 800, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", border: "1px solid rgba(212,175,55,0.3)" }}>
                  <ShieldCheck size={14} /> {tp?.verified_expert || "Verified Expert"}
                </div>
              )}
            </div>
            
            <div style={{ display: "flex", gap: "2.5rem", flexWrap: "wrap", color: "var(--text-secondary)", fontSize: "1.1rem", marginTop: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Star size={20} fill="#d4af37" color="#d4af37" /> 
                <span style={{ fontWeight: 900, color: "var(--text-primary)", fontSize: "1.4rem" }}>{m.averageRating > 0 ? m.averageRating.toFixed(1) : avgRating}</span>
                <span style={{ fontSize: "0.95rem", opacity: 0.7 }}>({tp?.reviews_count ? interpolate(tp.reviews_count, { count: m.totalReviews || reviews.length }) : `${m.totalReviews || reviews.length} Reviews`})</span>
              </div>
              {m.city && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                  <MapPin size={18} color="var(--gold-500)" /> {m.city}
                </div>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 600 }}>
                <Award size={18} color="var(--gold-500)" /> {tp?.member_since ? interpolate(tp.member_since, { year: memberYear }) : `Member since ${memberYear}`}
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
          {[
            { label: tp?.tabs?.about || "Overview", id: "about" },
            { label: tp?.tabs?.services || "Services", id: "services" },
            { label: tp?.tabs?.reviews || "Reviews", id: "reviews" },
            { label: tp?.tabs?.company || "Company Info", id: "company-info" }
          ].map((nav) => (
            <a key={nav.id} href={`#${nav.id}`} style={{
              padding: "1.25rem 0", color: "var(--text-primary)", fontSize: "0.95rem",
              fontWeight: 800, background: "none", border: "none", cursor: "pointer",
              borderBottom: "3px solid transparent", transition: "all 0.2s",
              whiteSpace: "nowrap", textDecoration: "none"
            }}>
              {nav.label}
            </a>
          ))}
        </div>
      </div>

      <div className="container" style={{ 
        maxWidth: "1140px", marginTop: "2.5rem", 
        display: "grid", gridTemplateColumns: "1fr 360px", gap: "3rem", padding: "0 1.5rem"
      }}>
        
        {/* Left Column - Main Content */}
        <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
          
          {youtubeId && (
            <section id="video" style={{ borderRadius: "20px", overflow: "hidden", border: "1px solid var(--border-color)", boxShadow: "0 20px 50px rgba(0,0,0,0.3)" }}>
              <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
                <iframe
                  style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
                  src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0&modestbranding=1`}
                  title={tp?.verified_video || "Expert Profile Video"}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div style={{ padding: "1rem 1.5rem", backgroundColor: "var(--surface-1)", borderTop: "1px solid var(--border-color)", display: "flex", alignItems: "center", gap: "10px" }}>
                 <CheckCircle2 size={16} color="var(--gold-500)" />
                 <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--gold-400)" }}>{tp?.verified_video || "Verified Expert Introduction Video"}</span>
              </div>
            </section>
          )}

          <section id="about" style={{ background: "linear-gradient(145deg, var(--surface-1) 0%, rgba(212,175,55,0.04) 100%)", borderRadius: "20px", padding: "2.5rem", border: "1px solid var(--border-color)", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, right: 0, padding: "1.5rem", opacity: 0.1 }}>
              <Award size={80} color="var(--gold-500)" />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
              <div style={{ width: "4px", height: "24px", backgroundColor: "var(--gold-500)", borderRadius: "2px" }} />
              <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>{tp?.about_title || "Specialist Background"}</h2>
            </div>
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ color: "var(--text-secondary)", lineHeight: 1.8, fontSize: "1.08rem", margin: "0 0 1.5rem 0", fontWeight: 500 }}>
                {m.bio || m.description || tp?.about_fallback || "Senior specialist dedicated to delivering high-quality professional results."}
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "var(--gold-400)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                <CheckCircle2 size={12} /> {tp?.review_summary_note || "✦ AI-GENETIC PROFILE VERIFIED"}
              </div>
            </div>
          </section>

          {services.length > 0 && (
            <section id="services" style={{ background: "linear-gradient(145deg, var(--surface-1) 0%, rgba(212,175,55,0.04) 100%)", borderRadius: "20px", padding: "2.5rem", border: "1px solid var(--border-color)" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1.5rem" }}>{tp?.services_title || "Services Offered"}</h2>
              
              <div style={{ background: "var(--surface-2)", borderRadius: "16px", border: "1px solid var(--border-color)", padding: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>
                    {services[0]?.category || tp?.services_provided || "Specialist Services"} ({services.length})
                  </h3>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
                  {services.map((svc: any) => (
                    <Link key={svc.id} href={`/book/${m.id}?serviceId=${svc.id}`} style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-primary)", textDecoration: "none", fontSize: "0.95rem", padding: "8px 0" }}>
                      <Check size={18} color="var(--gold-500)" style={{ flexShrink: 0, strokeWidth: 3 }} />
                      <span style={{ fontWeight: 600 }}>{svc.name}</span>
                      <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>£{svc.price}</span>
                      {svc.id === matchedServiceId && (
                        <span style={{ background: "var(--accent-color)", color: "#000", padding: "3px 10px", borderRadius: "8px", fontSize: "0.65rem", fontWeight: 900, display: "flex", alignItems: "center", gap: "4px", marginLeft: "auto", boxShadow: "0 0 10px var(--accent-soft)" }}>
                          {tp?.matching_search || "MATCHING SEARCH"} <ThumbsUp size={12} />
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            </section>
          )}

          <section id="reviews" style={{ background: "linear-gradient(145deg, var(--surface-1) 0%, rgba(212,175,55,0.04) 100%)", borderRadius: "20px", padding: "2.5rem", border: "1px solid var(--border-color)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
              <h2 style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--text-primary)", margin: 0 }}>
                {tp?.customer_reviews ? interpolate(tp.customer_reviews, { count: reviews.length }) : `Customer Reviews (${reviews.length})`}
              </h2>
              <Link href={`/book/${m.id}/review`} style={{ 
                background: "transparent", border: "2px solid var(--gold-500)", 
                color: "var(--gold-400)", padding: "0.6rem 1.5rem", borderRadius: "8px", 
                fontWeight: 800, cursor: "pointer", textDecoration: "none" 
              }}>
                {tp?.write_review || "Write a review"}
              </Link>
            </div>
            
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>{tp?.review_overview || "Based on reviews over the past 12 months"}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "3rem" }}>
              {[
                { label: tp?.quality || "Quality", score: qualityScore },
                { label: tp?.reliability || "Reliability", score: reliabilityScore },
                { label: tp?.communication || "Communication", score: commsScore }
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
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "var(--gold-400)", margin: 0 }}>{tp?.review_summary_title || "AI Analysis Summary"}</h3>
                </div>
                <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.6, margin: "0 0 0.75rem 0", fontStyle: "italic" }}>
                  {tp?.review_summary_content || "Excellent feedback history with strong focus on quality and reliability."}
                </p>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", lineHeight: 1.5 }}>
                  {tp?.review_summary_note || "✦ AI-generated from customer reviews."}
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              {reviews.map((rev: any) => (
                <div key={rev.id} style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "2rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                    <div style={{ fontWeight: 800, color: "var(--text-primary)", fontSize: "1.1rem" }}>{rev.customer?.name || (locale === "zh-TW" ? "匿名客戶" : "Anonymous")}</div>
                    <div style={{ display: "flex", gap: "2px" }}>
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={14} fill={i < (rev.rating || 5) ? "#d4af37" : "none"} color="#d4af37" />
                      ))}
                    </div>
                  </div>
                  <p style={{ color: "var(--text-secondary)", lineHeight: 1.7, margin: "0 0 1rem 0", fontSize: "0.95rem" }}>
                    {rev.comment || (locale === "zh-TW" ? "服務優質，強烈推薦！" : "Great service, highly recommended!")}
                  </p>
                  <div style={{ display: "flex", gap: "1.5rem", fontSize: "0.8rem", color: "var(--text-muted)", fontWeight: 600 }}>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>{tp?.quality || "Quality"} <Star size={10} fill="currentColor" /> {rev.qualityRating || rev.rating || 5}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>{tp?.reliability || "Reliability"} <Star size={10} fill="currentColor" /> {rev.reliabilityRating || rev.rating || 5}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>{tp?.communication || "Communication"} <Star size={10} fill="currentColor" /> {rev.communicationRating || rev.rating || 5}</span>
                  </div>
                </div>
              ))}
              {reviews.length === 0 && (
                <div style={{ color: "var(--text-muted)", textAlign: "center", padding: "2rem 0" }}>{tp?.no_reviews || "No reviews yet"}</div>
              )}
            </div>
          </section>
        </div>

        {/* Right Column - Sidebar */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div style={{ position: "sticky", top: "100px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            
            {/* Elite Trust Seal */}
            <div className="reveal">
              <EliteTrustSeal 
                isVerified={isVerified} 
                insuranceAmount={m.insuranceAmount} 
                rating={m.averageRating > 0 ? m.averageRating.toFixed(1) : avgRating}
                totalJobs={m.totalJobs || reviews.length}
              />
            </div>

            {/* CTA Box */}
            <div style={{ 
              background: "linear-gradient(145deg, var(--surface-1) 0%, rgba(212,175,55,0.08) 100%)", 
              borderRadius: "20px", padding: "2rem", 
              border: "1px solid var(--gold-500)",
              boxShadow: "0 10px 40px rgba(212,175,55,0.1)"
            }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1.5rem" }}>{tp?.consultation_title || "Consultation"}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Link href={bookingHref} style={{
                  background: "linear-gradient(135deg, #d4af37, #f5e07a)",
                  color: "#000", padding: "1.1rem", borderRadius: "12px",
                  fontWeight: 900, textAlign: "center", textDecoration: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                }}>
                  {tp?.book_now || "Book Service Now"} <ArrowRight size={18} />
                </Link>
                <Link href={`/member/chat?merchantId=${m.id}`} style={{
                  background: "transparent", border: "1px solid var(--border-color)",
                  color: "var(--text-primary)", padding: "1.1rem", borderRadius: "12px",
                  fontWeight: 800, textAlign: "center", textDecoration: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                }}>
                  <MessageSquare size={18} /> {tp?.send_message || "Send Message"}
                </Link>
                {m.user?.phone && (
                  <a href={`tel:${m.user.phone}`} style={{
                    background: "transparent", border: "1px solid var(--border-color)",
                    color: "var(--text-primary)", padding: "1.1rem", borderRadius: "12px",
                    fontWeight: 800, textAlign: "center", textDecoration: "none",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                  }}>
                    <Phone size={18} /> {tp?.call_now ? interpolate(tp.call_now, { phone: m.user.phone }) : `Call Directly (${m.user.phone})`}
                  </a>
                )}
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", textAlign: "center", marginTop: "0.5rem" }}>
                  {tp?.platform_tip || "Security Tip: We mandate communication through ConciergeAI internal chat to ensure your safety."}
                </div>
              </div>
            </div>

            {/* Company Info Box */}
            <section id="company-info" style={{ background: "linear-gradient(145deg, var(--surface-1) 0%, rgba(212,175,55,0.04) 100%)", borderRadius: "20px", padding: "2rem", border: "1px solid var(--border-color)" }}>
              <h2 style={{ fontSize: "1.3rem", fontWeight: 900, color: "var(--text-primary)", marginBottom: "1.5rem" }}>{tp?.tabs?.company || "Company Info"}</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{tp?.owner_label || "OWNER"}</div>
                  <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.1rem" }}>{m.ownerName || m.user?.name || "N/A"}</div>
                </div>
                
                <div style={{ height: "1px", background: "var(--border-color)" }} />
                
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{tp?.operates_label || "OPERATES IN"}</div>
                  <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.1rem" }}>{m.city ? `${m.city} ${tp?.nearby || "and surrounding areas"}` : (tp?.nationwide || "Nationwide")}</div>
                </div>

                <div style={{ height: "1px", background: "var(--border-color)" }} />
                
                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{tp?.business_type_label || "BUSINESS TYPE"}</div>
                  <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.1rem" }}>{m.businessType || tp?.sole_trader || "Sole Trader"}</div>
                </div>
                
                <div style={{ height: "1px", background: "var(--border-color)" }} />

                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{tp?.vat_label || "VAT REGISTERED"}</div>
                  <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    {m.vatNumber ? (
                      <><CheckCircle2 size={18} color="var(--gold-500)" /> {tp?.yes || "Yes"}</>
                    ) : (
                      tp?.no || "No"
                    )}
                  </div>
                </div>

                <div style={{ height: "1px", background: "var(--border-color)" }} />

                <div>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.85rem", fontWeight: 700, marginBottom: "0.4rem", textTransform: "uppercase", letterSpacing: "0.05em" }}>{tp?.insurance_label || "INSURANCE"}</div>
                  <div style={{ color: "var(--text-primary)", fontWeight: 800, fontSize: "1.1rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    {m.insuranceAmount && m.insuranceAmount > 0 ? (
                      <><ShieldCheck size={18} color="#10b981" /> {tp?.insured_amount ? interpolate(tp.insured_amount, { amount: m.insuranceAmount.toLocaleString() }) : `£${m.insuranceAmount.toLocaleString()} Insured`}</>
                    ) : (
                      <span style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{tp?.not_provided || "Contact for info"}</span>
                    )}
                  </div>
                </div>
              </div>
            </section>
            
            {/* Auxiliary Actions */}
            <ProfileActions 
              displayName={displayName}
              description={m.description || m.bio}
              website={m.website}
            />
            
          </div>
        </div>
      </div>
      <MerchantAIBot merchantId={m.id} merchantName={displayName} />
    </div>
  );
}
