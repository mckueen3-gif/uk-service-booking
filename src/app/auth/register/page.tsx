"use client";

import { useState } from "react";
import Link from "next/link";
import { registerUser } from "@/app/actions/auth";
import { useRouter } from "next/navigation";

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
        
        <div style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Already have an account? <Link href="/auth/login" style={{ color: 'var(--accent-color)', fontWeight: 600 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
