'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mail, Lock, LogIn, AlertCircle, CheckCircle2 } from 'lucide-react';
import '../auth.css';
import { useTranslation } from '@/components/LanguageContext';
import { useSession } from 'next-auth/react';

function LoginForm() {
  const router = useRouter();
  const { status } = useSession();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get('registered');
  const callbackUrl = searchParams.get('callbackUrl') || '/member/home';

  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace(callbackUrl);
    }
    setTimeout(() => setRevealed(true), 100);
  }, [status, router, callbackUrl]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      // result.error for credentials is usually 'CredentialsSignin'
      setError(t?.auth?.errors?.invalidCredentials || "Invalid credentials provided.");
      setLoading(false);
    } else {
      router.push(callbackUrl);
      router.refresh();
    }
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.75rem', display: 'block' }}>{t?.auth?.login?.title || "Initialize Session"}</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {t?.auth?.login?.subtitle || "Enter your credentials to access the mesh."}
          </p>
        </div>
        
        {isRegistered && !error && (
           <div className={`input-group ${revealed ? 'revealed' : ''}`} style={{ backgroundColor: 'rgba(52, 211, 153, 0.05)', color: '#d4af37', padding: '1rem', borderRadius: '12px', fontSize: '0.875rem', border: '1px solid rgba(52, 211, 153, 0.2)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <CheckCircle2 size={18} />
             {t?.auth?.login?.success || "Registration verified."}
           </div>
        )}

        {error && (
           <div className={`input-group ${revealed ? 'revealed' : ''}`} style={{ backgroundColor: 'rgba(219, 39, 119, 0.05)', color: '#db2777', padding: '1rem', borderRadius: '12px', fontSize: '0.875rem', border: '1px solid rgba(219, 39, 119, 0.2)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
             <AlertCircle size={18} />
             {error}
           </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column' }}>
          <div className={`input-group ${revealed ? 'revealed' : ''}`} style={{ animationDelay: '100ms' }}>
            <label>{t?.auth?.login?.emailLabel || "Email Vector"}</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input type="email" name="email" className="premium-input" placeholder={t?.auth?.login?.emailPlaceholder || "your@email.com"} required disabled={loading} />
            </div>
          </div>
          
          <div className={`input-group ${revealed ? 'revealed' : ''}`} style={{ animationDelay: '150ms' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ marginBottom: 0 }}>{t?.auth?.login?.passwordLabel || "Security Key"}</label>
              <Link href="/auth/forgot-password" style={{ fontSize: '0.85rem', color: 'var(--accent-color)', fontWeight: 600 }}>{t?.auth?.login?.forgotPassword || "Reset Key"}</Link>
            </div>
            <div className="input-wrapper">
              <Lock className="input-icon" size={18} />
              <input type="password" name="password" className="premium-input" placeholder={t?.auth?.login?.passwordPlaceholder || "••••••••"} required disabled={loading} />
            </div>
          </div>
          
          <button 
            type="submit" 
            className={`btn btn-primary ${revealed ? 'revealed' : ''}`} 
            disabled={loading} 
            style={{ width: '100%', padding: '1rem', marginTop: '0.5rem', animationDelay: '200ms' }}
          >
            {loading ? (t?.auth?.login?.loading || "Verifying...") : (t?.auth?.login?.submit || "Enter Interface")}
            <LogIn size={20} />
          </button>
        </form>

        <div className="divider">
          <span>{revealed ? (t?.auth?.login?.or || "OR") : ''}</span>
        </div>

        <button 
          onClick={() => signIn('google', { callbackUrl })}
          className="btn-social" 
          style={{ opacity: revealed ? 1 : 0, transitionDelay: '250ms' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {t?.auth?.login?.google || "Continue with Google"}
        </button>
        
        <div style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)', marginTop: '2rem' }}>
          {t?.auth?.login?.navToRegister || "New to the platform?"} <Link href="/auth/register" style={{ color: 'var(--accent-color)', fontWeight: 800 }}>{t?.auth?.login?.createAccount || "Create Node"}</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { t } = useTranslation();
  return (
    <Suspense fallback={<div className="auth-page-wrapper"><div className="auth-card" style={{ textAlign: 'center' }}>{t?.auth?.loading?.preparing || "Calibrating interface..."}</div></div>}>
      <LoginForm />
    </Suspense>
  );
}
