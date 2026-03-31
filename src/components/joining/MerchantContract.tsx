'use client';

import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from '../LanguageContext';
import { FileText, ShieldCheck, AlertCircle } from 'lucide-react';

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
      // If we are within 20px of the bottom
      if (scrollHeight - scrollTop <= clientHeight + 20) {
        setHasReadToBottom(true);
      }
    }
  };

  useEffect(() => {
    // Initial check if content is already short
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
        <ShieldCheck className="icon-main" />
        <h3>{t.onboarding.contract.title}</h3>
      </div>

      <div 
        className="contract-box glass-panel" 
        onScroll={handleScroll}
        ref={scrollRef}
      >
        <div className="contract-content">
          <h4>{t.onboarding.contract.clauses.commission.title}</h4>
          <p>{t.onboarding.contract.clauses.commission.body}</p>

          <h4>{t.onboarding.contract.clauses.service.title}</h4>
          <p>{t.onboarding.contract.clauses.service.body}</p>

          <h4>{t.onboarding.contract.clauses.disputes.title}</h4>
          <p>{t.onboarding.contract.clauses.disputes.body}</p>
          
          <div className="contract-legal">
            <p><strong>Additional Terms:</strong> By joining ServiceHub, you certify that all information provided is accurate and that you possess the necessary insurance and licenses required to practice in the United Kingdom.</p>
            <p>© 2026 ServiceHub UK Limited. All Rights Reserved.</p>
          </div>
        </div>
      </div>

      <div className="contract-footer">
        {!hasReadToBottom && (
          <div className="scroll-hint">
            <AlertCircle size={16} />
            <span>{t.onboarding.contract.scrollingNotice}</span>
          </div>
        )}
        
        <label className={`agree-label ${!hasReadToBottom ? 'disabled' : ''}`}>
          <input 
            type="checkbox" 
            checked={accepted} 
            onChange={(e) => onAccept(e.target.checked)}
            disabled={!hasReadToBottom}
          />
          <span className="check-text">{t.onboarding.contract.agree}</span>
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
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
          justify-content: center;
        }

        .icon-main {
          color: var(--accent-color);
        }

        .contract-box {
          height: 300px;
          overflow-y: auto;
          padding: 30px;
          margin-bottom: 24px;
          scrollbar-width: thin;
          scrollbar-color: var(--accent-color) transparent;
        }

        .contract-content h4 {
          margin-top: 24px;
          margin-bottom: 12px;
          color: var(--text-primary);
          font-size: 1.1rem;
        }

        .contract-content p {
          color: var(--text-muted);
          line-height: 1.7;
          font-size: 0.95rem;
          margin-bottom: 16px;
        }

        .contract-legal {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px dashed var(--border-color);
          font-size: 0.85rem ! from dictionary;
        }

        .contract-footer {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .scroll-hint {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: rgba(255, 152, 0, 0.1);
          color: #f59e0b;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .agree-label {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          cursor: pointer;
          padding: 12px 24px;
          border-radius: 99px;
          transition: all 0.3s;
          border: 1px solid var(--border-color);
        }

        .agree-label:hover:not(.disabled) {
          background: var(--accent-soft);
          border-color: var(--accent-color);
        }

        .agree-label.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: grayscale(1);
        }

        .check-text {
          color: var(--text-primary);
        }

        input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: var(--accent-color);
        }
      `}</style>
    </div>
  );
}
