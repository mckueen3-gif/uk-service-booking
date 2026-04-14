import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Wallet, ShoppingBag, ShoppingCart, Apple, Shirt, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";

export default async function VoucherRedemptionPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  const user = session.user as any;
  const dbUser = (await prisma.user.findUnique({
    where: { id: user.id },
    select: { referralCredits: true }
  })) as any;

  const vouchers = [
    { name: "Tesco Gift Card", brand: "Tesco", cost: 10, category: "Supermarket", logo: "/vouchers/tesco.png", color: "#00539f" },
    { name: "Sainsbury's Card", brand: "Sainsbury's", cost: 20, category: "Supermarket", logo: "/vouchers/sainsburys.png", color: "#f06c00" },
    { name: "Nike Store Voucher", brand: "NIKE", cost: 50, category: "Sports", logo: "/vouchers/nike.png", color: "#111" },
    { name: "Amazon UK Credit", brand: "Amazon", cost: 10, category: "Shopping", logo: "/vouchers/amazon.png", color: "#ff9900" },
    { name: "Apple Gift Card", brand: "Apple", cost: 25, category: "Digital", logo: "/vouchers/apple.png", color: "#555" },
    { name: "Starbucks Coffee", brand: "Starbucks", cost: 5, category: "Food & Drink", logo: "/vouchers/starbucks.png", color: "#00704a" },
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '2rem', maxWidth: '1000px', margin: '0 auto', color: '#f8fafc' }}>
      <Link href="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#94a3b8', textDecoration: 'none', marginBottom: '2rem' }} className="hover:text-white transition-colors">
        <ArrowLeft size={20} /> 返回控制台
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.5rem' }}>現金券兌換 (Redemption)</h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>使用您的抵用金點數兌換精選品牌現金券。</p>
        </div>
        
        <div style={{ 
          background: 'rgba(99, 102, 241, 0.1)', 
          border: '1px solid rgba(99, 102, 241, 0.2)', 
          padding: '1.5rem 2rem', 
          borderRadius: '1.5rem',
          textAlign: 'right'
        }}>
          <p style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', marginBottom: '0.25rem' }}>可用點數餘額 (Balance)</p>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '0.5rem' }}>
            <Wallet size={32} color="#6366f1" />
            £{dbUser?.referralCredits?.toFixed(2) || "0.00"}
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', color: '#f8fafc' }}>熱門禮物卡 (Popular Vouchers)</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {vouchers.map((voucher, i) => (
          <div key={i} style={{ 
            background: 'rgba(255, 255, 255, 0.03)', 
            border: '1px solid rgba(255, 255, 255, 0.05)', 
            borderRadius: '1.5rem', 
            padding: '1.5rem',
            transition: 'all 0.3s',
            position: 'relative',
            overflow: 'hidden'
          }} className="hover-scale">
            <div style={{ 
              position: 'absolute', 
              top: 0, 
              right: 0, 
              width: '100px', 
              height: '100px', 
              background: `radial-gradient(circle at top right, ${voucher.color}33 0%, transparent 70%)`,
              zIndex: 0
            }} />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                <div style={{ backgroundColor: 'white', padding: '0.4rem', borderRadius: '0.75rem', width: '56px', height: '56px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
                  <img src={voucher.logo} alt={voucher.brand} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                </div>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.75rem', borderRadius: '2rem' }}>
                  {voucher.category}
                </span>
              </div>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '0.25rem' }}>{voucher.name}</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>官方 {voucher.brand} 數位禮物卡</p>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#f8fafc' }}>£{voucher.cost}</div>
                <button 
                  disabled={(dbUser?.referralCredits || 0) < voucher.cost}
                  style={{ 
                    backgroundColor: (dbUser?.referralCredits || 0) < voucher.cost ? 'rgba(255,255,255,0.05)' : '#6366f1',
                    color: (dbUser?.referralCredits || 0) < voucher.cost ? '#475569' : 'white',
                    padding: '0.6rem 1.25rem',
                    borderRadius: '0.75rem',
                    fontWeight: 700,
                    border: 'none',
                    cursor: (dbUser?.referralCredits || 0) < voucher.cost ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  {(dbUser?.referralCredits || 0) < voucher.cost ? "點數不足" : "立即兌換"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div style={{ marginTop: '3rem', padding: '2rem', borderRadius: '1.5rem', background: 'rgba(255, 255, 255, 0.02)', border: '1px dashed rgba(255, 255, 255, 0.1)', textAlign: 'center' }}>
        <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          點數於訂單「完工」後自動入帳。如有兌換問題，請主動聯繫我們的客戶支援。
        </p>
      </div>
    </div>
  );
}
