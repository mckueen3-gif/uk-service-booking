"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SearchFilters, searchMerchants } from "./search";
import { generateAIContent } from "@/lib/ai-provider";

export async function parseSearchIntent(query: string): Promise<SearchFilters & { urgency?: 'high' | 'medium' | 'low', detail?: string }> {

  const prompt = `
    Analyze the following user search query for a service marketplace.
    Extract the following entities as a JSON object:
    1. "category": One of [Auto, Home, Accounting, Tires, MOT, Repair, Cleaning, Plumbing, Electrical, Education, Legal].
    2. "location": A city or region name if mentioned (default to undefined).
    3. "problem": A specific keywords for the issue (e.g., "brake noise", "tax audit").
    4. "urgency": Assessment of how urgent this is (high, medium, low).
    5. "detail": A 1-sentence professional summary of the user's specific need.
    
    Query: "${query}"
    
    JSON only:
  `;

  try {
    const responseText = await generateAIContent({
      prompt,
      jsonMode: true
    });

    const aiResponse = JSON.parse(responseText.replace(/```json|```/g, "").trim());
    
    return {
      category: aiResponse.category || undefined,
      location: aiResponse.location || undefined,
      query: aiResponse.problem || query,
      sortBy: 'rating',
      urgency: aiResponse.urgency || 'medium',
      detail: aiResponse.detail || undefined
    };
  } catch (error) {
    console.error("AI Search Intent Parsing failed:", error);
    return { query };
  }
}

export async function matchLead(query: string, city?: string) {
  try {
    const intent = await parseSearchIntent(query);
    
    // Search for matches
    const matches = await searchMerchants({
      location: intent.location || city,
      category: intent.category,
      query: intent.query,
      sortBy: 'rating'
    });

    // Generate a high-trust matching report
    const reportPrompt = `
      You are the ConciergeAI Matchmaker. Based on the user need and these results, write a very short, premium 2-sentence match report.
      User Need: "${intent.detail || query}"
      Top Match: "${matches[0]?.companyName || 'None'}"
      
      Response should be professional and encouraging. 
    `;

    const report = await generateAIContent({ prompt: reportPrompt });

    return {
      success: true,
      intent,
      matches: matches.slice(0, 3), 
      report,
      matchCount: matches.length
    };
  } catch (error) {
    console.error("Lead Matching Error:", error);
    return { success: false, error: "Matching engine timeout" };
  }
}

export async function getPersonalizedFeed(city?: string) {
  const currentCity = city || "London";
  
  try {
    const session = (await getServerSession(authOptions)) as any;
    
    if (!session?.user?.id) {
      // If not logged in, return localized trending based on city with variety
      return {
        recommendations: [
          { 
            id: 't1', 
            titleKey: 'london_plumbing',
            subtitleKey: null,
            subtitle: null,
            category: "Repair", 
            query: "Repair", 
            icon: "Hammer", 
            reasonKey: "trending" 
          },
          { 
            id: 't2', 
            titleKey: 'london_cleaning',
            subtitleKey: null,
            subtitle: null,
            category: "Cleaning", 
            query: "Clean", 
            icon: "Sparkles", 
            reasonKey: "trending" 
          },
          { 
            id: 't3', 
            titleKey: 'birmingham_accounting',
            subtitleKey: null,
            subtitle: null,
            category: "Accounting", 
            query: "Accounting", 
            icon: "Briefcase", 
            reasonKey: "trending" 
          }
        ]
      };
    }

    // Fetch User Assets
    const vehicles = await prisma.vehicle.findMany({ where: { userId: session.user.id } });
    const properties = await prisma.property.findMany({ where: { userId: session.user.id } });

    const recommendations = [];

    // Logic: Map vehicles to Auto/Tires/MOT (Temporarily disabled - Car repair hidden)
    /*
    for (const v of vehicles) {
      recommendations.push({
        id: `v_${v.id}`,
        title: `${v.make} ${v.model} 專屬保養`,
        subtitle: `根據您的 ${v.year} 年份座駕推薦`,
        category: "Auto",
        query: v.make,
        icon: "Car",
        reasonKey: "assetMatch"
      });
    }
    */

    // Logic: Map properties to Home/Cleaning/Plumbing
    for (const p of properties) {
      recommendations.push({
        id: `p_${p.id}`,
        title: "家居設施年度巡檢",
        subtitle: `維護您的 ${p.type} (${p.address.split(',')[0]})`,
        category: "Home",
        query: "Maintenance",
        icon: "Home",
        reasonKey: "assetMatch"
      });
    }

    // Fallback: Trending with variety (Auto Repair hidden)
    if (recommendations.length === 0) {
      recommendations.push(
        { 
          id: 't1', 
          titleKey: 'london_plumbing',
          subtitleKey: null,
          subtitle: null,
          category: "Repair", 
          query: "Repair", 
          icon: "Hammer", 
          reasonKey: "trending" 
        },
        { 
          id: 't2', 
          titleKey: 'london_cleaning',
          subtitleKey: null,
          subtitle: null,
          category: "Cleaning", 
          query: "Clean", 
          icon: "Sparkles", 
          reasonKey: "trending" 
        }
      );
    }

    return { recommendations };
  } catch (error) {
    console.error("Critical Failure in Personalized Feed:", error);
    return {
      recommendations: [
        { 
          id: 'f1', 
          titleKey: 'manchester_repair',
          subtitleKey: null,
          subtitle: null,
          category: "Repair", 
          query: "Repair", 
          icon: "Hammer", 
          reasonKey: "trending" 
        },
        { 
          id: 'f2', 
          titleKey: 'london_cleaning',
          subtitleKey: null,
          subtitle: null,
          category: "Cleaning", 
          query: "Clean", 
          icon: "Sparkles", 
          reasonKey: "trending" 
        }
      ]
    };
  }
}
