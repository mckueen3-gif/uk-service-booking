"use server";

export async function analyzeReview(text: string) {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return { sentiment: "NEUTRAL", keywords: [] };

  const prompt = `
    Analyze the following customer review for a UK service provider.
    Return a JSON object with:
    1. "sentiment": One of "POSITIVE", "NEUTRAL", "NEGATIVE".
    2. "keywords": An array of up to 5 short keywords/traits mentioned (e.g., "punctual", "expensive", "great quality").
    
    Review text: "${text}"
    
    JSON only:
  `;

  try {
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(GEMINI_API_KEY)}`;
    const res = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" }
      })
    });

    const data = await res.json();
    const aiResponse = JSON.parse(data.candidates?.[0]?.content?.parts?.[0]?.text || "{}");
    
    return {
      sentiment: aiResponse.sentiment || "NEUTRAL",
      keywords: aiResponse.keywords || []
    };
  } catch (error) {
    console.error("AI Sentiment Analysis failed:", error);
    return { sentiment: "NEUTRAL", keywords: [] };
  }
}
