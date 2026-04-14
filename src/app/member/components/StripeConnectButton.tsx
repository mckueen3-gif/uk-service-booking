"use client";

import { useState } from "react";
import { Loader2, ArrowRight } from "lucide-react";
import { useTranslation } from "@/components/LanguageContext";

export default function StripeConnectButton() {
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleConnect = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("/api/stripe/connect", {
        method: "POST",
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || t.merchant.verification.stripeError);
      }

      // Redirect the user to Stripe's hosted secure onboarding page
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <button 
        onClick={handleConnect} 
        disabled={isLoading} 
        className="btn btn-primary"
        style={{ backgroundColor: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
      >
        {isLoading ? <Loader2 size={18} className="animate-spin" /> : t.merchant.verification.stripeBtn}
        {!isLoading && <ArrowRight size={18} />}
      </button>
      {error && <div style={{ fontSize: '0.8rem', color: '#ef4444', fontWeight: 600 }}>{error}</div>}
    </div>
  );
}
