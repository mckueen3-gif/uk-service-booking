'use client';

import React from 'react';
import { 
  Wand2, 
  MessageSquare, 
  Search, 
  Video, 
  ArrowRight,
  Sparkles,
  Type,
  Layout,
  Megaphone,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Tool {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  badge: string;
  color: string;
  iconBg: string;
  href: string;
}

interface MerchantToolsProps {
  t: any;
}

export default function MerchantTools({ t }: MerchantToolsProps) {
  const tools: Tool[] = [
    {
      id: 'diagnosis',
      name: t?.merchant_dashboard?.tools?.diagnosis?.name || "AI Intelligent Diagnosis",
      description: t?.merchant_dashboard?.tools?.diagnosis?.desc || "Visual damage assessment & lead capture system",
      icon: <Wand2 size={24} />,
      badge: t?.merchant_dashboard?.tools?.diagnosis?.badge || "FREE",
      color: "#3b82f6",
      iconBg: "rgba(59, 130, 246, 0.1)",
      href: "/merchant/toolkit/diagnosis"
    },
    {
      id: 'whatsapp',
      name: t?.merchant_dashboard?.tools?.whatsapp?.name || "WhatsApp Real-time Connect",
      description: t?.merchant_dashboard?.tools?.whatsapp?.desc || "Instant notifications for new leads and queries",
      icon: <MessageSquare size={24} />,
      badge: t?.merchant_dashboard?.tools?.whatsapp?.badge || "FREE",
      color: "#10b981",
      iconBg: "rgba(16, 185, 129, 0.1)",
      href: "/merchant/toolkit/whatsapp"
    },
    {
      id: 'seo',
      name: t?.merchant_dashboard?.tools?.seo?.name || "SEO Profile Optimization",
      description: t?.merchant_dashboard?.tools?.seo?.desc || "Boost Google rankings & optimize metadata",
      icon: <Search size={24} />,
      badge: t?.merchant_dashboard?.tools?.seo?.badge || "FREE",
      color: "#f59e0b",
      iconBg: "rgba(245, 158, 11, 0.1)",
      href: "/merchant/toolkit/seo"
    },
    {
      id: 'ad_copy',
      name: t?.merchant_dashboard?.tools?.ad_copy?.name || "AI Ad Copy",
      description: t?.merchant_dashboard?.tools?.ad_copy?.desc || "Generate high-converting social media & ad slogans automatically",
      icon: <Megaphone size={24} />,
      badge: t?.merchant_dashboard?.tools?.ad_copy?.badge || "FREE",
      color: "#ec4899",
      iconBg: "rgba(236, 72, 153, 0.1)",
      href: "/merchant/toolkit/social"
    },
    {
      id: 'video',
      name: t?.merchant_dashboard?.tools?.video?.name || "Elite AI Video Config",
      description: t?.merchant_dashboard?.tools?.video?.desc || "Professional video import & AI knowledge syncing",
      icon: <Video size={24} />,
      badge: t?.merchant_dashboard?.tools?.video?.badge || "FREE",
      color: "#8b5cf6",
      iconBg: "rgba(139, 92, 246, 0.1)",
      href: "/merchant/ai-secretary"
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h2 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 900, 
          color: 'var(--text-primary)', 
          display: 'flex', 
          alignItems: 'center', 
          gap: '10px',
          margin: 0
        }}>
          <Sparkles size={24} color="#d4af37" />
          {t?.merchant_dashboard?.tools?.title || "Latest Available Items"}
        </h2>
        <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
          {t?.merchant_dashboard?.tools?.subtitle || "Curated growth tools for experts (All FREE)"}
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
        gap: '1.25rem' 
      }}>
        {tools.map((tool) => (
          <Link key={tool.id} href={tool.href} style={{ textDecoration: 'none' }}>
            <motion.div 
              whileHover={{ y: -5 }}
              style={{ 
                backgroundColor: 'var(--surface-1)', 
                borderRadius: '24px', 
                padding: '1.75rem', 
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.2s',
                cursor: 'pointer'
              }} className="tool-card">
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '1.5rem'
              }}>
                <div style={{ 
                  width: '52px', 
                  height: '52px', 
                  borderRadius: '16px', 
                  backgroundColor: tool.iconBg, 
                  color: tool.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {tool.icon}
                </div>
                <span style={{ 
                  fontSize: '0.7rem', 
                  fontWeight: 900, 
                  color: 'var(--accent-color)',
                  backgroundColor: 'rgba(212, 175, 55, 0.1)',
                  padding: '4px 10px',
                  borderRadius: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  border: '1px solid rgba(212, 175, 55, 0.2)'
                }}>
                  {tool.badge}
                </span>
              </div>

              <h3 style={{ 
                fontSize: '1.1rem', 
                fontWeight: 800, 
                marginBottom: '0.5rem',
                color: 'var(--text-primary)'
              }}>{tool.name}</h3>
              
              <p style={{ 
                fontSize: '0.85rem', 
                color: 'var(--text-secondary)', 
                lineHeight: 1.5, 
                marginBottom: '1.5rem',
                flexGrow: 1
              }}>
                {tool.description}
              </p>

              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                fontSize: '0.85rem', 
                fontWeight: 700, 
                color: 'var(--accent-color)',
              }} className="launch-btn">
                {t?.merchant_dashboard?.tools?.launch || "Launch Now"}
                <ChevronRight size={16} />
              </div>

              {/* Subtle Gradient Glow */}
              <motion.div 
                animate={{ 
                  opacity: [0.1, 0.3, 0.1],
                  scale: [1, 1.2, 1]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity,
                  ease: "easeInOut" 
                }}
                style={{
                  position: 'absolute',
                  bottom: '-20px',
                  right: '-20px',
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: `radial-gradient(circle, ${tool.color}44 0%, transparent 70%)`,
                  zIndex: 0
                }} 
              />
            </motion.div>
          </Link>
        ))}
      </div>

      <style jsx>{`
        .tool-card {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .tool-card:hover {
          border-color: var(--accent-color) !important;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(212, 175, 55, 0.05);
        }
        .launch-btn:hover {
          gap: 10px !important;
        }
      `}</style>
    </div>
  );
}
