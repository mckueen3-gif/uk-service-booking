import { prisma } from "@/lib/prisma";
import { 
  Users, 
  MapPin, 
  Star, 
  ShieldCheck, 
  ShieldAlert,
  Search,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminMerchantsPage() {
  const merchants = await prisma.merchant.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        backgroundColor: '#ffffff', 
        padding: '1.5rem', 
        borderRadius: '1.25rem', 
        border: '1px solid #e2e8f0', 
        marginBottom: '1rem',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
            <Users style={{ color: '#d4af37' }} />
            Expert Management Directory
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '4px', margin: 0 }}>Full list of registered service providers across the UK.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
          <input 
            type="text" 
            placeholder="Filter experts..." 
            style={{ 
              paddingLeft: '40px', 
              paddingRight: '16px', 
              paddingTop: '8px', 
              paddingBottom: '8px', 
              backgroundColor: '#f8fafc', 
              border: '1px solid #e2e8f0', 
              borderRadius: '0.75rem', 
              fontSize: '14px', 
              color: '#0f172a',
              outline: 'none',
              width: '260px'
            }}
          />
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1.25rem', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Expert / Company</th>
              <th style={{ padding: '1rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Location</th>
              <th style={{ padding: '1rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Status</th>
              <th style={{ padding: '1rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center' }}>Rating</th>
              <th style={{ padding: '1rem', fontSize: '10px', fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {merchants.map((m) => (
              <tr key={m.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d4af37', fontWeight: 800 }}>
                      {m.companyName?.[0]}
                    </div>
                    <div>
                      <p style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{m.companyName}</p>
                      <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0 }}>{m.user.email}</p>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#64748b' }}>
                     <MapPin size={12} style={{ color: '#d4af37' }} />
                     {m.city}
                   </div>
                </td>
                <td style={{ padding: '1rem', textAlign: 'center' }}>
                  {m.isVerified ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '99px', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: '#10b981', fontSize: '10px', fontWeight: 800, border: '1px solid rgba(16,185,129,0.2)', textTransform: 'uppercase' }}>
                      <ShieldCheck size={12} /> Verified
                    </span>
                  ) : (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '99px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', fontSize: '10px', fontWeight: 800, border: '1px solid rgba(239, 68, 68, 0.2)', textTransform: 'uppercase' }}>
                      <ShieldAlert size={12} /> Pending
                    </span>
                  )}
                </td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', color: '#d4af37' }}>
                    <Star size={14} fill="#d4af37" />
                    <span style={{ fontSize: '0.875rem', fontWeight: 800, color: '#0f172a' }}>{m.averageRating.toFixed(1)}</span>
                  </div>
                </td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '8px' }}>
                     <Link 
                       href={`/merchants/${m.id}`} 
                       target="_blank"
                       style={{ padding: '8px', color: '#94a3b8', transition: 'color 0.2s' }}
                     >
                       <ExternalLink size={18} />
                     </Link>
                     <button style={{ padding: '8px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', color: '#d4af37', cursor: 'pointer' }}>
                       <ChevronRight size={18} />
                     </button>
                   </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
