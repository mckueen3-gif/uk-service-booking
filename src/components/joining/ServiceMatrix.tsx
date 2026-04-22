'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/components/LanguageContext';
import { SERVICE_CATALOG, ServiceItem } from '@/lib/constants/service-catalog';
import { Sparkles, Loader2, Check, Search, ChevronDown, ChevronUp, Wand2 } from 'lucide-react';
import { mapExpertSkills } from '@/app/actions/map-skills';

interface ServiceMatrixProps {
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  selectedSector: string | null;
}

export default function ServiceMatrix({ selectedIds, onChange, selectedSector }: ServiceMatrixProps) {
  const { t } = useTranslation();
  const [description, setDescription] = useState('');
  const [isMapping, setIsMapping] = useState(false);
  const [expandedTrades, setExpandedTrades] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Group services by trade based on selected sector
  const filteredCatalog = SERVICE_CATALOG.filter(item => {
    if (!selectedSector) return true;
    if (selectedSector === 'technical') return item.vertical === 'utilities' || item.vertical === 'renovation';
    if (selectedSector === 'professional') return item.vertical === 'professional';
    if (selectedSector === 'home_services') return item.vertical === 'home_services';
    return true;
  });

  const trades = Array.from(new Set(filteredCatalog.map(item => item.trade)));

  const toggleTrade = (trade: string) => {
    setExpandedTrades(prev => 
      prev.includes(trade) ? prev.filter(t => t !== trade) : [...prev, trade]
    );
  };

  const toggleService = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter(i => i !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  const handleAIMap = async () => {
    if (description.length < 10) return;
    setIsMapping(true);
    try {
      const result = await mapExpertSkills(description);
      if (result.success && result.matchedIds) {
        // Merge with existing OR replace? User said "modified chance", let's merge for now
        const newIds = Array.from(new Set([...selectedIds, ...result.matchedIds]));
        onChange(newIds);
        
        // Auto-expand trades containing matches
        const matchedTrades = SERVICE_CATALOG
          .filter(s => result.matchedIds!.includes(s.id))
          .map(s => s.trade);
        setExpandedTrades(prev => Array.from(new Set([...prev, ...matchedTrades])));
      }
    } catch (error) {
      console.error("AI Mapping failed", error);
    } finally {
      setIsMapping(false);
    }
  };

  return (
    <div className="service-matrix-container">
      <div className="ai-assist-box premium-glass">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={20} className="text-gold" />
          <h3 className="text-lg font-bold text-white">{t.ai_assistant.map_title}</h3>
        </div>
        
        <p className="text-sm text-gray-400 mb-4">{t.ai_assistant.map_description}</p>
        
        <div className="flex flex-col gap-3">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.ai_assistant.map_placeholder}
            className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-gold/50 outline-none transition-all min-h-[100px]"
          />
          
          <button
            onClick={handleAIMap}
            disabled={isMapping || description.length < 10}
            className={`btn-ai-magic ${isMapping ? 'loading' : ''}`}
          >
            {isMapping ? (
              <><Loader2 size={18} className="animate-spin" /> {t.ai_assistant.map_processing}</>
            ) : (
              <><Wand2 size={18} /> {t.ai_assistant.map_button}</>
            )}
          </button>
        </div>
      </div>

      <div className="matrix-controls flex items-center justify-between mt-8 mb-6">
        <div className="search-box relative flex-1 max-w-md">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search skills (e.g. electrical, plumbing, taxes...)"
            className="w-full bg-white/5 border border-white/10 rounded-full py-3 pl-12 pr-4 text-sm text-white focus:bg-white/10 transition-all"
          />
        </div>
        
        <div className="selected-count">
          <span className="text-sm font-bold text-gold">{selectedIds.length}</span>
          <span className="text-xs text-gray-500 ml-2 uppercase tracking-widest">{t.ai_assistant.matched_count}</span>
        </div>
      </div>

      <div className="trades-grid">
        {trades.map(trade => {
          const services = filteredCatalog.filter(s => s.trade === trade);
          const activeCount = services.filter(s => selectedIds.includes(s.id)).length;
          const isExpanded = expandedTrades.includes(trade) || searchQuery.length > 0;

          return (
            <div key={trade} className={`trade-card ${activeCount > 0 ? 'has-selection' : ''}`}>
              <button 
                onClick={() => toggleTrade(trade)}
                className="trade-header w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`status-dot ${activeCount > 0 ? 'active' : ''}`} />
                  <span className="font-bold text-white uppercase tracking-wider text-sm">
                    {t.service_catalog[trade as keyof typeof t.service_catalog] || trade.replace('_', ' ')}
                  </span>
                  {activeCount > 0 && (
                    <span className="count-badge">{activeCount}</span>
                  )}
                </div>
                {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {isExpanded && (
                <div className="services-list p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 border-t border-white/5 animate-in fade-in slide-in-from-top-2">
                  {services.map(service => (
                    <button
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`service-item ${selectedIds.includes(service.id) ? 'selected' : ''}`}
                    >
                      <div className="checkbox-mini">
                        {selectedIds.includes(service.id) && <Check size={12} />}
                      </div>
                      <span className="text-sm">
                        {t.service_catalog[service.id as keyof typeof t.service_catalog] || service.id}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx>{`
        .service-matrix-container {
          width: 100%;
          max-width: 1200px;
          margin: 0 auto;
        }

        .premium-glass {
          background: rgba(255, 255, 255, 0.03);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 32px;
        }

        .text-gold {
          color: #d4af37;
        }

        .btn-ai-magic {
          background: linear-gradient(135deg, #d4af37, #b8860b);
          color: black;
          font-weight: 800;
          padding: 12px 24px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.85rem;
        }

        .btn-ai-magic:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 10px 20px rgba(212, 175, 55, 0.2);
        }

        .btn-ai-magic:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          filter: grayscale(1);
        }

        .trade-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          margin-bottom: 16px;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .trade-card.has-selection {
          border-color: rgba(212, 175, 55, 0.3);
          background: rgba(212, 175, 55, 0.02);
        }

        .status-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #333;
        }

        .status-dot.active {
          background: #d4af37;
          box-shadow: 0 0 10px rgba(212, 175, 55, 0.5);
        }

        .count-badge {
          background: #d4af37;
          color: black;
          font-size: 0.65rem;
          font-weight: 900;
          padding: 2px 8px;
          border-radius: 20px;
          margin-left: 4px;
        }

        .service-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          text-align: left;
          color: #94a3b8;
          transition: all 0.2s ease;
        }

        .service-item:hover {
          background: rgba(255, 255, 255, 0.07);
          color: white;
        }

        .service-item.selected {
          background: rgba(212, 175, 55, 0.1);
          border-color: #d4af37;
          color: white;
        }

        .checkbox-mini {
          width: 18px;
          height: 18px;
          border-radius: 4px;
          border: 1.5px solid rgba(255, 255, 255, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .selected .checkbox-mini {
          background: #d4af37;
          border-color: #d4af37;
          color: black;
        }

        .animate-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
