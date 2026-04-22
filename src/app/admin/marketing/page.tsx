"use client";

import { useEffect, useState } from "react";
import { getAdminMerchants } from "@/app/actions/admin_actions";
import { generateAdCopy } from "@/app/actions/ai-marketing";
import { 
  Sparkles, 
  Users, 
  ChevronRight, 
  Loader2,
  TrendingUp,
  Target,
  Megaphone
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "@/components/LanguageContext";
import AdCanvasExporter from "@/components/admin/AdCanvasExporter";

export default function MarketingHub() {
  const [merchants, setMerchants] = useState<any[]>([]);
  const [selectedMerchant, setSelectedMerchant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [aiAds, setAiAds] = useState<any[]>([]);
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    async function load() {
      const data = await getAdminMerchants();
      setMerchants(data || []);
      setLoading(false);
    }
    load();
  }, []);

  const handleSelectMerchant = async (merchant: any) => {
    setSelectedMerchant(merchant);
    handleGenerateCopy(merchant);
  };

  const handleGenerateCopy = async (merchant = selectedMerchant) => {
    if (!merchant) return;
    setGenerating(true);
    const result = await generateAdCopy(
      merchant.companyName || merchant.name,
      merchant.category || "Professional Services",
      merchant.reviews || [],
      "conciergeai.uk"
    );
    if (result && result.ads) {
      setAiAds(result.ads);
      setCurrentAdIndex(0);
    }
    setGenerating(false);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '0 0.5rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>{t.admin.sidebar.labels.marketing}</h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', fontWeight: 500, margin: '0.25rem 0 0 0' }}>AI 驅動的品牌宣傳與自動化廣告引擎</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2.5rem' }}>
        {/* Merchant Selector */}
        <div style={{ 
          backgroundColor: '#ffffff', 
          borderRadius: '2.5rem', 
          border: '1px solid rgba(184, 134, 11, 0.08)', 
          overflow: 'hidden', 
          boxShadow: '0 30px 70px rgba(0,0,0,0.04)',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '800px'
        }}>
          <div style={{ padding: '2rem', borderBottom: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: '0 0 1rem' }}>選擇宣傳對象</h3>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                placeholder="搜尋專家..." 
                style={{ 
                  width: '100%', 
                  padding: '12px 16px', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0', 
                  fontSize: '14px',
                  outline: 'none'
                }} 
              />
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
             {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center' }}><Loader2 className="animate-spin" color="#d4af37" /></div>
             ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                   {merchants.map(m => (
                      <button 
                        key={m.id}
                        onClick={() => handleSelectMerchant(m)}
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '12px', 
                          padding: '12px', 
                          borderRadius: '16px', 
                          border: selectedMerchant?.id === m.id ? '1px solid #d4af37' : '1px solid transparent',
                          backgroundColor: selectedMerchant?.id === m.id ? 'rgba(212,175,55,0.05)' : 'transparent',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'all 0.2s'
                        }}
                      >
                         <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#0f172a', color: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900 }}>
                           {m.name?.[0].toUpperCase()}
                         </div>
                         <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.companyName || m.name}</div>
                            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>{m.category || "專業服務"}</div>
                         </div>
                         <ChevronRight size={16} color={selectedMerchant?.id === m.id ? "#d4af37" : "#cbd5e1"} />
                      </button>
                   ))}
                </div>
             )}
          </div>
        </div>

        {/* Ad Workspace */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
           {/* Marketing Insights */}
           <div style={{ 
             display: 'grid', 
             gridTemplateColumns: 'repeat(3, 1fr)', 
             gap: '1.5rem' 
           }}>
              <InsightCard icon={<Megaphone size={20} />} label="預期觸及" value="2,400+" trend="+12%" />
              <InsightCard icon={<Target size={20} />} label="精準匹配率" value="94.2%" trend="+5.4%" />
              <InsightCard icon={<TrendingUp size={20} />} label="估算點擊成本" value="£0.42" trend="-15%" />
           </div>

           {/* Ad Preview Area */}
           <div style={{ 
             backgroundColor: '#ffffff', 
             borderRadius: '2.5rem', 
             border: '1px solid rgba(184, 134, 11, 0.08)', 
             padding: '2.5rem',
             boxShadow: '0 30px 70px rgba(0,0,0,0.04)',
             minHeight: '600px',
             display: 'flex',
             flexDirection: 'column'
           }}>
              {!selectedMerchant ? (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', opacity: 0.5 }}>
                   <div style={{ width: '80px', height: '80px', borderRadius: '24px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#cbd5e1' }}>
                      <Sparkles size={40} />
                   </div>
                   <div style={{ textAlign: 'center' }}>
                      <p style={{ fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>請從左側選擇一位專家</p>
                      <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: '4px' }}>AI 將自動為其生成專屬品牌推廣廣告</p>
                   </div>
                </div>
              ) : (
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                   {generating ? (
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
                        <Loader2 className="animate-spin" size={40} color="#d4af37" />
                        <p style={{ fontSize: '0.9rem', fontWeight: 800, color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Aura AI 正在構思創意廣告...</p>
                      </div>
                   ) : (
                      <AdCanvasExporter 
                        merchant={selectedMerchant} 
                        aiCopy={aiAds[currentAdIndex]} 
                        onRegenerate={() => handleGenerateCopy()} 
                      />
                   )}
                </div>
              )}
           </div>
        </div>
      </div>
    </motion.div>
  );
}

function InsightCard({ icon, label, value, trend }: any) {
  return (
    <div style={{ 
      padding: '1.5rem', 
      borderRadius: '20px', 
      backgroundColor: '#ffffff', 
      border: '1px solid rgba(184, 134, 11, 0.05)',
      boxShadow: '0 10px 30px rgba(0,0,0,0.02)',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    }}>
       <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: 'rgba(212,175,55,0.08)', color: '#d4af37', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
         {icon}
       </div>
       <div>
         <p style={{ fontSize: '11px', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>{label}</p>
         <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
           <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a' }}>{value}</span>
           <span style={{ fontSize: '10px', fontWeight: 800, color: trend.startsWith('+') ? '#10b981' : '#ef4444' }}>{trend}</span>
         </div>
       </div>
    </div>
  );
}
