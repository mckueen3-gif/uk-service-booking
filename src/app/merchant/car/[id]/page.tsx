import { 
  Car, Clock, User, Phone, MapPin, AlertCircle, 
  CheckCircle2, Camera, Plus, ArrowLeft, Wrench, Settings 
} from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import StatusButtons from '@/app/components/merchant/StatusButtons';
import VariationForm from '@/app/components/merchant/VariationForm';
import { calculateCarRepairPayout } from '@/lib/commission';

export default async function CarJobDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      service: true,
      customer: true,
      variations: true,
      merchant: true
    }
  }) as any;

  if (!booking || !booking.vehicleReg) {
    notFound();
  }

  const payout = calculateCarRepairPayout(
    booking.totalAmount - booking.variations.reduce((acc: number, v: any) => acc + v.amount, 0),
    booking.variations,
    booking.merchant
  );

  return (
    <div className="container" style={{ paddingTop: '6rem', paddingBottom: '10rem' }}>
      <div style={{ marginBottom: '2rem' }}>
         <Link href="/merchant/car" className="btn btn-secondary" style={{ display: 'inline-flex', padding: '0.6rem 1.2rem' }}>
            <ArrowLeft size={18} /> Back to Dashboard
         </Link>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2.5rem', alignItems: 'start' }}>
        
        {/* Left Column: Job & Vehicle Info */}
        <section style={{ display: 'grid', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Vehicle Details</h2>
                <div style={{ backgroundColor: 'var(--accent-color)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 800, fontSize: '1.2rem', letterSpacing: '0.05em' }}>
                   {booking.vehicleReg}
                </div>
             </div>

             <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                   <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Make / Model</span>
                   <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{booking.vehicleMake} {booking.vehicleModel}</div>
                </div>
                <div>
                   <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Year / Engine</span>
                   <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{booking.vehicleYear}</div>
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                   <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Customer Notes / Issues</span>
                   <div style={{ fontSize: '1rem', marginTop: '0.5rem', padding: '1rem', backgroundColor: 'var(--bg-secondary)', borderRadius: '0.75rem', border: '1px solid var(--border-color)' }}>
                      {booking.vehicleNotes || "No specific issues described."}
                   </div>
                </div>
             </div>
          </div>

          <div className="glass-panel" style={{ padding: '2rem' }}>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Customer Contact</h2>
             <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                   <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                      {booking.customer.name?.[0]}
                   </div>
                   <div>
                      <div style={{ fontWeight: 700 }}>{booking.customer.name}</div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{booking.customer.email}</div>
                   </div>
                </div>
             </div>
          </div>

          <div className="glass-panel gradient-border" style={{ padding: '2rem', border: '2px solid var(--accent-color)' }}>
             <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', color: 'var(--accent-color)' }}>Collection Guide</h2>
             <div style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                   <span style={{ color: 'var(--text-secondary)' }}>Labor to Collect</span>
                   <span style={{ fontWeight: 600 }}>£{payout.laborTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                   <span style={{ color: 'var(--text-secondary)' }}>Parts to Collect (0% Fee)</span>
                   <span style={{ color: 'var(--accent-color)', fontWeight: 700 }}>+ £{payout.partsTotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                   <span style={{ fontWeight: 800, fontSize: '1.2rem' }}>Total to Collect at Shop</span>
                   <span style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--accent-color)' }}>£{payout.totalCustomerPrice.toFixed(2)}</span>
                </div>
                
                <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.05)', borderRadius: '0.75rem', borderLeft: '4px solid #ef4444' }}>
                   <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>Platform Commission (to be billed)</div>
                   <div style={{ fontWeight: 700, color: '#ef4444' }}>- £{payout.platformFee.toFixed(2)}</div>
                </div>
             </div>
          </div>
        </section>

        {/* Right Column: Status & Variations */}
        <section style={{ display: 'grid', gap: '2rem' }}>
           <div className="glass-panel" style={{ padding: '2rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem' }}>Update Status</h2>
              <StatusButtons bookingId={booking.id} currentStatus={booking.status} />
           </div>

           <div className="glass-panel" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                 <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Additional Costs (Variations)</h2>
                 <VariationForm bookingId={booking.id} />
              </div>

              {booking.variations.length === 0 ? (
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '2rem' }}>No extra items added to this job yet.</p>
              ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {booking.variations.map((v: any) => (
                    <div key={v.id} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                       <div>
                          <div style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                             {v.description.startsWith('[PART]') ? <Settings size={14} style={{ color: 'var(--accent-color)' }} /> : <Wrench size={14} />}
                             {v.description}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{new Date(v.createdAt).toLocaleDateString()}</div>
                       </div>
                       <div style={{ fontWeight: 900, fontSize: '1.1rem' }}>+ £{v.amount}</div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ marginTop: '2rem', padding: '1.5rem', backgroundColor: 'rgba(37, 99, 235, 0.05)', borderRadius: '1rem', border: '1px dashed var(--accent-color)' }}>
                 <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <AlertCircle size={18} /> Collection Policy
                 </h3>
                 <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    As you are a fixed-location merchant, you are responsible for collecting the <strong>Total to Collect at Shop</strong> directly from the customer. The platform commission is tracked and will be handled separately.
                 </p>
              </div>
           </div>
        </section>

      </div>
    </div>
  );
}
