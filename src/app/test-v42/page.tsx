'use client';

export default function TestPage() {
  return (
    <div style={{ padding: '4rem', textAlign: 'center' }}>
      <h1 style={{ color: '#d4af37' }}>CONCIERGE V4.2 DEPLOY TEST</h1>
      <p>If you see this page, the build with Ref: V42_DEPLOY_CB_8822 is successfully deployed.</p>
      <p>Time: {new Date().toISOString()}</p>
    </div>
  );
}
