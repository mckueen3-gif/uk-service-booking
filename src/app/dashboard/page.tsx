import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { TrendingUp, Clock, CheckCircle2, Star, ShieldCheck, Wallet, Banknote, CalendarHeart, MapPin, MessageCircle, Wrench, Camera, Plus, ArrowRight, Car, Home, Sparkles } from "lucide-react";
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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        {/* Welcome Header */}
        <div className="reveal active">
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem', letterSpacing: '-0.03em', fontFamily: 'var(--font-heading)' }}>
            午安，{user.name || "貴賓"} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.25rem', fontWeight: 500 }}>
            您目前有 <span style={{ color: 'var(--accent-color)', fontWeight: 800 }}>{bookings.filter(b => b.status !== 'COMPLETED').length}</span> 筆進行中的服務。
          </p>
        </div>

        {/* Action Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 reveal stagger-1">
          
          {/* Upcoming Booking Card */}
          {activeBooking ? (
            <div className="glass-panel" style={{ padding: '2rem', borderLeft: '6px solid var(--accent-color)', background: 'var(--surface-1)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                 <div>
                    <div style={{ color: 'var(--accent-color)', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                      <CalendarHeart size={16} /> 近期服務 Upcoming
                    </div>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{activeBooking.service?.name}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>{activeBooking.merchant?.user?.name}</p>
                 </div>
                 <span style={{ backgroundColor: 'var(--emerald-50)', color: 'var(--emerald-700)', padding: '0.5rem 1rem', borderRadius: '2rem', fontSize: '0.85rem', fontWeight: 800 }}>
                   {activeBooking.status}
                 </span>
               </div>
               
               <div style={{ padding: '1.25rem', backgroundColor: 'var(--surface-2)', borderRadius: '12px', marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 600 }}>
                   <Clock size={18} color="var(--accent-color)" /> {new Date(activeBooking.createdAt).toLocaleDateString()}
                 </div>
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', color: 'var(--text-secondary)', fontSize: '0.95rem', fontWeight: 600 }}>
                   <MapPin size={18} color="var(--accent-color)" /> {(activeBooking as any).postcode || "Location"}
                 </div>
               </div>
               
               <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
                 {(activeBooking as any).vehicleReg && (
                   <Link href={`/dashboard/repair/${activeBooking.id}`} style={{ width: '100%', textDecoration: 'none' }}>
                     <button className="btn btn-primary" style={{ width: '100%', borderRadius: '12px' }}>
                       <Wrench size={18} /> 追蹤維修進度 Track Repair
                     </button>
                   </Link>
                 )}
                 <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn" style={{ flex: 1, backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      <MessageCircle size={18} /> 聯絡專家
                    </button>
                    <button className="btn" style={{ flex: 1, backgroundColor: 'transparent', color: 'var(--text-muted)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                      管理預約
                    </button>
                 </div>
               </div>
            </div>
          ) : (
            <div className="glass-panel" style={{ padding: '3rem', borderRadius: '24px', border: '2px dashed var(--border-color)', textAlign: 'center', background: 'transparent' }}>
                <div style={{ backgroundColor: 'var(--surface-2)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem' }}>
                  <CalendarHeart size={32} color="var(--text-muted)" />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>暫無進行中的服務</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>預約您的下一個專業服務吧！</p>
            </div>
          )}

          {/* Start New Booking CTA */}
          <div className="glass-panel hover-scale" style={{ padding: '2rem', borderRadius: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center', border: '2px dashed var(--accent-soft)', background: 'var(--emerald-50)', cursor: 'pointer' }}>
             <div className="float" style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem', boxShadow: 'var(--shadow-md)' }}>
               <Sparkles size={36} color="var(--accent-color)" />
             </div>
             <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>需要其他居家協助嗎？</h3>
             <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem', maxWidth: '300px', fontWeight: 500 }}>尋找超過 500+ 位經過嚴格認證的本地服務專家。</p>
             <Link href="/services?city=London">
                <button className="btn btn-primary" style={{ padding: '0.85rem 2.5rem' }}>瀏覽服務目錄 Explore</button>
             </Link>
          </div>
        </div>

        {/* Maintenance Timeline Section */}
        <div className="reveal stagger-2">
          <MaintenanceTimeline />
        </div>

        {/* Past Bookings & History */}
        <div className="glass-panel reveal stagger-3" style={{ padding: '2.5rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>歷史預約與付款憑證 History</h2>
            <button style={{ backgroundColor: 'var(--emerald-50)', border: 'none', color: 'var(--accent-color)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>查看全部 View All</button>
          </div>
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--surface-2)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  <th style={{ padding: '1rem 0', fontWeight: 800 }}>服務與專家 Service</th>
                  <th style={{ padding: '1rem 0', fontWeight: 800 }}>日期 Date</th>
                  <th style={{ padding: '1rem 0', fontWeight: 800 }}>總金額 Total</th>
                  <th style={{ padding: '1rem 0', fontWeight: 800 }}>狀態 Status</th>
                  <th style={{ padding: '1rem 0', fontWeight: 800 }}></th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>目前無歷史預約紀錄</td>
                  </tr>
                ) : (
                  bookings.map((booking: any) => (
                    <tr key={booking.id} style={{ borderBottom: '1px solid var(--surface-2)' }} className="hover-scale">
                      <td style={{ padding: '1.5rem 0' }}>
                        <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{booking.service?.name}</div>
                        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{booking.merchant?.companyName}</div>
                      </td>
                      <td style={{ padding: '1.5rem 0', color: 'var(--text-secondary)', fontWeight: 600 }}>{new Date(booking.scheduledDate).toLocaleDateString()}</td>
                      <td style={{ padding: '1.5rem 0', fontWeight: 900, color: 'var(--text-primary)', fontSize: '1.1rem' }}>£{booking.totalAmount.toFixed(2)}</td>
                      <td style={{ padding: '1.5rem 0' }}>
                        <span style={{ 
                          backgroundColor: booking.status === 'COMPLETED' ? 'var(--emerald-50)' : 'var(--surface-2)', 
                          color: booking.status === 'COMPLETED' ? 'var(--emerald-700)' : 'var(--text-muted)', 
                          padding: '0.5rem 1rem', 
                          borderRadius: '2rem', 
                          fontSize: '0.8rem', 
                          fontWeight: 800 
                        }}>
                          {booking.status}
                        </span>
                      </td>
                      <td style={{ padding: '1.5rem 0', textAlign: 'right' }}>
                        {booking.status === 'COMPLETED' ? (
                          <ReviewButton 
                            bookingId={booking.id} 
                            merchantId={booking.merchantId} 
                            serviceName={booking.service?.name} 
                          />
                        ) : (
                          <Link href={`/dashboard/repair/${booking.id}`} style={{ color: 'var(--accent-color)', fontSize: '0.9rem', fontWeight: 800, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'flex-end' }}>
                            查看詳情 <ArrowRight size={16} />
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
        <div className="reveal stagger-4" style={{ marginTop: '1rem', padding: '3rem', borderRadius: '32px', background: 'var(--surface-2)', border: '1px solid var(--border-color)' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', fontFamily: 'var(--font-heading)' }}>
            <div style={{ backgroundColor: 'var(--accent-color)', padding: '0.75rem', borderRadius: '12px' }}>
              <Wallet size={28} color="white" />
            </div>
            帳戶設定與獎勵 Account & Rewards
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {/* Referral Info Card */}
            <div style={{ 
              background: 'linear-gradient(135deg, var(--emerald-700) 0%, var(--emerald-950) 100%)',
              padding: '2.5rem',
              borderRadius: '2rem',
              color: 'white',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: 'var(--shadow-lg)'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                  <div style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.5rem', borderRadius: '8px' }}>
                    <Star size={24} fill="white" color="white" />
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '1.25rem', fontFamily: 'var(--font-heading)' }}>推薦親友獎勵計畫</span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem' }}>
                  <div>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>您的推薦代碼</p>
                    <div style={{ 
                      fontSize: '1.75rem', 
                      fontWeight: 900, 
                      letterSpacing: '0.15em',
                      color: 'white',
                      background: 'rgba(255,255,255,0.15)',
                      padding: '0.5rem 1rem',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>{(dbUser as any)?.referralCode}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', marginBottom: '0.5rem', letterSpacing: '0.05em' }}>可用點數</p>
                    <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--emerald-100)' }}>£{(dbUser as any)?.referralCredits?.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--emerald-100)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', fontWeight: 500 }}>
                分享代碼給好友，雙方皆可享有完工金額 <span style={{ color: 'white', fontWeight: 900 }}>3% 重複回饋</span>！
              </p>
            </div>

            {/* Quick Link Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              {[
                { href: '/dashboard/garage', icon: <Car size={28} />, title: '我的車庫', desc: '維修日誌與 MOT', color: 'var(--emerald-600)' },
                { href: '/dashboard/properties', icon: <Home size={28} />, title: '我的房產', desc: '設施維修細節', color: '#10b981' },
                { href: '/dashboard/wallet', icon: <Banknote size={28} />, title: '錢包獎勵', desc: '管理點數與回饋', color: '#34d399' },
                { href: '/dashboard/settings', icon: <Plus size={28} />, title: '帳戶設定', desc: '個人資料與安全性', color: '#64748b' },
              ].map((item, idx) => (
                <Link href={item.href} key={idx} style={{ textDecoration: 'none' }}>
                  <div className="glass-panel hover-scale" style={{ 
                    padding: '1.5rem',
                    borderRadius: '20px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    background: 'white'
                  }}>
                    <div style={{ color: item.color, marginBottom: '0.75rem' }}>
                      {item.icon}
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{item.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', fontWeight: 500 }}>{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      
      {/* Verification Banner */}
      {!merchant?.isVerified && (
        <div className="reveal active" style={{ backgroundColor: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '16px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ backgroundColor: '#fef3c7', padding: '0.75rem', borderRadius: '12px', color: '#b45309' }}>
               <ShieldCheck size={24} />
            </div>
            <div>
              <h3 style={{ color: '#92400e', fontWeight: 900, marginBottom: '0.25rem', fontSize: '1.15rem' }}>
                需要您的行動：執照與身份人工審核 Verification
              </h3>
              <p style={{ color: '#b45309', fontSize: '0.95rem', fontWeight: 500 }}>為了讓客戶能搜尋並預約您的服務，您必須依照英國商用指引上傳您的專業證照供 AI 初審。</p>
            </div>
          </div>
          <Link href="/dashboard/verification" style={{ textDecoration: 'none' }}>
            <button className="btn btn-primary" style={{ backgroundColor: '#d97706', padding: '0.75rem 1.5rem' }}>前往上傳證件</button>
          </Link>
        </div>
      )}

      {/* Stripe Onboarding Banner */}
      {merchant?.isVerified && !merchant?.stripeAccountId && (
        <div className="reveal active" style={{ backgroundColor: 'var(--emerald-50)', border: '1.5px solid var(--emerald-100)', borderRadius: '16px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <div style={{ backgroundColor: 'var(--emerald-100)', padding: '0.75rem', borderRadius: '12px', color: 'var(--emerald-700)' }}>
               <Banknote size={24} />
            </div>
            <div>
              <h3 style={{ color: 'var(--emerald-800)', fontWeight: 900, marginBottom: '0.25rem', fontSize: '1.15rem' }}>
                綁定收款銀行帳戶 Stripe Connect
              </h3>
              <p style={{ color: 'var(--emerald-700)', fontSize: '0.95rem', fontWeight: 500 }}>恭喜您通過身分審查！為了能順利收取客人的信用卡訂金，請建立您的 Stripe 收款帳戶。</p>
            </div>
          </div>
          <StripeConnectButton />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 0' }} className="reveal">
        <div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3rem)', fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.04em', lineHeight: 1, fontFamily: 'var(--font-heading)' }}>
            商家績效中心 <span style={{ color: 'var(--accent-color)' }}>Analytics</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginTop: '0.5rem', fontWeight: 500 }}>管理您的業務增長、訂單與客戶回饋。</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1.25rem', backgroundColor: 'var(--surface-2)', borderRadius: '999px', border: '1.5px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 800 }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 0 4px rgba(16, 185, 129, 0.2)' }}></div>
          Real-time Sync Active
        </div>
      </div>

      {/* Advanced Analytics Suite */}
      <div className="reveal stagger-1">
        <MerchantAnalytics />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        <div className="glass-panel reveal stagger-2" style={{ padding: '2.5rem', borderRadius: '24px', background: 'var(--surface-1)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-muted)', fontSize: '0.95rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <Wallet size={20} color="var(--emerald-600)" /> 可提現餘額
          </div>
          <div style={{ fontSize: '3.5rem', fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>£{merchant?.wallet?.availableBalance?.toFixed(2) || "0.00"}</div>
          <Link href="/dashboard/merchant/wallet" style={{ fontSize: '1rem', color: 'var(--emerald-700)', fontWeight: 900, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem' }}>
            管理提現 Withdraw <ArrowRight size={18} />
          </Link>
        </div>

        <div className="glass-panel reveal stagger-3" style={{ padding: '2.5rem', borderRadius: '24px', background: 'var(--surface-1)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
           <div style={{ backgroundColor: 'var(--emerald-50)', padding: '1.5rem', borderRadius: '20px', color: 'var(--emerald-700)' }}>
             <Camera size={42} />
           </div>
           <div style={{ flex: 1 }}>
             <h3 style={{ fontSize: '1.35rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>作品集展示 Portfolio</h3>
             <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>已上傳 <span style={{ color: 'var(--text-primary)', fontWeight: 800 }}>{merchant?.portfolio?.length || 0}</span> 個案例。</p>
             <button className="btn btn-primary" style={{ padding: '0.6rem 1.25rem', borderRadius: '12px', fontSize: '0.85rem', marginTop: '1rem' }}>
               <Plus size={18} /> 新增完工案例
             </button>
           </div>
        </div>

        <div className="reveal stagger-4">
          <AISuggestionBox />
        </div>
      </div>

      {/* Recent Bookings Table */}
      <div className="glass-panel reveal" style={{ padding: '3rem', borderRadius: '32px', marginTop: '2rem', background: 'var(--surface-1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
           <h2 style={{ fontSize: '1.8rem', fontWeight: 950, color: 'var(--text-primary)', letterSpacing: '-0.02em', fontFamily: 'var(--font-heading)' }}>最新預約請求 Recent Requests</h2>
           <Link href="/dashboard/bookings" className="btn" style={{ padding: '0.6rem 1.5rem', backgroundColor: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: '0.9rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>查看全部 View All</Link>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--surface-2)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem 0', fontWeight: 800 }}>客戶 Customer</th>
                <th style={{ padding: '1rem 0', fontWeight: 800 }}>服務 Service</th>
                <th style={{ padding: '1rem 0', fontWeight: 800 }}>日期 Date</th>
                <th style={{ padding: '1rem 0', fontWeight: 800 }}>金額 Amount</th>
                <th style={{ padding: '1rem 0', fontWeight: 800 }}>狀態 Status</th>
                <th style={{ padding: '1rem 0', fontWeight: 800 }}></th>
              </tr>
            </thead>
            <tbody>
              {merchantBookings.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '5rem', textAlign: 'center', color: 'var(--text-muted)', fontWeight: 600 }}>目前尚無預約請求</td>
                </tr>
              ) : (
                merchantBookings.map((booking: any) => (
                  <tr key={booking.id} style={{ borderBottom: '1px solid var(--surface-2)' }} className="hover-scale">
                    <td style={{ padding: '1.5rem 0' }}>
                      <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '1.1rem' }}>{booking.customer?.name}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>{booking.customer?.city || "London"}</div>
                    </td>
                    <td style={{ padding: '1.5rem 0', color: 'var(--text-secondary)', fontWeight: 600 }}>{booking.service?.name}</td>
                    <td style={{ padding: '1.5rem 0', color: 'var(--text-secondary)', fontWeight: 500 }}>{new Date(booking.scheduledDate).toLocaleString()}</td>
                    <td style={{ padding: '1.5rem 0', fontWeight: 900, color: 'var(--text-primary)', fontSize: '1.15rem' }}>£{booking.totalAmount.toFixed(2)}</td>
                    <td style={{ padding: '1.5rem 0' }}>
                      <span style={{ 
                        backgroundColor: booking.status === 'PENDING' ? '#fffbeb' : 'var(--emerald-50)', 
                        color: booking.status === 'PENDING' ? '#b45309' : 'var(--emerald-700)', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '2rem', 
                        fontSize: '0.8rem', 
                        fontWeight: 800 
                      }}>
                        {booking.status}
                      </span>
                    </td>
                    <td style={{ padding: '1.5rem 0', textAlign: 'right' }}>
                       <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                         {booking.status === 'PENDING' && (
                           <div style={{ display: 'flex', gap: '0.5rem' }}>
                             <BookingStatusActions bookingId={booking.id} currentStatus={booking.status} />
                             <VariationMerchantButton bookingId={booking.id} />
                           </div>
                         )}
                         <Link href={`/dashboard/merchant/bookings/${booking.id}`} style={{ textDecoration: 'none' }}>
                            <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', backgroundColor: 'var(--surface-2)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>查看細節</button>
                         </Link>
                       </div>
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
