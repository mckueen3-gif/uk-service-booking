"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SearchFilters, searchMerchants } from "./search";
import { generateAIContent } from "@/lib/ai-provider";

export async function parseSearchIntent(query: string): Promise<SearchFilters> {

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
    const responseText = await generateAIContent({
      prompt,
      jsonMode: true
    });

    const aiResponse = JSON.parse(responseText.replace(/```json|```/g, "").trim());
    
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
          { 
            id: 't1', 
            titleKey: 'trendingTitle',
            categoryKey: 'homeRepair',
            subtitleKey: 'homeSub',
            category: "Repair", 
            query: "Repair", 
            icon: "Hammer", 
            reasonKey: "trending" 
          },
          { 
            id: 't2', 
            titleKey: 'topRatedTitle',
            categoryKey: 'deepCleaning',
            subtitleKey: 'cleanSub',
            category: "Cleaning", 
            query: "Clean", 
            icon: "Sparkles", 
            reasonKey: "trending" 
          },
          { 
            id: 't3', 
            titleKey: 'professionalTitle',
            categoryKey: 'accounting',
            subtitleKey: 'accountSub',
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

    // Logic: Map vehicles to Auto/Tires/MOT
    for (const v of vehicles) {
      recommendations.push({
        id: `v_${v.id}`,
        title: `${v.make} ${v.model} 專屬保養`, // Static titles for now as they are dynamic assets
        subtitle: `根據您的 ${v.year} 年份座駕推薦`,
        category: "Auto",
        query: v.make,
        icon: "Car",
        reasonKey: "assetMatch"
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
        reasonKey: "assetMatch"
      });
    }

    // Fallback: Trending
    if (recommendations.length === 0) {
      recommendations.push(
        { 
          id: 't1', 
          titleKey: 'trendingTitle',
          categoryKey: 'autoRepair', 
          subtitleKey: 'autoSub',
          category: "Auto", 
          query: "Repair", 
          icon: "Car", 
          reasonKey: "trending" 
        },
        { 
          id: 't2', 
          titleKey: 'trendingTitle',
          categoryKey: 'homeRepair', 
          subtitleKey: 'homeSub',
          category: "Repair", 
          query: "Repair", 
          icon: "Hammer", 
          reasonKey: "trending" 
        }
      );
    }

    return { recommendations };
  } catch (error) {
    console.error("Critical Failure in Personalized Feed:", error);
    // Ultimate fallback for server-side exceptions
    return {
      recommendations: [
        { 
          id: 'f1', 
          titleKey: 'trendingTitle',
          categoryKey: 'homeRepair', 
          subtitleKey: 'homeSub',
          category: "Repair", 
          query: "Repair", 
          icon: "Hammer", 
          reasonKey: "trending" 
        },
        { 
          id: 'f2', 
          titleKey: 'topRatedTitle',
          categoryKey: 'autoRepair', 
          subtitleKey: 'autoSub',
          category: "Auto", 
          query: "Repair", 
          icon: "Car", 
          reasonKey: "trending" 
        }
      ]
    };
  }
}
