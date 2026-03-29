import { Calendar, Clock, MapPin, Wrench, ChevronRight, MessageCircle } from "lucide-react";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VariationPanel from "@/components/booking/VariationPanel";
import ReviewButton from "@/components/booking/ReviewButton";

export default async function BookingsPage() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) redirect("/auth/login");

  const bookings = await prisma.booking.findMany({
    where: { customerId: (session.user as any).id },
    include: {
      service: true,
      variations: true,
      dispute: true,
      review: true,
      merchant: {
        include: {
          user: true
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  }) as any[];

  return (
    <div className="animate-fade-up">
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>我的預約 (Bookings)</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>檢視您的完整預約歷史與即時服務狀態</p>
      
      {bookings.length === 0 ? (
        <div className="glass-panel" style={{ padding: '4rem 2rem', borderRadius: '16px', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', border: '2px dashed var(--border-color)' }}>
           <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
             <Calendar size={32} color="var(--text-secondary)" />
           </div>
           <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>尚未有任何預約</h2>
           <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>您還沒有預約過任何服務。現在就去瀏覽我們的專業服務目錄吧！</p>
           <Link href="/services" style={{ display: 'inline-block', marginTop: '1.5rem' }}>
              <button className="btn btn-primary">瀏覽服務</button>
           </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '1.5rem' }}>
          {bookings.map((booking) => (
            <div key={booking.id} className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px', backgroundColor: 'var(--bg-secondary)' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: '200px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                       <span style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent-color)', padding: '0.25rem 0.6rem', borderRadius: '0.5rem', fontSize: '0.75rem', fontWeight: 700 }}>
                          {booking.status}
                       </span>
                       <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                          ID: #{booking.id.substring(0, 8)}
                       </span>
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{booking.service?.name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{booking.merchant?.user?.name}</p>
                    
                    <div style={{ marginTop: '1rem', display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                          <Clock size={16} color="var(--text-secondary)" /> {new Date(booking.createdAt).toLocaleDateString()}
                       </div>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                          <MapPin size={16} color="var(--text-secondary)" /> {booking.postcode || "Location"}
                       </div>
                    </div>

                    {/* AI Dispute & Variations Panel */}
                    <VariationPanel 
                      bookingId={booking.id} 
                      initialVariations={booking.variations || []} 
                      dispute={booking.dispute}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', minWidth: '180px' }}>
                     {booking.vehicleReg && (
                        <Link href={`/dashboard/repair/${booking.id}`} style={{ textDecoration: 'none' }}>
                           <button className="btn btn-primary" style={{ width: '100%', padding: '0.6rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                              <Wrench size={16} /> 追蹤維修進度
                           </button>
                        </Link>
                     )}
                     
                     {/* 🚀 NEW: Review Feature (For Completed Jobs) */}
                     {booking.status === 'COMPLETED' && (
                        <ReviewButton bookingId={booking.id} hasReview={!!booking.review} />
                     )}

                     <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button className="btn btn-secondary" style={{ flex: 1, padding: '0.6rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                           <MessageCircle size={16} /> 聯絡
                        </button>
                        <button className="btn btn-secondary" style={{ flex: 1, padding: '0.6rem', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                           詳情 <ChevronRight size={16} />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
