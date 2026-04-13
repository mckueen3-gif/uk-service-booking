"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, CreditCard, Building, Lock, 
  Loader2, AlertTriangle
} from 'lucide-react';
import { getEarningsStats, requestWithdrawal, updateBankDetails } from "@/app/actions/finance";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/components/LanguageContext";

export default function PayoutPage() {
  const { t, isRTL } = useTranslation();
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [withdrawalAmount, setWithdrawalAmount] = useState<number>(0);
  const [bankInfo, setBankInfo] = useState({ sortCode: "", accountNumber: "" });
  
  const [submittingWithdrawal, setSubmittingWithdrawal] = useState(false);
  const [submittingBank, setSubmittingBank] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await getEarningsStats();
    if (res.wallet) {
      setData(res);
      setBankInfo({ 
        sortCode: res.merchant?.bankSortCode || "", 
        accountNumber: res.merchant?.bankAccountNumber || "" 
      });
    }
    setLoading(false);
  }

  async function handleWithdrawal(e: React.FormEvent) {
    e.preventDefault();
    if (withdrawalAmount <= 0) return;
    setSubmittingWithdrawal(true);
    const res = await requestWithdrawal(withdrawalAmount);
    if (res.success) {
      setMsg("提領申請已送出！ (Success)");
      load();
    } else {
      setMsg(res.error || "Error");
    }
    setSubmittingWithdrawal(false);
  }

  async function handleBankUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSubmittingBank(true);
    const res = await updateBankDetails(bankInfo.sortCode, bankInfo.accountNumber);
    if (res.success) {
      alert("Success");
    }
    setSubmittingBank(false);
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem' }}>
      <Loader2 className="animate-spin" size={48} color="#d4af37" />
    </div>
  );

  const wallet = data?.wallet || { availableBalance: 0 };

  return (
    <div className="animate-fade-in" style={{ direction: isRTL ? 'rtl' : 'ltr' }}>
      <Link href="/dashboard/earnings" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#666', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
        <ArrowLeft size={16} /> {t.merchant.merchant_services.back}
      </Link>

      <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2.5rem', textAlign: isRTL ? 'right' : 'left', color: '#fff' }}>
        {t.merchant.merchant_wallet.payout.title}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px', textAlign: isRTL ? 'right' : 'left', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
             <CreditCard size={28} color="#d4af37" />
             <h2 style={{ fontWeight: 900, color: '#fff' }}>{t.merchant.merchant_wallet.payout.amount}</h2>
          </div>

          <div style={{ backgroundColor: 'rgba(212,175,55,0.05)', padding: '1.5rem', borderRadius: '20px', marginBottom: '2.5rem' }}>
             <p style={{ fontSize: '0.8rem', color: '#666', marginBottom: '0.5rem' }}>{t.merchant.merchant_wallet.available}</p>
             <p style={{ fontSize: '2rem', fontWeight: 900, color: '#d4af37' }}>£{wallet.availableBalance.toFixed(2)}</p>
          </div>

          <form onSubmit={handleWithdrawal}>
            <div style={{ marginBottom: '2rem' }}>
               <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#666', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase' }}>{t.merchant.merchant_wallet.payout.amount} (£)</label>
               <input 
                 type="number" 
                 step="0.01"
                 className="input-field" 
                 placeholder="0.00"
                 value={withdrawalAmount}
                 onChange={e => setWithdrawalAmount(parseFloat(e.target.value))}
                 required
                 style={{ textAlign: isRTL ? 'right' : 'left', direction: isRTL ? 'rtl' : 'ltr' }}
               />
            </div>
            
            {msg && (
              <div style={{ padding: '1rem', borderRadius: '12px', backgroundColor: 'rgba(212, 175, 55, 0.05)', color: '#d4af37', fontSize: '0.85rem', marginBottom: '1.5rem', fontWeight: 700, border: '1px solid rgba(212, 175, 55, 0.1)' }}>
                 {msg}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={submittingWithdrawal || withdrawalAmount <= 0} style={{ width: '100%', padding: '1.25rem' }}>
               {submittingWithdrawal ? <Loader2 className="animate-spin" size={20} /> : t.merchant.merchant_wallet.payout.confirm}
            </button>
          </form>
        </div>

        <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '32px', textAlign: isRTL ? 'right' : 'left', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
             <Building size={28} color="#d4af37" />
             <h2 style={{ fontWeight: 900, color: '#fff' }}>{t.merchant.merchant_wallet.banking.title}</h2>
          </div>
          
          <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '2rem', lineHeight: 1.6 }}>
             {t.merchant.merchant_wallet.banking.tip}
          </p>

          <form onSubmit={handleBankUpdate}>
            <div style={{ marginBottom: '1.5rem' }}>
               <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#666', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase' }}>{t.merchant.merchant_wallet.banking.sortCode}</label>
               <input 
                 className="input-field" 
                 placeholder="XX-XX-XX"
                 value={bankInfo.sortCode}
                 onChange={e => setBankInfo({...bankInfo, sortCode: e.target.value})}
                 required
                 style={{ textAlign: isRTL ? 'right' : 'left' }}
               />
            </div>
            <div style={{ marginBottom: '2rem' }}>
               <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#666', display: 'block', marginBottom: '0.75rem', textTransform: 'uppercase' }}>{t.merchant.merchant_wallet.banking.accountNumber}</label>
               <input 
                 className="input-field" 
                 placeholder="XXXXXXXX"
                 value={bankInfo.accountNumber}
                 onChange={e => setBankInfo({...bankInfo, accountNumber: e.target.value})}
                 required
                 style={{ textAlign: isRTL ? 'right' : 'left' }}
               />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.75rem', color: '#555', marginBottom: '2rem', flexDirection: isRTL ? 'row-reverse' : 'row' }}>
               <Lock size={14} /> {t.merchant.merchant_wallet.banking.encrypted}
            </div>

            <button type="submit" className="btn" style={{ width: '100%', padding: '1rem', backgroundColor: 'transparent', border: '1px solid #d4af37', color: '#d4af37', fontWeight: 900 }} disabled={submittingBank}>
               {submittingBank ? <Loader2 className="animate-spin" size={20} /> : t.merchant.merchant_wallet.banking.update}
            </button>
          </form>
        </div>

      </div>

      <div className="glass-panel" style={{ marginTop: '3rem', padding: '2rem', display: 'flex', gap: '1.25rem', alignItems: 'center', flexDirection: isRTL ? 'row-reverse' : 'row', textAlign: isRTL ? 'right' : 'left', borderRadius: '24px', border: '1px solid rgba(212,175,55,0.05)' }}>
         <AlertTriangle color="#d4af37" size={28} />
         <p style={{ fontSize: '0.9rem', color: '#666', lineHeight: 1.5 }}>
            <strong style={{ color: '#fff' }}>{t.merchant.merchant_wallet.terms.title}:</strong> {t.merchant.merchant_wallet.payout.minAlert}
         </p>
      </div>
    </div>
  );
}
