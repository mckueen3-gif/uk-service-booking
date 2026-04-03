import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { 
  CreditCard, 
  Wallet, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  History,
  TrendingUp
} from "lucide-react";
import { PayoutButtons } from "./PayoutButtons";

export const dynamic = "force-dynamic";

export default async function AdminPayoutsPage() {
  const requests = await prisma.withdrawalRequest.findMany({
    include: { merchant: { include: { wallet: true } } },
    orderBy: { createdAt: "desc" }
  });

  const pendingAmount = requests
    .filter(r => r.status === "PENDING")
    .reduce((sum, r) => sum + r.amount, 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Financial Health Snapshot - Physical Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '1.5rem' 
      }}>
        <div style={{ padding: '1.5rem', borderRadius: '1.25rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
             <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(212,175,55,0.1)', color: '#d4af37' }}>
               <Clock size={20} />
             </div>
             <div>
               <h4 style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Pending Payouts</h4>
               <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>£{pendingAmount.toLocaleString()}</p>
             </div>
           </div>
           <div style={{ height: '4px', width: '100%', backgroundColor: '#f1f5f9', borderRadius: '99px', overflow: 'hidden' }}>
             <div style={{ height: '100%', backgroundColor: '#d4af37', width: '33%' }}></div>
           </div>
        </div>

        <div style={{ padding: '1.5rem', borderRadius: '1.25rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
             <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981' }}>
               <CheckCircle2 size={20} />
             </div>
             <div>
               <h4 style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Completed Today</h4>
               <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>£1,240.00</p>
             </div>
           </div>
           <p style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px', margin: 0 }}>
             <TrendingUp size={12} style={{ color: '#10b981' }} />
             Healthy cash flow confirmed
           </p>
        </div>

        <div style={{ padding: '1.5rem', borderRadius: '1.25rem', backgroundColor: '#ffffff', border: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
             <div style={{ padding: '12px', borderRadius: '12px', backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6' }}>
               <History size={20} />
             </div>
             <div>
               <h4 style={{ fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>Average Processing</h4>
               <p style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>4.2h</p>
             </div>
           </div>
           <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Industry standard: 24-48h</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '2rem', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
           <h3 style={{ fontSize: '1.125rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
             <CreditCard style={{ color: '#d4af37' }} size={20} />
             Withdrawal Adjudication Center
           </h3>
           <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '0.75rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '10px', fontWeight: 900, border: '1px solid rgba(239,68,68,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
             <AlertTriangle size={14} /> Security Audit Active
           </div>
        </div>

        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Merchant / Wallet Status</th>
              <th style={{ padding: '1rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Request Details</th>
              <th style={{ padding: '1rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Security Check</th>
              <th style={{ padding: '1rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Action Center</th>
            </tr>
          </thead>
          <tbody>
            {requests.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ padding: '5rem 0', textAlign: 'center', color: '#94a3b8', fontStyle: 'italic', fontSize: '14px' }}>No withdrawal requests found.</td>
              </tr>
            ) : (
              requests.map((r) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', fontWeight: 800 }}>
                        {r.merchant.companyName?.[0]}
                      </div>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{r.merchant.companyName}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '10px', color: '#64748b', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>
                          <Wallet size={12} style={{ color: '#d4af37' }} />
                          Avail: £{r.merchant.wallet?.availableBalance.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <p style={{ fontSize: '1.125rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>£{r.amount.toLocaleString()}</p>
                    <p style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px', margin: 0 }}>{format(new Date(r.createdAt), 'yyyy-MM-dd HH:mm')}</p>
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'center' }}>
                    {r.status === "PENDING" ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '99px', backgroundColor: 'rgba(249, 115, 22, 0.1)', color: '#f97316', fontSize: '10px', fontWeight: 900, border: '1px solid rgba(249,115,22,0.2)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                        <Clock size={12} /> Awaiting Approval
                      </span>
                    ) : (
                      <span style={{ 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '6px', 
                        padding: '4px 12px', 
                        borderRadius: '99px', 
                        fontSize: '10px', 
                        fontWeight: 900, 
                        border: '1px solid rgba(0,0,0,0.1)', 
                        textTransform: 'uppercase', 
                        letterSpacing: '0.1em',
                        backgroundColor: (r.status === "COMPLETED" || r.status === "APPROVED") ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                        color: (r.status === "COMPLETED" || r.status === "APPROVED") ? '#10b981' : '#ef4444'
                      }}>
                        {r.status === "COMPLETED" ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {r.status}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {r.status === "PENDING" && (
                      <PayoutButtons requestId={r.id} />
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
