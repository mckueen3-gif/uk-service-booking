"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  CreditCard,
  AlertTriangle,
  Calendar,
  MessageSquare,
  LifeBuoy,
} from "lucide-react";
import { useTranslation } from "@/components/LanguageContext";

export default function SmartFAQ() {
  const [activeCategory, setActiveCategory] = useState<
    "payments" | "disputes" | "bookings"
  >("payments");
  const { t, isRTL } = useTranslation();

  // Use localized FAQs from dictionary
  const faqs = t.faq.questions;

  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "3rem",
        padding: "3rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)",
        border: "1px solid #f1f5f9",
        direction: isRTL ? "rtl" : "ltr",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <h2
          style={{
            fontSize: "2rem",
            fontWeight: 900,
            color: "#0f172a",
            marginBottom: "1rem",
          }}
        >
          {t.faq.title}
        </h2>
        <p style={{ color: "#64748b", fontSize: "1.1rem" }}>{t.faq.subtitle}</p>
      </div>

      {/* Categories */}
      <div
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "3rem",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        {[
          {
            id: "payments" as const,
            icon: <CreditCard size={18} />,
            label: t.faq.categories.payments,
          },
          {
            id: "disputes" as const,
            icon: <AlertTriangle size={18} />,
            label: t.faq.categories.disputes,
          },
          {
            id: "bookings" as const,
            icon: <Calendar size={18} />,
            label: t.faq.categories.bookings,
          },
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: "1rem 2rem",
              borderRadius: "2rem",
              border: "none",
              backgroundColor:
                activeCategory === cat.id ? "#2563eb" : "#f8fafc",
              color: activeCategory === cat.id ? "#ffffff" : "#64748b",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              transition: "all 0.2s",
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Questions */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {(faqs[activeCategory] as any[]).map((faq: any, idx: number) => (
          <div
            key={idx}
            style={{
              padding: "1.5rem 2rem",
              backgroundColor: "#f8fafc",
              borderRadius: "1.5rem",
              border: "1px solid #f1f5f9",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              cursor: "pointer",
              transition: "all 0.2s",
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.5rem",
                flexDirection: isRTL ? "row-reverse" : "row",
              }}
            >
              <div
                style={{
                  padding: "0.5rem",
                  backgroundColor: "#ffffff",
                  borderRadius: "0.75rem",
                  color: "#2563eb",
                }}
              >
                <LifeBuoy size={18} />
              </div>
              <span
                style={{
                  fontWeight: 700,
                  color: "#1e293b",
                  fontSize: "1.05rem",
                  textAlign: "inherit",
                }}
              >
                {faq.q}
              </span>
            </div>
            <ChevronDown size={20} color="#94a3b8" />
          </div>
        ))}
      </div>

      {/* Aura AI CTA */}
      <div
        style={{
          marginTop: "4rem",
          padding: "3rem",
          backgroundColor: "#eff6ff",
          borderRadius: "2.5rem",
          textAlign: "center",
          border: "1px solid rgba(37, 99, 235, 0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1.5rem",
            alignItems: "center",
          }}
        >
          <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e3a8a" }}>
            {t.faq.aura.title}
          </h3>
          <p style={{ color: "#1e40af", maxWidth: "30rem", lineHeight: 1.6 }}>
            {t.faq.aura.subtitle}
          </p>
          <button
            style={{
              padding: "1rem 2.5rem",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              borderRadius: "2rem",
              border: "none",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              cursor: "pointer",
              boxShadow: "0 10px 20px -5px rgba(37, 99, 235, 0.3)",
              flexDirection: isRTL ? "row-reverse" : "row",
            }}
          >
            {t.faq.aura.cta} <MessageSquare size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
