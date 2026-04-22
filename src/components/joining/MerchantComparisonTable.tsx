'use client';

import React from 'react';
import { Check, X, ShieldCheck, Zap, TrendingUp, Users, Crown } from 'lucide-react';
import { useTranslation } from '@/components/LanguageContext';

const MerchantComparisonTable = () => {
  const { t } = useTranslation();

  const comparisonData = [
    {
      feature: t?.comparison_table?.rows?.commission?.title || 'Commission Fees',
      others: t?.comparison_table?.rows?.commission?.others || '15% - 30% Per Job',
      concierge: t?.comparison_table?.rows?.commission?.concierge || '10% Commission for All Experts',
      isHighlight: true
    },
    {
      feature: t?.comparison_table?.rows?.response_fees?.title || 'Response / Lead Fees',
      others: t?.comparison_table?.rows?.response_fees?.others || 'Paid Credits Required',
      concierge: t?.comparison_table?.rows?.response_fees?.concierge || 'ALWAYS £0 (Free Responses)',
      isHighlight: true
    },
    {
      feature: t?.comparison_table?.rows?.client_calibre?.title || 'Client Calibre',
      others: t?.comparison_table?.rows?.client_calibre?.others || 'Mass Market',
      concierge: t?.comparison_table?.rows?.client_calibre?.concierge || 'Diverse Client Base',
      isHighlight: false
    },
    {
      feature: t?.comparison_table?.rows?.earnings_model?.title || 'Earnings Model',
      others: t?.comparison_table?.rows?.earnings_model?.others || 'One-off Income',
      concierge: t?.comparison_table?.rows?.earnings_model?.concierge || 'Referral Dividends (5 Years) Vouchers',
      isHighlight: true
    },
    {
      feature: t?.comparison_table?.rows?.verification?.title || 'Verification',
      others: t?.comparison_table?.rows?.verification?.others || 'Manual / Slow',
      concierge: t?.comparison_table?.rows?.verification?.concierge || 'SMART AI',
      isHighlight: false
    },
    {
      feature: t?.comparison_table?.rows?.marketing_support?.title || 'Marketing Support',
      others: t?.comparison_table?.rows?.marketing_support?.others || 'Paid Ads Required',
      concierge: t?.comparison_table?.rows?.marketing_support?.concierge || 'Fair Global Automated Matching (Discovery Mode)',
      isHighlight: false
    },
    {
      feature: t?.comparison_table?.rows?.communication?.title || 'Communication',
      others: t?.comparison_table?.rows?.communication?.others || 'Scattered (Phone/WhatsApp)',
      concierge: t?.comparison_table?.rows?.communication?.concierge || 'Nexus Secure Real-time Chat',
      isHighlight: false
    },
    {
      feature: t?.comparison_table?.rows?.booking_system?.title || 'Booking System',
      others: t?.comparison_table?.rows?.booking_system?.others || 'Manual / Fragmented',
      concierge: t?.comparison_table?.rows?.booking_system?.concierge || 'Intelligent Automated Scheduling',
      isHighlight: false
    },
    {
      feature: t?.comparison_table?.rows?.toolkit?.title || 'Technical Toolkit',
      others: t?.comparison_table?.rows?.toolkit?.others || 'Basic Booking Records',
      concierge: t?.comparison_table?.rows?.toolkit?.concierge || 'AI Diagnosis & Asset Management',
      isHighlight: false
    },
    {
      feature: t?.comparison_table?.rows?.data_sovereignty?.title || 'Data Sovereignty',
      others: t?.comparison_table?.rows?.data_sovereignty?.others || 'Legacy Platform Controlled',
      concierge: t?.comparison_table?.rows?.data_sovereignty?.concierge || 'Decentralized Expert Identity',
      isHighlight: false
    },
    {
      feature: t?.comparison_table?.rows?.growth?.title || 'Professional Growth',
      others: t?.comparison_table?.rows?.growth?.others || 'Zero Resources Provided',
      concierge: t?.comparison_table?.rows?.growth?.concierge || 'Education Hub & Mentorship',
      isHighlight: false
    }
  ];

  return (
    <div className="comparison-wrapper">
      <div className="table-container">
        <div className="table-header">
          <div className="header-cell feature-col">{t?.comparison_table?.header_features || "Features"}</div>
          <div className="header-cell platforms">{t?.comparison_table?.header_others || "Legacy Platforms"}</div>
          <div className="header-cell branding">
            <div className="brand-badge">
              <Crown size={14} className="gold-text" />
              <span>ConciergeAI</span>
            </div>
          </div>
        </div>

        <div className="table-body">
          {comparisonData.map((row, idx) => (
            <div key={idx} className={`table-row ${row.isHighlight ? 'highlighted' : ''}`}>
              <div className="cell feature-col">
                <span className="feature-text">{row.feature}</span>
              </div>
              <div className="cell others">
                <div className="mobile-label">{t?.comparison_table?.label_legacy || "Legacy: "}</div>
                <div className="val-flex">
                  <X size={16} className="text-red" />
                  <span>{row.others}</span>
                </div>
              </div>
              <div className="cell concierge">
                <div className="mobile-label">{t?.comparison_table?.label_concierge || "ConciergeAI: "}</div>
                <div className="val-flex gold-text">
                  <Check size={18} className="gold-glow" />
                  <span className="weight-bold">{row.concierge}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .comparison-wrapper {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          background: rgba(10, 10, 10, 0.4);
          border-radius: 24px;
          padding: 2px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, transparent 40%, rgba(212, 175, 55, 0.1) 100%);
          box-shadow: 0 40px 100px rgba(0, 0, 0, 0.8);
        }

        .table-container {
          background: #050505;
          border-radius: 22px;
          overflow: hidden;
          width: 100%;
        }

        .table-header {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          background: rgba(212, 175, 55, 0.05);
          border-bottom: 1px solid rgba(212, 175, 55, 0.1);
        }

        .header-cell {
          padding: 24px;
          font-size: 0.85rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #94a3b8;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .feature-col {
          justify-content: flex-start;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
        }

        .brand-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(212, 175, 55, 0.1);
          padding: 8px 16px;
          border-radius: 100px;
          border: 1px solid rgba(212, 175, 55, 0.2);
          color: white;
          font-weight: 900;
        }

        .gold-text {
          color: #d4af37;
        }

        .table-row {
          display: grid;
          grid-template-columns: 1.2fr 1fr 1fr;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          transition: all 0.3s ease;
        }

        .table-row:last-child {
          border-bottom: none;
        }

        .table-row:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .table-row.highlighted {
          background: rgba(212, 175, 55, 0.02);
        }

        .cell {
          padding: 20px 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.95rem;
          color: #cbd5e1;
        }

        .cell.feature-col {
          justify-content: flex-start;
          font-weight: 600;
          color: #94a3b8;
        }

        .val-flex {
          display: flex;
          align-items: center;
          gap: 10px;
          text-align: center;
        }

        .text-red {
          color: #ef4444;
          opacity: 0.6;
        }

        .gold-glow {
          filter: drop-shadow(0 0 5px rgba(212, 175, 55, 0.5));
        }

        .weight-bold {
          font-weight: 800;
        }

        .mobile-label {
          display: none;
        }

        @media (max-width: 768px) {
          .table-header {
            display: none;
          }

          .table-row {
            grid-template-columns: 1fr;
            padding: 20px;
            gap: 12px;
          }

          .cell {
            padding: 0;
            justify-content: flex-start;
          }

          .cell.feature-col {
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(212, 175, 55, 0.1);
            margin-bottom: 8px;
            font-size: 1.1rem;
            color: #d4af37;
          }

          .mobile-label {
            display: block;
            min-width: 100px;
            font-size: 0.75rem;
            font-weight: 800;
            text-transform: uppercase;
            color: #64748b;
          }

          .feature-col {
            border-right: none;
          }
        }
      `}</style>
    </div>
  );
};

export default MerchantComparisonTable;
