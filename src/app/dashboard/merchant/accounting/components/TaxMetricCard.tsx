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
        <div style={{ color: '#d4af37', backgroundColor: 'rgba(212, 175, 55, 0.1)', padding: '0.6rem', borderRadius: '12px' }}>
          {icon}
        </div>
        {isLocked && <Lock size={16} color="#666" />}
      </div>

      <div>
        <h3 style={{ fontSize: '0.85rem', color: '#666', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{title}</h3>
        <p style={{ fontSize: '1.75rem', fontWeight: 900, color: isLocked ? '#444' : 'white', margin: '0.25rem 0' }}>{value}</p>
        <p style={{ fontSize: '0.75rem', color: '#555', fontWeight: 500 }}>{description}</p>
      </div>

      {isLocked && (
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          backgroundColor: 'rgba(5, 5, 5, 0.2)', 
          zIndex: 1 
        }} />
      )}
    </div>
  );
}
