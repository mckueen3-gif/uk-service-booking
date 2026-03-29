import { ShieldCheck } from 'lucide-react';

export default function VerifiedBadge({ size = 16, showText = false }: { size?: number, showText?: boolean }) {
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#2563eb' }}>
      <div style={{ 
        backgroundColor: '#dbeafe', 
        padding: '0.2rem', 
        borderRadius: '50%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        border: '1px solid #bfdbfe'
      }}>
        <ShieldCheck size={size} fill="#2563eb" color="white" />
      </div>
      {showText && <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Verified Pro</span>}
    </div>
  );
}
