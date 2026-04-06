"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { requestPasswordReset } from "@/app/actions/auth";
import { getDictionary } from "@/lib/i18n/dictionary";

export default function ForgotPasswordPage() {
  const t = getDictionary('zh-TW');
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      const res = await requestPasswordReset(email);
      
      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        setSubmitted(true);
        setLoading(false);
      }
    } catch (err) {
      setError("發生非預期錯誤，請稍後再試。");
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="auth-page-wrapper">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div style={{ backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <CheckCircle2 size={48} color="#d4af37" />
            </div>
          </div>
          <h1 className="hero-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>{t.auth.forgotPassword.success}</h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            我們已將重設密碼連結發送至 <strong>{email}</strong>，請檢查您的收件匣。
          </p>
          <div style={{ marginTop: '2rem' }}>
            <Link href="/auth/login" className="btn btn-primary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <ArrowLeft size={18} /> {t.auth.forgotPassword.back}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page-wrapper">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{t.auth.forgotPassword.title}</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            {t.auth.forgotPassword.subtitle}
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.12)', marginBottom: '1.5rem' }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="input-group revealed">
            <label>{t.auth.forgotPassword.emailLabel}</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="premium-input" 
                placeholder={t.auth.forgotPassword.emailPlaceholder} 
                required 
                disabled={loading}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem' }}>
            {loading ? t.auth.forgotPassword.loading : t.auth.forgotPassword.submit}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <Link href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>
            <ArrowLeft size={16} /> {t.auth.forgotPassword.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
