"use client";

import { ReactNode } from "react";
import { Lock } from "lucide-react";

interface TaxMetricCardProps {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  isLocked?: boolean;
}

export default function TaxMetricCard({ title, value, description, icon, isLocked }: TaxMetricCardProps) {
  return (
    <div className="glass-panel" style={{ 
      padding: '1.5rem', 
      borderRadius: '24px', 
      background: 'rgba(15, 15, 15, 0.4)', 
      border: '1px solid rgba(212, 175, 55, 0.05)',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      transition: 'all 0.3s ease',
      filter: isLocked ? 'blur(1px) grayscale(0.5)' : 'none',
      opacity: isLocked ? 0.7 : 1
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ 
          padding: '0.65rem',
          backgroundColor: 'var(--accent-soft)', 
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-color)'
        }}>
          {icon}
        </div>
        {isLocked && <Lock size={16} color="#666" />}
      </div>

      <div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '0.25rem' }}>{title}</div>
        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>{value}</div>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{description}</p>
      </div>

      {isLocked && (
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundColor: 'var(--surface-1)', 
          opacity: 0.2,
          zIndex: 1 
        }} />
      )}
    </div>
  );
}
