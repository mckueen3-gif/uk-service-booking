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
      referralCode: true,
      referralCredits: true,
      createdAt: true
    }
  });

  const getRoleBadge = (role: string) => {
    switch(role) {
      case 'ADMIN': return { bg: '#6366f120', text: '#818cf8', label: '管理員' };
      case 'MERCHANT': return { bg: '#f59e0b20', text: '#fbbf24', label: '商戶' };
      default: return { bg: '#10b98120', text: '#34d399', label: '一般客戶' };
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '0.5rem' }}>用戶管理 (User Management)</h1>
          <p style={{ color: '#94a3b8' }}>平台註冊用戶及抵用金點數管理。</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
           <div style={{ position: 'relative' }}>
            <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} size={18} />
            <input 
              type="text" 
              placeholder="搜尋用戶名稱或 Email..." 
              style={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', padding: '0.75rem 1rem 0.75rem 2.8rem', borderRadius: '0.75rem', color: 'white', outline: 'none', width: '300px' }}
            />
          </div>
        </div>
      </div>

      <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.05)', borderRadius: '1.5rem', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem' }}>基本資訊</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem' }}>角色</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem' }}>推薦碼</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem' }}>抵用金</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem' }}>註冊日期</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 600, fontSize: '0.875rem' }}>操作</th>
            </tr>
          </thead>
          <tbody>
            {(users as any[]).map((user) => {
              const badge = getRoleBadge(user.role);
              return (
                <tr key={user.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }} className="hover:bg-white/5 transition-colors">
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>{user.name || "未設置名稱"}</div>
                    <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>{user.email}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.4rem 0.75rem', 
                      borderRadius: '0.75rem', 
                      fontSize: '0.75rem', 
                      fontWeight: 700,
                      backgroundColor: badge.bg,
                      color: badge.text,
                      border: `1px solid ${badge.text}40`
                    }}>
                      {badge.label}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <code style={{ background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '0.5rem', fontSize: '0.85rem', color: '#cbd5e1' }}>
                      {user.referralCode || "N/A"}
                    </code>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', color: '#f8fafc', fontWeight: 800 }}>
                    £{(user.referralCredits || 0).toFixed(2)}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontSize: '0.875rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} /> {new Date(user.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
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
