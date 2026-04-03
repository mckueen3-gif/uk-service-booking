import { prisma } from "@/lib/prisma";
import { 
  Users, 
  Search, 
  UserPlus, 
  CreditCard, 
  Calendar,
  MoreVertical
} from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      // referralCode: true,    // Temporarily disabled for schema sync
      // referralCredits: true, // Temporarily disabled for schema sync
      createdAt: true
    }
  });

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'ADMIN': return { bg: 'rgba(99, 102, 241, 0.1)', text: '#6366f1', label: '管理員' };
      case 'MERCHANT': return { bg: 'rgba(212, 175, 55, 0.1)', text: '#d4af37', label: '商戶/專家' };
      default: return { bg: 'rgba(100, 116, 139, 0.1)', text: '#64748b', label: '一般客戶' };
    }
  };

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
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.75rem', margin: 0 }}>
            <Users style={{ color: '#d4af37' }} />
            User Management Hub
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '4px', margin: 0 }}>Platform registration database and credit monitoring.</p>
        </div>
        <div style={{ position: 'relative' }}>
          <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} size={18} />
          <input 
            type="text" 
            placeholder="Search name or email..." 
            style={{ 
              paddingLeft: '40px', 
              paddingRight: '16px', 
              paddingTop: '10px', 
              paddingBottom: '10px', 
              backgroundColor: '#f8fafc', 
              border: '1px solid #e2e8f0', 
              borderRadius: '0.75rem', 
              fontSize: '14px', 
              color: '#0f172a',
              outline: 'none',
              width: '300px'
            }}
          />
        </div>
      </div>

      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 10px 40px rgba(0,0,0,0.03)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Identity information</th>
              <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Role Status</th>
              <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Referral Code</th>
              <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Credits</th>
              <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Registration</th>
              <th style={{ padding: '1rem 1.5rem', color: '#94a3b8', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {(users as any[]).map((user) => {
              const badge = getRoleBadge(user.role);
              return (
                <tr key={user.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.2s' }}>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <div style={{ color: '#0f172a', fontWeight: 800, fontSize: '0.95rem' }}>{user.name || "UNNAMED USER"}</div>
                    <div style={{ color: '#64748b', fontSize: '0.8rem', fontWeight: 600 }}>{user.email}</div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <span style={{ 
                      padding: '4px 10px', 
                      borderRadius: '99px', 
                      fontSize: '10px', 
                      fontWeight: 900,
                      backgroundColor: badge.bg,
                      color: badge.text,
                      border: `1px solid ${badge.text}20`,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {badge.label}
                    </span>
                  </td>
                  <td style={{ padding: '1rem 1.5rem' }}>
                    <code style={{ background: '#f8fafc', padding: '4px 8px', borderRadius: '6px', fontSize: '12px', color: '#64748b', border: '1px solid #e2e8f0', fontWeight: 700 }}>
                      {user.referralCode || "N/A"}
                    </code>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#0f172a', fontWeight: 900, fontSize: '1rem' }}>
                    £{(user.referralCredits || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: '1rem 1.5rem', color: '#64748b', fontSize: '12px', fontWeight: 600 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} style={{ color: '#d4af37' }} /> {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                    <button style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                      <MoreVertical size={18} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
