"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "@/components/LanguageContext";
import { ShieldCheck, Download, FileText, Search, Filter, Loader2, ExternalLink, ArrowLeft } from "lucide-react";
import { getMerchantReceipts } from "@/app/actions/finance";
import Link from "next/link";

export default function AuditVaultPage() {
  const { t } = useTranslation();
  const [receipts, setReceipts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function loadData() {
      const data = await getMerchantReceipts();
      if (Array.isArray(data)) {
        setReceipts(data);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const filteredReceipts = receipts.filter(r => 
    r.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.booking.customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.booking.service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleView = (fileUrl: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.target = "_blank";
    link.download = `Receipt.pdf`; // Data URI triggers download usually
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '10rem', backgroundColor: '#050505', minHeight: '100vh' }}>
        <Loader2 className="animate-spin" size={48} color="#d4af37" />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', backgroundColor: '#050505', minHeight: '100vh', color: '#fff' }}>
      <Link 
        href="/merchant/toolkit"
        style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#666', textDecoration: 'none', marginBottom: '2rem', fontSize: '0.9rem', fontWeight: 600 }}
      >
        <ArrowLeft size={16} /> {t?.merchant?.toolkit?.back || "Back to Toolkit"}
      </Link>

      {/* Header */}
      <div className="animate-fade-up" style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.75rem', borderRadius: '16px', border: '1px solid #d4af37' }}>
            <ShieldCheck size={32} color="#d4af37" />
          </div>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: 0 }}>
              {t?.merchant?.audit_vault?.title?.split(' ')[0] || "Audit"} <span style={{ color: '#d4af37' }}>{t?.merchant?.audit_vault?.title?.split(' ')[1] || "Vault"}</span>
            </h1>
            <p style={{ color: '#666', margin: 0 }}>{t?.merchant?.audit_vault?.subtitle || "Automated professional records for your specialist business."}</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={20} color="#444" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
          <input 
            type="text"
            placeholder={t?.merchant?.audit_vault?.searchPlaceholder || "Search receipts, customers, or services..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ 
              width: '100%', 
              backgroundColor: '#0c0c0c', 
              border: '1px solid #222', 
              borderRadius: '16px', 
              padding: '1rem 1rem 1rem 3rem', 
              color: '#fff',
              fontSize: '1rem'
            }}
          />
        </div>
        <button style={{ backgroundColor: '#0c0c0c', border: '1px solid #222', borderRadius: '16px', padding: '0 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#999' }}>
          <Filter size={18} /> {t?.merchant?.audit_vault?.filterBtn || "Filter"}
        </button>
      </div>

      {/* Receipts Table */}
      <div style={{ backgroundColor: '#0c0c0c', borderRadius: '24px', border: '1px solid #222', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ backgroundColor: '#111', color: '#555', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
              <th style={{ padding: '1.5rem', fontWeight: 800 }}>{t?.merchant?.audit_vault?.table?.date || "Date"}</th>
              <th style={{ padding: '1.5rem', fontWeight: 800 }}>{t?.merchant?.audit_vault?.table?.id || "Receipt #"}</th>
              <th style={{ padding: '1.5rem', fontWeight: 800 }}>{t?.merchant?.audit_vault?.table?.customer || "Customer / Service"}</th>
              <th style={{ padding: '1.5rem', fontWeight: 800 }}>{t?.merchant?.audit_vault?.table?.amount || "Amount"}</th>
              <th style={{ padding: '1.5rem', fontWeight: 800, textAlign: 'right' }}>{t?.merchant?.audit_vault?.table?.actions || "Actions"}</th>
            </tr>
          </thead>
          <tbody>
            {filteredReceipts.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ padding: '6rem', textAlign: 'center' }}>
                   <FileText size={48} color="#222" style={{ marginBottom: '1rem' }} />
                   <p style={{ color: '#444', margin: 0 }}>{t?.merchant?.audit_vault?.empty || "No audit records found."}</p>
                </td>
              </tr>
            ) : (
              filteredReceipts.map((r, idx) => (
                <tr key={r.id} style={{ borderBottom: '1px solid #1a1a1a', backgroundColor: idx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                  <td style={{ padding: '1.5rem', fontSize: '0.9rem', color: '#666' }}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '1.5rem', fontWeight: 800, color: '#d4af37', fontFamily: 'monospace' }}>
                    {r.receiptNumber}
                  </td>
                  <td style={{ padding: '1.5rem' }}>
                    <div style={{ fontWeight: 700, color: '#fff' }}>{r.booking.customer.name}</div>
                    <div style={{ fontSize: '0.8rem', color: '#555' }}>{r.booking.service.name}</div>
                  </td>
                  <td style={{ padding: '1.5rem', fontWeight: 900, color: '#fff', fontSize: '1.1rem' }}>
                    £{r.totalAmount.toFixed(2)}
                  </td>
                  <td style={{ padding: '1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end' }}>
                      <button 
                        onClick={() => handleView(r.fileUrl)}
                        style={{ 
                          backgroundColor: '#222', 
                          border: 'none', 
                          color: '#fff', 
                          padding: '0.6rem 1rem', 
                          borderRadius: '12px', 
                          fontSize: '0.8rem', 
                          fontWeight: 800,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                          <FileText size={14} /> {t?.merchant?.audit_vault?.viewBtn || "View"}
                      </button>
                      <button 
                        onClick={() => handleView(r.fileUrl)}
                        style={{ 
                          backgroundColor: '#d4af37', 
                          border: 'none', 
                          color: '#000', 
                          padding: '0.6rem 1rem', 
                          borderRadius: '12px', 
                          fontSize: '0.8rem', 
                          fontWeight: 900,
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem'
                        }}
                      >
                        <Download size={14} /> {t?.merchant?.audit_vault?.pdfBtn || "PDF"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div style={{ marginTop: '2rem', padding: '2rem', borderRadius: '24px', backgroundColor: 'rgba(212, 175, 55, 0.05)', border: '1px dashed rgba(212, 175, 55, 0.2)' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#d4af37', marginBottom: '0.5rem' }}>{t?.merchant?.audit_vault?.compliance?.title || "Professional Compliance"}</h3>
        <p style={{ fontSize: '0.85rem', color: '#666', margin: 0, lineHeight: 1.6 }}>
          {t?.merchant?.audit_vault?.compliance?.desc || "All receipts generated here are compliant with standard UK freelance and small-business record-keeping guidelines. Use these for your self-assessment or VAT filings."}
        </p>
      </div>
    </div>
  );
}
