import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="animate-fade-up">
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>帳號設定 (Settings)</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', marginBottom: '2rem' }}>管理您的通知偏好、密碼安全性與系統設定</p>
      
      <div className="glass-panel" style={{ padding: '4rem 2rem', borderRadius: '16px', textAlign: 'center', backgroundColor: 'var(--bg-secondary)', border: '2px dashed var(--border-color)' }}>
         <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
           <Settings size={32} color="#94a3b8" />
         </div>
         <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>此進階模組建置中 (Coming Soon)</h2>
         <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', margin: '0 auto' }}>深度集成的電子郵件通知(Email Notifications)與多因素認證(MFA)正在系統整合排程中，未來為您提供銀行級的帳戶安全保護。</p>
      </div>
    </div>
  );
}
