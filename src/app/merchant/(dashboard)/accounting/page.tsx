"use client";

import { useState, useEffect } from "react";
import { 
  Calculator, 
  BarChart, 
  ShieldCheck, 
  Zap, 
  Receipt, 
  ArrowRight,
  Download,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  FileText,
  BadgeCheck,
  MessageSquare,
  Lock,
  Globe
} from "lucide-react";
import { 
  getMerchantAccountingSummary, 
  authorizeAccountantAccess 
} from "@/app/actions/merchant_dashboard";
import { useTranslation } from "@/components/LanguageContext";
import TaxMetricCard from "./components/TaxMetricCard";
import { jsPDF } from "jspdf";

export default function AccountingPage() {
  const { t } = useTranslation();
  const accDict = (t as any).merchant.accounting;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Accounting is now free for verified specialists
  const isPremium = true; 

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

  async function handleAuthorize() {
    if (submitting) return;
    setSubmitting(true);
    try {
      const res = await authorizeAccountantAccess();
      if (res.success) {
        await loadData();
      } else {
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
    
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("ConciergeAI Audit", 20, 25);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("Self-Audit Performance Certificate", 140, 25);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.text(`Merchant Statement: ${monthData.month} ${data.taxYear}`, 20, 55);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 20, 62);

    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.text("Description", 20, 80);
    doc.text("Amount (GBP)", 150, 80);
    
    doc.setFont("helvetica", "normal");
    doc.text("Gross Sales Revenue", 20, 95);
    doc.text(`£${monthData.revenue.toLocaleString()}`, 150, 95);
    
    doc.text("Platform Commission (Included)", 20, 105);
    doc.setTextColor(200, 0, 0);
    doc.text(`-£${monthData.fees.toLocaleString()}`, 150, 105);
    
    doc.line(20, 115, 190, 115);
    doc.setTextColor(34, 197, 94);
    doc.setFont("helvetica", "bold");
    doc.text("Net Business Profit", 20, 125);
    doc.text(`£${(monthData.revenue - monthData.fees).toLocaleString()}`, 150, 125);

    doc.save(`Audit_${monthData.month}.pdf`);
  };

  const exportAnnualReport = () => {
    if (!data) return;
    const doc = new jsPDF();
    doc.setFillColor(15, 15, 15);
    doc.rect(0, 0, 210, 50, 'F');
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(28);
    doc.setFont("helvetica", "bold");
    doc.text("ANNUAL TAX REPORT", 20, 30);
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text(`Financial Year ${data.taxYear}`, 20, 40);
    doc.text("ConciergeAI Compliance Desk", 140, 40);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.text("Business Entity Summary", 20, 65);
    doc.text(`Entity: ${data.companyName || 'Verified Expert'}`, 20, 75);
    doc.text(`Gross Revenue: £${data.grossRevenue.toLocaleString()}`, 20, 85);
    doc.text(`Est. Tax: £${data.estimatedTax.toLocaleString()}`, 20, 95);

    doc.setFontSize(9);
    const disclaimer = doc.splitTextToSize(accDict.disclaimerText, 170);
    doc.text(disclaimer, 20, 120);

    doc.save(`TaxYear_${data.taxYear}.pdf`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#d4af37' }}>
        <Zap className="animate-pulse" size={48} />
      </div>
    );
  }

  const isConnected = data?.isAccountantConnected || false;

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', position: 'relative' }}>
      
      {/* PROFESSIONAL GATEWAY HEADER */}
      <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.6rem', 
            backgroundColor: 'rgba(212, 175, 55, 0.1)', 
            padding: '0.4rem 1rem', 
            borderRadius: '100px',
            color: '#d4af37',
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            marginBottom: '1rem',
            border: '1px solid rgba(212, 175, 55, 0.2)'
          }}>
            <Globe size={14} /> {accDict.accountantGateway}
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', marginBottom: '0.6rem', letterSpacing: '-0.04em' }}>
            {accDict.title} <span style={{ color: '#d4af37' }}>& Compliance</span>
          </h1>
          <p style={{ color: '#666', fontSize: '1.2rem', fontWeight: 500, maxWidth: '700px' }}>
            {accDict.hmrcNotice}
          </p>
        </div>

        <div style={{ textAlign: 'right' }}>
           <div style={{ 
            backgroundColor: isConnected ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)', 
            padding: '0.8rem 1.5rem', 
            borderRadius: '16px', 
            border: `1px solid ${isConnected ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.1)'}`,
            color: isConnected ? '#22c55e' : '#888',
            fontSize: '0.9rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}>
            {isConnected ? <BadgeCheck size={20} /> : <AlertCircle size={20} />}
            {isConnected ? "GATEWAY: ACTIVE & AUTHORIZED" : "GATEWAY: STANDBY"}
          </div>
        </div>
      </div>

      {/* ACCOUNTANT PROMOTION & ACTION BOX */}
      <div style={{ 
        background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.8) 0%, rgba(10, 10, 10, 0.95) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        borderRadius: '32px',
        padding: '3rem',
        marginBottom: '3.5rem',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '4rem',
        boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Shine Effect */}
        <div style={{ 
          position: 'absolute', 
          top: '-50%', 
          left: '-20%', 
          width: '60%', 
          height: '200%', 
          background: 'linear-gradient(135deg, transparent, rgba(212, 175, 55, 0.03), transparent)', 
          transform: 'rotate(45deg)',
          pointerEvents: 'none'
        }} />

        <div>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 900, color: 'white', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>
            {accDict.accountantPromotion}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
              <div style={{ color: '#d4af37', flexShrink: 0 }}><ShieldCheck size={24} /></div>
              <div>
                <div style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem' }}>{accDict.tailoredQuote}</div>
                <p style={{ color: '#666', fontSize: '0.95rem' }}>{accDict.priceNotice}</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'flex-start' }}>
              <div style={{ color: '#d4af37', flexShrink: 0 }}><Zap size={24} /></div>
              <div>
                <div style={{ color: 'white', fontWeight: 800, fontSize: '1.1rem', marginBottom: '0.4rem' }}>{accDict.hassleFreeNotice}</div>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            {!isConnected ? (
              <button 
                onClick={handleAuthorize}
                disabled={submitting}
                style={{ 
                  flex: 1,
                  padding: '1.25rem',
                  borderRadius: '16px',
                  background: 'white',
                  color: 'black',
                  fontWeight: 900,
                  fontSize: '1rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.75rem',
                  transition: 'all 0.3s ease'
                }}
                className="hover-lift"
              >
                {submitting ? "Processing..." : accDict.connectAccountant} <ArrowRight size={18} />
              </button>
            ) : (
              <div style={{ 
                flex: 1, 
                backgroundColor: 'rgba(34, 197, 94, 0.1)', 
                color: '#22c55e', 
                padding: '1.25rem', 
                borderRadius: '16px', 
                fontWeight: 900,
                textAlign: 'center',
                border: '1px solid rgba(34, 197, 94, 0.2)'
              }}>
                GATEWAY CONNECTED
              </div>
            )}
            
            <a 
              href="https://wa.me/447441926613" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                padding: '0 1.5rem',
                borderRadius: '16px',
                backgroundColor: 'rgba(37, 211, 102, 0.1)',
                border: '1px solid rgba(37, 211, 102, 0.3)',
                color: '#25D366',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none'
              }}
              className="hover-lift"
            >
              <MessageSquare size={24} />
            </a>
          </div>
          <p style={{ marginTop: '1.5rem', color: '#444', fontSize: '0.8rem', fontWeight: 600 }}>
            {accDict.externalBillingNotice}
          </p>
        </div>

        {/* ELITE UNLOCKS PREVIEW */}
        <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.02)', borderRadius: '24px', padding: '2rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', color: '#d4af37', marginBottom: '2rem' }}>
            <BadgeCheck size={20} />
            <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>ELITE MERCHANT BENEFITS</span>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* HMRC Badge Incentive */}
            <div style={{ 
              opacity: isConnected ? 1 : 0.4, 
              padding: '1.5rem', 
              backgroundColor: isConnected ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
              border: `1px dashed ${isConnected ? '#22c55e' : '#333'}`,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              transition: 'all 0.5s ease'
            }}>
              {isConnected ? <BadgeCheck size={32} color="#22c55e" /> : <Lock size={32} color="#444" />}
              <div>
                <div style={{ color: isConnected ? 'white' : '#666', fontWeight: 800, fontSize: '1rem' }}>{accDict.eliteBenefitBadge}</div>
                <div style={{ color: '#444', fontSize: '0.85rem' }}>Auto-verify your compliance for customers.</div>
              </div>
            </div>

            {/* AI Audit Incentive */}
            <div style={{ 
              opacity: isConnected ? 1 : 0.4, 
              padding: '1.5rem', 
              backgroundColor: isConnected ? 'rgba(212, 175, 55, 0.05)' : 'transparent',
              border: `1px dashed ${isConnected ? '#d4af37' : '#333'}`,
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              transition: 'all 0.5s ease'
            }}>
              {isConnected ? <Zap size={32} color="#d4af37" /> : <Lock size={32} color="#444" />}
              <div>
                <div style={{ color: isConnected ? 'white' : '#666', fontWeight: 800, fontSize: '1rem' }}>{accDict.aiFinancialAudit}</div>
                <div style={{ color: '#444', fontSize: '0.85rem' }}>Deep profitability trends using platform data.</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FINANCIAL METRICS GRID */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', 
        gap: '2rem',
        marginBottom: '3.5rem'
      }}>
        <TaxMetricCard 
          title={accDict.grossRevenue}
          value={`£${data?.grossRevenue.toLocaleString()}`}
          description={accDict.grossRevenueDesc}
          icon={<BarChart size={24} />} 
        />
        <TaxMetricCard 
          title={accDict.taxPayable}
          value={`£${data?.estimatedTax.toLocaleString()}`}
          description={accDict.taxPayableDesc}
          icon={<Calculator size={24} />} 
        />
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
            <div style={{ color: '#666', fontSize: '0.9rem', fontWeight: 700 }}>{accDict.vatRadar}</div>
            <BadgeCheck size={20} color="#d4af37" />
          </div>
          <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white', marginBottom: '1rem' }}>
            {data?.vatProgress.toFixed(1)}%
          </div>
          <div style={{ height: '8px', backgroundColor: '#111', borderRadius: '40px', overflow: 'hidden', marginBottom: '1rem' }}>
            <div style={{ 
              width: `${Math.min(data?.vatProgress || 0, 100)}%`, 
              height: '100%', 
              background: 'linear-gradient(90deg, #d4af37, #f1c40f)',
              boxShadow: '0 0 15px rgba(212, 175, 55, 0.4)'
            }} />
          </div>
          <p style={{ color: '#444', fontSize: '0.8rem', fontWeight: 600 }}>{accDict.vatRadarDesc}</p>
        </div>
      </div>

      {/* MONTHLY BREAKDOWN */}
      <div style={{ animation: 'fadeIn 0.8s ease-out' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.75rem', fontWeight: 900, color: 'white', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Receipt size={28} color="#d4af37" /> {accDict.monthlyBreakdown}
          </h3>
          <div style={{ display: 'flex', gap: '1rem' }}>
             <button 
                onClick={exportAnnualReport}
                className="hover-lift"
                style={{
                  padding: '0.8rem 1.5rem',
                  borderRadius: '12px',
                  backgroundColor: 'white',
                  color: 'black',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem'
                }}
              >
                <Download size={18} /> {accDict.generateReport}
              </button>
          </div>
        </div>

        <div className="glass-panel" style={{ overflow: 'hidden', borderRadius: '24px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ backgroundColor: 'rgba(255,255,255,0.02)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <th style={{ padding: '1.5rem 2rem', color: '#666', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>Month</th>
                <th style={{ padding: '1.5rem 2rem', color: '#666', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>{accDict.revenue}</th>
                <th style={{ padding: '1.5rem 2rem', color: '#666', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>{accDict.fees}</th>
                <th style={{ padding: '1.5rem 2rem', color: '#666', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>{accDict.netProfit}</th>
                <th style={{ padding: '1.5rem 2rem', color: '#666', fontWeight: 800, textTransform: 'uppercase', fontSize: '0.75rem' }}>Action</th>
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
                        <Download size={14} /> Self-Audit PDF
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
      </div>

      {/* LEGAL FOOTER */}
      <div style={{ 
        marginTop: '5rem',
        borderTop: '1px solid rgba(255, 255, 255, 0.05)',
        paddingTop: '3rem',
        display: 'flex',
        gap: '2rem',
        alignItems: 'flex-start'
      }}>
        <AlertCircle size={20} color="#444" />
        <div>
           <h4 style={{ color: '#666', fontWeight: 800, fontSize: '0.85rem', marginBottom: '0.8rem', textTransform: 'uppercase' }}>
            {accDict.disclaimerTitle}
          </h4>
          <p style={{ color: '#333', fontSize: '0.8rem', lineHeight: '1.6', maxWidth: '900px' }}>
            {accDict.disclaimerText}
          </p>
        </div>
      </div>

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
        .hover-lift {
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .hover-lift:hover {
          transform: translateY(-4px);
          filter: brightness(1.1);
        }
        .glass-panel {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
        }
      `}</style>
    </div>
  );
}
