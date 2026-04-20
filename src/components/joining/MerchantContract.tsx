'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from '../LanguageContext';
import { ShieldCheck, AlertCircle } from 'lucide-react';

interface MerchantContractProps {
  onAccept: (accepted: boolean) => void;
  accepted: boolean;
}

export default function MerchantContract({ onAccept, accepted }: MerchantContractProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [hasReadToBottom, setHasReadToBottom] = useState(false);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollHeight - scrollTop <= clientHeight + 30) {
        setHasReadToBottom(true);
      }
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      if (scrollHeight <= clientHeight) {
        setHasReadToBottom(true);
      }
    }
  }, []);

  return (
    <div className="merchant-contract-container">
      <div className="contract-header">
        <div className="icon-glow">
          <ShieldCheck className="icon-main" size={32} />
        </div>
        <h3 style={{ color: 'white', fontSize: '1.75rem', fontWeight: 900 }}>
          {t?.onboarding?.contract?.title_zh || "入駐協議"}{" "}
          <span style={{ color: '#d4af37', opacity: 0.8 }}>{t?.onboarding?.contract?.title || "Expert Terms"}</span>
        </h3>
      </div>

      <div 
        className="contract-box" 
        onScroll={handleScroll}
        ref={scrollRef}
        style={{ 
          backgroundColor: 'rgba(15, 15, 15, 0.8)',
          border: '1px solid rgba(212, 175, 55, 0.1)',
          borderRadius: '24px',
          boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)'
        }}
      >
        <div className="contract-content">
          {t?.onboarding?.contract?.content ? (
            (t.onboarding.contract.content as {title: string, body: string}[]).map((section, idx) => (
              <div key={idx} style={{ marginBottom: '24px' }}>
                <h4 style={{ color: '#d4af37', marginTop: idx === 0 ? '0' : '24px', marginBottom: '8px', fontSize: '1.1rem', fontWeight: 800 }}>
                  {section.title}
                </h4>
                {section.body.split('\n').map((line, i) => (
                  <p key={i} style={{ color: '#aaa', margin: '4px 0', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {line}
                  </p>
                ))}
              </div>
            ))
          ) : (
            <>
              <h4 style={{ color: '#d4af37' }}>{t?.onboarding?.contract?.clauses?.platform_fee?.title || "1. Platform Fees"}</h4>
              <p>{t?.onboarding?.contract?.clauses?.platform_fee?.body || "Standard platform commissions apply."}</p>
              <h4 style={{ color: '#d4af37' }}>{t?.onboarding?.contract?.clauses?.payments?.title || "2. Payments"}</h4>
              <p>{t?.onboarding?.contract?.clauses?.payments?.body || "Payouts are handled securely."}</p>
              <h4 style={{ color: '#d4af37' }}>{t?.onboarding?.contract?.clauses?.conduct?.title || "3. Conduct"}</h4>
              <p>{t?.onboarding?.contract?.clauses?.conduct?.body || "Professional conduct is mandatory."}</p>
            </>
          )}

          <div className="contract-legal" style={{ borderTop: '1px solid rgba(212, 175, 55, 0.1)', color: '#666', marginTop: '32px', paddingTop: '24px' }}>
            <p><strong>{t?.onboarding?.contract?.legal_notice ? "" : "Additional Terms:"}</strong> {t?.onboarding?.contract?.legal_notice || "By joining ConciergeAI, you certify that all information provided is accurate and that you possess the necessary insurance and licenses required to practice in the United Kingdom."}</p>
            <p>{t?.onboarding?.contract?.copyright || "© 2026 ConciergeAI UK Limited. All Rights Reserved."}</p>
          </div>
        </div>
      </div>
      <div className="contract-footer">
        {!hasReadToBottom && (
          <div className="scroll-hint">
            <AlertCircle size={16} />
            <span>{t?.onboarding?.contract?.scrollingNotice || "Scroll to bottom to continue"}</span>
          </div>
        )}
        <label className={`agree-label ${!hasReadToBottom ? 'disabled' : ''} ${accepted ? 'accepted' : ''}`}>
          <div className="checkbox-custom">
            <input 
              type="checkbox" 
              checked={accepted} 
              onChange={(e) => onAccept(e.target.checked)}
              disabled={!hasReadToBottom}
            />
          </div>
          <span className="check-text">{t?.onboarding?.contract?.agree || "I agree to the terms"}</span>
        </label>
      </div>

      <style jsx>{`
        .merchant-contract-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }

        .contract-header {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          margin-bottom: 32px;
          text-align: center;
        }

        .icon-glow {
          width: 64px;
          height: 64px;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #d4af37;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.2);
        }

        .contract-box {
          height: 350px;
          overflow-y: auto;
          padding: 40px;
          margin-bottom: 32px;
          scrollbar-width: thin;
          scrollbar-color: #d4af37 transparent;
        }

        .contract-content h4 {
          margin-top: 32px;
          margin-bottom: 12px;
          font-size: 1.15rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .contract-content p {
          color: #888;
          line-height: 1.8;
          font-size: 1rem;
          margin-bottom: 20px;
          font-weight: 500;
        }

        .contract-legal {
          margin-top: 48px;
          padding-top: 24px;
          font-size: 0.9rem;
        }

        .contract-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
        }

        .scroll-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          background: rgba(212, 175, 55, 0.1);
          color: #d4af37;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 700;
          border: 1px solid rgba(212, 175, 55, 0.2);
        }

        .agree-label {
          display: flex;
          align-items: center;
          gap: 14px;
          font-weight: 700;
          cursor: pointer;
          padding: 14px 32px;
          border-radius: 99px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.02);
        }

        .agree-label:hover:not(.disabled) {
          border-color: #d4af37;
          background: rgba(212, 175, 55, 0.05);
        }

        .agree-label.accepted {
          border-color: #d4af37;
          background: rgba(212, 175, 55, 0.1);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
        }

        .agree-label.disabled {
          opacity: 0.3;
          cursor: not-allowed;
          filter: grayscale(1);
        }

        .check-text {
          color: white;
          font-size: 1rem;
        }

        input[type="checkbox"] {
          width: 22px;
          height: 22px;
          accent-color: #d4af37;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
