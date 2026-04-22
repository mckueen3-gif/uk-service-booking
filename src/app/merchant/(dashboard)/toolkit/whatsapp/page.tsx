"use client";

import { useState } from "react";
import { 
  MessageSquare, 
  ArrowLeft, 
  CheckCircle2, 
  Smartphone, 
  Bell, 
  Zap,
  Loader2,
  ExternalLink
} from "lucide-react";
import { useTranslation } from "@/components/LanguageContext";
import Link from "next/link";
import { motion } from "framer-motion";

export default function WhatsAppConnectPage() {
  const { t } = useTranslation();
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState(false);

  const handleConnect = () => {
    setConnecting(true);
    setTimeout(() => {
      setConnecting(false);
      setConnected(true);
    }, 2000);
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '900px', margin: '0 auto' }}>
      <header style={{ marginBottom: '3rem' }}>
        <Link 
          href="/merchant/toolkit"
          style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '8px', 
            color: 'var(--text-muted)', 
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            marginBottom: '1.5rem',
            transition: 'color 0.2s'
          }}
          onMouseOver={(e) => (e.currentTarget.style.color = 'var(--accent-color)')}
          onMouseOut={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <ArrowLeft size={16} /> {t?.merchant?.toolkit?.back || "Back to Toolkit"}
        </Link>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
              {t?.merchant?.toolkit?.whatsapp?.title || "WhatsApp Real-time Connect"}
            </h1>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>
              {t?.merchant?.toolkit?.whatsapp?.desc || "Instant notifications for new leads and queries"}
            </p>
          </div>
          <div style={{ 
            backgroundColor: 'rgba(16, 185, 129, 0.1)', 
            padding: '0.5rem 1rem', 
            borderRadius: '12px',
            border: '1px solid rgba(16, 185, 129, 0.2)',
            color: '#10b981',
            fontSize: '0.8rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {t?.merchant_dashboard?.tools?.whatsapp?.badge || "FREE"}
          </div>
        </div>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {/* Connection Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            backgroundColor: 'var(--surface-1)', 
            borderRadius: '24px', 
            border: '1px solid var(--border-color)',
            padding: '2rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '24px', 
            backgroundColor: connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)',
            color: connected ? '#10b981' : 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1.5rem'
          }}>
            <MessageSquare size={40} />
          </div>

          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.75rem' }}>
            {connected ? (t?.merchant?.toolkit?.whatsapp?.gateway_active || "Gateway Active") : (t?.merchant?.toolkit?.whatsapp?.init_connection || "Initialize Connection")}
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem' }}>
            {connected 
              ? (t?.merchant?.toolkit?.whatsapp?.active_desc || "Your WhatsApp node is successfully linked. You will now receive instant push notifications for every high-intent lead.")
              : (t?.merchant?.toolkit?.whatsapp?.init_desc || "Link your business WhatsApp account to receive real-time updates and customer inquiry notifications directly on your phone.")}
          </p>

          {!connected ? (
            <button 
              onClick={handleConnect}
              disabled={connecting}
              style={{ 
                width: '100%', 
                padding: '1rem', 
                borderRadius: '16px', 
                backgroundColor: 'var(--text-primary)', 
                color: 'var(--bg-primary)',
                border: 'none',
                fontWeight: 800,
                fontSize: '1rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px'
              }}
            >
              {connecting ? <Loader2 className="animate-spin" size={20} /> : <Zap size={20} />}
              {connecting ? (t?.merchant?.toolkit?.whatsapp?.syncing || "Synchronizing...") : (t?.merchant?.toolkit?.whatsapp?.link_now || "Link WhatsApp Now")}
            </button>
          ) : (
            <div style={{ 
              width: '100%', 
              padding: '1rem', 
              borderRadius: '16px', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              color: '#10b981',
              fontWeight: 800,
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <CheckCircle2 size={20} /> {t?.merchant?.toolkit?.whatsapp?.secured || "Connection Secured"}
            </div>
          )}
        </motion.div>

        {/* Features Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[
            {
              icon: <Bell size={20} />,
              title: t?.merchant?.toolkit?.whatsapp?.features?.alerts?.title || "Instant Lead Alerts",
              desc: t?.merchant?.toolkit?.whatsapp?.features?.alerts?.desc || "Get notified the second a customer expresses interest in your service.",
              color: "#3b82f6"
            },
            {
              icon: <Smartphone size={20} />,
              title: t?.merchant?.toolkit?.whatsapp?.features?.mobile?.title || "Mobile Management",
              desc: t?.merchant?.toolkit?.whatsapp?.features?.mobile?.desc || "Reply to inquiries directly through WhatsApp without logging into the dashboard.",
              color: "#8b5cf6"
            },
            {
              icon: <Zap size={20} />,
              title: t?.merchant?.toolkit?.whatsapp?.features?.sync?.title || "AI Response Sync",
              desc: t?.merchant?.toolkit?.whatsapp?.features?.sync?.desc || "Aura AI can draft responses for you to review and send with one click.",
              color: "#d4af37"
            }
          ].map((feat, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{ 
                backgroundColor: 'var(--surface-1)', 
                borderRadius: '20px', 
                border: '1px solid var(--border-color)',
                padding: '1.25rem',
                display: 'flex',
                gap: '1.25rem'
              }}
            >
              <div style={{ 
                width: '44px', 
                height: '44px', 
                borderRadius: '12px', 
                backgroundColor: `${feat.color}11`, 
                color: feat.color,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {feat.icon}
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.25rem' }}>{feat.title}</h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{feat.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <footer style={{ marginTop: '4rem', padding: '2rem', backgroundColor: 'rgba(212, 175, 55, 0.03)', borderRadius: '24px', border: '1px solid rgba(212, 175, 55, 0.1)' }}>
        <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem', fontWeight: 800, marginBottom: '1rem' }}>
          <Zap size={20} color="#d4af37" /> {t?.merchant?.toolkit?.whatsapp?.elite_title || "Elite Expert Integration"}
        </h4>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {t?.merchant?.toolkit?.whatsapp?.elite_desc || "WhatsApp Connect is an exclusive feature for verified ConciergeAI experts. It allows you to maintain a 100% response rate, which significantly boosts your ranking in our search algorithm."}
        </p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button style={{ 
            padding: '0.75rem 1.25rem', 
            borderRadius: '12px', 
            backgroundColor: 'var(--bg-primary)', 
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            fontSize: '0.85rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {t?.merchant?.toolkit?.whatsapp?.view_docs || "View Documentation"} <ExternalLink size={14} />
          </button>
        </div>
      </footer>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
