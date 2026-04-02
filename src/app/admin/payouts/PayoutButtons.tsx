"use client";

import { useState } from "react";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { processWithdrawal } from "@/app/actions/admin";

export function PayoutButtons({ requestId }: { requestId: string }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (status: "COMPLETED" | "REJECTED") => {
    setLoading(status);
    try {
      const result = await processWithdrawal(requestId, status);
      if (result.success) {
        // Success state is revalidated via next/cache or manually if needed
      } else {
        alert(result.message);
      }
    } catch (e) {
      console.error("Payout action error:", e);
      alert("Failed to process transaction.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex justify-end gap-2">
      <button 
        disabled={loading !== null}
        onClick={() => handleAction("COMPLETED")}
        className="px-3 py-2 bg-emerald-500 text-black text-[10px] font-black rounded-lg hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 uppercase tracking-widest flex items-center gap-1.5 disabled:opacity-50"
      >
        {loading === "COMPLETED" ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
        Payout Now
      </button>
      
      <button 
        disabled={loading !== null}
        onClick={() => handleAction("REJECTED")}
        className="px-3 py-2 bg-[#1a1a1a] text-red-500 border border-red-500/30 text-[10px] font-black rounded-lg hover:bg-red-500 hover:text-black transition-all uppercase tracking-widest active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
      >
        {loading === "REJECTED" ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
        Reject
      </button>
    </div>
  );
}
