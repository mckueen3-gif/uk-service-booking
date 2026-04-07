"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { resetPassword } from "@/app/actions/auth";
import { useTranslation } from "@/components/LanguageContext";

function ResetPasswordForm() {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) {
      setError(t.auth.resetPassword.invalidToken);
      return;
    }

    if (password !== confirmPassword) {
      setError(t.auth.resetPassword.notMatch);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await resetPassword(token, password);

      if (res.error) {
        const errorKey = res.error as keyof typeof t.auth.errors;
        setError(t.auth.errors[errorKey] || t.auth.resetPassword.error);
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        setTimeout(() => {
          router.push("/auth/login?reset=success");
        }, 2000);
      }
    } catch (err) {
      setError(t.auth.resetPassword.error);
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '1rem', borderRadius: '50%' }}>
            <CheckCircle2 size={48} color="#d4af37" />
          </div>
        </div>
        <h1 className="hero-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t.auth.resetPassword.success}</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          {t.auth.resetPassword.successDetail}
        </p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="auth-card" style={{ textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <AlertCircle size={48} color="#ef4444" />
        </div>
        <h1 className="hero-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>{t.auth.resetPassword.invalidToken}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>{t.auth.resetPassword.invalidTokenDetail}</p>
        <Link href="/auth/forgot-password" className="btn btn-primary" style={{ marginTop: '2rem', width: '100%' }}>{t.auth.resetPassword.requestNewLink}</Link>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{t.auth.resetPassword.title}</h1>
        <p style={{ color: 'var(--text-muted)' }}>{t.auth.resetPassword.subtitle}</p>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.12)', marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="input-group revealed">
          <label>{t.auth.resetPassword.passwordLabel}</label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="premium-input" 
              placeholder="••••••••" 
              required 
              minLength={6}
              disabled={loading}
            />
          </div>
        </div>

        <div className="input-group revealed">
          <label>{t.auth.resetPassword.confirmPasswordLabel}</label>
          <div className="input-wrapper">
            <Lock className="input-icon" size={18} />
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="premium-input" 
              placeholder="••••••••" 
              required 
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
          {loading ? t.auth.resetPassword.loading : t.auth.resetPassword.submit}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={16} /> {t.auth.resetPassword.back}
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  return (
    <div className="auth-page-wrapper">
      <Suspense fallback={<div className="auth-card" style={{ textAlign: 'center' }}>{t.auth.loading.preparing}</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
