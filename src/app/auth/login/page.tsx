"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh(); // Refresh layout to grab new session
    }
  }

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: '4rem 1.5rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="title" style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Sign in to access your UK Service Hub account.</p>
        </div>
        
        {isRegistered && !error && (
           <div style={{ backgroundColor: '#d1fae5', color: '#047857', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', border: '1px solid #6ee7b7', textAlign: 'center', fontWeight: 500 }}>
             Account created successfully! Please sign in.
           </div>
        )}

        {error && (
           <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', border: '1px solid #fca5a5' }}>
             {error}
           </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Email Address</label>
            <input type="email" name="email" className="input-field" placeholder="you@example.com" required disabled={loading} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <label style={{ fontWeight: 500, fontSize: '0.875rem' }}>Password</label>
              <Link href="#" style={{ fontSize: '0.875rem', color: 'var(--accent-color)' }}>Forgot password?</Link>
            </div>
            <input type="password" name="password" className="input-field" placeholder="••••••••" required disabled={loading} />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem', padding: '0.875rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Don&apos;t have an account? <Link href="/auth/register" style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ textAlign: 'center', padding: '4rem' }}>Loading form...</div>}>
      <LoginForm />
    </Suspense>
  );
}
