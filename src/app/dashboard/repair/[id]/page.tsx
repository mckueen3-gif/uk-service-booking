import { 
  ArrowLeft, Car, Clock, CheckCircle2, AlertCircle, 
  MapPin, Settings, Wrench, Camera, ShieldCheck, Star
} from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { calculateCarRepairPayout } from '@/lib/commission';
import VerifiedBadge from '@/app/components/VerifiedBadge';

export default async function RepairTracker({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: true,
      merchant: {
        include: {
          user: true
        }
      }
    }
  }) as any;

  if (!booking || !booking.vehicleReg) {
    notFound();
  }

  // Fetch variations separately to bypass missing relation in Prisma client
  let variations = [];
  try {
    variations = await (prisma as any).variation.findMany({
      where: { bookingId: id }
    });
  } catch (e) {
    console.error("Variations model not ready in Prisma Client:", e);
  }
  
  booking.variations = variations;

  const payout = calculateCarRepairPayout(
    booking.totalAmount - booking.variations.reduce((acc: number, v: any) => acc + v.amount, 0),
    booking.variations,
    booking.merchant
  );

  const stages = [
    { key: 'PENDING', label: '預約已確認', desc: '等待師傅檢查', icon: Clock },
    { key: 'IN_PROGRESS', label: '維修檢查中', desc: '師傅正處理您的車輛', icon: Wrench },
    { key: 'FIXED', label: '維修已完成', desc: '車輛已就緒，等待取車', icon: CheckCircle2 },
    { key: 'COMPLETED', label: '服務結清', desc: '感謝使用我們的服務', icon: ShieldCheck },
  ];

  const currentStageIndex = stages.findIndex(s => s.key === booking.status);

  return (
    <div className="container" style={{ paddingTop: '6rem', paddingBottom: '10rem' }}>
      <div style={{ marginBottom: '2rem' }}>
         <Link href="/dashboard" className="btn btn-secondary" style={{ display: 'inline-flex', padding: '0.6rem 1.2rem' }}>
            <ArrowLeft size={18} /> Back to Dashboard
         </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '3rem', alignItems: 'start' }}>
        
        {/* Left Column: Progress & Info */}
        <section style={{ display: 'grid', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2.5rem', borderLeft: '6px solid var(--accent-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '2.5rem' }}>
                 <div style={{ width: '60px', height: '60px', borderRadius: '1rem', backgroundColor: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Car size={32} />
                 </div>
                 <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.25rem' }}>Repair Status</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>{booking.vehicleMake} {booking.vehicleModel} ({booking.vehicleReg})</p>
                 </div>
              </div>

              <div style={{ display: 'grid', gap: '2rem', position: 'relative', marginLeft: '1rem', paddingLeft: '2rem', borderLeft: '2px dashed var(--border-color)' }}>
                 {stages.map((stage, idx) => {
                    const isCompleted = idx <= currentStageIndex;
                    const isActive = idx === currentStageIndex;
                    
                    return (
                       <div key={stage.key} style={{ position: 'relative' }}>
                          {/* Indicator Dot */}
                          <div style={{ 
                             position: 'absolute', 
                             left: '-3rem', 
                             top: '0', 
                             width: '24px', 
                             height: '24px', 
                             borderRadius: '50%', 
                             backgroundColor: isCompleted ? 'var(--accent-color)' : 'var(--bg-secondary)', 
                             border: `4px solid ${isCompleted ? 'rgba(37,99,235,0.2)' : 'var(--border-color)'}`,
                             display: 'flex',
                             alignItems: 'center',
                             justifyContent: 'center'
                          }}>
                             {isCompleted && <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'white' }} />}
                          </div>

                          <div style={{ opacity: isCompleted ? 1 : 0.4 }}>
                             <div style={{ fontWeight: 800, fontSize: '1.25rem', color: isCompleted ? 'var(--text-primary)' : 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {stage.label}
                                {isActive && <span className="animate-pulse" style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} />}
                             </div>
                             <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{stage.desc}</p>
                          </div>
                       </div>
                    );
                 })}
              </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
             <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={20} color="var(--accent-color)" /> Workshop Location
             </h2>
             <div style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                   {booking.merchant.user.name}
                   {booking.merchant.isVerified && <VerifiedBadge size={16} />}
                </div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{booking.postcode}</div>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                   <button className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem' }}>Get Directions</button>
                   <button className="btn btn-secondary" style={{ flex: 1, padding: '0.5rem' }}>Call Workshop</button>
                </div>
             </div>
          </div>
        </section>

        {/* Right Column: Financials & Evidence */}
        <section style={{ display: 'grid', gap: '2rem' }}>
           
           <div className="glass-panel gradient-border" style={{ padding: '2.5rem', border: '2px solid var(--accent-color)' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Billing Summary</h2>
              
              <div style={{ display: 'grid', gap: '1.25rem' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Initial Diagnostic Fee (Paid Online)</span>
                    <span style={{ fontWeight: 600 }}>£{booking.diagnosticFee || 20.00}</span>
                 </div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
                    <span>Additional Labor & Parts</span>
                    <span style={{ fontWeight: 600 }}>£{(payout.totalCustomerPrice - (booking.diagnosticFee || 20)).toFixed(2)}</span>
                 </div>
                 
                 <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                    <div>
                       <div style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--accent-color)' }}>£{payout.totalCustomerPrice.toFixed(2)}</div>
                       <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Total Estimated Cost</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                       <div style={{ fontWeight: 900, fontSize: '1.5rem', color: '#10b981' }}>£{(payout.totalCustomerPrice - (booking.diagnosticFee || 20)).toFixed(2)}</div>
                       <div style={{ fontSize: '0.85rem', color: '#10b981' }}>Pay at Workshop</div>
                    </div>
                 </div>

                 <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: booking.status === 'COMPLETED' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(37, 99, 235, 0.05)', borderRadius: '0.75rem', fontSize: '0.85rem', borderLeft: `4px solid ${booking.status === 'COMPLETED' ? '#10b981' : 'var(--accent-color)'}` }}>
                    <AlertCircle size={16} style={{ marginBottom: '0.5rem' }} />
                    {booking.status === 'COMPLETED' ? (
                       <div style={{ color: 'var(--text-primary)' }}>
                          <p style={{ fontWeight: 800, color: '#10b981', marginBottom: '0.25rem' }}>維修已圓滿結束！</p>
                          <p style={{ color: 'var(--text-secondary)' }}>您已完成到店支付。如果您對這次服務滿意，請花一分鐘為師傅留下好評。</p>
                          <Link href={`/dashboard/repair/${booking.id}/review`} style={{ display: 'inline-block', marginTop: '1rem' }}>
                             <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                                <CheckCircle2 size={14} style={{ marginRight: '0.4rem' }} /> 立即評價
                             </button>
                          </Link>
                       </div>
                    ) : (
                       <p style={{ color: 'var(--text-secondary)' }}>
                          維修完成後，請直接向師傅支付 **Pay at Workshop** 的金額。師傅會提供正式發票。
                       </p>
                    )}
                 </div>
              </div>
           </div>

           <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '1.5rem' }}>Repair Items & Evidence</h2>
              
              <div style={{ display: 'grid', gap: '1rem' }}>
                 {booking.variations.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                       <Camera size={32} style={{ margin: '0 auto 1rem', opacity: 0.3 }} />
                       <p>Waiting for mechanic to update inspection details.</p>
                    </div>
                 ) : (
                    booking.variations.map((v: any) => (
                       <div key={v.id} style={{ display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.03)', borderRadius: '1rem', border: '1px solid var(--border-color)' }}>
                          {v.photoUrl && (
                             <img src={v.photoUrl} alt="Evidence" style={{ width: '80px', height: '80px', borderRadius: '0.5rem', objectFit: 'cover' }} />
                          )}
                          <div style={{ flex: 1 }}>
                             <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                {v.description.startsWith('[PART]') ? <Settings size={14} color="var(--accent-color)" /> : <Wrench size={14} />}
                                {v.description}
                             </div>
                             <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '0.2rem' }}>£{v.amount.toFixed(2)}</div>
                             {v.status === 'PENDING' && (
                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                                   <button className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Accept</button>
                                   <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Enquire</button>
                                </div>
                             )}
                          </div>
                          {v.status === 'ACCEPTED' && (
                             <CheckCircle2 color="#10b981" size={20} />
                          )}
                       </div>
                    ))
                 )}
              </div>
           </div>

        </section>

      </div>
    </div>
  );
}
