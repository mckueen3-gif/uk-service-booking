"use client";

import { useState } from "react";
import { 
  XCircle, 
  CheckCircle2, 
  ArrowRightLeft, 
  Loader2,
  Trash2,
  ArrowRight
} from "lucide-react";
import { resolveDispute } from "@/app/actions/dispute_admin";

export function DisputeActions({ disputeId }: { disputeId: string }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleResolve = async (decision: "REFUND_CUSTOMER" | "FORCE_PAYOUT" | "SPLIT_COST") => {
    if (!confirm(`Are you sure you want to resolve this case as: ${decision.replace('_', ' ')}?`)) return;
    
    setLoading(decision);
    try {
      const result = await resolveDispute(disputeId, decision);
      if (!result.success) alert(result.message);
    } catch (e) {
      alert("Arbitration failed.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <button 
        disabled={loading !== null}
        onClick={() => handleResolve("REFUND_CUSTOMER")}
        className="w-full flex items-center justify-between p-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black border border-red-500/20 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest group disabled:opacity-50"
      >
        <span className="flex items-center gap-2">
           {loading === "REFUND_CUSTOMER" ? <Loader2 size={16} className="animate-spin" /> : <XCircle size={16} />}
           Refuse & Refund
        </span>
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>

      <button 
        disabled={loading !== null}
        onClick={() => handleResolve("FORCE_PAYOUT")}
        className="w-full flex items-center justify-between p-4 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black border border-emerald-500/20 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest group disabled:opacity-50"
      >
        <span className="flex items-center gap-2">
           {loading === "FORCE_PAYOUT" ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle2 size={16} />}
           Sustain & Payout
        </span>
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>

      <button 
        disabled={loading !== null}
        onClick={() => handleResolve("SPLIT_COST")}
        className="w-full flex items-center justify-between p-4 bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-black border border-blue-500/20 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest group disabled:opacity-50"
      >
        <span className="flex items-center gap-2">
           {loading === "SPLIT_COST" ? <Loader2 size={16} className="animate-spin" /> : <ArrowRightLeft size={16} />}
           Split & Compromise
        </span>
        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
}
