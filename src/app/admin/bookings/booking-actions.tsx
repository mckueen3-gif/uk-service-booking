"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  MoreVertical 
} from "lucide-react";
import { 
  adminForceComplete, 
  adminCancelAndRefund 
} from "@/app/actions/booking_admin";

export function BookingAdminActions({ bookingId, status }: { bookingId: string, status: string }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleForceComplete = async () => {
    if (!confirm("Confirm manual fund release? This action is irreversible.")) return;
    setLoading("COMPLETE");
    try {
      const result = await adminForceComplete(bookingId);
      if (!result.success) alert(result.message);
    } catch (e) {
      alert("Failed to release funds.");
    } finally {
      setLoading(null);
    }
  };

  const handleRefund = async () => {
    if (!confirm("Are you sure you want to CANCEL and REFUND this booking?")) return;
    setLoading("REFUND");
    try {
      const result = await adminCancelAndRefund(bookingId);
      if (!result.success) alert(result.message);
    } catch (e) {
      alert("Failed to process refund.");
    } finally {
      setLoading(null);
    }
  };

  if (status === "COMPLETED" || status === "CANCELLED") {
    return (
      <div className="text-[10px] text-gray-600 font-bold uppercase italic tracking-widest">
        Audit Finalized
      </div>
    );
  }

  return (
    <div className="flex justify-end gap-2">
      <button 
        disabled={loading !== null}
        onClick={handleForceComplete}
        className="px-3 py-1.5 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black border border-emerald-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 disabled:opacity-50"
      >
        {loading === "COMPLETE" ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
        Force Payout
      </button>
      
      <button 
        disabled={loading !== null}
        onClick={handleRefund}
        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black border border-red-500/20 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 disabled:opacity-50"
      >
        {loading === "REFUND" ? <Loader2 size={12} className="animate-spin" /> : <XCircle size={12} />}
        Refund
      </button>
    </div>
  );
}
