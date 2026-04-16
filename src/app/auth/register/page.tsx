'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { registerUser } from '@/app/actions/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { User, Mail, Shield, Lock, ChevronRight, Phone, MapPin, Home, Search, Loader2 } from 'lucide-react';
import '../auth.css';
import { useTranslation } from '@/components/LanguageContext';
import { useSession } from 'next-auth/react';

function RegisterForm() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/member/home';

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [role, setRole] = useState('CUSTOMER');
  
  // Address Lookup State
  const [postcodeQuery, setPostcodeQuery] = useState('');
  const [addressResults, setAddressResults] = useState<{houseNumber: string, fullAddress: string}[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);

  const { t } = useTranslation();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl);
    }
    setTimeout(() => setRevealed(true), 100);
  }, [status, router, callbackUrl]);

  const handlePostcodeSearch = async () => {
    if (!postcodeQuery || postcodeQuery.length < 3) return;
    setIsSearching(true);
    setError('');
    try {
        const res = await fetch(`https://api.postcodes.io/postcodes/${postcodeQuery.replace(/\s/g, '')}`);
        const data = await res.json();
        if (data.status === 200) {
            const result = data.result;
            const area = result.admin_district || result.parliamentary_constituency;
            const region = result.region || result.country;
            
            // Simulate House Numbers for the Image 2 experience
            const mocks = [7, 12, 15, 22, 38].map(num => ({
                houseNumber: num.toString(),
                fullAddress: `${num} Westminster Way, ${area}, ${region}`
            }));
            setAddressResults(mocks);
        } else {
            setError("Invalid UK Postcode. Please try again.");
            setAddressResults([]);
        }
    } catch (e) {
        setError("Network error. Please enter address manually.");
    } finally {
        setIsSearching(false);
    }
  };

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    const res = await registerUser(formData);
    
    if ('error' in res && res.error) {
        const errorKey = res.error as keyof typeof t.auth.errors;
        setError(t?.auth?.errors?.[errorKey] || t?.auth?.errors?.serverError || "Server Error");
        setLoading(false);
     } else {
       const loginUrl = `/auth/login?registered=true${callbackUrl !== '/member/home' ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`;
       router.push(loginUrl);
    }
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card" style={{ maxWidth: '540px', padding: '3rem' }}>
        
        {/* Expert Signup Redirect Button */}
        <div style={{ marginBottom: '2rem' }}>
          <Link href="/join" className="expert-link-banner" style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            gap: '12px',
            padding: '12px 20px',
            background: 'rgba(212, 175, 55, 0.08)',
            border: '1px dashed rgba(212, 175, 55, 0.4)',
            borderRadius: '16px',
            color: '#d4af37',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 700,
            transition: 'all 0.3s ease'
          }}>
            <Shield size={18} />
            {t?.auth?.register?.expertSignupPrompt || "Register as Specialist Expert"}
            <ChevronRight size={16} />
          </Link>
        </div>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 className="hero-title" style={{ fontSize: '2.8rem', fontWeight: 900, marginBottom: '0.75rem', letterSpacing: '-0.02em' }}>
            {t?.auth?.register?.title || "Initialize Identity"}
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: 500 }}>
            {t?.auth?.register?.subtitle || "Join the UK's elite professional node array."}
          </p>
        </div>
        
        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {error && (
            <div className={`input-group revealed`} style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', padding: '1rem', borderRadius: '16px', fontSize: '0.85rem', border: '1px solid rgba(239, 68, 68, 0.2)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={18} />
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
             <div className="input-group revealed">
               <label>{t?.auth?.register?.firstNameLabel || "First Name"}</label>
               <div className="input-wrapper">
                 <User className="input-icon" size={18} />
                 <input type="text" name="firstName" className="premium-input" placeholder={t?.auth?.register?.firstNameLabel || "First Name"} required disabled={loading} />
               </div>
             </div>
             <div className="input-group revealed">
               <label>{t?.auth?.register?.lastNameLabel || "Last Name"}</label>
               <div className="input-wrapper">
                 <User className="input-icon" size={18} />
                 <input type="text" name="lastName" className="premium-input" placeholder={t?.auth?.register?.lastNameLabel || "Last Name"} required disabled={loading} />
               </div>
             </div>
          </div>

          <div className="input-group revealed">
            <label>{t?.auth?.register?.emailLabel || "Email Address"}</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                name="email" 
                className="premium-input" 
                placeholder={t?.auth?.register?.emailPlaceholder || "email@example.com"} 
                required 
                disabled={loading} 
              />
            </div>
          </div>

          {/* Role Selection - Restricted to Customer */}
          <div className="input-group revealed">
            <label>{t?.auth?.register?.accountTypeLabel || "Account Type"}</label>
            <div className="input-wrapper" style={{ border: '2px solid rgba(212, 175, 55, 0.6)', background: 'rgba(212, 175, 55, 0.05)' }}>
              <Shield className="input-icon" size={18} color="#d4af37" />
              <select name="role" className="premium-input" value={role} onChange={(e) => setRole(e.target.value)} disabled={loading} style={{ color: 'white', fontWeight: 800 }}>
                <option value="CUSTOMER">{t?.auth?.register?.roles?.customer || "Regular Customer"}</option>
              </select>
            </div>
          </div>

          <div className="input-group revealed">
            <label>{t?.auth?.register?.phoneLabel || "Phone Number"}</label>
            <div className="input-wrapper">
              <Phone className="input-icon" size={18} />
              <input 
                type="tel" 
                name="phone" 
                className="premium-input" 
                placeholder="+44 7... (UK Mobile)" 
                required 
                disabled={loading} 
              />
            </div>
          </div>

          {/* Advanced Address Search (Matches Image 2) */}
          <div className="input-group revealed">
             <label>{t?.auth?.register?.searchAddressLabel || "Search for your address"}</label>
             <div className="input-wrapper" style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                   <MapPin className="input-icon" size={18} />
                   <input 
                      type="text" 
                      className="premium-input" 
                      placeholder={t?.auth?.register?.searchAddressPlaceholder || "NG15 7HU"} 
                      value={postcodeQuery}
                      onChange={(e) => setPostcodeQuery(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handlePostcodeSearch())}
                   />
                </div>
                <button 
                  type="button" 
                  className="btn btn-primary" 
                  style={{ width: '80px', height: '100%', borderRadius: '14px', background: 'var(--accent-color)' }}
                  onClick={handlePostcodeSearch}
                  disabled={isSearching}
                >
                  {isSearching ? <Loader2 className="animate-spin" size={16} /> : <Search size={18} />}
                </button>
             </div>

             {/* Results Dropdown */}
             {addressResults.length > 0 && (
                <div className="address-results-dropdown fade-in" style={{
                    marginTop: '8px',
                    borderRadius: '16px',
                    background: '#111',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 15px 35px rgba(0,0,0,0.5)',
                    overflow: 'hidden',
                    zIndex: 10
                }}>
                   <div style={{ padding: '10px 16px', fontSize: '0.7rem', color: '#64748b', fontWeight: 700, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      {t?.auth?.register?.addressResultHint || "Select matching address:"}
                   </div>
                   {addressResults.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="address-item"
                        onClick={() => {
                            setSelectedAddress(item.fullAddress);
                            setPostcodeQuery(item.fullAddress);
                            setAddressResults([]);
                            // Set hidden fields
                            setRole(role); // Trigger dummy state update
                        }}
                        style={{
                            padding: '14px 16px',
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            borderBottom: idx === addressResults.length - 1 ? 'none' : '1px solid rgba(255,255,255,0.03)'
                        }}
                      >
                         <span style={{ fontWeight: 800, color: 'white' }}>{item.houseNumber} </span>
                         <span style={{ color: '#94a3b8' }}>{item.fullAddress.split(',').slice(0).join(',')}</span>
                      </div>
                   ))}
                </div>
             )}
          </div>

          {/* Hidden inputs for selected data */}
          <input type="hidden" name="postcode" value={postcodeQuery.split(',').pop()?.trim() || ''} />
          <input type="hidden" name="houseNumber" value={postcodeQuery.split(',')[0]?.trim() || ''} />
          
          <div className="input-group revealed">
            <label>{t?.auth?.register?.passwordLabel || "Safe Protocol (Password)"}</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input type="password" name="password" className="premium-input" placeholder={t?.auth?.register?.passwordHint || "Min 6 characters"} required minLength={6} disabled={loading} />
            </div>
          </div>

          <div className="input-group revealed">
            <label>{t?.auth?.register?.referralLabel || "Referral Code (Optional)"}</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input type="text" name="referredBy" className="premium-input" placeholder={t?.auth?.register?.referralPlaceholder || "Elite Referral ID"} defaultValue={searchParams.get('ref') || ''} disabled={loading} />
            </div>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary revealed" 
            disabled={loading} 
            style={{ width: '100%', padding: '1.25rem', marginTop: '1rem', background: 'var(--accent-color)', color: 'black', fontWeight: 900, borderRadius: '18px' }}
          >
            {loading ? (t?.auth?.register?.loading || "Initializing Identity...") : (t?.auth?.register?.submit || "Execute Integration")}
            <ChevronRight size={20} />
          </button>
        </form>

        <div className="divider">
          <span>{t?.auth?.register?.or || "OR"}</span>
        </div>

        <button 
          onClick={() => signIn('google', { callbackUrl })}
          className="btn-social"
          style={{ width: '100%', padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {t?.auth?.register?.google || "Sign in with Google"}
        </button>
        
        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '2.5rem' }}>
          {t?.auth?.register?.navToLogin || "Already have a node?"} <Link href={`/auth/login${callbackUrl !== '/member/home' ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`} style={{ color: 'var(--accent-color)', fontWeight: 800 }}>{t?.auth?.register?.signIn || "Sign In"}</Link>
        </div>
      </div>

      <style jsx>{`
        .address-item:hover {
            background: rgba(212, 175, 55, 0.1);
            padding-left: 20px;
            color: #d4af37;
        }
        .expert-link-banner:hover {
            background: rgba(212, 175, 55, 0.14);
            transform: translateY(-2px);
            border-color: #d4af37;
        }
      `}</style>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="auth-page-wrapper"><div className="auth-card" style={{ textAlign: 'center' }}>Connecting to Terminal...</div></div>}>
      <RegisterForm />
    </Suspense>
  );
}
