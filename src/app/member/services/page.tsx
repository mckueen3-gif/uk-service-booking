"use client";

import { useState, useEffect } from "react";
import {
  Briefcase,
  X,
  ChevronRight,
  MapPin,
  Zap,
  Clock,
  ShieldAlert,
  Plus,
  Edit2,
  Trash2,
  TrendingUp,
  Info,
  Sparkles,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { useTranslation } from "@/components/LanguageContext";
import {
  getMerchantServices,
  upsertService,
  deleteService,
} from "@/app/actions/services";
import { getPricingBenchmark } from "@/app/actions/pricing-ai";

export default function ServicesPage() {
  const { t, isRTL } = useTranslation();
  const [services, setServices] = useState<any[]>([]);
  const [merchantCity, setMerchantCity] = useState("London");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentService, setCurrentService] = useState<any>(null);
  const [fetchingAi, setFetchingAi] = useState(false);
  const [aiBenchmark, setAiBenchmark] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Plumbing",
    description: "",
    price: 0,
    compareCity: "",
    isEmergencyAble: false,
    emergencySurchargePercentage: 0,
    emergencyResponseTime: "",
  });

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const res = await getMerchantServices();
    if (res.services) setServices(res.services);
    if (res.city) {
      setMerchantCity(res.city);
      setFormData((prev) => ({ ...prev, compareCity: res.city }));
    }
    setLoading(false);
  }

  function openEdit(service: any) {
    setCurrentService(service);
    setFormData({
      name: service.name,
      category: service.category,
      description: service.description || "",
      price: service.price,
      compareCity: merchantCity,
      isEmergencyAble: service.isEmergencyAble || false,
      emergencySurchargePercentage: service.emergencySurchargePercentage || 0,
      emergencyResponseTime: service.emergencyResponseTime || "",
    });
    setAiBenchmark(null);
    setModalOpen(true);
  }

  function openNew() {
    setCurrentService(null);
    setFormData({
      name: "",
      category: "Plumbing",
      description: "",
      price: 0,
      compareCity: merchantCity,
      isEmergencyAble: false,
      emergencySurchargePercentage: 0,
      emergencyResponseTime: "",
    });
    setAiBenchmark(null);
    setModalOpen(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await upsertService({ ...formData, id: currentService?.id });
    if (res.success) {
      setModalOpen(false);
      load();
    }
  }

  async function handleDelete(id: string) {
    if (confirm(t.merchant.merchant_services.deleteConfirm)) {
      const res = await deleteService(id);
      if (res.success) load();
    }
  }

  async function handleAiPricing() {
    if (!formData.name) return alert("請先輸入服務名稱");
    setFetchingAi(true);
    const res = await getPricingBenchmark(
      formData.name,
      formData.compareCity || merchantCity,
    );
    if (res.benchmark) setAiBenchmark(res.benchmark);
    setFetchingAi(false);
  }

  const premiumInputStyle = {
    width: "100%",
    padding: "0.875rem 1.25rem",
    borderRadius: "16px",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    border: "1px solid rgba(212, 175, 55, 0.15)",
    color: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    textAlign: isRTL ? ("right" as const) : ("left" as const),
    direction: isRTL ? ("rtl" as const) : ("ltr" as const),
  };

  const premiumLabelStyle = {
    display: "block",
    fontSize: "0.75rem",
    fontWeight: 800,
    color: "#666",
    textTransform: "uppercase" as const,
    marginBottom: "0.6rem",
    textAlign: isRTL ? ("right" as const) : ("left" as const),
  };

  if (loading)
    return (
      <div
        style={{ display: "flex", justifyContent: "center", padding: "10rem" }}
      >
        <Loader2 className="animate-spin" size={48} color="#d4af37" />
      </div>
    );

  return (
    <div
      className="animate-fade-in"
      style={{ paddingBottom: "5rem", direction: isRTL ? "rtl" : "ltr" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "3rem",
          flexDirection: isRTL ? "row-reverse" : "row",
        }}
      >
        <div style={{ textAlign: isRTL ? "right" : "left" }}>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, color: "#fff" }}>
            {t.sidebar.labels.services}{" "}
            <span style={{ color: "#d4af37" }}>Catalog</span>
          </h1>
          <p style={{ color: "#666", fontSize: "1.1rem" }}>
            {t.merchant.merchant_services.subtitle}
          </p>
        </div>
        <button
          className="btn btn-primary"
          onClick={openNew}
          style={{ padding: "1rem 2.5rem" }}
        >
          <Plus size={20} /> {t.merchant.merchant_services.add}
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
          gap: "2rem",
        }}
      >
        {services.map((s) => (
          <div
            key={s.id}
            className="glass-panel hover-lift"
            style={{
              padding: "2rem",
              borderRadius: "32px",
              backgroundColor: "rgba(12, 12, 12, 0.6)",
              border: "1px solid rgba(212, 175, 55, 0.1)",
              textAlign: isRTL ? "right" : "left",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "1.5rem",
                flexDirection: isRTL ? "row-reverse" : "row",
              }}
            >
              <div
                style={{
                  padding: "0.75rem",
                  borderRadius: "16px",
                  backgroundColor: "rgba(212, 175, 55, 0.05)",
                  color: "#d4af37",
                  border: "1px solid rgba(212, 175, 55, 0.2)",
                }}
              >
                <Briefcase size={22} />
              </div>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button
                  onClick={() => openEdit(s)}
                  className="haptic-press"
                  style={{
                    color: "#666",
                    backgroundColor: "#111",
                    padding: "0.5rem",
                    borderRadius: "10px",
                    border: "1px solid #222",
                  }}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="haptic-press"
                  style={{
                    color: "#ef4444",
                    backgroundColor: "rgba(239, 68, 68, 0.05)",
                    padding: "0.5rem",
                    borderRadius: "10px",
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 900,
                marginBottom: "0.4rem",
                color: "#fff",
              }}
            >
              {s.name}
            </h3>
            <p
              style={{
                fontSize: "0.75rem",
                color: "#d4af37",
                fontWeight: 800,
                textTransform: "uppercase",
                marginBottom: "0.6rem",
              }}
            >
              {s.category}
            </p>

            {s.isEmergencyAble && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.4rem",
                  marginBottom: "1rem",
                  flexDirection: isRTL ? "row-reverse" : "row",
                }}
              >
                <div
                  style={{
                    padding: "0.3rem 0.6rem",
                    borderRadius: "8px",
                    backgroundColor: "rgba(212, 175, 55, 0.15)",
                    color: "#d4af37",
                    fontSize: "0.65rem",
                    fontWeight: 900,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                >
                  <Zap size={10} fill="#d4af37" /> {t.search.emergencyReady}
                </div>
                <span style={{ fontSize: "0.7rem", color: "#666" }}>
                  +{s.emergencySurchargePercentage}%{" "}
                  {t.booking.labels.expressSurcharge}
                </span>
              </div>
            )}

            <p
              style={{
                fontSize: "0.9rem",
                color: "#999",
                marginBottom: "2rem",
                lineHeight: 1.6,
              }}
            >
              {s.description || "..."}
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: "1.5rem",
                borderTop: "1px solid rgba(212, 175, 55, 0.1)",
                flexDirection: isRTL ? "row-reverse" : "row",
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#555",
                    fontWeight: 700,
                  }}
                >
                  BASE PRICE
                </span>
                <div
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 900,
                    color: "#fff",
                  }}
                >
                  £{s.price.toFixed(2)}
                </div>
              </div>
              <div
                style={{
                  fontSize: "0.85rem",
                  color: "#d4af37",
                  fontWeight: 700,
                  backgroundColor: "rgba(212, 175, 55, 0.05)",
                  padding: "0.4rem 0.8rem",
                  borderRadius: "8px",
                }}
              >
                Per Hour
              </div>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.85)",
            backdropFilter: "blur(20px)",
            zIndex: 1000,
            display: "flex",
            justifyContent: "flex-end",
            direction: isRTL ? "rtl" : "ltr",
          }}
        >
          <div
            className="animate-slide-in"
            style={{
              width: "100%",
              maxWidth: "550px",
              height: "100%",
              backgroundColor: "#0a0a0a",
              borderLeft: "1px solid rgba(212, 175, 55, 0.2)",
              padding: "3rem",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "3rem",
                flexDirection: isRTL ? "row-reverse" : "row",
              }}
            >
              <div style={{ textAlign: isRTL ? "right" : "left" }}>
                <h2
                  style={{
                    fontSize: "1.75rem",
                    fontWeight: 900,
                    color: "#fff",
                  }}
                >
                  {currentService
                    ? t.merchant.merchant_services.modal.editTitle
                    : t.merchant.merchant_services.modal.addTitle}
                </h2>
                <p style={{ color: "#666", fontSize: "0.9rem" }}>
                  {t.merchant.merchant_services.modal.subtitle}
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                style={{
                  color: "#fff",
                  backgroundColor: "#1a1a1a",
                  border: "1px solid #333",
                  width: "40px",
                  height: "40px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                gap: "1.75rem",
                overflowY: "auto",
              }}
            >
              <div style={{ textAlign: isRTL ? "right" : "left" }}>
                <label style={premiumLabelStyle}>
                  {t.merchant.merchant_services.modal.name}
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  style={premiumInputStyle}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.25rem",
                }}
              >
                <div style={{ textAlign: isRTL ? "right" : "left" }}>
                  <label style={premiumLabelStyle}>
                    {t.merchant.merchant_services.modal.category}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    style={premiumInputStyle}
                  >
                    <option value="Plumbing">Plumbing</option>
                    <option value="Renovation">Renovation</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Gardening">Gardening</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Accounting">Accounting & Tax</option>
                    <option value="Education">Education</option>
                  </select>
                </div>
                <div style={{ textAlign: isRTL ? "right" : "left" }}>
                  <label style={premiumLabelStyle}>
                    {t.merchant.merchant_services.modal.pricing}
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      required
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          price: parseFloat(e.target.value),
                        })
                      }
                      style={{
                        ...premiumInputStyle,
                        [isRTL ? "paddingRight" : "paddingLeft"]: "2.5rem",
                      }}
                    />
                    <span
                      style={{
                        position: "absolute",
                        [isRTL ? "right" : "left"]: "0.85rem",
                        top: "50%",
                        transform: "translateY(-50%)",
                        fontWeight: 900,
                        color: "#d4af37",
                      }}
                    >
                      £
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "20px",
                  backgroundColor: "rgba(212, 175, 55, 0.03)",
                  border: "1px solid rgba(212, 175, 55, 0.1)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    marginBottom: "1rem",
                    flexDirection: isRTL ? "row-reverse" : "row",
                  }}
                >
                  <input
                    placeholder={t.search.location}
                    value={formData.compareCity}
                    onChange={(e) =>
                      setFormData({ ...formData, compareCity: e.target.value })
                    }
                    style={{ ...premiumInputStyle, flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleAiPricing}
                    disabled={fetchingAi}
                    className="btn"
                    style={{
                      padding: "0 1rem",
                      backgroundColor: "#d4af37",
                      color: "#000",
                      borderRadius: "12px",
                    }}
                  >
                    {fetchingAi ? (
                      <Loader2 className="animate-spin" size={16} />
                    ) : (
                      <TrendingUp size={16} />
                    )}
                  </button>
                </div>
                {aiBenchmark && (
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#999",
                      textAlign: isRTL ? "right" : "left",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "0.5rem",
                        flexDirection: isRTL ? "row-reverse" : "row",
                      }}
                    >
                      <span>Avg: £{aiBenchmark.average}</span>
                      <span>High: £{aiBenchmark.high}</span>
                    </div>
                    <p style={{ fontStyle: "italic" }}>{aiBenchmark.insight}</p>
                  </div>
                )}
              </div>

              <div
                style={{
                  padding: "1.5rem",
                  borderRadius: "20px",
                  backgroundColor: formData.isEmergencyAble
                    ? "rgba(212, 175, 55, 0.08)"
                    : "rgba(255,255,255,0.02)",
                  border: "1px solid #222",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexDirection: isRTL ? "row-reverse" : "row",
                  }}
                >
                  <div style={{ textAlign: isRTL ? "right" : "left" }}>
                    <h4
                      style={{
                        color: "#fff",
                        fontSize: "0.9rem",
                        fontWeight: 700,
                      }}
                    >
                      {t.booking.labels.expressSupport}
                    </h4>
                    <p style={{ fontSize: "0.7rem", color: "#666" }}>
                      Enable urgent responses
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        isEmergencyAble: !formData.isEmergencyAble,
                      })
                    }
                    style={{
                      width: "40px",
                      height: "20px",
                      borderRadius: "10px",
                      backgroundColor: formData.isEmergencyAble
                        ? "#d4af37"
                        : "#333",
                      border: "none",
                      cursor: "pointer",
                      position: "relative",
                    }}
                  >
                    <div
                      style={{
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        backgroundColor: "#fff",
                        position: "absolute",
                        top: "2px",
                        left: formData.isEmergencyAble ? "22px" : "2px",
                        transition: "all 0.2s",
                      }}
                    />
                  </button>
                </div>
                {formData.isEmergencyAble && (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "1rem",
                      marginTop: "1.5rem",
                    }}
                  >
                    <div style={{ textAlign: isRTL ? "right" : "left" }}>
                      <label style={premiumLabelStyle}>
                        {t.booking.labels.expressSurcharge} %
                      </label>
                      <input
                        type="number"
                        value={formData.emergencySurchargePercentage}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emergencySurchargePercentage: parseFloat(
                              e.target.value,
                            ),
                          })
                        }
                        style={premiumInputStyle}
                      />
                    </div>
                    <div style={{ textAlign: isRTL ? "right" : "left" }}>
                      <label style={premiumLabelStyle}>
                        {t.booking.labels.responseTime}
                      </label>
                      <input
                        value={formData.emergencyResponseTime}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            emergencyResponseTime: e.target.value,
                          })
                        }
                        style={premiumInputStyle}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div style={{ textAlign: isRTL ? "right" : "left" }}>
                <label style={premiumLabelStyle}>
                  {t.merchant.merchant_services.modal.description}
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  style={{ ...premiumInputStyle, resize: "none" }}
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ padding: "1.25rem", width: "100%" }}
              >
                {currentService ? (
                  <>{t.merchant.merchant_services.modal.save}</>
                ) : (
                  <>{t.merchant.merchant_services.modal.publish}</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
