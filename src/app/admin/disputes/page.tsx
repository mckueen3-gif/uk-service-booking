import { prisma } from "@/lib/prisma";
import { 
  Gavel, 
  ShieldAlert, 
  MessageSquare, 
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight
} from "lucide-react";
import { DisputeActions } from "./dispute-actions";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function AdminDisputesPage() {
  const disputes = await prisma.dispute.findMany({
    where: { status: "OPEN" },
    include: {
      booking: {
        include: {
          customer: { select: { name: true } },
          merchant: { select: { companyName: true } }
        }
      },
      evidence: true
    },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#ffffff', 
        padding: '1.5rem', 
        borderRadius: '1.5rem', 
        border: '1px solid #e2e8f0', 
        marginBottom: '1rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.04)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
            <Gavel style={{ color: '#d4af37' }} />
            Arbitration Tribunal
          </h2>
          <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '0.2em', fontWeight: 800, margin: 0, fontFamily: 'monospace' }}>Dispute Resolution Command Center</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div style={{ textAlign: 'right' }}>
             <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Active Cases</p>
             <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#d4af37', margin: 0 }}>{disputes.length}</p>
           </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {disputes.length === 0 ? (
          <div style={{ 
            padding: '8rem 0', 
            textAlign: 'center', 
            borderRadius: '2.5rem', 
            border: '1px solid #e2e8f0', 
            backgroundColor: '#ffffff',
            boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.02)'
          }}>
             <CheckCircle2 size={64} style={{ margin: '0 auto', color: '#d4af37', marginBottom: '1.5rem', opacity: 0.2 }} />
             <p style={{ color: '#0f172a', fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>No active disputes requiring human intervention.</p>
             <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem', fontStyle: 'italic', margin: 0 }}>Neural networks are handling low-risk cases automatically.</p>
          </div>
        ) : (
          disputes.map((dispute) => (
            <DisputeCard key={dispute.id} dispute={dispute} />
          ))
        )}
      </div>
    </div>
  );
}

function DisputeCard({ dispute }: any) {
  return (
    <div style={{ 
      backgroundColor: '#ffffff', 
      border: '1px solid #e2e8f0', 
      borderRadius: '2rem', 
      padding: '2rem', 
      boxShadow: '0 20px 50px rgba(0,0,0,0.04)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', top: 0, right: 0, padding: '3rem', opacity: 0.03, color: '#0f172a' }}>
        <Gavel size={120} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'row', gap: '3rem', position: 'relative', zIndex: 10 }}>
        {/* Left Side: Context & AI Reasoning */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
             <span style={{ padding: '4px 12px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '10px', fontWeight: 900, border: '1px solid rgba(239,68,68,0.2)', borderRadius: '99px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Case #DIS-{dispute.id.slice(-6).toUpperCase()}</span>
             <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 700 }}>{format(new Date(dispute.createdAt), 'MMM dd, HH:mm')}</span>
          </div>

          <div>
             <h3 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.2, margin: 0 }}>
                {dispute.booking.customer.name} <span style={{ color: '#d4af37', margin: '0 8px' }}>vs</span> {dispute.booking.merchant.companyName}
             </h3>
             <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '8px', fontStyle: 'italic', margin: 0 }}>Reason for dispute: {dispute.reason}</p>
          </div>

          <div style={{ padding: '1.5rem', borderRadius: '1.5rem', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1rem' }}>
                <div style={{ padding: '6px', borderRadius: '6px', backgroundColor: '#d4af37', color: '#ffffff' }}>
                   <AlertTriangle size={14} />
                </div>
                <h4 style={{ fontSize: '10px', fontWeight: 900, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.15em', margin: 0 }}>AI Arbiter Premise</h4>
             </div>
             <p style={{ fontSize: '0.875rem', color: '#334155', lineHeight: 1.6, fontStyle: 'italic', margin: 0 }}>
               "{dispute.aiReasoning || "Awaiting secondary neural analysis for this case context."}"
             </p>
             <div style={{ marginTop: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ flex: 1, height: '4px', backgroundColor: '#e2e8f0', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', backgroundColor: '#d4af37', width: '75%' }}></div>
                </div>
                <span style={{ fontSize: '10px', fontWeight: 900, color: '#64748b', textTransform: 'uppercase' }}>AI Confidence: 75%</span>
             </div>
          </div>
        </div>

        {/* Middle: Evidence Gallery */}
        <div style={{ width: '320px' }}>
          <h4 style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}>
            <ImageIcon size={14} style={{ color: '#d4af37' }} />
            Evidence Gallery
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
             {dispute.evidence.length === 0 ? (
               <div style={{ gridColumn: 'span 2', padding: '2.5rem 0', border: '1px dashed #e2e8f0', borderRadius: '1rem', textAlign: 'center', color: '#94a3b8', fontSize: '12px' }}>
                  No visual proof provided.
               </div>
             ) : (
               dispute.evidence.map((ev: any, idx: number) => (
                 <div key={idx} style={{ aspectRatio: '1/1', borderRadius: '1rem', backgroundColor: '#f1f5f9', overflow: 'hidden', border: '1px solid #e2e8f0', cursor: 'zoom-in', position: 'relative' }}>
                    <img src={ev.fileUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)', padding: '4px', textAlign: 'center' }}>
                       <span style={{ fontSize: '8px', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>{ev.type}</span>
                    </div>
                 </div>
               ))
             )}
          </div>
        </div>

        {/* Right Side: Decisions */}
        <div style={{ width: '260px', borderLeft: '1px solid #e2e8f0', paddingLeft: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
           <h4 style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1.5rem', margin: 0 }}>Human Verdict Required</h4>
           <DisputeActions disputeId={dispute.id} />
        </div>
      </div>
    </div>
  );
}
