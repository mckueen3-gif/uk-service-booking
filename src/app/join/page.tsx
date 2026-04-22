'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslation } from '@/components/LanguageContext';
import OnboardingHero from '@/components/joining/OnboardingHero';
import SectorSelector from '@/components/joining/SectorSelector';
import MerchantContract from '@/components/joining/MerchantContract';
import LiveProfilePreview from '@/components/joining/LiveProfilePreview';
import SuperpowerHighlights from '@/components/joining/SuperpowerHighlights';
import { ChevronRight, ChevronLeft, CheckCircle2, Building2, Mail, Globe, User, Loader2, MapPin, Sparkles, Wand2, Calculator, Gift, ShieldCheck, Phone, Camera } from 'lucide-react';
import MerchantComparisonTable from '@/components/joining/MerchantComparisonTable';
import { createMerchantAction } from '@/app/actions/merchant';
import { fetchBusinessInfoWithAI, generateSmartBio, verifyCredentialsWithAI } from '@/app/actions/ai_onboarding';
import { signIn } from 'next-auth/react';
import { Lock } from 'lucide-react';

function JoinPageContent() {
  const { t, locale } = useTranslation();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [bioLoading, setBioLoading] = useState(false);
  const [verifyingCredential, setVerifyingCredential] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [contractAccepted, setContractAccepted] = useState(false);
  const [promoApplied, setPromoApplied] = useState(false);
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    website: '',
    bio: '',
    credentials: [] as { name: string, dataUrl: string, review: any | null }[],
    city: 'London',
    promoCode: '',
    avatar: null as string | null,
    bannerUrl: null as string | null,
    phone: '',
    password: '',
    insuranceAmount: '1,000,000',
    suggestedCategories: [] as string[]
  });

  const nextStep = () => {
    if (step === 1 && !selectedSector) {
      setError(t.onboarding.validation.select_sector);
      return;
    }
    if (step === 2) {
      if (!formData.businessName || !formData.email || !formData.phone || !formData.bio) {
        setError(t.onboarding.validation.fill_required);
        return;
      }
      if (formData.bio.length < 20) {
        setError(t.onboarding.validation.bio_short);
        return;
      }
      // Technical sector credentials no longer strictly mandatory to align with UI tip "can review later"
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = e.target;
    
    if (name === 'credentials' && e.target.files) {
      const files = Array.from(e.target.files);
      if (formData.credentials.length + files.length > 10) {
        setError(t.onboarding.validation.file_size_error); // Reusing size error as generic error for now or custom message
        return;
      }
      
      setVerifyingCredential(true);
      
      const newCreds: { name: string, dataUrl: string, review: any | null }[] = [];
      
      for (const file of files) {
        if (file.size > 5 * 1024 * 1024) continue;
        
        const dataUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        
        let review = null;
        if (selectedSector) {
          try {
            review = await verifyCredentialsWithAI(dataUrl, selectedSector, formData.suggestedCategories);
          } catch (err) {
            review = { status: 'manual_review', reason: t.onboarding.validation.ai_fallback };
          }
        }
        newCreds.push({ name: file.name, dataUrl, review });
      }
      
      setFormData(prev => ({ ...prev, credentials: [...prev.credentials, ...newCreds] }));
      setVerifyingCredential(false);
      
      // Clear the file input so you can select the same file again if removed
      e.target.value = '';
      return;
    }

    // Avatar / Banner
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        setError(t.onboarding.validation.file_size_error);
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        setFormData(prev => ({ ...prev, [name]: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCredential = (index: number) => {
    setFormData(prev => ({
      ...prev,
      credentials: prev.credentials.filter((_, i) => i !== index)
    }));
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
    if (!formData.businessName) { setError(t.onboarding.validation.business_name_required); return; }
    if (!formData.email) { setError(t.onboarding.validation.email_required); return; }
    if (!formData.phone) { setError(t.onboarding.validation.phone_required); return; }
    if (!formData.password || formData.password.length < 6) { 
      setError("密碼長度至少需 6 個字元 (Password must be at least 6 characters)"); 
      return; 
    }
    if (!formData.bio || formData.bio.length < 20) { setError(t.onboarding.validation.bio_short); return; }
    if (!selectedSector) { setError(t.onboarding.validation.select_sector); return; }
    if (!formData.city) { setError(t.onboarding.validation.city_required); return; }
    // Technical sector credentials no longer strictly mandatory to align with UI tip "can review later"

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
        // Auto-login after successful registration
        await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
              
              <div style={{ maxWidth: '1100px', width: '100%', margin: '0 auto' }}>
                <SuperpowerHighlights />
                <MerchantComparisonTable />
              </div>

              <button 
                className="btn-premium"
                onClick={() => {
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                  setStep(1);
                }}
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
                    <h2 className="form-title">{t.onboarding.profile_form.form_title}</h2>
                    <p className="form-intro">{t.onboarding.profile_form.form_subtitle}</p>
                  </div>

                  {error && (
                    <div className="error-msg premium-error fade-in" style={{ 
                      background: 'rgba(212, 175, 55, 0.05)', 
                      border: '1px solid rgba(212, 175, 55, 0.2)', 
                      padding: '16px', borderRadius: '16px',
                      color: '#d4af37', marginBottom: '24px', fontSize: '0.9rem',
                      display: 'flex', alignItems: 'center', gap: '10px'
                    }}>
                      <ShieldCheck size={16} /> {error}
                    </div>
                  )}

                  {/* 1. Primary Identity: Business Name */}
                  <div className="input-group full" style={{ marginBottom: '32px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      <Building2 size={16} /> {t.onboarding.profile_form.business_name} 
                      <span style={{ color: '#d4af37', fontSize: '0.8rem' }}>{t.onboarding.profile_form.credentials_required}</span>
                    </label>
                    <input 
                      type="text" 
                      name="businessName" 
                      value={formData.businessName} 
                      onChange={handleInputChange} 
                      placeholder={t.onboarding.profile_form.business_name_placeholder}
                      className="premium-input-large"
                      style={{ fontSize: '1.2rem', fontWeight: 700 }}
                    />
                  </div>

                  {/* 2. Professional Identity: Avatar & Banner */}
                  <div className="visuals-container" style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '24px', marginBottom: '32px', alignItems: 'center' }}>
                    <div className="avatar-upload-block">
                      <div className={`avatar-upload-circle ${formData.avatar ? 'has-image' : ''}`} style={{ width: '100px', height: '100px' }}>
                        {formData.avatar ? (
                          <>
                            <img src={formData.avatar} alt="Profile Preview" className="uploaded-img" />
                            <div className="upload-overlay" onClick={() => document.getElementById('avatar-input')?.click()}>
                              <Wand2 size={24} color="white" />
                            </div>
                          </>
                        ) : (
                          <div className="upload-trigger" onClick={() => document.getElementById('avatar-input')?.click()}>
                            <User size={32} color="#64748b" />
                            <span style={{ fontSize: '0.65rem' }}>{t.onboarding.profile_form.avatar_placeholder}</span>
                          </div>
                        )}
                        <input id="avatar-input" name="avatar" type="file" accept="image/*" hidden onChange={handleFileChange} />
                      </div>
                    </div>
                    
                    <div className="banner-upload-block" style={{ flex: 1 }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                        <Camera size={16} /> {t.onboarding.profile_form.banner_label}
                      </label>
                      <div className="banner-dropzone" onClick={() => document.getElementById('banner-input')?.click()} style={{ 
                        height: '100px', borderRadius: '16px', 
                        background: formData.bannerUrl ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${formData.bannerUrl}) center/cover` : 'rgba(212, 175, 55, 0.05)',
                        display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', border: '1.5px dashed rgba(212, 175, 55, 0.2)', transition: 'all 0.3s ease'
                      }}>
                        {formData.bannerUrl ? (
                          <span style={{ color: '#d4af37', fontWeight: 700, fontSize: '0.8rem' }}>{t.onboarding.buttons.back}</span>
                        ) : (
                          <>
                            <Camera size={20} color="#d4af37" />
                            <span style={{ color: '#64748b', fontSize: '0.75rem', fontWeight: 500 }}>{t.onboarding.profile_form.banner_placeholder}</span>
                          </>
                        )}
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
                  </div>

                  {/* 3. About & Digital Presence */}
                  <div className="form-grid">
                    <div className="input-group full">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <label style={{ margin: 0 }}><User size={16} /> {t.onboarding.profile_form.bio_label} <span style={{ color: '#d4af37', fontSize: '0.8rem' }}>{t.onboarding.profile_form.credentials_required}</span></label>
                        <button 
                          onClick={handleBioRegeneration}
                          disabled={bioLoading || !formData.businessName}
                          className="ai-bio-btn-small"
                        >
                          {bioLoading ? <Loader2 className="animate-spin" size={14} /> : <Sparkles size={14} />}
                          {t.onboarding.profile_form.bio_optimize}
                        </button>
                      </div>
                      <textarea 
                        name="bio" 
                        value={formData.bio} 
                        onChange={handleInputChange}
                        placeholder={t.onboarding.profile_form.bio_placeholder}
                        rows={3}
                        className={bioLoading ? 'ai-loading-pulse' : ''}
                      />
                    </div>

                    <div className="input-group full ai-fetch-group">
                      <label><Globe size={16} /> {t.onboarding.profile_form.website_label}</label>
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
                          <span>{t.onboarding.profile_form.ai_autofill}</span>
                        </button>
                      </div>
                    </div>

                    {/* 4. Contact Info */}
                    <div className="input-group">
                      <label><Mail size={16} /> {t?.merchant_profile?.labels?.email || "Email Address"} <span style={{ color: '#d4af37', fontSize: '0.8rem' }}>{t?.onboarding?.profile_form?.credentials_required || "Required"}</span></label>
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          placeholder={t.onboarding.profile_form.email_placeholder}
                        />
                    </div>
                    <div className="input-group">
                      <label><Phone size={16} /> {t?.merchant_profile?.labels?.phone || "Phone Number"} <span style={{ color: '#d4af37', fontSize: '0.8rem' }}>{t?.onboarding?.profile_form?.credentials_required || "Required"}</span></label>
                        <input 
                          type="tel" 
                          name="phone" 
                          value={formData.phone} 
                          onChange={handleInputChange} 
                          placeholder={t.onboarding.profile_form.phone_placeholder}
                        />
                    </div>
                    <div className="input-group full">
                      <label><Lock size={16} /> {t?.onboarding?.profile_form?.password_label || "Set Password"} <span style={{ color: '#d4af37', fontSize: '0.8rem' }}>* {t?.onboarding?.profile_form?.credentials_required || "Required"}</span></label>
                        <input 
                          type="password" 
                          name="password" 
                          value={formData.password} 
                          onChange={handleInputChange} 
                          placeholder={t.onboarding.profile_form.password_placeholder}
                        />
                    </div>

                    {/* 5. Service Location */}
                    <div className="input-group full">
                      <label><MapPin size={16} /> {t.onboarding.profile_form.city_label}</label>
                      <select 
                        name="city" 
                        value={formData.city} 
                        onChange={(e: any) => handleInputChange(e)} 
                        className="premium-select"
                      >
                        <option value="">{t.onboarding.profile_form.city_placeholder}</option>
                        <option value="UK Nationwide">{t.onboarding.profile_form.nationwide}</option>
                        <optgroup label={t.onboarding.profile_form.major_cities}>
                          <option value="London">London</option>
                          <option value="Manchester">Manchester</option>
                          <option value="Birmingham">Birmingham</option>
                          <option value="Leeds">Leeds</option>
                          <option value="Glasgow">Glasgow</option>
                        </optgroup>
                      </select>
                    </div>

                    {/* 6. Verification & Compliance Section */}
                    <div className="compliance-section full premium-glass" style={{ padding: '24px', borderRadius: '24px', border: '1px solid rgba(212, 175, 55, 0.1)', background: 'rgba(212, 175, 55, 0.02)', marginTop: '16px' }}>
                      <div className="section-header" style={{ marginBottom: '20px' }}>
                        <h4 style={{ color: '#d4af37', margin: 0, display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1rem', fontWeight: 800 }}>
                          <ShieldCheck size={20} /> {t.onboarding.steps.credentials}
                        </h4>
                      </div>

                      <div className="input-group full" style={{ marginBottom: '20px' }}>
                        <label style={{ color: '#94a3b8' }}>{t.onboarding.profile_form.insurance_label}</label>
                        <select name="insuranceAmount" value={formData.insuranceAmount} onChange={handleInputChange} className="premium-select">
                          <option value="1,000,000">{t.onboarding.profile_form.insurance_1m}</option>
                          <option value="2,000,000">{t.onboarding.profile_form.insurance_2m}</option>
                          <option value="5,000,000">{t.onboarding.profile_form.insurance_5m}</option>
                          <option value="10,000,000">{t.onboarding.profile_form.insurance_10m}</option>
                          <option value="None">{t.onboarding.profile_form.insurance_none}</option>
                        </select>
                        <p style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '6px' }}>{t.onboarding.profile_form.insurance_hint}</p>
                      </div>

                      <div className="input-group full">
                        <label style={{ color: '#94a3b8' }}>{t.onboarding.profile_form.credentials_label} {t.onboarding.profile_form.credentials_required}</label>
                        <div className="file-upload-wrapper">
                          <input 
                            type="file" 
                            name="credentials" 
                            multiple
                            onChange={handleFileChange}
                            className={`premium-file-input ${selectedSector === 'technical' && formData.credentials.length === 0 ? 'error' : ''}`}
                          />
                          {selectedSector === 'technical' ? (
                            <div className="validation-alert error">
                              <ShieldCheck size={14} />
                              <span>{t.onboarding.profile_form.credentials_hint_technical}</span>
                            </div>
                          ) : (
                            <div className="validation-alert info">
                              <Sparkles size={14} />
                              <span>{t.onboarding.profile_form.credentials_hint_standard}</span>
                            </div>
                          )}
                          <div style={{ marginTop: '12px', fontSize: '0.8rem', color: '#64748b', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                            <Lock size={14} style={{ marginTop: '2px', flexShrink: 0, color: '#10b981' }} />
                            <span>
                              {locale === 'zh' 
                                ? '您的資料僅供平台驗證資格使用，絕不作其他用途，亦不會外流。'
                                : 'Your uploaded documents are securely processed for verification purposes only and will not be shared or used elsewhere.'}
                            </span>
                          </div>
                        </div>

                        {/* Real-time AI Review Display */}
                        {verifyingCredential && (
                          <div className="ai-review-loading" style={{ marginTop: '16px', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
                             <Loader2 className="animate-spin" size={18} color="#d4af37" />
                             <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>{t.onboarding.profile_form.ai_verifying}</span>
                          </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                          {formData.credentials.map((cred, idx) => (
                            <div key={idx} style={{ padding: '16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <span style={{ color: '#e2e8f0', fontSize: '0.85rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' }}>{cred.name}</span>
                                <button type="button" onClick={() => removeCredential(idx)} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1 }}>&times;</button>
                              </div>
                              {cred.review && (
                                <div className={`ai-review-result ${cred.review.status}`} style={{ 
                                  padding: '12px', 
                                  borderRadius: '8px', 
                                  border: `1px solid ${cred.review.status === 'verified' ? 'rgba(16, 185, 129, 0.2)' : cred.review.status === 'rejected' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)'}`,
                                  background: cred.review.status === 'verified' ? 'rgba(16, 185, 129, 0.03)' : cred.review.status === 'rejected' ? 'rgba(239, 68, 68, 0.03)' : 'rgba(245, 158, 11, 0.03)',
                                  display: 'flex',
                                  gap: '12px'
                                }}>
                                  <div style={{ color: cred.review.status === 'verified' ? '#10b981' : cred.review.status === 'rejected' ? '#ef4444' : '#f59e0b', marginTop: '2px' }}>
                                    {cred.review.status === 'verified' ? <CheckCircle2 size={20} /> : <ShieldCheck size={20} />}
                                  </div>
                                  <div>
                                    <div style={{ fontWeight: 800, fontSize: '0.85rem', marginBottom: '4px', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      {cred.review.status === 'verified' ? t.onboarding.profile_form.ai_verified_success : 
                                       cred.review.status === 'rejected' ? t.onboarding.profile_form.ai_verified_failed : t.onboarding.profile_form.manual_review}
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>{cred.review.reason}</p>
                                    {(cred.review.regulatoryBody || cred.review.documentType || cred.review.expiryDate) && (
                                      <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                        {cred.review.documentType && (
                                          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#d4af37', background: 'rgba(212,175,55,0.1)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                            {cred.review.documentType}
                                          </span>
                                        )}
                                        {cred.review.regulatoryBody && (
                                          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                            {cred.review.regulatoryBody}
                                          </span>
                                        )}
                                        {cred.review.expiryDate && (
                                          <span style={{ fontSize: '0.65rem', fontWeight: 700, color: cred.review.status === 'rejected' ? '#ef4444' : '#10b981', background: cred.review.status === 'rejected' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)', padding: '2px 6px', borderRadius: '4px', textTransform: 'uppercase' }}>
                                            EXP: {cred.review.expiryDate}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 7. Rewards / Promo Code */}
                    <div className="input-group full" style={{ marginTop: '24px' }}>
                      <label style={{ color: promoApplied ? '#d4af37' : '#94a3b8' }}>
                        <Gift size={16} /> {t.onboarding.profile_form.promo_label}
                      </label>
                      <div className="promo-input-wrapper">
                        <input 
                          type="text" 
                          name="promoCode" 
                          value={formData.promoCode} 
                          onChange={handleInputChange} 
                          placeholder={t.onboarding.profile_form.promo_placeholder}
                          className={promoApplied ? 'promo-active' : ''}
                        />
                        {promoApplied && (
                          <div className="promo-badge-mini">
                            <Sparkles size={12} />
                            <span>{t.onboarding.profile_form.promo_active}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="controls" style={{ marginTop: '40px' }}>
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
                    bio={formData.bio}
                    city={formData.city === 'UK Nationwide' ? t.onboarding.profile_form.nationwide : formData.city}
                    sector={
                      selectedSector === 'professional' ? t.onboarding.sectors.professional.title :
                      selectedSector === 'education' ? t.onboarding.sectors.education.title :
                      selectedSector === 'technical' ? t.onboarding.sectors.technical.title :
                      t.onboarding.preview.sector_placeholder
                    }
                    rawSector={selectedSector}
                    avatar={formData.avatar}
                    bannerUrl={formData.bannerUrl}
                    insuranceAmount={formData.insuranceAmount}
                    hasCredentials={formData.credentials.length > 0}
                    isAiVerified={formData.credentials.some(c => c.review?.status === 'verified')}
                    labels={t.onboarding.preview}
                  />
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
                  <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem', color: 'white' }}>{t.onboarding.success.title}</h2>
                  <p style={{ color: '#888', fontSize: '1.1rem', marginBottom: '3rem' }}>
                    {t.onboarding.success.subtitle}
                  </p>
                  
                  {/* AI Tax Assistant Placeholder */}
                  <div className="ai-placeholder-card">
                    <div className="placeholder-icon">
                      <Calculator size={32} color="#d4af37" />
                    </div>
                    <div className="placeholder-text">
                      <h4 style={{ color: '#d4af37', margin: 0, fontWeight: 900 }}>{t.onboarding.success.ai_tax_title}</h4>
                      <p style={{ color: '#666', fontSize: '0.85rem', margin: '4px 0 0' }}>{t.onboarding.success.ai_tax_desc}</p>
                    </div>
                    <div className="coming-soon-badge">{t.onboarding.success.coming_soon}</div>
                  </div>

                  <button className="btn-premium wide" onClick={() => window.location.href = '/merchant'}>
                    {t.onboarding.success.enter_dashboard} <ChevronRight size={20} />
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
          max-width: 1440px;
          margin: 0 auto;
          padding: 120px 40px 100px;
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
          grid-template-columns: 1.8fr 1fr;
          gap: 56px;
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
          gap: 24px;
          width: 100%;
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
