"use client";

import { useState, useEffect } from "react";
import { 
  Calculator, 
  BarChart, 
  ShieldCheck, 
  Lock, 
  Zap, 
  Receipt, 
  ArrowRight,
  Download,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { getMerchantAccountingSummary, activateAccountingSubscription } from "@/app/actions/merchant_dashboard";
import { useTranslation } from "@/components/LanguageContext";
import TaxMetricCard from "./components/TaxMetricCard";
import { jsPDF } from "jspdf";

export default function AccountingPage() {
  const { t, locale } = useTranslation();
  const accDict = (t as any).merchant.accounting;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const isPremium = data?.isAccountingActive || false;

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    try {
      const res = await getMerchantAccountingSummary();
      if (!res.error) {
        setData(res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubscribe() {
    setSubmitting(true);
    try {
      const res = await activateAccountingSubscription();
      if (res.url) {
        window.location.href = res.url;
      } else if (res.error) {
        alert(res.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  }

  const exportToPDF = (monthData: any) => {
    if (!data) return;
    const doc = new jsPDF();
    
    // Header
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("ConciergeAI Audit", 20, 25);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("Official Performance Certificate", 140, 25);

    // Metadata
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Merchant Statement: ${monthData.month} ${data.taxYear}`, 20, 55);
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 62);

    // Financial Table
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 70, 190, 70);
    
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Description", 20, 80);
    doc.text("Amount (GBP)", 150, 80);
    
    doc.setFont("helvetica", "normal");
    doc.text("Gross Sales Revenue", 20, 95);
    doc.text(`£${monthData.revenue.toLocaleString()}`, 150, 95);
    
    doc.text("Platform Commission (9%)", 20, 105);
    doc.setTextColor(200, 0, 0);
    doc.text(`-£${monthData.fees.toLocaleString()}`, 150, 105);
    
    doc.line(20, 115, 190, 115);
    doc.setTextColor(34, 197, 94);
    doc.setFont("helvetica", "bold");
    doc.text("Net Business Profit", 20, 125);
    doc.text(`£${(monthData.revenue - monthData.fees).toLocaleString()}`, 150, 125);

    // Compliance
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(8);
    doc.setFont("helvetica", "italic");
    doc.text("This document serves as a verified record of transaction volume on the ConciergeAI platform.", 20, 145);
    doc.text("Please reconcile these figures with your business bank account for HMRC filings.", 20, 150);

    doc.save(`ConciergeAI_${monthData.month.replace(' ', '_')}.pdf`);
  };

  const exportToCSV = () => {
    if (!data) return;
    const headers = ["Month", "Revenue (£)", "Platform Fees (£)", "Net Profit (£)"];
    const rows = data.monthlySummaries.map((s: any) => [
      s.month,
      s.revenue.toFixed(2),
      s.fees.toFixed(2),
      (s.revenue - s.fees).toFixed(2)
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n"
      + rows.map((e: any) => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `ConciergeAI_Audit_${data.taxYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#d4af37' }}>
        <Zap className="animate-pulse" size={48} />
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
      
      {/* Header */}
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '0.5rem', letterSpacing: '-0.03em' }}>
            {accDict.title} <span style={{ color: '#d4af37' }}>Accounting & Tax</span>
          </h1>
          <p style={{ color: '#666', fontSize: '1.1rem', fontWeight: 500 }}>
            {accDict.subtitle}
          </p>
        </div>
        <div style={{ 
          backgroundColor: isPremium ? 'rgba(34, 197, 94, 0.1)' : 'rgba(212, 175, 55, 0.1)', 
          padding: '0.6rem 1.2rem', 
          borderRadius: '14px', 
          border: `1px solid ${isPremium ? 'rgba(34, 197, 94, 0.2)' : 'rgba(212, 175, 55, 0.2)'}`,
          color: isPremium ? '#22c55e' : '#d4af37',
          fontSize: '0.85rem',
          fontWeight: 800,
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem'
        }}>
          {isPremium ? <CheckCircle size={16} /> : <Lock size={16} />}
          {isPremium ? accDict.statusActive : accDict.statusInactive}
        </div>
      </div>

      {/* Main Grid with Dynamic Data */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '2rem',
        marginBottom: '3.5rem',
        filter: !isPremium ? 'blur(8px)' : 'none',
        pointerEvents: !isPremium ? 'none' : 'auto',
        opacity: !isPremium ? 0.3 : 1,
        transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
      }}>
        <TaxMetricCard 
          title={accDict.grossRevenue}
          value={`£${data?.grossRevenue.toLocaleString()}`}
          description={accDict.grossRevenueDesc}
          icon={<BarChart size={24} />} 
          isLocked={!isPremium}
        />
        <TaxMetricCard 
          title={accDict.taxPayable}
          value={`£${data?.estimatedTax.toLocaleString()}`}
          description={accDict.taxPayableDesc}
          icon={<ShieldCheck size={24} />} 
          isLocked={!isPremium}
        />
        <div className="glass-panel" style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ color: '#666', fontSize: '0.9rem', fontWeight: 700 }}>{accDict.vatRadar}</div>
            <Calculator size={20} color="#d4af37" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>
            {data?.vatProgress.toFixed(1)}%
          </div>
          <div style={{ height: '8px', backgroundColor: '#111', borderRadius: '4px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ 
              width: `${Math.min(data?.vatProgress || 0, 100)}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #d4af37, #f1c40f)',
              boxShadow: '0 0 15px rgba(212, 175, 55, 0.5)'
            }} />
          </div>
          <p style={{ color: '#444', fontSize: '0.8rem', fontWeight: 600 }}>{accDict.vatRadarDesc}</p>
        </div>
      </div>

      {/* Premium Paywall Overlay */}
      {!isPremium && (
        <div style={{ 
          position: 'absolute', 
          top: '250px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '100%', 
          maxWidth: '640px', 
          zIndex: 20,
          textAlign: 'center'
        }}>
          <div className="glass-panel" style={{ 
            padding: '4rem 3.5rem', 
            borderRadius: '40px', 
            backgroundColor: 'rgba(8, 8, 8, 0.95)', 
            border: '1px solid rgba(212, 175, 55, 0.4)',
            boxShadow: '0 40px 100px -20px rgba(0,0,0,0.9), 0 0 0 1px rgba(212, 175, 55, 0.1)',
            backdropFilter: 'blur(20px)'
          }}>
            <div style={{ 
              width: '72px', 
              height: '72px', 
              backgroundColor: 'rgba(212, 175, 55, 0.1)', 
              borderRadius: '24px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              margin: '0 auto 2.5rem',
              border: '1px solid rgba(212, 175, 55, 0.3)'
            }}>
              <Zap size={36} color="#d4af37" fill="#d4af37" />
            </div>
            <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', marginBottom: '1.25rem', letterSpacing: '-0.02em' }}>
              {accDict.upgradeTitle}
            </h2>
            <p style={{ color: '#888', fontSize: '1.1rem', lineHeight: '1.7', marginBottom: '3rem' }}>
              {accDict.upgradeDesc}
            </p>
            
            <div style={{ 
              backgroundColor: 'rgba(212, 175, 55, 0.05)', 
              padding: '2rem', 
              borderRadius: '24px', 
              marginBottom: '3rem',
              border: '1px solid rgba(212, 175, 55, 0.1)'
            }}>
              <div style={{ fontSize: '0.9rem', color: '#666', textTransform: 'uppercase', fontWeight: 800, marginBottom: '0.75rem', letterSpacing: '0.1em' }}>Premium Logic</div>
              <div style={{ fontSize: '3rem', fontWeight: 900, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                £4.99 <span style={{ fontSize: '1.1rem', color: '#666', fontWeight: 600 }}>/ {accDict.upgradeCost.split('/')[1]}</span>
              </div>
            </div>

            <button 
              onClick={handleSubscribe}
              disabled={submitting}
              style={{ 
                width: '100%', 
                padding: '1.5rem', 
                borderRadius: '20px', 
                background: 'linear-gradient(135deg, #d4af37 0%, #b8860b 100%)', 
                color: 'black', 
                fontWeight: 900, 
                fontSize: '1.2rem',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                boxShadow: '0 10px 30px rgba(212, 175, 55, 0.3)',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
              }} 
              className="hover-lift"
            >
              {submitting ? "Processing..." : accDict.upgradeBtn} <ArrowRight size={22} />
            </button>
          </div>
        </div>
      )}

      {/* Monthly Breakdown and Export Tool */}
      {isPremium && (
        <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Receipt size={28} color="#d4af37" /> {accDict.monthlyBreakdown}
            </h3>
            <button 
              onClick={exportToCSV}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.8rem 1.5rem',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'white',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              className="hover-lift"
            >
              <Download size={18} /> {accDict.exportCsv}
            </button>
          </div>

          <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <th style={{ padding: '1.5rem 2rem', color: '#666', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>Month</th>
                  <th style={{ padding: '1.5rem 2rem', color: '#666', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>{accDict.revenue}</th>
                  <th style={{ padding: '1.5rem 2rem', color: '#666', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>{accDict.fees}</th>
                  <th style={{ padding: '1.5rem 2rem', color: '#666', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>{accDict.netProfit}</th>
                  <th style={{ padding: '1.5rem 2rem', color: '#666', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>Report</th>
                </tr>
              </thead>
              <tbody>
                {data.monthlySummaries.map((row: any, i: number) => (
                  <tr key={row.month} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)', backgroundColor: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.01)' }}>
                    <td style={{ padding: '1.5rem 2rem', color: 'white', fontWeight: 700 }}>{row.month}</td>
                    <td style={{ padding: '1.5rem 2rem', color: 'white', fontWeight: 500 }}>£{row.revenue.toLocaleString()}</td>
                    <td style={{ padding: '1.5rem 2rem', color: '#e74c3c', fontWeight: 500 }}>-£{row.fees.toLocaleString()}</td>
                    <td style={{ padding: '1.5rem 2rem', color: '#2ecc71', fontWeight: 800 }}>£{(row.revenue - row.fees).toLocaleString()}</td>
                    <td style={{ padding: '1.5rem 2rem' }}>
                      {row.revenue > 0 ? (
                        <button 
                          onClick={() => exportToPDF(row)}
                          style={{ color: '#d4af37', background: 'none', border: 'none', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        >
                          <Download size={14} /> View PDF
                        </button>
                      ) : (
                        <span style={{ opacity: 0.3, color: '#666', fontSize: '0.85rem' }}>No Data</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '2rem' }}>
            <div className="glass-panel" style={{ flex: 1, padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', borderRadius: '15px', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#d4af37' }}>
                <AlertCircle size={24} />
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 800, marginBottom: '0.25rem' }}>{accDict.taxYear} Summary</div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>Business Year: <span style={{ color: '#d4af37' }}>{data.taxYear}</span></div>
              </div>
            </div>
            <div className="glass-panel" style={{ flex: 1, padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ padding: '1rem', borderRadius: '15px', backgroundColor: 'rgba(212, 175, 55, 0.1)', color: '#d4af37' }}>
                <ShieldCheck size={24} />
              </div>
              <div>
                <div style={{ color: 'white', fontWeight: 800, marginBottom: '0.25rem' }}>{accDict.regNumber}</div>
                <div style={{ color: '#666', fontSize: '0.9rem' }}>Verification: <span style={{ color: '#2ecc71', fontWeight: 700 }}>VERIFIED</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-pulse {
          animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .5; }
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          filter: brightness(1.1);
        }
      `}</style>
    </div>
  );
}
