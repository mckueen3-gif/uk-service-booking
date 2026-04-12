"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

interface LegalAccordionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function LegalAccordion({ title, children, defaultOpen = false }: LegalAccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{ borderTop: '1px solid #e5e7eb' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ 
          width: '100%', padding: '40px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          textAlign: 'left', border: 'none', background: 'none', cursor: 'pointer' 
        }}
      >
        <h2 style={{ 
          fontSize: '32px', fontWeight: 800, color: '#1d1d1f', letterSpacing: '-0.022em', 
          lineHeight: 1.2, paddingRight: '32px', margin: 0 
        }}>
          {title}
        </h2>
        <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px' }}>
          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ color: '#9ca3af' }}
          >
            {isOpen ? <Minus size={32} strokeWidth={1} /> : <Plus size={32} strokeWidth={1} />}
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ paddingBottom: '48px' }}>
              <div style={{ fontSize: '19px', lineHeight: 1.6, fontWeight: 400, color: '#1d1d1f' }}>
                {children}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
