import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  TrendingUp, Clock, CheckCircle2, Star, ShieldCheck, Wallet, Banknote, 
  CalendarHeart, MapPin, MessageCircle, Wrench, Camera, Plus, ArrowRight, 
  Car, Home, Sparkles, Zap, ChevronRight, PieChart, Target, Users, AlertTriangle, ShieldAlert
} from "lucide-react";
import StripeConnectButton from "./components/StripeConnectButton";
import ReviewButton from "./components/ReviewModal";
import BookingStatusActions from "./components/BookingStatusActions";
import VariationMerchantButton from "./components/VariationMerchantButton";
import { prisma } from "@/lib/prisma";
import MerchantAnalytics from "@/components/dashboard/MerchantAnalytics";
import MaintenanceTimeline from "@/components/dashboard/MaintenanceTimeline";
import DynamicGreeting from "@/components/dashboard/DynamicGreeting";

export default async function DashboardOverview() {
  const session = (await getServerSession(authOptions)) as any;
  
  if (!session || !session.user) redirect("/auth/login");
  
  const user = session.user as any;
  const isMerchant = user.role === "MERCHANT";

  // Parallelize data fetching
  const [dbUser, bookings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { name: true, referralCode: true, referralCredits: true } as any
    }),
    prisma.booking.findMany({
      where: isMerchant ? { merchantId: (await (prisma.merchant as any).findUnique({ where: { userId: user.id } }))?.id } : { customerId: user.id },
      include: {
        service: true,
        customer: true,
        merchant: { include: { user: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    })
  ]) as [any, any[]];

  const merchant = isMerchant ? await (prisma.merchant as any).findUnique({
    where: { userId: user.id },
    include: { wallet: true, portfolio: true }
  }) : null;

  if (!isMerchant) {
    const activeBooking = bookings.find(b => b.status === 'PENDING' || b.status === 'CONFIRMED');

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        {/* Maintenance Advisory Banner */}
        <div className="glass-panel hover-lift" style={{ 
          background: 'linear-gradient(135deg, #fff 0%, #fffaf0 100%)', 
          borderLeft: '5px solid #f59e0b', 
          padding: '1.5rem 2rem', 
          borderRadius: '24px', 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 10px 30px -5px rgba(245, 158, 11, 0.1)',
          animation: 'fadeIn 0.5s ease-out'
        }}>
          <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
            <div style={{ padding: '0.8rem', backgroundColor: '#fef3c7', borderRadius: '16px' }}>
              <AlertTriangle color="#d97706" size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                AI 維護建議：您的車輛需要保養 <span style={{ fontSize: '0.7rem', backgroundColor: '#f59e0b', color: 'white', padding: '0.1rem 0.6rem', borderRadius: '99px' }}>URGENT</span>
              </h3>
              <p style={{ color: '#b45309', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                您的 <b>VW Golf (LF19 XXX)</b> 距離上次保養已達 12 個月。及時檢查可延長引擎壽命並維持二手價值。
              </p>
            </div>
          </div>
          <Link href="/services/results?q=car-service" style={{ 
            backgroundColor: '#d97706', 
            color: 'white', 
            padding: '0.8rem 1.5rem', 
            borderRadius: '12px', 
            textDecoration: 'none', 
            fontWeight: 800, 
            fontSize: '0.9rem',
            boxShadow: '0 4px 12px rgba(217, 119, 6, 0.2)'
          }}>
            立即預約檢查
          </Link>
        </div>

        {/* Hero Welcome */}
        <section className="reveal active">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ color: 'var(--accent-color)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Customer Dashboard
              </p>
              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
                <DynamicGreeting name={dbUser?.name} />
              </h1>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>£{dbUser?.referralCredits?.toFixed(2) || "0.00"}</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Available Credits</div>
            </div>
          </div>
        </section>

        {/* Top Cards Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
          
          {/* Active Booking Focus */}
          <div className="glass-panel hover-lift" style={{ 
            padding: '2rem', 
            borderRadius: '28px', 
            borderLeft: '8px solid var(--accent-color)',
            background: 'var(--surface-1)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}>
              <Sparkles size={120} color="var(--accent-color)" />
            </div>
            
            {activeBooking ? (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <div style={{ backgroundColor: 'var(--accent-soft)', color: 'var(--accent-color)', padding: '0.4rem 1rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800, border: '1px solid var(--accent-color)' }}>
                    ACTIVE SERVICE
                  </div>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>{activeBooking.status}</span>
                </div>
                <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{activeBooking.service?.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Users size={16} /> {activeBooking.merchant?.user?.name}
                </p>
                <Link href={`/dashboard/repair/${activeBooking.id}`} style={{ textDecoration: 'none' }}>
                  <button className="btn btn-primary" style={{ width: '100%', borderRadius: '14px', padding: '1rem' }}>
                    查看詳細進度 Track Details
                  </button>
                </Link>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <div style={{ backgroundColor: 'var(--surface-2)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem' }}>
                  <Zap size={28} color="var(--text-muted)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>準備好享受新的一天了嗎？</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>您目前沒有進行中的服務。需要幫忙打掃或維修嗎？</p>
                <Link href="/services" className="btn" style={{ padding: '0.6rem 1.5rem', backgroundColor: 'var(--surface-2)', borderRadius: '10px' }}>瀏覽服務項目</Link>
              </div>
            )}
          </div>

          {/* AI Discovery CTA */}
          <div className="glass-panel" style={{ 
            padding: '2rem', 
            borderRadius: '28px', 
            background: 'linear-gradient(135deg, var(--emerald-700) 0%, var(--emerald-900) 100%)',
            color: 'white'
          }}>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>AI 即時診斷現已上線</h3>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', marginBottom: '2rem' }}>拍張照，讓我們的 AI 為您識別問題並預估全英市場公道價格。</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Link href="/ai-diagnosis" style={{ textDecoration: 'none' }}>
                <button className="btn" style={{ width: '100%', backgroundColor: 'white', color: 'var(--emerald-800)', border: 'none', borderRadius: '12px', fontWeight: 800 }}>
                  立即體驗 AI
                </button>
              </Link>
              <div style={{ fontSize: '0.75rem', opacity: 0.8, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldCheck size={16} /> 100% 機密保護
              </div>
            </div>
          </div>
        </div>

        {/* Maintenance Timeline Area */}
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              維護與資產時程 Maintenance Log
            </h2>
            <Link href="/dashboard/garage" style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: 800, textDecoration: 'none' }}>
              管理我的資產 →
            </Link>
          </div>
          <MaintenanceTimeline />
        </section>

        {/* Past Bookings Table */}
        <section className="glass-panel" style={{ padding: '2rem', borderRadius: '28px' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '2rem' }}>預約歷史與憑證 History</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 0', textAlign: 'left' }}>Service & Expert</th>
                  <th style={{ padding: '1rem 0', textAlign: 'left' }}>Scheduled</th>
                  <th style={{ padding: '1rem 0', textAlign: 'left' }}>Amount</th>
                  <th style={{ padding: '1rem 0', textAlign: 'right' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--surface-2)' }}>
                    <td style={{ padding: '1.25rem 0' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)' }}>{b.service?.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{b.merchant?.user?.name}</div>
                    </td>
                    <td style={{ padding: '1.25rem 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {new Date(b.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '1.25rem 0', fontWeight: 900, color: 'var(--text-primary)' }}>
                      £{b.totalAmount.toFixed(2)}
                    </td>
                    <td style={{ padding: '1.25rem 0', textAlign: 'right' }}>
                      {b.status === 'COMPLETED' ? (
                        <ReviewButton bookingId={b.id} merchantId={b.merchantId} serviceName={b.service?.name} />
                      ) : (
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-color)' }}>{b.status}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    );
  }

  // --- Merchant Dashboard (Expert View) ---
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Verification & Stripe Alerts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {!merchant?.isVerified && (
          <div style={{ background: '#fff7ed', border: '1px solid #ffedd5', borderRadius: '20px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ background: '#fed7aa', padding: '0.75rem', borderRadius: '12px', color: '#ea580c' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 style={{ color: '#9a3412', fontWeight: 900 }}>身份證照人工審核 Pending</h4>
                <p style={{ color: '#c2410c', fontSize: '0.85rem' }}>請上傳英國工商登記或專業執照，AI 審核通過後即可開始接單。</p>
              </div>
            </div>
            <Link href="/dashboard/verification" className="btn btn-primary" style={{ background: '#ea580c', border: 'none' }}>去上傳</Link>
          </div>
        )}
        {merchant?.isVerified && !merchant?.stripeAccountId && (
          <div style={{ background: 'var(--emerald-50)', border: '1px solid var(--emerald-100)', borderRadius: '20px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <div style={{ background: 'var(--emerald-100)', padding: '0.75rem', borderRadius: '12px', color: 'var(--emerald-700)' }}>
                <Banknote size={24} />
              </div>
              <div>
                <h4 style={{ color: 'var(--emerald-900)', fontWeight: 900 }}>啟用線上收款 Stripe Connect</h4>
                <p style={{ color: 'var(--emerald-700)', fontSize: '0.85rem' }}>綁定您的銀行帳戶，以自動接收交易款項與提現。</p>
              </div>
            </div>
            <StripeConnectButton />
          </div>
        )}
      </div>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <p style={{ color: 'var(--accent-color)', fontWeight: 800, fontSize: '0.9rem', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              Merchant Analytics
            </p>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
              <DynamicGreeting name={user.name} />
            </h1>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link href="/dashboard/merchant/availability" className="btn" style={{ background: 'white', border: '1px solid var(--border-color)', borderRadius: '12px', fontWeight: 800 }}>更新班表</Link>
            <button className="btn btn-primary" style={{ borderRadius: '12px' }}><Plus size={18} /> 發布新服務</button>
          </div>
        </div>
        <MerchantAnalytics />
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {/* Real-time Insights Card */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '1rem' }}>
            <Target size={18} color="var(--accent-color)" /> Market Position
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>本地競爭力分析</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>地區排名</span>
              <span style={{ fontWeight: 800 }}>TOP 15%</span>
            </div>
             <div style={{ height: '8px', backgroundColor: 'var(--surface-2)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: '85%', height: '100%', backgroundColor: 'var(--accent-color)' }}></div>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              您的平均回覆速度優於 <span style={{ color: 'var(--accent-color)', fontWeight: 800 }}>92%</span> 的專家！保持下去。
            </p>
          </div>
        </div>

        {/* Portfolio Activity */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'var(--accent-soft)', padding: '0.75rem', borderRadius: '12px' }}>
              <Camera size={28} color="var(--accent-color)" />
            </div>
            <div>
              <h4 style={{ fontWeight: 800 }}>作品集流量</h4>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>過去 7 天有 42 位顧客查看</p>
            </div>
          </div>
          <Link href="/dashboard/merchant/portfolio" style={{ width: '100%', textDecoration: 'none' }}>
            <button className="btn" style={{ width: '100%', background: 'var(--surface-2)', border: 'none', borderRadius: '12px' }}>管理作品集 Manage</button>
          </Link>
        </div>
      </div>

      {/* Merchant Bookings Table */}
      <section className="glass-panel" style={{ padding: '2rem', borderRadius: '28px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '2rem' }}>最新預約請求 Requests</h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '1rem 0', textAlign: 'left' }}>Customer</th>
                <th style={{ padding: '1rem 0', textAlign: 'left' }}>Service</th>
                <th style={{ padding: '1rem 0', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '1rem 0', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>尚無預約請求</td></tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: '1px solid var(--surface-2)' }}>
                    <td style={{ padding: '1.25rem 0' }}>
                      <div style={{ fontWeight: 800 }}>{b.customer?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{(b as any).postcode || "London"}</div>
                    </td>
                    <td style={{ padding: '1.25rem 0', color: 'var(--text-secondary)' }}>{b.service?.name}</td>
                    <td style={{ padding: '1.25rem 0' }}>
                      <span style={{ 
                        background: b.status === 'PENDING' ? '#fffbeb' : 'var(--emerald-50)', 
                        color: b.status === 'PENDING' ? '#b45309' : 'var(--emerald-700)',
                        padding: '0.4rem 0.8rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 800
                      }}>{b.status}</span>
                    </td>
                    <td style={{ padding: '1.25rem 0', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <BookingStatusActions bookingId={b.id} currentStatus={b.status} />
                        <VariationMerchantButton bookingId={b.id} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
