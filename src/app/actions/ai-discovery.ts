"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SearchFilters, searchMerchants } from "./search";

export async function parseSearchIntent(query: string): Promise<SearchFilters> {
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) return { query };

  const prompt = `
    Analyze the following user search query for a service marketplace.
    Extract the following entities as a JSON object:
    1. "category": One of [Auto, Home, Accounting, Tires, MOT, Repair, Cleaning, Plumbing, Electrical].
    2. "location": A city or region name if mentioned.
    3. "problem": A specific keywords for the issue (e.g., "brake noise").
    4. "intent": Describe the user's intent.
    
    Query: "${query}"
    
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
      category: aiResponse.category || undefined,
      location: aiResponse.location || undefined,
      query: aiResponse.problem || query,
      sortBy: 'rating'
    };
  } catch (error) {
    console.error("AI Search Intent Parsing failed:", error);
    return { query };
  }
}

export async function getPersonalizedFeed(city?: string) {
  const currentCity = city || "London";
  
  try {
    const session = (await getServerSession(authOptions)) as any;
    
    if (!session?.user?.id) {
      // If not logged in, return localized trending based on city
      return {
        recommendations: [
          { id: 't1', title: `Trending in ${currentCity}: Home Repairs`, subtitle: "Top-rated electricians & plumbers nearby", category: "Repair", query: "Repair", icon: "TrendingUp", reason: "Trending" },
          { id: 't2', title: `Top Rated in ${currentCity}: Deep Cleaning`, subtitle: "Verified local experts available today", category: "Cleaning", query: "Clean", icon: "TrendingUp", reason: "Trending" },
          { id: 't3', title: `Professional Services in ${currentCity}`, subtitle: "Highly-rated accountants and legal aids", category: "Accounting", query: "Accounting", icon: "Briefcase", reason: "Trending" }
        ]
      };
    }

    // Fetch User Assets
    const vehicles = await prisma.vehicle.findMany({ where: { userId: session.user.id } });
    const properties = await prisma.property.findMany({ where: { userId: session.user.id } });

    const recommendations = [];

    // Logic: Map vehicles to Auto/Tires/MOT
    for (const v of vehicles) {
      recommendations.push({
        id: `v_${v.id}`,
        title: `${v.make} ${v.model} 專屬保養`,
        subtitle: `根據您的 ${v.year} 年份座駕推薦`,
        category: "Auto",
        query: v.make,
        icon: "Car",
        reason: "Asset-Match"
      });
    }

    // Logic: Map properties to Home/Cleaning/Plumbing
    for (const p of properties) {
      recommendations.push({
        id: `p_${p.id}`,
        title: "家居設施年度巡檢",
        subtitle: `維護您的 ${p.type} (${p.address.split(',')[0]})`,
        category: "Home",
        query: "Maintenance",
        icon: "Home",
        reason: "Asset-Match"
      });
    }

    // Fallback: Trending
    if (recommendations.length === 0) {
      recommendations.push(
        { id: 't1', title: `${currentCity} Popular Professional Services`, subtitle: "Trusted reviews in your area", category: "Auto", query: "Repair", icon: "TrendingUp", reason: "Trending" },
        { id: 't2', title: `Home Maintenance in ${currentCity}`, subtitle: "Get instant quotes today", category: "Cleaning", query: "Clean", icon: "TrendingUp", reason: "Trending" }
      );
    }

    return { recommendations };
  } catch (error) {
    console.error("Critical Failure in Personalized Feed:", error);
    // Ultimate fallback for server-side exceptions
    return {
      recommendations: [
        { id: 'f1', title: `Trending in ${currentCity}: Home Repairs`, subtitle: "Top-rated professionals nearby", category: "Repair", query: "Repair", icon: "TrendingUp", reason: "Trending" },
        { id: 'f2', title: `Top Rated in ${currentCity}: Auto Maintenance`, subtitle: "Verified local experts", category: "Auto", query: "Repair", icon: "Car", reason: "Trending" }
      ]
    };
  }
}
