import { prisma } from '@/lib/prisma';

export interface PricingGuidance {
  min: number;
  max: number;
  suggested: number;
  currency: string;
}

const MARKET_BENCHMARKS: Record<string, PricingGuidance> = {
  'GCSE_ENGLISH': { min: 40, max: 80, suggested: 55, currency: 'GBP' },
  'GCSE_MATHS': { min: 40, max: 80, suggested: 55, currency: 'GBP' },
  'AL_MATHS': { min: 70, max: 150, suggested: 95, currency: 'GBP' },
  'AL_PHYSICS': { min: 70, max: 150, suggested: 95, currency: 'GBP' },
  'OXBRIDGE_PREP': { min: 100, max: 250, suggested: 150, currency: 'GBP' },
  'SEN_SUPPORT': { min: 80, max: 200, suggested: 120, currency: 'GBP' },
  'DSE_IB_CONSULT': { min: 90, max: 180, suggested: 130, currency: 'GBP' },
  'DEFAULT': { min: 30, max: 100, suggested: 50, currency: 'GBP' }
};

export function getMarketGuidance(category: string): PricingGuidance {
  const key = category.toUpperCase().replace(/\s+/g, '_');
  return MARKET_BENCHMARKS[key] || MARKET_BENCHMARKS['DEFAULT'];
}

export async function analyzePriceHealth(price: number, category: string) {
  const guidance = getMarketGuidance(category);
  const platformFee = 0.09;
  const totalRate = price * (1 + platformFee);

  let status: 'UNDERPRICED' | 'OPTIMAL' | 'HIGH' = 'OPTIMAL';
  let message = "";
  let color = "#10b981"; // Green

  if (price < guidance.min) {
    status = 'UNDERPRICED';
    message = `Your rate is currently below the market average for ${category}. You could increase it to £${guidance.suggested} to better reflect your expertise without losing conversion.`;
    color = "#3b82f6"; // Blue
  } else if (price > guidance.max) {
    status = 'HIGH';
    message = `Your rate is in the elite bracket. Ensure your profile highlights specialized success (e.g., "95% A* rate") to justify this premium to parents.`;
    color = "#f59e0b"; // Orange/Yellow
  } else {
    message = `Your pricing is perfectly calibrated for the ${category} market. Great job!`;
  }

  return {
    status,
    message,
    color,
    guidance,
    totalRate,
    platformFeeAmount: price * platformFee
  };
}

export async function getMonthlyTrend(category: string) {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  try {
    const trend = await prisma.marketTrend.findUnique({
      where: {
        category_month_year: {
          category,
          month: currentMonth,
          year: currentYear
        }
      }
    });

    // Mock trend for now if db is empty
    if (!trend) {
      return {
        change: Math.random() > 0.5 ? "+2.4%" : "-1.2%",
        direction: Math.random() > 0.5 ? 'UP' : 'DOWN'
      };
    }

    return trend;
  } catch (err) {
    return { change: "Stable", direction: "NEUTRAL" };
  }
}
