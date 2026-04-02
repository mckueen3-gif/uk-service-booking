"use client";

import { useEffect, useState } from "react";
import { getAdminDisputes, updateDisputeStatus } from "@/app/actions/admin_actions";
import { DisputeStatus, ResolutionDecision } from "@prisma/client";
import { ShieldCheck, Loader2, Info, CheckCircle, Clock } from "lucide-react";
import Link from 'next/link';

export default function AdminDisputesPage() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadDisputes();
  }, []);

  async function loadDisputes() {
    setLoading(true);
    try {
      const data = await getAdminDisputes();
      setDisputes(data);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const getStatusColor = (status: DisputeStatus) => {
    switch(status) {
      case 'OPEN': return '#ef4444';
      case 'REVIEWING': return '#f59e0b';
      case 'RESOLVED': return '#facc15';
      default: return '#64748b';
    }
  };

  const getDecisionColor = (decision: ResolutionDecision) => {
    switch(decision) {
      case 'FORCE_PAYOUT': return '#ef4444';
      case 'REFUND_CUSTOMER': return '#facc15';
      case 'SPLIT_COST': return '#2563eb';
      default: return '#64748b';
    }
  };

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1rem', color: '#94a3b8' }}>
      <Loader2 className="animate-spin" size={32} />
      <span>Loading disputes...</span>
    </div>
  );

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: 'white' }}>
      {/* Header */}
      <div style={{ marginBottom: '3rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>
            爭議監管中心 <span style={{ color: 'white' }}>👑</span>
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem' }}>平台服務爭議監測與人工覆核隊列</p>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'right' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>爭議總金額</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f59e0b' }}>
              £{disputes.reduce((acc, d) => acc + (d.booking.variations.find((v: any) => v.status === 'PENDING')?.amount || 0), 0).toFixed(2)}
            </div>
          </div>
          <div style={{ padding: '1rem 1.5rem', backgroundColor: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.2)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <ShieldCheck color="#6366f1" size={24} />
            <span style={{ fontWeight: 600 }}>待處理餘額: {disputes.filter(d => d.status !== 'RESOLVED').length}</span>
          </div>
        </div>
      </div>

      {message && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid #ef4444', color: '#ef4444', borderRadius: '12px', marginBottom: '2rem' }}>
          {message}
        </div>
      )}

      {/* Disputes Table */}
      <div style={{ backgroundColor: 'rgba(30, 41, 59, 0.5)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 600 }}>ID</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 600 }}>兩造當事人 (Customer/Merch)</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 600 }}>爭議金額</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 600 }}>狀態 (Status)</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 600 }}>AI 仲裁結果</th>
              <th style={{ padding: '1.25rem 1.5rem', color: '#94a3b8', fontWeight: 600 }}>後台審核</th>
            </tr>
          </thead>
          <tbody>
            {disputes.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ padding: '4rem', textAlign: 'center', color: '#64748b' }}>
                  目前沒有任何爭議。所有服務運行順暢！ ✨
                </td>
              </tr>
            ) : disputes.map((dispute: any) => {
              const disputedVariation = dispute.booking.variations.find((v: any) => v.status === 'PENDING' || v.status === 'REJECTED');
              const needsAttention = dispute.status !== 'RESOLVED' && (!dispute.aiDecision || dispute.aiDecision === 'PENDING');

              return (
                <tr key={dispute.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', backgroundColor: needsAttention ? 'rgba(239, 68, 68, 0.05)' : 'transparent' }}>
                  <td style={{ padding: '1.25rem 1.5rem', fontSize: '0.875rem', color: '#94a3b8' }}>
                    #{dispute.id.slice(-6).toUpperCase()}
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 600 }}>{dispute.booking.customer.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>vs. {dispute.booking.merchant.companyName}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ fontWeight: 800, color: '#f1f5f9' }}>£{disputedVariation?.amount || 0}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{dispute.booking.service.name}</div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ 
                        padding: '0.25rem 0.75rem', 
                        borderRadius: '999px', 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        backgroundColor: `${getStatusColor(dispute.status)}20`, 
                        color: getStatusColor(dispute.status),
                        border: `1px solid ${getStatusColor(dispute.status)}40`
                      }}>
                        {dispute.status}
                      </span>
                      {needsAttention && <AlertCircle size={16} color="#ef4444" />}
                    </div>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '999px', 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      backgroundColor: dispute.aiDecision === 'PENDING' ? 'rgba(255,255,255,0.1)' : `${getDecisionColor(dispute.aiDecision)}20`, 
                      color: dispute.aiDecision === 'PENDING' ? '#94a3b8' : getDecisionColor(dispute.aiDecision),
                    }}>
                      {dispute.aiDecision}
                    </span>
                  </td>
                  <td style={{ padding: '1.25rem 1.5rem' }}>
                    <Link href={`/admin/disputes/${dispute.id}`} style={{ 
                      backgroundColor: needsAttention ? '#ef4444' : '#6366f1', 
                      color: 'white', 
                      padding: '0.5rem 1rem', 
                      borderRadius: '8px', 
                      textDecoration: 'none', 
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      transition: 'all 0.2s',
                      boxShadow: needsAttention ? '0 0 15px rgba(239, 68, 68, 0.4)' : 'none'
                    }}>
                      {needsAttention ? '立即審核 (Review)' : '回顧細節'}
                    </Link>
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

import { AlertCircle } from "lucide-react";
