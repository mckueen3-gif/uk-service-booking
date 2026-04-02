'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/components/LanguageContext';
import OnboardingHero from '@/components/joining/OnboardingHero';
import SectorSelector from '@/components/joining/SectorSelector';
import MerchantContract from '@/components/joining/MerchantContract';
import LiveProfilePreview from '@/components/joining/LiveProfilePreview';
import { ChevronRight, ChevronLeft, CheckCircle2, Building2, Mail, Globe, User, Loader2, MapPin, Sparkles, Wand2, Calculator, Gift, ShieldCheck } from 'lucide-react';
import { createMerchantAction } from '@/app/actions/merchant';
import { fetchBusinessInfoWithAI } from '@/app/actions/ai_onboarding';

export default function JoinPage() {
  const { t, locale } = useTranslation();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [contractAccepted, setContractAccepted] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    website: '',
    bio: '',
    credentials: '',
    city: 'London',
    promoCode: ''
  });

  const nextStep = () => {
    if (step === 1 && !selectedSector) return;
    if (step === 3 && !contractAccepted) return;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(step + 1);
  };

  const prevStep = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStep(Math.max(0, step - 1));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Simulate promo code validation
    if (name === 'promoCode') {
      if (value.toUpperCase() === 'FREE10' || value.toUpperCase() === 'ELITE') {
        setPromoApplied(true);
      } else {
        setPromoApplied(false);
      }
    }
  };

  const handleAIPreFill = async () => {
    if (!formData.website) {
      setError("Please enter a website URL first.");
      return;
    }
    setAiLoading(true);
    setError(null);
    try {
      const data = await fetchBusinessInfoWithAI(formData.website);
      if (data.error) {
        setError(data.error);
      } else {
        setFormData(prev => ({
          ...prev,
          businessName: data.businessName || prev.businessName,
          bio: data.bio || prev.bio
        }));
        if (data.sector) setSelectedSector(data.sector);
      }
    } catch (err) {
      setError("AI was unable to fetch information. Please fill manually.");
    } finally {
      setAiLoading(false);
    }
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
          {[1, 2, 3].map((num) => (
            <React.Fragment key={num}>
              <div className={`step-item ${step >= num ? 'active' : ''}`}>
                <div className="step-num">{num}</div>
                <span>{num === 1 ? t.onboarding.steps.profile : num === 2 ? t.onboarding.steps.credentials : t.onboarding.steps.contract}</span>
              </div>
              {num < 3 && <div className={`line ${step > num ? 'active' : ''}`} />}
            </React.Fragment>
          ))}
        </div>

        <main className="content-area">
          {step === 0 && (
            <div className="step-0 flex-col">
              <OnboardingHero />
              <button 
                className="btn-premium"
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
                <button className="btn-secondary" onClick={prevStep}>
                  <ChevronLeft size={20} /> {t.onboarding.buttons.back}
                </button>
                <button 
                  className={`btn-premium ${!selectedSector ? 'disabled' : ''}`}
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
              <div className="onboarding-grid">
                {/* Form Side */}
                <div className="form-card">
                  <div className="card-header">
                    <h2 className="form-title">專家商務資訊 <span style={{ color: '#d4af37' }}>Expert Profile</span></h2>
                    <p className="form-intro">請告訴我們您的專業背景，以便我們為您對接優質客戶。</p>
                  </div>
                  
                  <div className="form-grid">
                    <div className="input-group full ai-fetch-group">
                      <label><Globe size={16} /> 您的官方網站 / LinkedIn (可選 AI 自動填寫)</label>
                      <div className="input-with-button">
                        <input 
                          type="text" 
                          name="website" 
                          value={formData.website} 
                          onChange={handleInputChange} 
                          placeholder="https://yourwebsite.com"
                        />
                        <button 
                          className={`ai-fill-btn ${aiLoading ? 'loading' : ''}`} 
                          onClick={handleAIPreFill}
                          disabled={aiLoading || !formData.website}
                        >
                          {aiLoading ? <Loader2 className="animate-spin" size={16} /> : <Wand2 size={16} />}
                          <span>AI 智能填寫</span>
                        </button>
                      </div>
                    </div>

                    <div className="input-group">
                      <label><Building2 size={16} /> 商號名稱 (Business Name)</label>
                      <input 
                        type="text" 
                        name="businessName" 
                        value={formData.businessName} 
                        onChange={handleInputChange} 
                        placeholder="例如: Elite Accounting Services"
                      />
                    </div>
                    <div className="input-group">
                      <label><Mail size={16} /> 聯絡電子郵件 (Contact Email)</label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        placeholder="contact@business.com"
                      />
                    </div>
                    
                    <div className="input-group full">
                      <label><User size={16} /> 專業背景與資質 (Credentials)</label>
                      <textarea 
                        name="credentials" 
                        value={formData.credentials} 
                        onChange={handleInputChange}
                        placeholder={selectedSector === 'professional' ? "例如: ACCA 會計師, 10年英國稅務經驗..." : "輸入您的技術認證..."}
                        rows={3}
                      />
                      <small style={{ color: '#666', marginTop: '4px', display: 'block' }}>注意: 您可以先填寫基本資料，詳細證件可在進入後台後上傳審核。</small>
                    </div>

                    <div className="input-group full">
                      <label><MapPin size={16} /> 核心服務區域 (Primary City)</label>
                      <select 
                        name="city" 
                        value={formData.city} 
                        onChange={(e: any) => handleInputChange(e)} 
                        className="premium-select"
                      >
                        <option value="London">London (Greater London)</option>
                        <option value="Manchester">Manchester</option>
                        <option value="Birmingham">Birmingham</option>
                        <option value="Leeds">Leeds</option>
                        <option value="Glasgow">Glasgow</option>
                        <option value="Liverpool">Liverpool</option>
                        <option value="Edinburgh">Edinburgh</option>
                        <option value="Bristol">Bristol</option>
                      </select>
                    </div>

                    <div className="input-group full">
                      <label style={{ color: promoApplied ? '#d4af37' : '#555' }}>
                        <Gift size={16} /> 推薦碼 / 優惠碼 (PROMO CODE)
                      </label>
                      <div className="promo-input-wrapper">
                        <input 
                          type="text" 
                          name="promoCode" 
                          value={formData.promoCode} 
                          onChange={handleInputChange} 
                          placeholder="例如: ELITE"
                          className={promoApplied ? 'promo-active' : ''}
                        />
                        {promoApplied && (
                          <div className="promo-badge-mini">
                            <Sparkles size={12} />
                            <span>獎勵已啟用</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {error && <div className="error-msg">{error}</div>}

                  <div className="controls">
                    <button className="btn-secondary" onClick={prevStep}>
                      <ChevronLeft size={20} /> {t.onboarding.buttons.back}
                    </button>
                    <button 
                      className={`btn-premium ${!isFormValid ? 'disabled' : ''}`}
                      onClick={nextStep}
                      disabled={!isFormValid}
                    >
                      {t.onboarding.buttons.next} <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* Preview Side */}
                <div className="preview-side">
                  <LiveProfilePreview 
                    businessName={formData.businessName}
                    bio={formData.credentials}
                    city={formData.city}
                    sector={selectedSector === 'professional' ? "專業商務" : selectedSector === 'education' ? "教育培訓" : "技術工程"}
                  />
                  
                  <div className="success-tip-box">
                    <ShieldCheck size={20} color="#d4af37" />
                    <div>
                      <h5 style={{ color: 'white', margin: '0 0 4px', fontSize: '0.9rem' }}>專家入駐提示</h5>
                      <p style={{ color: '#777', margin: 0, fontSize: '0.8rem', lineHeight: 1.5 }}>
                        據統計，填寫完整的商號名稱與專業背景，能提升客戶 25% 的諮詢意願。
                      </p>
                    </div>
                  </div>
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
              
              {error && <div className="error-msg">{error}</div>}

              <div className="controls">
                <button className="btn-secondary" onClick={prevStep}>
                  <ChevronLeft size={20} /> {t.onboarding.buttons.back}
                </button>
                <button 
                  className={`btn-premium submit-btn ${!contractAccepted || loading ? 'disabled' : ''}`}
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
              <div className="success-wrapper">
                <div className="success-card">
                  <div className="animated-check">
                    <CheckCircle2 color="#d4af37" size={100} />
                    <div className="check-glow" />
                  </div>
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: 'white' }}>註冊成功！</h2>
                  <p style={{ color: '#888', fontSize: '1.1rem', marginBottom: '3rem' }}>
                    歡迎加入 ConciergeAI 的精英團隊。我們已收到您的申請，您可以先行探索商戶後台。
                  </p>
                  
                  {/* AI Tax Assistant Placeholder */}
                  <div className="ai-placeholder-card">
                    <div className="placeholder-icon">
                      <Calculator size={32} color="#d4af37" />
                    </div>
                    <div className="placeholder-text">
                      <h4 style={{ color: '#d4af37', margin: 0, fontWeight: 900 }}>AI 稅務助手 (Beta)</h4>
                      <p style={{ color: '#666', fontSize: '0.85rem', margin: '4px 0 0' }}>強大的 AI 記帳與稅務自動化工具即將開放內測，敬請期待。</p>
                    </div>
                    <div className="coming-soon-badge">COMING SOON</div>
                  </div>

                  <button className="btn-premium wide" onClick={() => window.location.href = '/dashboard/merchant'}>
                    進入商戶中心 <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <style jsx>{`
        .join-layout {
          min-height: 100vh;
          background-color: #050505;
          padding-top: 0;
          color: white;
        }

        .join-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px 100px;
        }

        .onboarding-stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 24px;
          padding: 40px 24px;
          margin-bottom: 40px;
        }

        .step-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 800;
          color: #222;
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: all 0.4s;
        }

        .step-item.active {
          color: #d4af37;
        }

        .step-num {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid #222;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-family: var(--font-heading);
        }

        .step-item.active .step-num {
          border-color: #d4af37;
          background: rgba(212, 175, 55, 0.1);
          color: white;
          box-shadow: 0 0 15px rgba(212, 175, 55, 0.2);
        }

        .line {
          width: 80px;
          height: 1.5px;
          background: #1a1a1a;
        }

        .line.active {
          background: linear-gradient(90deg, #d4af37, transparent);
          opacity: 0.5;
        }

        .onboarding-grid {
          display: grid;
          grid-template-columns: 1.6fr 1fr;
          gap: 48px;
          align-items: start;
        }

        .form-card {
          padding: 60px;
          background: #0a0a0a;
          border: 1px solid rgba(255, 255, 255, 0.03);
          border-radius: 40px;
          box-shadow: 0 30px 60px rgba(0,0,0,0.6);
          position: relative;
          overflow: hidden;
        }

        .form-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 4px;
          height: 100%;
          background: linear-gradient(to bottom, #d4af37, transparent);
          opacity: 0.3;
        }

        .form-title {
          margin-bottom: 12px;
          font-size: 2.25rem;
          font-weight: 900;
          letter-spacing: -0.02em;
        }

        .form-intro {
          color: #64748b;
          margin-bottom: 48px;
          font-weight: 500;
          font-size: 1.05rem;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 28px;
        }

        .input-group.full {
          grid-column: span 2;
        }

        .input-group label {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.75rem;
          font-weight: 800;
          margin-bottom: 12px;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        input, textarea, .premium-select {
          width: 100%;
          padding: 18px 24px;
          background: #0f0f0f;
          border: 1.5px solid #1a1a1a;
          border-radius: 20px;
          color: white;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 1.05rem;
          font-weight: 500;
        }

        input:focus, textarea:focus, .premium-select:focus {
          border-color: rgba(212, 175, 55, 0.5);
          background: #141414;
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.05);
        }

        .input-with-button {
          display: flex;
          gap: 16px;
        }

        .ai-fill-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 24px;
          background: rgba(212, 175, 55, 0.08);
          color: #d4af37;
          border: 1px solid rgba(212, 175, 55, 0.15);
          border-radius: 20px;
          font-weight: 800;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }

        .ai-fill-btn:hover:not(:disabled) {
          background: #d4af37;
          color: black;
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(212, 175, 55, 0.2);
        }

        .ai-fill-btn:disabled {
          opacity: 0.2;
          cursor: not-allowed;
        }

        .promo-active {
          border-color: #d4af37 !important;
          background: rgba(212, 175, 55, 0.05) !important;
          animation: pulse-gold-glow 2s infinite;
        }

        @keyframes pulse-gold-glow {
          0% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0.15); }
          70% { box-shadow: 0 0 0 10px rgba(212, 175, 55, 0); }
          100% { box-shadow: 0 0 0 0 rgba(212, 175, 55, 0); }
        }

        .success-tip-box {
          margin-top: 40px;
          padding: 28px;
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.05) 0%, transparent 100%);
          border: 1px solid rgba(212, 175, 55, 0.1);
          border-radius: 24px;
          display: flex;
          gap: 20px;
          backdrop-filter: blur(10px);
        }

        .btn-premium {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding: 18px 48px;
          background: linear-gradient(135deg, #d4af37 0%, #b8860b 100%);
          color: black;
          border-radius: 100px;
          font-weight: 900;
          font-size: 1.15rem;
          border: none;
          cursor: pointer;
          transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 15px 35px rgba(184, 134, 11, 0.3);
          position: relative;
          overflow: hidden;
          font-family: var(--font-heading);
          letter-spacing: 0.02em;
        }

        .btn-premium::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: linear-gradient(
            to bottom right,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%
          );
          transform: rotate(45deg);
          transition: all 0.8s;
          opacity: 0;
          pointer-events: none;
        }

        .btn-premium:hover:not(.disabled) {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 25px 50px rgba(184, 134, 11, 0.4);
        }

        .btn-premium:hover::after {
          opacity: 1;
          left: 100%;
          top: 100%;
        }

        .btn-premium.wide {
          width: 100%;
        }

        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 18px 36px;
          background: transparent;
          color: #64748b;
          border: 1.5px solid #1a1a1a;
          border-radius: 100px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
          font-family: var(--font-heading);
        }

        .btn-secondary:hover {
          color: white;
          border-color: #334155;
          background: rgba(255, 255, 255, 0.02);
        }

        .controls {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 60px;
        }

        .success-card {
          text-align: center;
          padding: 100px 64px;
          max-width: 800px;
          margin: 0 auto;
          background: #050505;
          border-radius: 48px;
          border: 1px solid rgba(212, 175, 55, 0.15);
          position: relative;
          box-shadow: 0 40px 100px rgba(0,0,0,0.8);
        }

        .ai-placeholder-card {
          display: flex;
          align-items: center;
          gap: 24px;
          padding: 28px;
          background: #0a0a0a;
          border: 1px dashed rgba(212, 175, 55, 0.2);
          border-radius: 24px;
          margin-bottom: 60px;
          text-align: left;
        }

        .error-msg {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          padding: 12px 20px;
          border-radius: 12px;
          text-align: center;
          margin-top: 30px;
          font-weight: 700;
          border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .disabled {
          opacity: 0.2;
          cursor: not-allowed;
          filter: grayscale(1);
        }

        @media (max-width: 1024px) {
          .onboarding-grid { grid-template-columns: 1fr; gap: 60px; }
          .preview-side { order: -1; }
          .form-card { padding: 40px; }
        }

        @media (max-width: 768px) {
          .form-grid { grid-template-columns: 1fr; }
          .input-group.full { grid-column: span 1; }
          .form-card { padding: 32px 20px; }
          .input-with-button { flex-direction: column; }
          .onboarding-stepper { flex-wrap: wrap; gap: 16px; padding: 20px; }
          .line { width: 30px; }
        }
      `}</style>
    </div>
  );
}
