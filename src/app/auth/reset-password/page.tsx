"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { resetPassword } from "@/app/actions/auth";
import { getDictionary } from "@/lib/i18n/dictionary";

function ResetPasswordForm() {
  const t = getDictionary('zh-TW');
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
      setError("無效或缺失的重設權杖。");
      return;
    }

    if (password !== confirmPassword) {
      setError("密碼不相符。");
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
        setTimeout(() => {
          router.push("/auth/login?reset=success");
        }, 2000);
      }
    } catch (err) {
      setError("發生非預期錯誤，請稍後再試。");
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
        <h1 className="hero-title" style={{ fontSize: '2rem', marginBottom: '1rem' }}>密碼重設成功！</h1>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          您的密碼已成功更新。正在為您跳轉至登入頁面...
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
        <h1 className="hero-title" style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>無效請求</h1>
        <p style={{ color: 'var(--text-secondary)' }}>重設密碼連結已過期或無效。</p>
        <Link href="/auth/forgot-password" className="btn btn-primary" style={{ marginTop: '2rem', width: '100%' }}>請求新連結</Link>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 className="hero-title" style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>設定新密碼</h1>
        <p style={{ color: 'var(--text-muted)' }}>請在下方輸入您的新密碼。</p>
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', padding: '1rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', border: '1px solid rgba(239, 68, 68, 0.12)', marginBottom: '1.5rem' }}>
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="input-group revealed">
          <label>新密碼</label>
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
          <label>確認新密碼</label>
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
          {loading ? "更新中..." : "更新密碼"}
        </button>
      </form>

      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Link href="/auth/login" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.875rem', textDecoration: 'none', fontWeight: 600 }}>
          <ArrowLeft size={16} /> 返回登入
        </Link>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="auth-page-wrapper">
      <Suspense fallback={<div className="auth-card" style={{ textAlign: 'center' }}>載入中...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
