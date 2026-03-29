"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { requestPasswordReset } from "@/app/actions/auth";

export default function ForgotPasswordPage() {
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
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  if (submitted) {
    return (
      <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: '4rem 1.5rem' }}>
        <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '3rem', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
            <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '1rem', borderRadius: '50%' }}>
              <CheckCircle2 size={48} color="#22c55e" />
            </div>
          </div>
          <h1 className="title" style={{ fontSize: '2rem' }}>Check your email</h1>
          <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            If an account exists for <strong>{email}</strong>, you will receive a password reset link shortly.
          </p>
          <div style={{ marginTop: '1rem' }}>
            <Link href="/auth/login" className="btn btn-secondary" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <ArrowLeft size={18} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: '4rem 1.5rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '3rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="title" style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>Reset Password</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Enter your email address and we&apos;ll send you a link to reset your password.
          </p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
            <AlertCircle size={18} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field" 
                placeholder="you@example.com" 
                required 
                disabled={loading}
                style={{ paddingLeft: '3rem' }}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? "Sending link..." : "Send Reset Link"}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>
            <ArrowLeft size={16} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
