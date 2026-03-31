'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/components/LanguageContext';
import OnboardingHero from '@/components/joining/OnboardingHero';
import SectorSelector from '@/components/joining/SectorSelector';
import MerchantContract from '@/components/joining/MerchantContract';
import { ChevronRight, ChevronLeft, CheckCircle2, Building2, Mail, Globe, User, Loader2 } from 'lucide-react';
import { createMerchantAction } from '@/app/actions/merchant';

export default function JoinPage() {
  const { t, locale } = useTranslation();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [contractAccepted, setContractAccepted] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    website: '',
    bio: '',
    credentials: '',
    promoCode: ''
  });

  const nextStep = () => {
    if (step === 1 && !selectedSector) return;
    if (step === 3 && !contractAccepted) return;
    setStep(step + 1);
  };

  const prevStep = () => setStep(Math.max(0, step - 1));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await createMerchantAction({
        ...formData,
        sector: selectedSector as string
      });
      if (res.error) {
        setError(res.error);
      } else {
        setStep(4);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.businessName && formData.email;

  return (
    <div className={`join-layout ${locale === 'ar' || locale === 'ur' ? 'rtl' : 'ltr'}`}>
      <div className="join-container">
        
        {/* Step Indicator Top Bar */}
        <div className="onboarding-stepper">
          <div className={`step-item ${step >= 1 ? 'active' : ''}`}>1. {t.onboarding.steps.profile}</div>
          <div className="line" />
          <div className={`step-item ${step >= 2 ? 'active' : ''}`}>2. {t.onboarding.steps.credentials}</div>
          <div className="line" />
          <div className={`step-item ${step >= 3 ? 'active' : ''}`}>3. {t.onboarding.steps.contract}</div>
        </div>

        <main className="content-area">
          {step === 0 && (
            <div className="step-0 flex-col">
              <OnboardingHero />
              <button 
                className="btn btn-primary float-btn stagger-2 reveal active"
                onClick={() => setStep(1)}
              >
                {t.onboarding.buttons.start} <ChevronRight size={20} />
              </button>
            </div>
          )}

          {step === 1 && (
            <div className="step-1 reveal active">
              <SectorSelector 
                selectedSector={selectedSector} 
                onSelect={(sector) => setSelectedSector(sector)} 
              />
              <div className="controls">
                <button className="btn btn-ghost" onClick={prevStep}>
                  <ChevronLeft size={20} /> {t.onboarding.buttons.back}
                </button>
                <button 
                  className={`btn btn-primary ${!selectedSector ? 'disabled' : ''}`}
                  onClick={nextStep}
                  disabled={!selectedSector}
                >
                  {t.onboarding.buttons.next} <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="step-2 reveal active">
              <div className="glass-panel form-card">
                <h2 className="form-title">Business Information</h2>
                <p className="form-intro">Tell us about your professional expertise.</p>
                
                <div className="form-grid">
                  <div className="input-group">
                    <label><Building2 size={16} /> Business Name</label>
                    <input 
                      type="text" 
                      name="businessName" 
                      value={formData.businessName} 
                      onChange={handleInputChange} 
                      placeholder="e.g. Elite Accounting Services"
                    />
                  </div>
                  <div className="input-group">
                    <label><Mail size={16} /> Contact Email</label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email} 
                      onChange={handleInputChange} 
                      placeholder="contact@business.com"
                    />
                  </div>
                  <div className="input-group full">
                    <label><Globe size={16} /> Website / Portfolio (Optional)</label>
                    <input 
                      type="text" 
                      name="website" 
                      value={formData.website} 
                      onChange={handleInputChange} 
                      placeholder="https://..."
                    />
                  </div>
                  <div className="input-group full">
                    <label><User size={16} /> Qualifications & Credentials</label>
                    <textarea 
                      name="credentials" 
                      value={formData.credentials} 
                      onChange={handleInputChange}
                      placeholder={selectedSector === 'professional' ? "Enter ACCA/Legal certificates..." : "Enter technical certifications..."}
                      rows={3}
                    />
                  </div>
                  <div className="input-group full">
                    <label style={{ color: 'var(--accent-color)' }}><CheckCircle2 size={16} /> Promo Code (Optional)</label>
                    <input 
                      type="text" 
                      name="promoCode" 
                      value={formData.promoCode} 
                      onChange={handleInputChange} 
                      placeholder="e.g. FREE10 or JOIN5"
                      style={{ border: '2px dashed var(--accent-color)', background: 'rgba(99, 102, 241, 0.05)' }}
                    />
                  </div>
                </div>

                <div className="controls">
                  <button className="btn btn-ghost" onClick={prevStep}>
                    <ChevronLeft size={20} /> {t.onboarding.buttons.back}
                  </button>
                  <button 
                    className={`btn btn-primary ${!isFormValid ? 'disabled' : ''}`}
                    onClick={nextStep}
                    disabled={!isFormValid}
                  >
                    {t.onboarding.buttons.next} <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="step-3 reveal active">
              <MerchantContract 
                accepted={contractAccepted} 
                onAccept={(val) => setContractAccepted(val)} 
              />
              
              {error && (
                <div style={{ color: '#ef4444', textAlign: 'center', marginTop: '1rem', fontWeight: 600 }}>
                  {error}
                </div>
              )}

              <div className="controls">
                <button className="btn btn-ghost" onClick={prevStep}>
                  <ChevronLeft size={20} /> {t.onboarding.buttons.back}
                </button>
                <button 
                  className={`btn btn-primary ${!contractAccepted || loading ? 'disabled' : ''}`}
                  onClick={handleSubmit}
                  disabled={!contractAccepted || loading}
                >
                  {loading ? <Loader2 className="animate-spin" /> : <>{t.onboarding.buttons.submit} <CheckCircle2 size={20} /></>}
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="step-success reveal active">
              <div className="success-card glass-panel">
                <div className="animated-check">
                  <CheckCircle2 color="var(--accent-color)" size={80} />
                </div>
                <h2>Application Submitted!</h2>
                <p>Welcome to ServiceHub. Our team is now reviewing your credentials for {selectedSector} sector. You will receive an email within 24 hours.</p>
                <button className="btn btn-primary" onClick={() => window.location.href = '/'}>
                  Return to Home
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .join-layout {
          min-height: 100vh;
          background-color: var(--bg-primary);
          padding-top: 40px;
        }

        .join-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px 80px;
        }

        .onboarding-stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 20px;
          margin-bottom: 40px;
        }

        .step-item {
          font-weight: 700;
          color: var(--text-muted);
          font-size: 0.9rem;
          opacity: 0.6;
        }

        .step-item.active {
          color: var(--accent-color);
          opacity: 1;
        }

        .line {
          width: 40px;
          height: 2px;
          background: var(--surface-3);
        }

        .content-area {
          min-height: 500px;
        }

        .flex-col {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .controls {
          display: flex;
          justify-content: center;
          gap: 20px;
          margin-top: 40px;
        }

        .form-card {
          max-width: 600px;
          margin: 0 auto;
          padding: 40px;
        }

        .form-title {
          margin-bottom: 8px;
        }

        .form-intro {
          color: var(--text-muted);
          margin-bottom: 32px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .input-group.full {
          grid-column: span 2;
        }

        .input-group label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          margin-bottom: 8px;
          color: var(--text-secondary);
        }

        input, textarea {
          width: 100%;
          padding: 12px 16px;
          background: var(--surface-2);
          border: 1px solid var(--border-color);
          border-radius: 12px;
          color: var(--text-primary);
          outline: none;
          transition: border-color 0.3s;
        }

        input:focus, textarea:focus {
          border-color: var(--accent-color);
        }

        .btn-ghost {
          background: transparent;
          color: var(--text-muted);
          border: 1px solid var(--border-color);
        }

        .btn-ghost:hover {
          background: var(--surface-2);
        }

        .success-card {
          text-align: center;
          padding: 60px;
          max-width: 600px;
          margin: 40px auto;
        }

        .animated-check {
          margin-bottom: 24px;
          animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes scaleIn {
          from { transform: scale(0.5); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }

        .disabled {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          .input-group.full {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
}
