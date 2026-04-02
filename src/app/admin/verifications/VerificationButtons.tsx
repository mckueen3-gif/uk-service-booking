"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { verifyMerchantDocument } from "@/app/actions/admin";

export function VerificationButtons({ documentId }: { documentId: string }) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleAction = async (status: "APPROVED" | "REJECTED") => {
    setLoading(status);
    try {
      const result = await verifyMerchantDocument(documentId, status);
      if (result.success) {
        // Success state is handled by revalidatePath in the action
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Action failed:", error);
      alert("An unexpected error occurred.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button 
        disabled={loading !== null}
        onClick={() => handleAction("APPROVED")}
        className="p-3 bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-black border border-emerald-500/20 rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading === "APPROVED" ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <CheckCircle2 size={20} className="group-active:scale-95 transition-transform" />
        )}
      </button>
      
      <button 
        disabled={loading !== null}
        onClick={() => handleAction("REJECTED")}
        className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-black border border-red-500/20 rounded-xl transition-all shadow-lg hover:shadow-red-500/20 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading === "REJECTED" ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <XCircle size={20} className="group-active:scale-95 transition-transform" />
        )}
      </button>
    </div>
  );
}
