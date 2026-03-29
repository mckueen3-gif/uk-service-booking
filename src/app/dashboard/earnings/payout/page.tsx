"use client";

import { useState, useEffect } from "react";
import { 
  ArrowLeft, CreditCard, Building, Lock, 
  CheckCircle2, Loader2, AlertTriangle, ArrowRight 
} from 'lucide-react';
import { getEarningsStats, requestWithdrawal, updateBankDetails } from "@/app/actions/finance";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function PayoutPage() {
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
      setMsg("提領申請已送出！ (Withdrawal request submitted)");
      load();
    } else {
      setMsg(res.error || "提領失敗");
    }
    setSubmittingWithdrawal(false);
  }

  async function handleBankUpdate(e: React.FormEvent) {
    e.preventDefault();
    setSubmittingBank(true);
    const res = await updateBankDetails(bankInfo.sortCode, bankInfo.accountNumber);
    if (res.success) {
      alert("銀行資訊已更新 (Bank details updated)");
    }
    setSubmittingBank(false);
  }

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
      <Loader2 className="animate-spin" size={48} color="var(--accent-color)" />
    </div>
  );

  const wallet = data?.wallet || { availableBalance: 0 };

  return (
    <div className="animate-fade-in">
      <Link href="/dashboard/earnings" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
        <ArrowLeft size={16} /> 返回收入概覽
      </Link>

      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '2rem' }}>申請提領 (Request Payout)</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem' }}>
        
        {/* Withdrawal Form */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
             <CreditCard size={24} color="var(--accent-color)" />
             <h2 style={{ fontWeight: 800 }}>提領金額</h2>
          </div>

          <div style={{ backgroundColor: 'rgba(0,0,0,0.1)', padding: '1.25rem', borderRadius: '16px', marginBottom: '2rem' }}>
             <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>可用餘額 (Available)</p>
             <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>£{wallet.availableBalance.toFixed(2)}</p>
          </div>

          <form onSubmit={handleWithdrawal}>
            <div style={{ marginBottom: '1.5rem' }}>
               <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>提領金額 (£)</label>
               <input 
                 type="number" 
                 step="0.01"
                 className="input-field" 
                 placeholder="0.00"
                 value={withdrawalAmount}
                 onChange={e => setWithdrawalAmount(parseFloat(e.target.value))}
                 required
               />
            </div>
            
            {msg && (
              <div style={{ padding: '0.75rem', borderRadius: '8px', backgroundColor: msg.includes("成功") ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', color: msg.includes("成功") ? '#10b981' : '#ef4444', fontSize: '0.85rem', marginBottom: '1rem', fontWeight: 600 }}>
                 {msg}
              </div>
            )}

            <button type="submit" className="btn btn-primary" disabled={submittingWithdrawal || withdrawalAmount <= 0} style={{ width: '100%', padding: '1rem' }}>
               {submittingWithdrawal ? <Loader2 className="animate-spin" size={20} /> : "確認提領 (Confirm Withdrawal)"}
            </button>
          </form>
        </div>

        {/* Bank Details Form */}
        <div className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
             <Building size={24} color="var(--accent-color)" />
             <h2 style={{ fontWeight: 800 }}>銀行詳細資訊</h2>
          </div>
          
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
             請提供您在英國的銀行帳號資訊，以便我們進行人工撥款。
          </p>

          <form onSubmit={handleBankUpdate}>
            <div style={{ marginBottom: '1.25rem' }}>
               <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Sort Code (6 位數)</label>
               <input 
                 className="input-field" 
                 placeholder="XX-XX-XX"
                 value={bankInfo.sortCode}
                 onChange={e => setBankInfo({...bankInfo, sortCode: e.target.value})}
                 required
               />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
               <label style={{ fontSize: '0.875rem', fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Account Number (8 位數)</label>
               <input 
                 className="input-field" 
                 placeholder="XXXXXXXX"
                 value={bankInfo.accountNumber}
                 onChange={e => setBankInfo({...bankInfo, accountNumber: e.target.value})}
                 required
               />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
               <Lock size={14} /> 您的資訊經過加密儲存，僅供撥款使用。
            </div>

            <button type="submit" className="btn" style={{ width: '100%', padding: '0.8rem', backgroundColor: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)', fontWeight: 700 }} disabled={submittingBank}>
               {submittingBank ? <Loader2 className="animate-spin" size={20} /> : "更新銀行資訊"}
            </button>
          </form>
        </div>

      </div>

      <div className="glass-panel" style={{ marginTop: '2rem', padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
         <AlertTriangle color="#f59e0b" size={24} />
         <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            <strong>提領限制：</strong> 最低提領金額為 £10.00。所有申請均需經過安全審核。
         </p>
      </div>
    </div>
  );
}
