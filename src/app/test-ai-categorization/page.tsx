"use client";

import { useState } from "react";
import { fetchBusinessInfoWithAI, getSmartCategoriesFromText } from "@/app/actions/ai_onboarding";
import { Search, Loader2, CheckCircle2, Globe, FileText, Sparkles } from "lucide-react";

export default function AICategorizationDemo() {
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"url" | "text">("url");

  const handleAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      if (mode === "url") {
        const data = await fetchBusinessInfoWithAI(url);
        setResult(data);
      } else {
        const categories = await getSmartCategoriesFromText(description);
        setResult({ suggestedCategories: categories });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-primary)", color: "var(--text-primary)", padding: "4rem 2rem" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(212,175,55,0.1)", color: "var(--gold-400)", padding: "0.5rem 1rem", borderRadius: "100px", fontSize: "0.85rem", fontWeight: 800, marginBottom: "1rem" }}>
            <Sparkles size={16} /> AI SMART REGISTRATION
          </div>
          <h1 style={{ fontSize: "2.5rem", fontWeight: 900, marginBottom: "1rem" }}>智能分類助手 (Smart Categorization)</h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem" }}>我們將根據您的描述或網站，自動從 Checkatrade 分類清單中為您找出最適合的專業標籤。</p>
        </div>

        <div style={{ background: "var(--surface-1)", borderRadius: "24px", border: "1px solid var(--border-color)", padding: "2.5rem", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>
          
          <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", background: "var(--surface-2)", padding: "0.5rem", borderRadius: "12px" }}>
            <button 
              onClick={() => setMode("url")} 
              style={{ flex: 1, padding: "0.75rem", borderRadius: "8px", border: "none", background: mode === "url" ? "var(--bg-primary)" : "transparent", color: mode === "url" ? "var(--gold-400)" : "var(--text-muted)", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}
            >
              <Globe size={18} /> 分析網站網址
            </button>
            <button 
              onClick={() => setMode("text")} 
              style={{ flex: 1, padding: "0.75rem", borderRadius: "8px", border: "none", background: mode === "text" ? "var(--bg-primary)" : "transparent", color: mode === "text" ? "var(--gold-400)" : "var(--text-muted)", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", transition: "all 0.2s" }}
            >
              <FileText size={18} /> 輸入公司描述
            </button>
          </div>

          {mode === "url" ? (
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700, fontSize: "0.9rem", color: "var(--text-secondary)" }}>公司網站 URL (Website URL)</label>
              <input 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://www.example-plumbing.co.uk"
                style={{ width: "100%", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--surface-2)", color: "var(--text-primary)", fontSize: "1rem" }}
              />
            </div>
          ) : (
            <div style={{ marginBottom: "1.5rem" }}>
              <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 700, fontSize: "0.9rem", color: "var(--text-secondary)" }}>介紹您的服務 (Describe your services)</label>
              <textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="例如：我是一家在曼徹斯特經營的空調安裝公司，專門處理住宅防盜警報器和商用冷氣..."
                style={{ width: "100%", height: "120px", padding: "1rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "var(--surface-2)", color: "var(--text-primary)", fontSize: "1rem", resize: "none" }}
              />
            </div>
          )}

          <button 
            onClick={handleAnalyze}
            disabled={loading || (mode === "url" ? !url : !description)}
            style={{ width: "100%", padding: "1.25rem", borderRadius: "12px", border: "none", background: "linear-gradient(135deg, var(--gold-600) 0%, var(--gold-400) 100%)", color: "#000", fontWeight: 900, fontSize: "1.1rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", opacity: (loading || (mode === "url" ? !url : !description)) ? 0.5 : 1 }}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles size={20} />}
            {loading ? "AI 正在深度解析中..." : "開始智能分類"}
          </button>

          {result && (
            <div style={{ marginTop: "2.5rem", padding: "2rem", background: "rgba(212,175,55,0.05)", borderRadius: "20px", border: "1px solid rgba(212,175,55,0.2)" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 900, marginBottom: "1.5rem", color: "var(--gold-400)", display: "flex", alignItems: "center", gap: "8px" }}>
                <CheckCircle2 size={24} /> 建議的專業類別
              </h3>
              
              {result.businessName && (
                <div style={{ marginBottom: "1rem" }}>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.2rem" }}>認出的公司名稱</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: 800 }}>{result.businessName}</div>
                </div>
              )}

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
                {result.suggestedCategories && result.suggestedCategories.length > 0 ? (
                  result.suggestedCategories.map((cat: string) => (
                    <div key={cat} style={{ background: "var(--surface-1)", border: "2px solid var(--gold-500)", color: "var(--text-primary)", padding: "0.6rem 1.2rem", borderRadius: "12px", fontSize: "0.95rem", fontWeight: 800, display: "flex", alignItems: "center", gap: "6px", boxShadow: "0 4px 12px rgba(212,175,55,0.1)" }}>
                      {cat}
                      <CheckCircle2 size={16} color="var(--gold-500)" />
                    </div>
                  ))
                ) : (
                  <div style={{ color: "var(--text-muted)", fontSize: "0.9rem", fontStyle: "italic" }}>
                    抱歉，AI 暫時無法從標準清單中找到匹配的分類。您可以嘗試用英文描述或輸入更多細節。
                  </div>
                )}
              </div>

              <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
                <button style={{ padding: "0.75rem 1.5rem", borderRadius: "8px", border: "none", background: "var(--text-primary)", color: "var(--bg-primary)", fontWeight: 800, cursor: "pointer" }}>
                  確定並繼續 (Confirm & Continue)
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
