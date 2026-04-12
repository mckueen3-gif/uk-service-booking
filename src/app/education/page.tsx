"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EducationRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/services/education');
  }, [router]);

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
      <div>
        <div style={{ display: 'inline-block', width: '40px', height: '40px', border: '3px solid var(--accent-color)', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '1.5rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Establishing Protocol...</h2>
        <p style={{ color: 'var(--text-muted)' }}>Redirecting to the new unified Education Node.</p>
      </div>
    </div>
  );
}
