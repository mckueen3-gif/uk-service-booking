export type CarTier = 'ECONOMY' | 'PREMIUM' | 'LUXURY';

const BRAND_TIERS: Record<string, CarTier> = {
  "Toyota": "ECONOMY",
  "Ford": "ECONOMY",
  "Volkswagen": "ECONOMY",
  "Honda": "ECONOMY",
  "Hyundai": "ECONOMY",
  "BMW": "PREMIUM",
  "Mercedes-Benz": "PREMIUM",
  "Audi": "PREMIUM",
  "Tesla": "PREMIUM",
  "Jaguar": "PREMIUM",
  "Porsche": "LUXURY",
  "Ferrari": "LUXURY",
  "Lamborghini": "LUXURY",
  "Bentley": "LUXURY",
};

const BASE_PRICES: Record<string, Record<CarTier, { min: number; max: number }>> = {
  "Interim Service": {
    "ECONOMY": { min: 80, max: 120 },
    "PREMIUM": { min: 150, max: 220 },
    "LUXURY": { min: 300, max: 500 },
  },
  "Full Service": {
    "ECONOMY": { min: 140, max: 200 },
    "PREMIUM": { min: 250, max: 380 },
    "LUXURY": { min: 600, max: 900 },
  },
  "Major Service": {
    "ECONOMY": { min: 200, max: 300 },
    "PREMIUM": { min: 400, max: 600 },
    "LUXURY": { min: 1000, max: 1500 },
  },
  "MOT Test": {
    "ECONOMY": { min: 45, max: 54 },
    "PREMIUM": { min: 45, max: 54 },
    "LUXURY": { min: 45, max: 60 },
  },
  "Brake pads replacement": {
    "ECONOMY": { min: 120, max: 180 },
    "PREMIUM": { min: 200, max: 350 },
    "LUXURY": { min: 500, max: 800 },
  }
};

export function getAiEstimate(service: string, make: string) {
  const tier = BRAND_TIERS[make] || 'ECONOMY';
  const priceRange = BASE_PRICES[service]?.[tier] || { min: 100, max: 250 };
  
  return {
    range: `£${priceRange.min} – £${priceRange.max}`,
    disclaimer: "此為參考價，最終價錢視現場檢查而定",
    diagnosticsFee: tier === 'LUXURY' ? 80 : 50
  };
}
