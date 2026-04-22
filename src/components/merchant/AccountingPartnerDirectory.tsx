'use client';

import React from 'react';
import { 
  Calculator, 
  ShieldCheck, 
  FileText, 
  Users, 
  TrendingUp, 
  ExternalLink,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { useTranslation } from '@/components/LanguageContext';

const AccountingPartnerDirectory = () => {
  const { t } = useTranslation();
  
  // Note: We can add these to translations later, using hardcoded for now to show design
  const partners = [
    {
      name: "Elite Tax Solutions UK",
      type: "Certified Partner",
      specialty: "VAT, Bookkeeping & HMRC",
      rating: 4.9,
      features: ["Monthly Bookkeeping", "Quarterly VAT Returns", "HMRC Representation"],
      accent: "#d4af37"
    },
    {
      name: "SmartPayroll Pros",
      type: "Payroll Specialist",
      specialty: "Employee & CIS Payroll",
      rating: 4.8,
      features: ["Automatic Payslips", "Pension Auto-enrolment", "CIS Subcontractor Filing"],
      accent: "#38bdf8"
    }
  ];

  return (
    <div style={{ marginTop: '24px', marginBottom: '40px' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'baseline',
        marginBottom: '20px'
      }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.025em' }}>
          Certified Accounting Partners <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>專業會計支援</span>
        </h2>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '20px' 
      }}>
        {partners.map((partner, idx) => (
          <div key={idx} style={{
            backgroundColor: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            borderRadius: '24px',
            padding: '24px',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 0.3s ease'
          }} className="partner-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ 
                backgroundColor: 'rgba(212, 175, 55, 0.1)', 
                padding: '4px 12px', 
                borderRadius: '100px',
                border: '1px solid rgba(212, 175, 55, 0.2)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <ShieldCheck size={14} color="#d4af37" />
                <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#d4af37', textTransform: 'uppercase' }}>Verified Partner</span>
              </div>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '4px' }}>{partner.name}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px' }}>{partner.specialty}</p>

            <div style={{ 
              backgroundColor: 'rgba(255,255,255,0.03)', 
              borderRadius: '16px', 
              padding: '16px',
              marginBottom: '20px'
            }}>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {partner.features.map((f, i) => (
                  <li key={i} style={{ 
                    fontSize: '0.8rem', 
                    color: '#e2e8f0', 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '8px'
                  }}>
                    <CheckCircle2 size={14} color="#10b981" /> {f}
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: 'auto', display: 'flex', gap: '12px' }}>
              <button style={{
                flex: 1,
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: '#ffffff',
                color: '#000000',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}>
                Book Consultation
              </button>
              <button style={{
                padding: '12px',
                borderRadius: '12px',
                backgroundColor: 'rgba(255,255,255,0.05)',
                color: '#ffffff',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer'
              }}>
                <ExternalLink size={18} />
              </button>
            </div>
          </div>
        ))}

        {/* Locked / Coming Soon Section */}
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.01)',
          border: '1px dashed rgba(255, 255, 255, 0.1)',
          borderRadius: '24px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '260px',
          textAlign: 'center'
        }}>
          <div style={{ 
            backgroundColor: 'rgba(255,255,255,0.03)', 
            padding: '16px', 
            borderRadius: '100px',
            marginBottom: '16px'
          }}>
            <Lock size={24} color="#475569" />
          </div>
          <h4 style={{ color: '#475569', fontWeight: 800 }}>More Partners Coming</h4>
          <p style={{ color: '#475569', fontSize: '0.8rem' }}>Expanding our network of elite services</p>
        </div>
      </div>

      <style jsx>{`
        .partner-card:hover {
          background-color: rgba(255, 255, 255, 0.04) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          transform: translateY(-4px);
          box-shadow: 0 12px 24px rgba(0,0,0,0.2);
        }
      `}</style>
    </div>
  );
};

export default AccountingPartnerDirectory;
