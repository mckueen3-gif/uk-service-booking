"use client";

import React from 'react';
import { ShieldCheck, Award, CheckCircle2, Shield, Lock, Star } from 'lucide-react';
import { useTranslation } from "@/components/LanguageContext";
import { interpolate } from "@/lib/i18n/interpolate";

interface EliteTrustSealProps {
  isVerified?: boolean;
  insuranceAmount?: number;
  rating?: string | number;
  totalJobs?: number;
}

export default function EliteTrustSeal({ 
  isVerified = true, 
  insuranceAmount, 
  rating = "5.0", 
  totalJobs = 120 
}: EliteTrustSealProps) {
  const { t } = useTranslation();

  return (
    <div className="elite-seal-container" style={{
      position: 'relative',
      padding: '24px',
      borderRadius: '24px',
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1505 100%)',
      border: '1px solid rgba(212, 175, 55, 0.4)',
      boxShadow: '0 20px 40px rgba(0,0,0,0.5), inset 0 0 20px rgba(212, 175, 55, 0.1)',
      overflow: 'hidden',
      maxWidth: '320px',
      margin: '0 auto'
    }}>
      {/* Dynamic Background Glow */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)',
        animation: 'spin 10s linear infinite',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #d4af37, #f5e07a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#000',
            boxShadow: '0 8px 20px rgba(212, 175, 55, 0.4)'
          }}>
            <Award size={28} />
          </div>
          <div>
            <div style={{ 
              fontSize: '0.7rem', 
              fontWeight: 900, 
              color: '#d4af37', 
              textTransform: 'uppercase', 
              letterSpacing: '0.15em',
              marginBottom: '2px'
            }}>
              ConciergeAI
            </div>
            <div style={{ 
              fontSize: '1.2rem', 
              fontWeight: 950, 
              color: '#fff', 
              letterSpacing: '-0.02em' 
            }}>
              {t.merchant_public?.seal_title || "Elite Trust Seal"}
            </div>
          </div>
        </div>

        {/* Metrics List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Verification */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#d4af37', display: 'flex' }}>
              <ShieldCheck size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>{t.merchant_public?.verified_identity || "Verified Identity"}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{t.merchant_public?.kyc_checked || "KYC & Credentials Checked"}</div>
            </div>
            <div style={{ color: '#10b981' }}><CheckCircle2 size={16} /></div>
          </div>

          {/* Insurance */}
          {insuranceAmount && insuranceAmount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ color: '#d4af37', display: 'flex' }}>
                <Shield size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>{t.merchant_public?.liability_insured || "Liability Insured"}</div>
                <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>
                  {t.merchant_public?.insured_upto ? interpolate(t.merchant_public.insured_upto, { amount: insuranceAmount.toLocaleString() }) : `Up to £${insuranceAmount.toLocaleString()}`}
                </div>
              </div>
              <div style={{ color: '#10b981' }}><CheckCircle2 size={16} /></div>
            </div>
          )}

          {/* Safe Payments */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ color: '#d4af37', display: 'flex' }}>
              <Lock size={20} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#fff' }}>{t.merchant_public?.safe_payments || "Safe Payments"}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>{t.merchant_public?.protection_desc || "Escrow & Dispute Protection"}</div>
            </div>
            <div style={{ color: '#10b981' }}><CheckCircle2 size={16} /></div>
          </div>
        </div>

        {/* Dynamic Footer Rating */}
        <div style={{ 
          marginTop: '24px', 
          paddingTop: '20px', 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Star size={16} fill="#d4af37" color="#d4af37" />
            <span style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff' }}>{rating}</span>
          </div>
          <div style={{ 
            fontSize: '0.75rem', 
            fontWeight: 700, 
            color: 'rgba(255,255,255,0.4)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {t.merchant_public?.completed_jobs ? interpolate(t.merchant_public.completed_jobs, { count: totalJobs }) : `${totalJobs}+ Completed`}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .elite-seal-container {
          animation: float-slow 4s ease-in-out infinite;
          transition: transform 0.3s ease;
        }
        .elite-seal-container:hover {
          transform: translateY(-5px) scale(1.02);
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
