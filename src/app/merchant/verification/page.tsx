import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from '@/lib/prisma';
import VerificationForm from '@/app/components/merchant/VerificationForm';
import { ShieldCheck, Info } from 'lucide-react';

export default async function VerificationPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/merchant/verification');
  }

  if ((session.user as any).role !== 'MERCHANT') {
    redirect('/auth/login'); // Or unauthorized page
  }

  const merchant = await prisma.merchant.findUnique({
    where: { userId: (session.user as any).id },
    select: { isVerified: true, licenseUrl: true, registrationNumber: true }
  });

  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '10rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', marginBottom: '4rem' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '1.25rem', backgroundColor: 'var(--accent-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem', boxShadow: '0 8px 16px rgba(184, 134, 11, 0.2)' }}>
          <ShieldCheck size={32} />
        </div>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>專家認證中心</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>完成認證，獲得平台專屬信任標誌</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '4rem', alignItems: 'start' }}>
        <VerificationForm initialStatus={merchant} />

        <aside style={{ display: 'grid', gap: '2rem' }}>
          <div className="glass-panel" style={{ padding: '2rem' }}>
             <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
               <Info size={18} color="var(--accent-color)" /> 為何需要認證？
             </h3>
             <ul style={{ padding: 0, margin: 0, listStyle: 'none', display: 'grid', gap: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
               <li style={{ display: 'flex', gap: '0.75rem' }}>
                 <div style={{ color: 'var(--accent-color)', fontWeight: 900 }}>✓</div>
                 <div>取得「認證職人」標章，提升客戶信任度。</div>
               </li>
               <li style={{ display: 'flex', gap: '0.75rem' }}>
                 <div style={{ color: 'var(--accent-color)', fontWeight: 900 }}>✓</div>
                 <div>優先出現在搜尋結果的前列。</div>
               </li>
               <li style={{ display: 'flex', gap: '0.75rem' }}>
                 <div style={{ color: 'var(--accent-color)', fontWeight: 900 }}>✓</div>
                 <div>解鎖更高額度的轉帳限額。</div>
               </li>
             </ul>
          </div>

          <div className="glass-panel" style={{ padding: '2rem', backgroundColor: 'rgba(37,99,235,0.05)' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.75rem' }}>認證流程</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              1. 提交專屬註冊編號<br/>
              2. 上傳對應證照正本照片<br/>
              3. AI 進行初步數據比對<br/>
              4. 審核小組最終確認
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
