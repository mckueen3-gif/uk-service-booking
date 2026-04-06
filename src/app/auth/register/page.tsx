'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { registerUser } from '@/app/actions/auth';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { User, Mail, Shield, Lock, ChevronRight } from 'lucide-react';
import '../auth.css';
import { useTranslation } from '@/components/LanguageContext';

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    // Start stagger animation
    setTimeout(() => setRevealed(true), 100);
  }, []);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError('');
    const res = await registerUser(formData);
    
    if ('error' in res && res.error) {
       setError(res.error as string);
       setLoading(false);
    } else {
       const loginUrl = `/auth/login?registered=true${callbackUrl !== '/' ? `&callbackUrl=${encodeURIComponent(callbackUrl)}` : ''}`;
       router.push(loginUrl);
    }
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'block' }}>{t.auth.register.title}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {t.auth.register.subtitle}
          </p>
        </div>
        
        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          
          {error && (
            <div className={`input-group ${revealed ? 'revealed' : ''}`} style={{ backgroundColor: 'rgba(219, 39, 119, 0.05)', color: '#db2777', padding: '1rem', borderRadius: '12px', fontSize: '0.875rem', border: '1px solid rgba(219, 39, 119, 0.2)', marginBottom: '1.5rem' }}>
              <Shield size={18} style={{ marginRight: '8px', display: 'inline' }} />
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '1rem' }}>
             <div className={`input-group ${revealed ? 'revealed' : ''}`} style={{ flex: 1, animationDelay: '100ms' }}>
               <label>{t.auth.register.firstNameLabel}</label>
               <div className="input-wrapper">
                 <User className="input-icon" size={18} />
                 <input type="text" name="firstName" className="premium-input" placeholder={t.auth.register.firstNameLabel} required disabled={loading} />
               </div>
             </div>
             <div className={`input-group ${revealed ? 'revealed' : ''}`} style={{ flex: 1, animationDelay: '150ms' }}>
               <label>{t.auth.register.lastNameLabel}</label>
               <div className="input-wrapper">
                 <User className="input-icon" size={18} />
                 <input type="text" name="lastName" className="premium-input" placeholder={t.auth.register.lastNameLabel} required disabled={loading} />
               </div>
             </div>
          </div>
          
          <div className={`input-group ${revealed ? 'revealed' : ''}`} style={{ animationDelay: '200ms' }}>
            <label>{t.auth.register.emailLabel}</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                name="email" 
                className="premium-input" 
                placeholder={t.auth.register.emailPlaceholder} 
                required 
                disabled={loading} 
              />
            </div>
          </div>

          <div className={`input-group ${revealed ? 'revealed' : ''}`} style={{ animationDelay: '250ms' }}>
            <label>{t.auth.register.accountTypeLabel}</label>
            <div className="input-wrapper">
              <Shield className="input-icon" size={18} />
              <select name="role" className="premium-input" required defaultValue="CUSTOMER" disabled={loading} style={{ appearance: 'none', cursor: 'pointer' }}>
                <option value="CUSTOMER">{t.auth.register.roles.customer}</option>
                <option value="MERCHANT">{t.auth.register.roles.merchant}</option>
              </select>
            </div>
          </div>
          
          <div className={`input-group ${revealed ? 'revealed' : ''}`} style={{ animationDelay: '300ms' }}>
            <label>{t.auth.register.passwordLabel}</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input type="password" name="password" className="premium-input" placeholder={t.auth.register.passwordHint} required minLength={6} disabled={loading} />
            </div>
          </div>

          <div className={`input-group ${revealed ? 'revealed' : ''}`} style={{ animationDelay: '325ms' }}>
            <label>{t.auth.register.referralLabel}</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input type="text" name="referredBy" className="premium-input" placeholder={t.auth.register.referralPlaceholder} defaultValue={searchParams.get('ref') || ''} disabled={loading} />
            </div>
          </div>
          
          <button 
            type="submit" 
            className={`btn btn-primary ${revealed ? 'revealed' : ''}`} 
            disabled={loading} 
            style={{ width: '100%', padding: '1rem', marginTop: '1.5rem', animationDelay: '350ms' }}
          >
            {loading ? t.auth.register.loading : t.auth.register.submit}
            <ChevronRight size={20} />
          </button>
        </form>

        <div className="divider">
          <span>{revealed ? t.auth.register.or : ''}</span>
        </div>

        <button 
          onClick={() => signIn('google', { callbackUrl })}
          className="btn-social"
          style={{ opacity: revealed ? 1 : 0, transitionDelay: '400ms' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {t.auth.register.google}
        </button>
        
        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
          {t.auth.register.navToLogin} <Link href="/auth/login" style={{ color: 'var(--accent-color)', fontWeight: 800 }}>{t.auth.register.signIn}</Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="auth-page-wrapper"><div className="auth-card" style={{ textAlign: 'center' }}>初始化中...</div></div>}>
      <RegisterForm />
    </Suspense>
  );
}
