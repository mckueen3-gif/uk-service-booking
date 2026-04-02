import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Star, MessageSquare, TrendingUp, TrendingDown, LayoutDashboard } from "lucide-react";
import ReviewManager from "@/components/dashboard/merchant/ReviewManager";

export default async function MerchantReviewsPage() {
  const session = (await getServerSession(authOptions)) as any;
  if (!session || session.user.role !== "MERCHANT") redirect("/dashboard");

  const merchant = await prisma.merchant.findUnique({
    where: { userId: session.user.id },
    include: {
      reviews: {
        include: {
          customer: { select: { name: true, image: true } }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!merchant) return <div>Merchant profile not found.</div>;

  const stats = {
    total: merchant.totalReviews || 0,
    avg: merchant.averageRating?.toFixed(1) || "0.0",
    positive: merchant.reviews.filter((r: any) => r.sentiment === 'POSITIVE').length,
    negative: merchant.reviews.filter((r: any) => r.sentiment === 'NEGATIVE').length
  };

  return (
    <div className="animate-fade-up">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>客戶評價管理 (Reviews)</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>掌握您的商業信譽，利用 AI 洞察優化服務質量</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass-panel" style={{ padding: '0.75rem 1.25rem', borderRadius: '14px', border: '1.5px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Star size={20} fill="#eab308" color="#eab308" />
            <span style={{ fontSize: '1.4rem', fontWeight: 900 }}>{stats.avg}</span>
          </div>
        </div>
      </div>

      {/* Review Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--surface-1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>總評價數 Total</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={18} color="var(--accent-color)" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900 }}>{stats.total}</div>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--surface-1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>核心情感 Positive Rate</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#ecfdf5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingUp size={18} color="#facc15" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#facc15' }}>{((stats.positive / (stats.total || 1)) * 100).toFixed(0)}%</div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '20px', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--surface-1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>需要改進 Negative Alerts</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TrendingDown size={18} color="#ef4444" />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 900, color: '#ef4444' }}>{stats.negative}</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', maxWidth: '1000px' }}>
        {merchant.reviews.length === 0 ? (
          <div style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            目前暫無任何評價資料。
          </div>
        ) : (
          merchant.reviews.map((review: any) => (
            <ReviewManager key={review.id} review={review} />
          ))
        )}
      </div>
    </div>
  );
}
