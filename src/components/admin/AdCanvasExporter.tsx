"use client";

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Award, 
  ShieldCheck, 
  Star, 
  Sparkles, 
  Download, 
  RefreshCw,
  Share2,
  Camera
} from 'lucide-react';
import { useTranslation } from "@/components/LanguageContext";

interface AdCanvasExporterProps {
  merchant: any;
  aiCopy?: { headline: string; body: string };
  onRegenerate: () => void;
}

export default function AdCanvasExporter({ merchant, aiCopy, onRegenerate }: AdCanvasExporterProps) {
  const { t } = useTranslation();
  const adRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);

  const handleDownload = async () => {
    setIsExporting(true);
    // In a real app, we would use html-to-image or similar.
    // For now, we simulate the "snapshot" feel and provide high-fidelity UI.
    setTimeout(() => {
      alert("AI Ad Exported! In this version, please use a screenshot of the premium preview above. In production, this will auto-generate a 2048x2048 PNG.");
      setIsExporting(false);
    }, 1500);
  };

  if (!merchant) return null;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>AI Ad Preview</h3>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '4px 0 0' }}>Square Format (1:1) - Perfect for Instagram & FB</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button 
            onClick={onRegenerate}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 20px', 
              borderRadius: '14px', 
              backgroundColor: '#ffffff', 
              border: '1px solid #e2e8f0', 
              color: '#d4af37', 
              fontSize: '13px', 
              fontWeight: 800, 
              cursor: 'pointer' 
            }}
          >
            <RefreshCw size={16} />
            Regenerate AI Copy
          </button>
          <button 
            onClick={handleDownload}
            disabled={isExporting}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              padding: '10px 20px', 
              borderRadius: '14px', 
              backgroundColor: '#0f172a', 
              border: 'none', 
              color: '#d4af37', 
              fontSize: '13px', 
              fontWeight: 800, 
              cursor: 'pointer',
              opacity: isExporting ? 0.7 : 1
            }}
          >
            {isExporting ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />}
            Download Ad
          </button>
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        padding: '3rem', 
        backgroundColor: '#f1f5f9', 
        borderRadius: '3rem', 
        border: '2px dashed #cbd5e1' 
      }}>
        <motion.div 
          ref={adRef}
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          style={{
            width: '500px',
            height: '500px',
            backgroundColor: '#0a0a0a',
            borderRadius: '12px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          {/* Background Effects */}
          <div style={{
            position: 'absolute',
            top: '-20%',
            right: '-20%',
            width: '80%',
            height: '80%',
            background: 'radial-gradient(circle, rgba(212, 175, 55, 0.1) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-10%',
            left: '-10%',
            width: '60%',
            height: '60%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }} />

          {/* Grid Pattern */}
          <div style={{ 
            position: 'absolute', 
            inset: 0, 
            backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.05) 1px, transparent 1px)', 
            backgroundSize: '24px 24px',
            opacity: 0.5
          }} />

          {/* Top Logo */}
          <div style={{ 
            padding: '30px', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            position: 'relative',
            zIndex: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '8px', 
                background: 'linear-gradient(135deg, #d4af37, #b8860b)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShieldCheck size={20} color="white" />
              </div>
              <span style={{ fontSize: '14px', fontWeight: 900, color: '#d4af37', letterSpacing: '0.1em' }}>CONCIERGE AI</span>
            </div>
            <div style={{ 
              padding: '6px 12px', 
              borderRadius: '99px', 
              backgroundColor: 'rgba(212,175,55,0.1)', 
              border: '1px solid rgba(212,175,55,0.2)',
              fontSize: '10px',
              fontWeight: 900,
              color: '#d4af37',
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Certified Expert Spotlight
            </div>
          </div>

          <div style={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            padding: '0 40px',
            position: 'relative',
            zIndex: 10
          }}>
             <motion.h4 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               style={{ 
                 fontSize: '32px', 
                 fontWeight: 900, 
                 color: 'white', 
                 lineHeight: 1.1, 
                 margin: '0 0 16px',
                 letterSpacing: '-0.02em'
               }}
             >
               {aiCopy?.headline || `Exceptional ${merchant.category || "Service"} by ${merchant.companyName || merchant.name}`}
             </motion.h4>
             <motion.p 
               initial={{ y: 20, opacity: 0 }}
               animate={{ y: 0, opacity: 1 }}
               transition={{ delay: 0.1 }}
               style={{ 
                 fontSize: '16px', 
                 color: 'rgba(255,255,255,0.7)', 
                 lineHeight: 1.5,
                 margin: '0 0 30px',
                 maxWidth: '90%'
               }}
             >
               {aiCopy?.body || "Connect with the UK's most vetted professionals. Quality guaranteed through our AI-audited booking system."}
             </motion.p>

             <div style={{ display: 'flex', gap: '30px' }}>
                <div>
                   <div style={{ fontSize: '10px', color: '#d4af37', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>Expert Rating</div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Star size={20} fill="#d4af37" color="#d4af37" />
                      <span style={{ fontSize: '24px', fontWeight: 900, color: 'white' }}>{merchant.rating || "5.0"}</span>
                   </div>
                </div>
                <div>
                   <div style={{ fontSize: '10px', color: '#d4af37', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '4px' }}>Proven Success</div>
                   <div style={{ fontSize: '24px', fontWeight: 900, color: 'white' }}>{merchant.totalJobs || "150"}+ <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Jobs</span></div>
                </div>
             </div>
          </div>

          {/* Bottom Bar */}
          <div style={{ 
            padding: '30px', 
            backgroundColor: 'rgba(212,175,55,0.05)', 
            borderTop: '1px solid rgba(212,175,55,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            zIndex: 10
          }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: 900, color: 'white' }}>{merchant.companyName || merchant.name}</div>
              <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', fontWeight: 700 }}>Exclusive on conciergeai.uk</div>
            </div>
            <div style={{ 
              padding: '10px 20px', 
              borderRadius: '99px', 
              background: 'linear-gradient(135deg, #d4af37, #f5e07a)',
              color: '#000',
              fontSize: '12px',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.1em'
            }}>
              Book Now
            </div>
          </div>

          {/* Corner Sparkle */}
          <div style={{ position: 'absolute', bottom: '150px', right: '40px', opacity: 0.3 }}>
            <Sparkles color="#d4af37" size={48} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
