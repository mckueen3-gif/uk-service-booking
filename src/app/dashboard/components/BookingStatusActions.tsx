"use client";

import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/components/LanguageContext";

interface BookingStatusActionsProps {
  bookingId: string;
  currentStatus: string;
}

export default function BookingStatusActions({ bookingId, currentStatus }: BookingStatusActionsProps) {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleStatusUpdate = async (newStatus: string) => {
    const alertMsg = newStatus === 'CONFIRMED' ? t.booking_actions.confirmAlert : t.booking_actions.rejectAlert;
    if (!confirm(alertMsg)) return;

    setIsLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t.booking_actions.errorUpdate);

      router.refresh();
    } catch (err: any) {
      alert("錯誤: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (currentStatus !== "PENDING") return null;

  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <button
        onClick={() => handleStatusUpdate("CONFIRMED")}
        disabled={isLoading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0.4rem 0.8rem",
          borderRadius: "6px",
          backgroundColor: "#facc15",
          color: "white",
          border: "none",
          fontSize: "0.8rem",
          fontWeight: 700,
          cursor: "pointer",
          opacity: isLoading ? 0.7 : 1
        }}
      >
        {isLoading ? <Loader2 className="animate-spin" size={14} /> : <Check size={14} />}
        {t.booking_actions.confirmTitle}
      </button>

      <button
        onClick={() => handleStatusUpdate("CANCELLED")}
        disabled={isLoading}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.25rem",
          padding: "0.4rem 0.8rem",
          borderRadius: "6px",
          backgroundColor: "transparent",
          color: "#ef4444",
          border: "1px solid #ef4444",
          fontSize: "0.8rem",
          fontWeight: 700,
          cursor: "pointer",
          opacity: isLoading ? 0.7 : 1
        }}
      >
        {isLoading ? <Loader2 className="animate-spin" size={14} /> : <X size={14} />}
        {t.booking_actions.rejectTitle}
      </button>
    </div>
  );
}
