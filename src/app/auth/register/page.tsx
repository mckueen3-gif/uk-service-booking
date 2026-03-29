"use client";

import { useState } from "react";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError("");
    const res = await registerUser(formData);
    
    if ("error" in res && res.error) {
      setError(res.error as string);
      setLoading(false);
    } else {
      // Registration successful! Redirect to login.
      router.push("/auth/login?registered=true");
    }
  }

  return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 'calc(100vh - 200px)', padding: '4rem 1.5rem' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 className="title" style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Create an Account</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Join the UK Service Hub as a Customer or Professional.</p>
        </div>
        
        <form action={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          
          {error && <div style={{ backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', border: '1px solid #fca5a5' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '1rem' }}>
             <div style={{ flex: 1 }}>
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>First Name</label>
               <input type="text" name="firstName" className="input-field" placeholder="John" required disabled={loading} />
             </div>
             <div style={{ flex: 1 }}>
               <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Last Name</label>
               <input type="text" name="lastName" className="input-field" placeholder="Doe" required disabled={loading} />
             </div>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Email Address</label>
            <input type="email" name="email" className="input-field" placeholder="you@example.com" required disabled={loading} />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Account Type</label>
            <select name="role" className="input-field" required defaultValue="CUSTOMER" disabled={loading} style={{ appearance: 'none' }}>
              <option value="CUSTOMER">Customer (Looking for services)</option>
              <option value="MERCHANT">Professional (Offering services)</option>
            </select>
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.875rem' }}>Password</label>
            <input type="password" name="password" className="input-field" placeholder="Create a strong password (min 6 chars)" required minLength={6} disabled={loading} />
          </div>
          
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', marginTop: '0.5rem', padding: '0.875rem', opacity: loading ? 0.7 : 1 }}>
            {loading ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <div style={{ display: 'flex', alignItems: 'center', margin: '0.5rem 0', gap: '1rem' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)', opacity: 0.5 }}></div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>or</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--border-color)', opacity: 0.5 }}></div>
        </div>

        <button 
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="btn btn-secondary" 
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.75rem',
            padding: '0.75rem',
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            transition: 'all 0.2s ease'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Sign up with Google
        </button>
        
        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Already have an account? <Link href="/auth/login" style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
