"use client";

import { useEffect, useState, use } from 'react';
import { 
  getDisputeDetails, 
  overrideDisputeAction
} from '@/app/actions/dispute';
import { ResolutionDecision } from '@/lib/constants/dispute_constants';
import { 
  ShieldAlert, User, Store, AlertTriangle, 
  CheckCircle, FileText, Scale, HelpCircle, 
  ArrowLeft, Info, Cpu, MessageSquare, ShieldCheck
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDisputeDetailPage({ params }: { params: Promise<{ disputeId: string }> }) {
  const { disputeId } = use(params);
  const [dispute, setDispute] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [overriding, setOverriding] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function load() {
      const res = await getDisputeDetails(disputeId);
      if (res.success) setDispute(res.dispute);
      setLoading(false);
    }
    load();
  }, [disputeId]);

  const handleOverride = async (decision: ResolutionDecision) => {
    if (!adminNotes.trim()) {
      alert("請輸入人工覆核理由");
      return;
    }
    setOverriding(true);
    const res = await overrideDisputeAction(disputeId, decision, adminNotes);
    if (res.success) {
      setMessage("裁定已提交: " + decision);
      const updated = await getDisputeDetails(disputeId);
      if (updated.success) setDispute(updated.dispute);
    } else {
      alert("提交失敗: " + res.error);
    }
    setOverriding(false);
  };

  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>載入爭議詳情中...</div>;
  if (!dispute) return <div style={{ padding: '4rem', textAlign: 'center' }}>找不到該爭議單</div>;

  const totalDisputedAmount = dispute.booking.variations?.reduce((acc: number, v: any) => v.status === 'DISPUTED' ? acc + v.amount : acc, 0) || 0;

  return (
    <div className="container" style={{ padding: '2rem 1.5rem', maxWidth: '1200px' }}>
      <header style={{ marginBottom: '2rem' }}>
        <Link href="/admin/disputes" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem', marginBottom: '1rem' }}>
          <ArrowLeft size={16} /> 返回列表
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '0.5rem' }}>
              爭議裁決 <span style={{ color: 'var(--accent-color)' }}>Arbitration</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>件號: #{dispute.id.slice(-8)} · 目前狀態: {dispute.status}</p>
          </div>
          <div style={{ padding: '0.5rem 1rem', borderRadius: '12px', backgroundColor: dispute.status === 'RESOLVED' ? '#f0fdf4' : 'var(--accent-soft)', color: dispute.status === 'RESOLVED' ? '#166534' : 'var(--accent-color)', fontWeight: 800, border: '1px solid currentColor' }}>
            {dispute.status === 'RESOLVED' ? '✅ 已結案' : '⚖️ 審理中'}
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2.5rem' }}>
        <div style={{ display: 'grid', gap: '2rem' }}>
          <section className="glass-panel" style={{ padding: '2rem', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <AlertTriangle color="var(--accent-color)" /> 爭議背景 (Case Background)
            </h2>
            <div style={{ backgroundColor: 'var(--surface-2)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
               <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem', fontWeight: 700 }}>初始投訴原因:</div>
               <p style={{ fontSize: '1.1rem', lineHeight: 1.6, fontWeight: 500 }}>{dispute.reason}</p>
            </div>
          </section>

          {dispute.aiReasoning && (
            <section className="glass-panel" style={{ padding: '2rem', borderRadius: '24px', border: '1px solid #6366f1', backgroundColor: 'rgba(99, 102, 241, 0.02)' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#4f46e5', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Cpu size={20} /> AI 智能仲裁分析
              </h3>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.7, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>{dispute.aiReasoning}</p>
            </section>
          )}
        </div>

        <aside>
          <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '24px' }}>
             <h3 style={{ fontSize: '1.1rem', fontWeight: 900, marginBottom: '1rem' }}>人工介入決策</h3>
             <textarea 
               placeholder="理由..." 
               value={adminNotes} 
               onChange={(e) => setAdminNotes(e.target.value)}
               style={{ width: '100%', minHeight: '100px', padding: '0.75rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1rem' }}
             />
             <div style={{ display: 'grid', gap: '0.5rem' }}>
                <button onClick={() => handleOverride(ResolutionDecision.REFUND_CUSTOMER)} disabled={overriding} style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: '#10b981', color: 'white', fontWeight: 800 }}>退款給客戶</button>
                <button onClick={() => handleOverride(ResolutionDecision.FORCE_PAYOUT)} disabled={overriding} style={{ padding: '0.75rem', borderRadius: '10px', backgroundColor: '#ef4444', color: 'white', fontWeight: 800 }}>支付給商戶</button>
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
