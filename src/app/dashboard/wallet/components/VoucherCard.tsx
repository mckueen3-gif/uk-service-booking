"use client";

import React from 'react';
import { ShoppingBag, Globe, Store, Lock, Sparkles, TrendingUp } from 'lucide-react';

interface VoucherCardProps {
  name: string;
  category: string;
  type: string;
  isLocked: boolean;
  isNew?: boolean;
  isPumpedUp?: boolean;
  isPremium?: boolean;
  onRedeem: (name: string) => void;
}

const VoucherCard: React.FC<VoucherCardProps> = ({ 
  name, 
  category, 
  type, 
  isLocked, 
  isNew, 
  isPumpedUp,
  isPremium,
  onRedeem 
}) => {
  // Generate a consistent placeholder color based on name
  const getBrandColor = (str: string) => {
    const colors = ['#d4af37', '#e5c100', '#b8860b', '#ffd700'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const brandColor = getBrandColor(name);

  return (
    <div 
      style={{
        position: 'relative',
        background: '#fff',
        borderRadius: '16px',
        border: isPremium ? '2px solid #d4af37' : `1.5px solid ${isPumpedUp ? '#d4af37' : 'rgba(212, 175, 55, 0.2)'}`,
        padding: '20px',
        textAlign: 'center',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        cursor: isLocked ? 'not-allowed' : 'pointer',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        boxShadow: isPremium ? '0 10px 40px rgba(184, 134, 11, 0.15)' : '0 4px 12px rgba(184, 134, 11, 0.05)'
      }}
      className={!isLocked ? `hover-lift ${isPremium ? 'shimmer-gold' : ''} group` : ""}
      onClick={() => !isLocked && onRedeem(name)}
    >
      {/* Badges Container */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
        zIndex: 2
      }}>
        {isPumpedUp && (
          <div style={{
            background: '#d4af37',
            color: '#000',
            fontSize: '9px',
            fontWeight: '800',
            padding: '2px 6px',
            borderRadius: '4px',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            <TrendingUp size={10} />
            PUMPED UP
          </div>
        )}
        {isNew && (
          <div style={{
            background: '#10b981',
            color: '#fff',
            fontSize: '9px',
            fontWeight: '800',
            padding: '2px 6px',
            borderRadius: '4px',
            textTransform: 'uppercase'
          }}>
            NEW
          </div>
        )}
      </div>

      {/* Lock Overlay */}
      {isLocked && (
        <div style={{
          position: 'absolute',
          top: '12px',
          right: '12px',
          color: 'var(--text-muted)'
        }}>
          <Lock size={16} />
        </div>
      )}

      {/* Brand Icon Decorator */}
      {isPumpedUp && (
        <div style={{
          position: 'absolute',
          top: '-10px',
          right: '-10px',
          width: '50px',
          height: '50px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />
      )}

      {/* Logo/Initial Container */}
      <div style={{
        width: '70px',
        height: '70px',
        margin: '20px auto 15px',
        borderRadius: '12px',
        background: 'var(--surface-3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '28px',
        fontWeight: 'bold',
        color: isLocked ? 'var(--text-muted)' : brandColor,
        border: `1px solid ${isPumpedUp ? 'rgba(212,175,55,0.4)' : isLocked ? 'transparent' : 'rgba(212,175,55,0.1)'}`,
        boxShadow: isLocked ? 'none' : 'var(--shadow-sm)',
        position: 'relative'
      }}>
        {name.charAt(0)}
        {isPumpedUp && (
          <Sparkles 
            size={16} 
            style={{ 
              position: 'absolute', 
              bottom: '-5px', 
              right: '-5px', 
              color: '#d4af37' 
            }} 
            fill="#d4af37"
          />
        )}
      </div>

      <div style={{ marginBottom: '10px' }}>
        <h3 style={{
          fontSize: '16px',
          fontWeight: '700',
          color: '#0f172a',
          marginBottom: '4px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis'
        }}>
          {name}
        </h3>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          fontSize: '12px',
          color: '#334155',
          fontWeight: '500'
        }}>
          {type.includes('Online') && <Globe size={12} style={{ color: '#d4af37' }} />}
          {type.includes('Instore') && <Store size={12} style={{ color: '#d4af37' }} />}
          <span style={{ color: '#475569' }}>{type}</span>
        </div>
      </div>

      {!isLocked && (
        <button 
          style={{
            width: '100%',
            padding: '8px',
            background: isPumpedUp ? 'rgba(212, 175, 55, 0.2)' : 'rgba(212, 175, 55, 0.1)',
            border: `1px solid ${isPumpedUp ? '#d4af37' : 'rgba(212, 175, 55, 0.3)'}`,
            borderRadius: '8px',
            color: '#d4af37',
            fontSize: '12px',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          className="group-hover:bg-[#d4af37] group-hover:text-black"
        >
          立即兌換
        </button>
      )}
    </div>
  );
};

export default VoucherCard;
