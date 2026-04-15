'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/components/LanguageContext';
import OnboardingHero from '@/components/joining/OnboardingHero';
import SectorSelector from '@/components/joining/SectorSelector';
import MerchantContract from '@/components/joining/MerchantContract';
import LiveProfilePreview from '@/components/joining/LiveProfilePreview';
import { ChevronRight, ChevronLeft, CheckCircle2, Building2, Mail, Globe, User, Loader2, MapPin, Sparkles, Wand2, Calculator, Gift, ShieldCheck } from 'lucide-react';
import { createMerchantAction } from '@/app/actions/merchant';
import { fetchBusinessInfoWithAI, generateSmartBio } from '@/app/actions/ai_onboarding';

function JoinPageContent() {
  const { t, locale } = useTranslation();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
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
    promoCode: '',
    avatar: null as string | null,
    bannerUrl: null as string | null,
    phone: '',
    insuranceAmount: '1,000,000',
    suggestedCategories: [] as string[]
  });

  const nextStep = () => {
    if (step === 1 && !selectedSector) {
      setError("請選擇一個業務領域以繼續 (Please select a sector)");
      return;
    }
    if (step === 2) {
      if (!formData.businessName || !formData.email || !formData.phone || !formData.bio || formData.suggestedCategories.length === 0) {
        setError("請填寫所有必填欄位 (Please fill in all required fields)");
        return;
      }
      if (formData.bio.length < 20) {
        setError("簡介過短，請提供更多關於貴司的資訊 (Bio too short)");
        return;
      }
    }
    if (step === 3 && !contractAccepted) return;
    
    setError(null);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        setError("Image size must be less than 2MB.");
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: null }));
  };

  const handleAIPreFill = async () => {
    if (!formData.website) {
      setError("Please enter a website URL first.");
      return;
    }
    setAiLoading(true);
    setError(null);
    try {
      const data = await fetchBusinessInfoWithAI(formData.website, selectedSector || undefined);
      if (data.error) {
        setError(data.error);
      } else {
        setFormData(prev => ({
          ...prev,
          businessName: data.businessName || prev.businessName,
          bio: data.bio || prev.bio,
          bannerUrl: data.bannerUrl || prev.bannerUrl,
          suggestedCategories: data.suggestedCategories || []
        }));
        if (data.sector) setSelectedSector(data.sector);
      }
    } catch (err) {
      setError("AI was unable to fetch information. Please fill manually.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleBioRegeneration = async () => {
    if (!formData.businessName || formData.suggestedCategories.length === 0) {
      setError("Please ensure Business Name and at least one category are present.");
      return;
    }
    setBioLoading(true);
    try {
      const bio = await generateSmartBio(formData.businessName, formData.suggestedCategories, selectedSector || undefined);
      setFormData(prev => ({ ...prev, bio }));
    } catch (err) {
      setError("AI was unable to generate a bio.");
    } finally {
      setBioLoading(false);
    }
  };

  const handleSubmit = async () => {
    // 1. Validate Required Fields
    if (!formData.businessName) { setError("請輸入商號名稱 (Business Name is required)"); return; }
    if (!formData.email) { setError("請輸入聯絡電郵 (Email is required)"); return; }
    if (!formData.phone) { setError("請輸入聯絡電話 (Phone number is required)"); return; }
    if (!formData.bio || formData.bio.length < 20) { setError("簡介長度不足，請至少輸入 20 字 (Bio is too short, min 20 chars)"); return; }
    if (!selectedSector) { setError("請選擇業務領域 (Sector is required)"); return; }
    if (formData.suggestedCategories.length === 0) { setError("請至少添加一個服務分類 (At least one category is required)"); return; }
    if (!formData.city) { setError("請選擇服務區域 (City is required)"); return; }

    setLoading(true);
    setError(null);
    try {
      const res = await createMerchantAction({
        ...formData,
        sector: selectedSector as string
      });
      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        setStep(4);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = formData.businessName && formData.email && formData.phone;

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
            <div className="step-0 flex-col" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '40px', paddingBottom: '60px' }}>
              <OnboardingHero />
              
              <div style={{ maxWidth: '800px', width: '100%', margin: '0 auto' }}>
                <img 
                  src="/images/merchant-comparison.png" 
                  alt="Merchant Comparison" 
                  style={{ width: '100%', height: 'auto', borderRadius: '16px', border: '1px solid rgba(212, 175, 55, 0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }} 
                />
              </div>

              <button 
                className="btn-premium"
                onClick={() => setStep(1)}
                style={{ marginTop: '20px' }}
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

                  {error && (
                    <div style={{ 
                      padding: "1rem", backgroundColor: "rgba(220, 38, 38, 0.1)", 
                      border: "1px solid rgba(220, 38, 38, 0.2)", borderRadius: "12px", 
                      color: "#ef4444", marginBottom: "1.5rem", fontSize: "0.9rem",
                      display: "flex", alignItems: "center", gap: "8px"
                    }}>
                      <CheckCircle2 size={16} style={{ transform: 'rotate(180deg)' }} /> {error}
                    </div>
                  )}

                  <div className="profile-banner-section" style={{ marginBottom: '24px' }}>
                    <div className="banner-dropzone" onClick={() => document.getElementById('banner-input')?.click()} style={{ 
                      height: '140px', borderRadius: '24px', 
                      background: formData.bannerUrl ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${formData.bannerUrl}) center/cover` : 'rgba(212, 175, 55, 0.05)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1px dashed rgba(212, 175, 55, 0.2)'
                    }}>
                      {formData.bannerUrl ? <span style={{ color: '#d4af37', fontWeight: 800 }}>更換封面 (Change)</span> : <Camera size={24} color="#64748b" />}
                      <input id="banner-input" type="file" accept="image/*" hidden onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => setFormData(prev => ({ ...prev, bannerUrl: reader.result as string }));
                          reader.readAsDataURL(file);
                        }
                      }} />
                    </div>
                  </div>
                  
                  {/* Profile Photo Upload Section */}
                  <div className="profile-photo-section">
                    <div className="upload-container">
                      <div className={`avatar-upload-circle ${formData.avatar ? 'has-image' : ''}`}>
                        {formData.avatar ? (
                          <>
                            <img src={formData.avatar} alt="Profile Preview" className="uploaded-img" />
                            <div className="upload-overlay" onClick={() => document.getElementById('avatar-input')?.click()}>
                              <Wand2 size={24} color="white" />
                              <span>更換照片</span>
                            </div>
                          </>
                        ) : (
                          <div className="upload-trigger" onClick={() => document.getElementById('avatar-input')?.click()}>
                            <User size={32} color="#475569" />
                            <div className="camera-badge"><Sparkles size={12} /></div>
                            <span>上傳頭像/LOGO</span>
                          </div>
                        )}
                        <input 
                          id="avatar-input"
                          type="file" 
                          accept="image/*" 
                          onChange={handleFileChange} 
                          style={{ display: 'none' }}
                        />
                      </div>
                      <div className="upload-info">
                        <h4 style={{ color: 'white', margin: '0 0 4px', fontSize: '1rem' }}>專業形象標誌</h4>
                        <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>支援 JPG, PNG。建議使用正方形圖片，大小不超過 2MB。</p>
                        {formData.avatar && (
                          <button className="remove-avatar-btn" onClick={removeAvatar}>刪除照片</button>
                        )}
                      </div>
                    </div>
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

                    {formData.suggestedCategories && formData.suggestedCategories.length > 0 && (
                      <div className="input-group full ai-suggestions-container premium-glass">
                        <label><Sparkles size={16} color="#d4af37" className="animate-pulse" /> AI 建議的專業類別已生成 (Suggested Categories)</label>
                        <div className="category-tags-interactive">
                          {formData.suggestedCategories.map((cat, idx) => (
                            <div key={idx} className="cat-tag-badge gold-glow">
                              {cat}
                              <button 
                                className="remove-cat-btn"
                                onClick={() => {
                                  setFormData(prev => ({
                                    ...prev,
                                    suggestedCategories: prev.suggestedCategories.filter(c => c !== cat)
                                  }));
                                }}
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        <p className="ai-hint-small">✨ 精確的分類能幫助 AI 為您匹配更精準的訂單需求，並提升您的轉化率。</p>
                      </div>
                    )}

                    <div className="input-group">
                      <label><Building2 size={16} /> 商號名稱 (Business Name) <span style={{ color: '#d4af37', fontSize: '0.8rem' }}>(必填)</span></label>
                      <input 
                        type="text" 
                        name="businessName" 
                        value={formData.businessName} 
                        onChange={handleInputChange} 
                        placeholder="例如: Elite Accounting Services"
                      />
                    </div>
                    <div className="input-group">
                      <label><Mail size={16} /> 聯絡電子郵件 (Contact Email) <span style={{ color: '#d4af37', fontSize: '0.8rem' }}>(必填)</span></label>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        placeholder="contact@business.com"
                      />
                    </div>
                    <div className="input-group">
                      <label><Building2 size={16} /> 聯絡電話 (Phone Number) <span style={{ color: '#d4af37', fontSize: '0.8rem' }}>(必填)</span></label>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        placeholder="+44 20 1234 5678"
                      />
                    </div>
                    
                    <div className="input-group full">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <label style={{ margin: 0 }}><User size={16} /> 專業簡介 (Business Bio) <span style={{ color: '#d4af37', fontSize: '0.8rem' }}>(必填)</span></label>
                        <button 
                          onClick={handleBioRegeneration}
                          disabled={bioLoading || !formData.businessName || formData.suggestedCategories.length === 0}
                          className="ai-bio-btn-small"
                          title="使用 AI 根據分類優化簡介"
                        >
                          {bioLoading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                          AI 優化
                        </button>
                      </div>
                      <textarea 
                        name="bio" 
                        value={formData.bio} 
                        onChange={handleInputChange}
                        placeholder="介紹您的服務與優勢..."
                        rows={3}
                        className={bioLoading ? 'ai-loading-pulse' : ''}
                      />
                    </div>

                    <div className="input-group full">
                      <label><ShieldCheck size={16} /> 專業背景與資質 (Credentials)</label>
                      <textarea 
                        name="credentials" 
                        value={formData.credentials} 
                        onChange={handleInputChange}
                        placeholder={selectedSector === 'professional' ? "例如: ACCA 會計師, 10年英國稅務經驗..." : "輸入您的技術認證..."}
                        rows={2}
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
                        <option value="UK Nationwide">UK (Nationwide / Remote)</option>
                        <optgroup label="Major Hubs">
                          <option value="London">London (Greater London)</option>
                          <option value="Manchester">Manchester</option>
                          <option value="Birmingham">Birmingham</option>
                          <option value="Leeds">Leeds</option>
                          <option value="Glasgow">Glasgow</option>
                          <option value="Liverpool">Liverpool</option>
                          <option value="Edinburgh">Edinburgh</option>
                          <option value="Bristol">Bristol</option>
                        </optgroup>
                        <optgroup label="All UK Cities & Towns">
                          <option value="Aberdeen">Aberdeen</option>
                          <option value="Armagh">Armagh</option>
                          <option value="Bath">Bath</option>
                          <option value="Belfast">Belfast</option>
                          <option value="Blackpool">Blackpool</option>
                          <option value="Bournemouth">Bournemouth</option>
                          <option value="Bradford">Bradford</option>
                          <option value="Brighton & Hove">Brighton & Hove</option>
                          <option value="Cambridge">Cambridge</option>
                          <option value="Canterbury">Canterbury</option>
                          <option value="Cardiff">Cardiff</option>
                          <option value="Carlisle">Carlisle</option>
                          <option value="Chelmsford">Chelmsford</option>
                          <option value="Chester">Chester</option>
                          <option value="Chichester">Chichester</option>
                          <option value="Colchester">Colchester</option>
                          <option value="Coventry">Coventry</option>
                          <option value="Derby">Derby</option>
                          <option value="Derry">Derry</option>
                          <option value="Doncaster">Doncaster</option>
                          <option value="Dundee">Dundee</option>
                          <option value="Durham">Durham</option>
                          <option value="Ely">Ely</option>
                          <option value="Exeter">Exeter</option>
                          <option value="Gloucester">Gloucester</option>
                          <option value="Hereford">Hereford</option>
                          <option value="Inverness">Inverness</option>
                          <option value="Kingston upon Hull">Kingston upon Hull</option>
                          <option value="Lancaster">Lancaster</option>
                          <option value="Leicester">Leicester</option>
                          <option value="Lichfield">Lichfield</option>
                          <option value="Lincoln">Lincoln</option>
                          <option value="Lisburn">Lisburn</option>
                          <option value="Londonderry">Londonderry</option>
                          <option value="Luton">Luton</option>
                          <option value="Milton Keynes">Milton Keynes</option>
                          <option value="Newcastle upon Tyne">Newcastle upon Tyne</option>
                          <option value="Newport">Newport</option>
                          <option value="Newry">Newry</option>
                          <option value="Northampton">Northampton</option>
                          <option value="Norwich">Norwich</option>
                          <option value="Nottingham">Nottingham</option>
                          <option value="Oxford">Oxford</option>
                          <option value="Perth">Perth</option>
                          <option value="Peterborough">Peterborough</option>
                          <option value="Plymouth">Plymouth</option>
                          <option value="Portsmouth">Portsmouth</option>
                          <option value="Preston">Preston</option>
                          <option value="Reading">Reading</option>
                          <option value="Ripon">Ripon</option>
                          <option value="Salford">Salford</option>
                          <option value="Salisbury">Salisbury</option>
                          <option value="Sheffield">Sheffield</option>
                          <option value="Shrewsbury">Shrewsbury</option>
                          <option value="Southampton">Southampton</option>
                          <option value="Southend-on-Sea">Southend-on-Sea</option>
                          <option value="St Albans">St Albans</option>
                          <option value="St Asaph">St Asaph</option>
                          <option value="St Davids">St Davids</option>
                          <option value="Stirling">Stirling</option>
                          <option value="Stoke-on-Trent">Stoke-on-Trent</option>
                          <option value="Sunderland">Sunderland</option>
                          <option value="Swansea">Swansea</option>
                          <option value="Truro">Truro</option>
                          <option value="Wakefield">Wakefield</option>
                          <option value="Wells">Wells</option>
                          <option value="Westminster">Westminster</option>
                          <option value="Winchester">Winchester</option>
                          <option value="Wolverhampton">Wolverhampton</option>
                          <option value="Worcester">Worcester</option>
                          <option value="Wrexham">Wrexham</option>
                          <option value="York">York</option>
                      </select>
                    </div>

                    <div className="input-group full">
                      <label><ShieldCheck size={16} /> 公眾責任保險額度 (Public Liability Insurance) <span style={{ color: '#d4af37', fontSize: '0.8rem' }}>(必填)</span></label>
                      <select name="insuranceAmount" value={formData.insuranceAmount} onChange={handleInputChange} className="premium-select">
                        <option value="1,000,000">£1,000,000 (1 Million)</option>
                        <option value="2,000,000">£2,000,000 (2 Million)</option>
                        <option value="5,000,000">£5,000,000 (5 Million)</option>
                        <option value="10,000,000">£10,000,000 (10 Million)</option>
                        <option value="None">尚未投保 (Not Insured)</option>
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
                    avatar={formData.avatar}
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
          padding: 120px 20px 100px;
        }

        .step-0 {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          padding-top: 40px;
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
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.85rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          transition: all 0.4s;
          opacity: 0.6;
        }

        .step-item.active {
          color: #d4af37;
          opacity: 1;
        }

        .step-num {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 2px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.85rem;
          font-family: var(--font-heading);
          background: rgba(255, 255, 255, 0.05);
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
          color: #94a3b8;
          margin-bottom: 48px;
          font-weight: 500;
          font-size: 1.05rem;
          opacity: 0.9;
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
          color: #94a3b8;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        input, textarea, .premium-select {
          width: 100%;
          padding: 18px 24px;
          background: #0f0f0f;
          border: 1.5px solid #222;
          border-radius: 20px;
          color: white;
          outline: none;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          font-size: 1.05rem;
          font-weight: 500;
        }

        input::placeholder, textarea::placeholder {
          color: #475569;
          opacity: 0.8;
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

        .success-tip-box p {
          color: #94a3b8 !important;
        }

        .ai-fetch-group {
          margin-bottom: 12px;
        }

        .ai-suggestions-container {
          background: rgba(212, 175, 55, 0.03);
          padding: 24px;
          border-radius: 24px;
          border: 1px dashed rgba(212, 175, 55, 0.2);
          margin-bottom: 24px;
          animation: slideDown 0.4s ease-out;
        }

        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .category-tags-interactive {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 10px;
        }

        .cat-tag-badge {
          background: #111;
          color: white;
          padding: 8px 16px;
          border-radius: 12px;
          border: 1.5px solid #d4af37;
          font-size: 0.9rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 10px;
          box-shadow: 0 4px 12px rgba(212, 175, 55, 0.1);
          transition: all 0.3s ease;
        }

        .cat-tag-badge:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(212, 175, 55, 0.2);
        }

        .remove-cat-btn {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          color: #d4af37;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s;
        }

        .remove-cat-btn:hover {
          background: #d4af37;
          color: black;
        }

        .ai-hint-small {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 12px;
          font-style: italic;
        }

        .ai-bio-btn-small {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.2);
          color: #d4af37;
          padding: 4px 12px;
          border-radius: 8px;
          font-size: 0.75rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .ai-bio-btn-small:hover:not(:disabled) {
          background: #d4af37;
          color: black;
        }

        .ai-bio-btn-small:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .ai-loading-pulse {
          animation: borderPulse 1.5s infinite;
        }

        @keyframes borderPulse {
          0% { border-color: #222; }
          50% { border-color: #d4af37; }
          100% { border-color: #222; }
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

        /* Profile Photo Upload Styles */
        .profile-photo-section {
          margin-bottom: 40px;
          padding: 24px;
          background: rgba(255, 255, 255, 0.02);
          border-radius: 24px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .upload-container {
          display: flex;
          align-items: center;
          gap: 24px;
        }

        .avatar-upload-circle {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: #0f0f0f;
          border: 2px dashed #1a1a1a;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .avatar-upload-circle:hover {
          border-color: #d4af37;
          background: rgba(212, 175, 55, 0.05);
          box-shadow: 0 0 20px rgba(212, 175, 55, 0.1);
        }

        .avatar-upload-circle.has-image {
          border-style: solid;
          border-color: rgba(212, 175, 55, 0.3);
        }

        .upload-trigger {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          color: #94a3b8;
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          text-align: center;
        }

        .camera-badge {
          position: absolute;
          bottom: 8px;
          right: 8px;
          width: 24px;
          height: 24px;
          background: #d4af37;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: black;
          box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        }

        .uploaded-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .upload-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 4px;
          opacity: 0;
          transition: opacity 0.3s;
          color: white;
          font-size: 0.7rem;
          font-weight: 800;
          backdrop-filter: blur(4px);
        }

        .avatar-upload-circle:hover .upload-overlay {
          opacity: 1;
        }

        .upload-info {
          flex: 1;
        }

        .remove-avatar-btn {
          background: transparent;
          border: none;
          color: #ef4444;
          font-size: 0.75rem;
          font-weight: 700;
          margin-top: 8px;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
          opacity: 0.8;
          transition: opacity 0.3s;
        }

        .remove-avatar-btn:hover {
          opacity: 1;
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
export default function JoinPage() {
  return (
    <Suspense fallback={<div className="join-layout"><div className="join-container" style={{ textAlign: 'center' }}>正在載入入駐程序...</div></div>}>
      <JoinPageContent />
    </Suspense>
  );
}
