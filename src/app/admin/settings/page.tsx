'use client';

import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Save, 
  FileText, 
  ShieldCheck, 
  Cookie,
  ExternalLink,
  Loader2,
  CheckCircle2,
  Calculator
} from 'lucide-react';

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);

import { useTranslation } from "@/components/LanguageContext";

interface SettingSectionProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}

const SettingSection = ({ title, icon, children }: SettingSectionProps) => (
  <div style={{
    backgroundColor: 'white',
    borderRadius: '24px',
    padding: '2rem',
    border: '1px solid rgba(184, 134, 11, 0.05)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
    marginBottom: '2rem'
  }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
      <div style={{ 
        padding: '0.625rem', 
        borderRadius: '12px', 
        background: 'rgba(212, 175, 55, 0.08)', 
        color: '#d4af37' 
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{title}</h3>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      {children}
    </div>
  </div>
);

interface InputFieldProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  icon: React.ReactNode;
  placeholder?: string;
}

const InputField = ({ label, value, onChange, icon, placeholder }: InputFieldProps) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <label style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748b', marginLeft: '4px' }}>{label}</label>
    <div style={{ position: 'relative' }}>
      <div style={{ 
        position: 'absolute', 
        left: '1rem', 
        top: '50%', 
        transform: 'translateY(-50%)', 
        color: '#94a3b8' 
      }}>
        {icon}
      </div>
      <input 
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.875rem 1rem 0.875rem 2.75rem',
          borderRadius: '14px',
          border: '1px solid #e2e8f0',
          fontSize: '0.95rem',
          color: '#0f172a',
          outline: 'none',
          transition: 'all 0.2s ease',
          backgroundColor: '#f8fafc'
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#d4af37';
          e.target.style.boxShadow = '0 0 0 4px rgba(212, 175, 55, 0.1)';
          e.target.style.backgroundColor = 'white';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = '#e2e8f0';
          e.target.style.boxShadow = 'none';
          e.target.style.backgroundColor = '#f8fafc';
        }}
      />
    </div>
  </div>
);

export default function PlatformSettingsPage() {
  const { t } = useTranslation();
  const tm = t.admin.settings_mgr;
  const tf = t.footer;

  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  // Form State
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [companyNo, setCompanyNo] = useState('');
  const [vatNo, setVatNo] = useState('');
  const [facebook, setFacebook] = useState('');
  const [twitter, setTwitter] = useState('');
  const [instagram, setInstagram] = useState('');
  const [linkedin, setLinkedin] = useState('');

  React.useEffect(() => {
    fetch('/api/admin/settings')
      .then(res => res.json())
      .then(data => {
        setAddress(data.officeAddress || '');
        setPhone(data.contactPhone || '');
        setEmail(data.contactEmail || '');
        setCompanyNo(data.companyRegistration || '');
        setVatNo(data.vatRegistration || '');
        setFacebook(data.facebookUrl || '');
        setTwitter(data.twitterUrl || '');
        setInstagram(data.instagramUrl || '');
        setLinkedin(data.linkedinUrl || '');
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load settings", err);
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          officeAddress: address,
          contactPhone: phone,
          contactEmail: email,
          companyRegistration: companyNo,
          vatRegistration: vatNo,
          facebookUrl: facebook,
          twitterUrl: twitter,
          instagramUrl: instagram,
          linkedinUrl: linkedin
        })
      });
      
      if (res.ok) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Failed to save settings", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <Loader2 className="animate-spin" size={40} color="#d4af37" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px' }}>
      <div style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.025em', marginBottom: '0.5rem' }}>
            {tm.title}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.1rem', fontWeight: 500 }}>
            {tm.sub}
          </p>
        </div>
        
        <button 
          onClick={handleSave}
          disabled={saving}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.875rem 2rem',
            borderRadius: '16px',
            backgroundColor: success ? '#10b981' : '#0f172a',
            color: 'white',
            border: 'none',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer',
            transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            boxShadow: success ? '0 10px 20px rgba(16, 185, 129, 0.2)' : '0 10px 20px rgba(15, 23, 42, 0.1)'
          }}
          className={!saving ? "hover-lift" : ""}
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : (success ? <CheckCircle2 size={20} /> : <Save size={20} />)}
          {saving ? tm.saving : (success ? tm.success : tm.save)}
        </button>
      </div>

      <SettingSection title={tm.companyInfo} icon={<Building2 size={20} />}>
        <InputField 
          label="Office Address" 
          value={address} 
          onChange={setAddress} 
          icon={<MapPin size={18} />} 
          placeholder="Enter full physical address"
        />
        <InputField 
          label="Contact Phone" 
          value={phone} 
          onChange={setPhone} 
          icon={<Phone size={18} />} 
          placeholder="+44 ..."
        />
        <InputField 
          label="Contact Email" 
          value={email} 
          onChange={setEmail} 
          icon={<Mail size={18} />} 
          placeholder="hello@company.com"
        />
        <InputField 
          label="Company Registration No." 
          value={companyNo} 
          onChange={setCompanyNo} 
          icon={<FileText size={18} />} 
          placeholder="8-digit number"
        />
        <InputField 
          label="VAT Registration No." 
          value={vatNo} 
          onChange={setVatNo} 
          icon={<Calculator size={18} />} 
          placeholder="GB ..."
        />
      </SettingSection>

      <SettingSection title={tm.socialLinks} icon={<Globe size={20} />}>
        <InputField 
          label="Facebook URL" 
          value={facebook} 
          onChange={setFacebook} 
          icon={<FacebookIcon />} 
          placeholder="https://facebook.com/..."
        />
        <InputField 
          label="Twitter/X URL" 
          value={twitter} 
          onChange={setTwitter} 
          icon={<TwitterIcon />} 
          placeholder="https://twitter.com/..."
        />
        <InputField 
          label="Instagram URL" 
          value={instagram} 
          onChange={setInstagram} 
          icon={<InstagramIcon />} 
          placeholder="https://instagram.com/..."
        />
        <InputField 
          label="LinkedIn URL" 
          value={linkedin} 
          onChange={setLinkedin} 
          icon={<LinkedinIcon />} 
          placeholder="https://linkedin.com/..."
        />
      </SettingSection>

      <SettingSection title={tm.legalLinks} icon={<ShieldCheck size={20} />}>
        <div style={{ gridColumn: 'span 2', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {[
            { label: 'Terms of Service', icon: <FileText size={18} />, url: '/legal/terms' },
            { label: 'Privacy Policy', icon: <ShieldCheck size={18} />, url: '/legal/privacy' },
            { label: 'Cookie Policy', icon: <Cookie size={18} />, url: '/legal/cookies' }
          ].map((item, idx) => (
            <div key={idx} style={{ 
              padding: '1.25rem', 
              borderRadius: '16px', 
              border: '1px solid #f1f5f9', 
              backgroundColor: '#f8fafc',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              transition: 'all 0.2s ease'
            }} className="hover-scale">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ color: '#d4af37' }}>{item.icon}</div>
                <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{item.label}</span>
              </div>
              <a href={item.url} style={{ color: '#94a3b8' }}><ExternalLink size={16} /></a>
            </div>
          ))}
        </div>
      </SettingSection>
      
      <div style={{ 
        padding: '1.5rem', 
        borderRadius: '20px', 
        backgroundColor: 'rgba(212, 175, 55, 0.05)', 
        border: '1px dashed rgba(212, 175, 55, 0.2)',
        textAlign: 'center'
      }}>
        <p style={{ margin: 0, color: '#b8860b', fontSize: '0.9rem', fontWeight: 600 }}>
          💡 Tip: Ensure all corporate information matches your filings at Companies House (UK).
        </p>
      </div>

      <style jsx>{`
        .hover-lift:hover {
          transform: translateY(-2px);
          filter: brightness(1.2);
        }
        .hover-scale:hover {
          border-color: #d4af37 !important;
          background: white !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.02);
        }
      `}</style>
    </div>
  );
}
