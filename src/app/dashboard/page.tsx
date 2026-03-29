import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TrendingUp, Clock, CheckCircle2, Star, ShieldCheck, Wallet, Banknote, CalendarHeart, MapPin, MessageCircle, Wrench, Camera, Plus, ArrowRight, Car, Home } from "lucide-react";
import StripeConnectButton from "./components/StripeConnectButton";
import ReviewButton from "./components/ReviewModal";
import VariationCustomerAlert from "./components/VariationCustomerAlert";
import VariationMerchantButton from "./components/VariationMerchantButton";
import BookingStatusActions from "./components/BookingStatusActions";
import { prisma } from "@/lib/prisma";
import MaintenanceTimeline from "@/components/dashboard/MaintenanceTimeline";
import MerchantAnalytics from "@/components/dashboard/MerchantAnalytics";
import AISuggestionBox from "@/components/dashboard/AISuggestionBox";

export default async function DashboardOverview() {
  const session = (await getServerSession(authOptions)) as any;
  
  if (!session || !session.user) redirect("/auth/login");
  
  const user = session.user as any;
  const isMerchant = user.role === "MERCHANT";

  // Parallelize data fetching for better performance
  const [dbUser, userReview, bookings] = await Promise.all([
    prisma.user.findUnique({
      where: { id: user.id },
      select: { 
        name: true, 
        referralCode: true, 
        referralCredits: true 
      } as any
    }),
    (!isMerchant ? prisma.review.findFirst({
      where: { customerId: user.id },
      orderBy: { createdAt: 'desc' }
    }) : Promise.resolve(null)),
    (!isMerchant ? prisma.booking.findMany({
      where: { customerId: user.id },
      include: {
        service: true,
        merchant: {
          include: {
            user: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    }) : Promise.resolve([]))
  ]) as [any, any, any[]];

  // Self-heal: If referralCode is missing for existing user, generate it in background or on demand
  // To keep Dashboard FAST, we skip the update if it's already fetching correctly
  if (!isMerchant) {
    const activeBooking = bookings.find(b => b.status !== 'COMPLETED' && b.status !== 'CANCELLED');

    // Fully Featured Customer Dashboard UI
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* Welcome Header */}
        <div style={{ padding: '1rem 0' }} className="animate-fade-up">
          <h1 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            午安，{user.name || "貴賓"} 👋
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.2rem' }}>
            您目前有 {bookings.filter(b => b.status !== 'COMPLETED').length} 筆進行中的服務。
          </p>
        </div>

        {/* Variations are temporarily disabled in the overview list to fix Prisma sync issues */}
        {/* We can fetch them per-booking in the repair tracker page instead */}

        {/* Action Highlights */}
        <div className="animate-fade-up delay-200" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          
          {/* Upcoming Booking Card */}
          {activeBooking ? (
            <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', borderLeft: '4px solid var(--accent-color)', backgroundColor: 'var(--bg-secondary)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                 <div>
                    <div style={{ color: 'var(--accent-color)', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <CalendarHeart size={16} /> 近期服務 (Upcoming)
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{activeBooking.service?.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{activeBooking.merchant?.user?.name}</p>
                 </div>
                 <span style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-color)', padding: '0.35rem 0.75rem', borderRadius: '2rem', fontSize: '0.8rem', fontWeight: 700 }}>
                   {activeBooking.status}
                 </span>
               </div>
               
               <div style={{ padding: '1rem', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                   <Clock size={16} color="var(--text-secondary)" /> {new Date(activeBooking.createdAt).toLocaleDateString()}
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                   <MapPin size={16} color="var(--text-secondary)" /> {(activeBooking as any).postcode || "Location"}
                 </div>
               </div>
               
               <div style={{ display: 'flex', gap: '0.75rem', flexDirection: 'column' }}>
                 {(activeBooking as any).vehicleReg && (
                   <Link href={`/dashboard/repair/${activeBooking.id}`} style={{ width: '100%', textDecoration: 'none' }}>
                     <button style={{ width: '100%', padding: '0.85rem', borderRadius: '8px', backgroundColor: 'var(--accent-color)', color: 'white', fontWeight: 700, border: 'none', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                       <Wrench size={18} /> Track My Repair / 追蹤維修進度
                     </button>
                   </Link>
                 )}
                 <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-primary)', fontWeight: 600, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <MessageCircle size={18} /> 聯絡專家
                    </button>
                    <button style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', backgroundColor: 'transparent', color: 'var(--text-secondary)', fontWeight: 600, border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      管理預約
                    </button>
                 </div>
               </div>
            </div>
          ) : (
             <div className="glass-panel" style={{ padding: '2rem', borderRadius: '16px', border: '1px dashed var(--border-color)', textAlign: 'center' }}>
                <CalendarHeart size={32} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>暫無進行中的服務</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>預約您的下一個專業服務吧！</p>
             </div>
          )}

          {/* Start New Booking CTA */}
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', border: '2px dashed #e2e8f0', backgroundColor: 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
             <div style={{ width: '60px', height: '60px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
               <Wrench size={28} color="#64748b" />
             </div>
             <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>需要其他居家協助嗎？</h3>
             <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '200px' }}>尋找超過 500+ 位經過嚴格認證的本地服務專家。</p>
             <Link href="/services?city=London">
                <button className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '2rem' }}>瀏覽服務目錄</button>
             </Link>
          </div>
        </div>

        {/* Maintenance Timeline Section */}
        <div className="animate-fade-up delay-300" style={{ marginTop: '1rem' }}>
          <MaintenanceTimeline />
        </div>

        {/* Past Bookings & History */}
        <div className="glass-panel animate-fade-up delay-400" style={{ padding: '2rem', borderRadius: '16px', marginTop: '1rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>歷史預約與付款憑證 (History)</h2>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: '#94a3b8', fontSize: '0.875rem' }}>
                  <th style={{ paddingBottom: '1rem', fontWeight: 600 }}>服務項目 (Service)</th>
                  <th style={{ paddingBottom: '1rem', fontWeight: 600 }}>日期 (Date)</th>
                  <th style={{ paddingBottom: '1rem', fontWeight: 600 }}>總金額 (Total)</th>
                  <th style={{ paddingBottom: '1rem', fontWeight: 600 }}>狀態 (Status)</th>
                  <th style={{ paddingBottom: '1rem', fontWeight: 600 }}>行動/評價 (Action)</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>目前無歷史預約紀錄</td>
                  </tr>
                ) : (
                  bookings.map((booking: any) => (
                    <tr key={booking.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '1.25rem 0' }}>
                        <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{booking.service?.name}</div>
                        <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{booking.merchant?.companyName}</div>
                      </td>
                      <td style={{ padding: '1.25rem 0', color: '#94a3b8' }}>{new Date(booking.scheduledDate).toLocaleDateString()}</td>
                      <td style={{ padding: '1.25rem 0', fontWeight: 700, color: 'var(--text-primary)' }}>£{booking.totalAmount.toFixed(2)}</td>
                      <td style={{ padding: '1.25rem 0' }}>
                        <span style={{ 
                          backgroundColor: booking.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255,255,255,0.05)', 
                          color: booking.status === 'COMPLETED' ? '#10b981' : 'var(--text-primary)', 
                          padding: '0.35rem 0.75rem', 
                          borderRadius: '1rem', 
                          fontSize: '0.75rem', 
                          fontWeight: 600 
                        }}>
                          {booking.status}
                        </span>
                      </td>
                      <td style={{ padding: '1.25rem 0' }}>
                        {booking.status === 'COMPLETED' ? (
                          <ReviewButton 
                            bookingId={booking.id} 
                            merchantId={booking.merchantId} 
                            serviceName={booking.service?.name} 
                          />
                        ) : (
                          <Link href={`/dashboard/repair/${booking.id}`} style={{ color: 'var(--accent-color)', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>
                            查看詳情
                          </Link>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* My Account & Rewards Section */}
        <div style={{ marginTop: '2.5rem', padding: '2rem', borderRadius: '24px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid rgba(255, 255, 255, 0.05)' }} className="animate-fade-up delay-500">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Wallet size={28} color="#6366f1" /> 帳戶設定與獎勵 (My Account & Rewards)
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {/* Referral Info Card */}
            <div style={{ 
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(168, 85, 247, 0.15) 100%)',
              border: '1px solid rgba(99, 102, 241, 0.2)',
              padding: '2rem',
              borderRadius: '1.5rem',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <Star size={20} fill="#818cf8" color="#818cf8" />
                  <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>推薦親友獎勵計畫</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>推薦代碼</p>
                    <div style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 900, 
                      letterSpacing: '0.1em',
                      color: '#f8fafc',
                      background: 'rgba(255,255,255,0.1)',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '0.5rem'
                    }}>{(dbUser as any)?.referralCode}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: '#94a3b8', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>可用點數</p>
                    <div style={{ fontSize: '2rem', fontWeight: 900, color: '#818cf8' }}>£{(dbUser as any)?.referralCredits?.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#cbd5e1', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', marginTop: '1rem' }}>
                分享給好友，雙方皆享有完工金額 <span style={{ color: '#f8fafc', fontWeight: 700 }}>3% 回饋</span>！
              </p>
            </div>

            {/* My Garage Link Card */}
            <Link href="/dashboard/garage" style={{ textDecoration: 'none' }}>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2rem',
                borderRadius: '1.5rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }} className="hover-scale">
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '1.25rem', borderRadius: '50%', marginBottom: '1.25rem', border: '1px solid rgba(99, 102, 241, 0.2)' }}>
                  <Car size={32} color="#6366f1" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>我的車庫 (My Garage)</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '240px' }}>管理您的所有車輛，追蹤維修日誌與 MOT</p>
              </div>
            </Link>

            {/* My Properties Link Card */}
            <Link href="/dashboard/properties" style={{ textDecoration: 'none' }}>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 241, 0.1)',
                padding: '2rem',
                borderRadius: '1.5rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }} className="hover-scale">
                <div style={{ background: 'rgba(244, 63, 94, 0.1)', padding: '1.25rem', borderRadius: '50%', marginBottom: '1.25rem', border: '1px solid rgba(244, 63, 94, 0.2)' }}>
                  <Home size={32} color="#f43f5e" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>我的房產 (Properties)</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '240px' }}>管理多個服務地址，記錄設施維修細節</p>
              </div>
            </Link>

            {/* Voucher Redemption & Wallet Link Card */}
            <Link href="/dashboard/wallet" style={{ textDecoration: 'none' }}>
              <div style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                padding: '2rem',
                borderRadius: '1.5rem',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                transition: 'all 0.3s',
                cursor: 'pointer'
              }} className="hover-scale">
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '1.25rem', borderRadius: '50%', marginBottom: '1.25rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <Banknote size={32} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>我的錢包與獎勵 (Wallet)</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', maxWidth: '240px' }}>管理點數、兌換優惠券並查看推薦回饋</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Merchant Dashboard View
  const merchant = await (prisma.merchant as any).findUnique({
    where: { userId: user.id },
    include: {
      portfolio: true,
      wallet: true
    }
  });

  const merchantBookings = merchant ? await prisma.booking.findMany({
    where: { merchantId: merchant.id },
    include: { 
      customer: true, 
      service: true 
    },
    orderBy: { createdAt: 'desc' },
    take: 5
  }) : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* Verification Banner */}
      {!merchant?.isVerified && (
        <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: '#b45309', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShieldCheck size={20} /> 需要您的行動：執照與身份人工審核 (Verification)
            </h3>
            <p style={{ color: '#92400e', fontSize: '0.875rem' }}>為了讓客戶能搜尋並預約您的服務，您必須依照英國商用指引上傳您的專業證照供 AI 初審。</p>
          </div>
          <Link href="/dashboard/verification" style={{ textDecoration: 'none', display: 'inline-block', backgroundColor: '#d97706', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '6px', fontWeight: 600, cursor: 'pointer', transition: 'background-color 0.2s' }}>
            前往上傳證件
          </Link>
        </div>
      )}

      {/* Stripe Onboarding Banner */}
      {merchant?.isVerified && !merchant?.stripeAccountId && (
        <div style={{ backgroundColor: '#e0e7ff', border: '1px solid #c7d2fe', borderRadius: '12px', padding: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: '#3730a3', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Banknote size={20} /> 綁定收款銀行帳戶 (Stripe Connect)
            </h3>
            <p style={{ color: '#312e81', fontSize: '0.875rem' }}>恭喜您通過身分審查！為了能順利收取客人的信用卡訂金，請建立您的 Stripe 收款帳戶。</p>
          </div>
          <StripeConnectButton />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.025em' }}>商家績效中心 <span style={{ color: 'var(--accent-color)' }}>Analytics</span></h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 700 }}>
          <Clock size={16} /> Data Refresh: Just Now
        </div>
      </div>

      {/* Advanced Analytics Suite */}
      <MerchantAnalytics />

      <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        <div className="glass-panel animate-fade-up delay-200" style={{ padding: '2rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1.5px solid var(--border-color)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 800 }}>
            <Wallet size={18} color="#10b981" /> 可提現餘額
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>£{merchant?.wallet?.availableBalance?.toFixed(2) || "0.00"}</div>
          <Link href="/dashboard/merchant/wallet" style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            管理提現 Manage Withdrawals <ArrowRight size={14} />
          </Link>
        </div>

        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', backgroundColor: 'var(--surface-1)', display: 'flex', alignItems: 'center', gap: '1.5rem', border: '1.5px solid var(--border-color)' }}>
           <div style={{ backgroundColor: 'var(--accent-soft)', padding: '1.25rem', borderRadius: '1.25rem' }}>
             <Camera size={36} color="var(--accent-color)" />
           </div>
           <div style={{ flex: 1 }}>
             <h3 style={{ fontSize: '1.15rem', fontWeight: 900, color: 'var(--text-primary)' }}>作品集展示 ({merchant?.portfolio?.length || 0})</h3>
             <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>上傳您的完工照片以提升轉化率。</p>
           </div>
           <button style={{ backgroundColor: 'var(--accent-color)', color: 'white', border: 'none', padding: '0.75rem 1.25rem', borderRadius: '12px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
             <Plus size={18} /> 新增案例
           </button>
        </div>

        <AISuggestionBox />
      </div>

      {/* Recent Bookings Table - Keep it legacy for balance or move to a separate tab later */}
      <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px', marginTop: '3rem', border: '1.5px solid var(--border-color)', backgroundColor: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
           <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--text-primary)' }}>最新預約請求 (Recent Requests)</h2>
           <Link href="/dashboard/bookings" style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--accent-color)', textDecoration: 'none' }}>查看全部列表 View All</Link>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                <th style={{ paddingBottom: '0.75rem', fontWeight: 600 }}>客戶名稱 (Customer)</th>
                <th style={{ paddingBottom: '0.75rem', fontWeight: 600 }}>服務項目 (Service)</th>
                <th style={{ paddingBottom: '0.75rem', fontWeight: 600 }}>服務日期 (Date)</th>
                <th style={{ paddingBottom: '0.75rem', fontWeight: 600 }}>金額 (Amount)</th>
                <th style={{ paddingBottom: '0.75rem', fontWeight: 600 }}>訂單狀態 (Status)</th>
                <th style={{ paddingBottom: '0.75rem', fontWeight: 600 }}></th>
              </tr>
            </thead>
            <tbody>
              {merchantBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>目前尚無預約請求</td>
                </tr>
              ) : (
                merchantBookings.map((booking: any) => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '1rem 0' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{booking.customer?.name}</div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{booking.customer?.city || "London"}</div>
                    </td>
                    <td style={{ padding: '1rem 0', color: 'var(--text-secondary)', fontWeight: 500 }}>{booking.service?.name}</td>
                    <td style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>{new Date(booking.scheduledDate).toLocaleString()}</td>
                    <td style={{ padding: '1rem 0', fontWeight: 700, color: 'var(--text-primary)' }}>£{booking.totalAmount.toFixed(2)}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span style={{ 
                        backgroundColor: booking.status === 'PENDING' ? '#fef3c7' : '#ccfbf1', 
                        color: booking.status === 'PENDING' ? '#b45309' : '#0f766e', 
                        padding: '0.35rem 0.75rem', 
                        borderRadius: '1rem', 
                        fontSize: '0.75rem', 
                        fontWeight: 600 
                      }}>
                        {booking.status}
                      </span>
                    </td>
                    <td style={{ padding: '1.25rem 0', textAlign: 'right', display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                       {booking.status === 'PENDING' && (
                         <div style={{ display: 'flex', gap: '0.5rem' }}>
                           <BookingStatusActions bookingId={booking.id} currentStatus={booking.status} />
                           <VariationMerchantButton bookingId={booking.id} />
                         </div>
                       )}
                       <Link href={`/dashboard/merchant/bookings/${booking.id}`} style={{ textDecoration: 'none' }}>
                          <button style={{ backgroundColor: 'transparent', color: 'var(--text-primary)', border: '1px solid var(--border-color)', padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>查看細節 Details</button>
                       </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
