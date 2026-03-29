"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { resetPassword } from "@/app/actions/auth";

function ResetPasswordForm() {
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
      setError("Invalid or missing reset token.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await resetPassword(token, password);

      if (res.error) {
        setError(res.error);
        setLoading(false);
      } else {
        setSuccess(true);
        setLoading(false);
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/auth/login?reset=success");
        }, 2000);
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '3rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.1)', padding: '1rem', borderRadius: '50%' }}>
            <CheckCircle2 size={48} color="#22c55e" />
          </div>
        </div>
        <h1 className="title" style={{ fontSize: '2rem' }}>Password Reset!</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Your password has been successfully updated. Redirecting you to the login page...
        </p>
      </div>
    );
  }

  if (!token) {
    return (
      <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '3rem', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
          <AlertCircle size={48} color="#ef4444" />
        </div>
        <h1 className="title" style={{ fontSize: '1.5rem' }}>Invalid Request</h1>
        <p style={{ color: 'var(--text-secondary)' }}>The password reset link is missing or invalid.</p>
        <Link href="/auth/forgot-password" className="btn btn-primary" style={{ marginTop: '1rem' }}>Request New Link</Link>
      </div>
    );
  }

  return (
    <div className="glass-panel" style={{ width: '100%', maxWidth: '450px', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '3rem' }}>
      <div style={{ textAlign: 'center' }}>
        <h1 className="title" style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>New Password</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Please enter your new password below.</p>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>New Password</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                <Lock size={18} />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field" 
              placeholder="••••••••" 
              required 
              minLength={6}
              disabled={loading}
              style={{ paddingLeft: '3rem' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Confirm New Password</label>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }}>
                <Lock size={18} />
            </div>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="input-field" 
              placeholder="••••••••" 
              required 
              disabled={loading}
              style={{ paddingLeft: '3rem' }}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', padding: '1rem', opacity: loading ? 0.7 : 1 }}>
          {loading ? "Updating..." : "Update Password"}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        <Link href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.875rem', textDecoration: 'none' }}>
          <ArrowLeft size={16} /> Back to Sign In
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: '4rem 1.5rem' }}>
      <Suspense fallback={<div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>Loading...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
