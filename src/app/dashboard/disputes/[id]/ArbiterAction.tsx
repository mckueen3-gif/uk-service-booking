"use client";

import { useState } from 'react';
import { runAIArbiter } from '@/app/actions/dispute';
import { Loader2, Sparkles, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

interface ArbiterActionProps {
  disputeId: string;
  status: string;
}

export default function ArbiterAction({ disputeId, status }: ArbiterActionProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRunArbiter = async () => {
    // Premium confirmation check
    const isConfirmed = window.confirm("確定啟動 AI 智能仲裁？\n系統將自動分析所有證據、比對現場照片並產出具備法律標次的裁決報告。");
    
    if (isConfirmed) {
       setLoading(true);
       setError(null);
       try {
         const res = await runAIArbiter(disputeId);
         if (res.error) {
           setError(res.error);
         } else {
           // Success feedback - the page will revalidate anyway but we can show a brief state
           window.location.reload();
         }
       } catch (err) {
         setError("仲裁服務暫時不可用，請稍後再試。");
       } finally {
         setLoading(false);
       }
    }
  };

  if (status === 'RESOLVED') return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 800, fontSize: '0.9rem' }}>
       <Shield size={18} /> 案件已結案
    </div>
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.75rem' }}>
       <button 
         onClick={handleRunArbiter}
         disabled={loading}
         className={`btn btn-primary hover-scale ${loading ? 'opacity-70' : ''}`}
         style={{ 
           display: 'flex',
           alignItems: 'center',
           gap: '0.6rem',
           padding: '0.8rem 1.75rem',
           borderRadius: '14px',
           fontSize: '1rem',
           boxShadow: loading ? 'none' : '0 12px 24px -8px var(--accent-color)',
           background: loading ? 'var(--surface-3)' : 'white',
           color: loading ? 'var(--text-muted)' : 'var(--accent-color)',
           border: loading ? '1px solid var(--border-color)' : 'none',
           fontWeight: 800
         }}
       >
         {loading ? (
           <>
             <Loader2 size={20} className="animate-spin" />
             <span>分析證據中...</span>
           </>
         ) : (
           <>
             <Sparkles size={20} />
             <span>執行 AI 仲裁 Arbiter</span>
           </>
         )}
       </button>
       
       {error && (
         <div className="animate-fade-up" style={{ 
           fontSize: '0.75rem', 
           color: '#ef4444', 
           fontWeight: 700, 
           display: 'flex', 
           alignItems: 'center', 
           gap: '0.4rem',
           backgroundColor: 'rgba(239, 68, 68, 0.1)',
           padding: '0.4rem 0.8rem',
           borderRadius: '8px',
           border: '1px solid rgba(239, 68, 68, 0.2)'
         }}>
            <AlertCircle size={14} /> {error}
         </div>
       )}
    </div>
  );
}
