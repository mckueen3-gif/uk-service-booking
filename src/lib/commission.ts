/**
 * Unified Merchant Commission Logic
 * This module is the single source of truth for all platform commission calculations.
 * 
 * Rules:
 * 1. If merchant has freeOrdersLeft > 0, commission is 0%.
 * 2. Otherwise, use the merchant's stored commissionRate (Default 8%).
 */

/**
 * Calculates the platform commission rate based on merchant settings.
 * @param merchant The merchant object from the database with required fields.
 * @returns The commission rate as a decimal (e.g., 0.08 for 8%).
 */
export function getCommissionRate(merchant: { commissionRate: number; freeOrdersLeft: number }): number {
  if (merchant.freeOrdersLeft > 0) {
    return 0;
  }
  return merchant.commissionRate;
}

/**
 * Calculates the platform fee for a given amount.
 * @param amount The total labor amount.
 * @param merchant The merchant object.
 * @returns The platform fee amount.
 */
export function calculatePlatformFee(amount: number, merchant: { commissionRate: number; freeOrdersLeft: number }): number {
  const rate = getCommissionRate(merchant);
  return amount * rate;
}

/**
 * Specialized payout calculation for Car Repairs.
 * @param baseAmount The original labor estimate.
 * @param variations Additional variations (parts/labor).
 * @param merchant The merchant object.
 */
export function calculateCarRepairPayout(
  baseAmount: number, 
  variations: { description: string; amount: number }[],
  merchant: { commissionRate: number; freeOrdersLeft: number }
) {
  const rate = getCommissionRate(merchant);
  
  let partsTotal = 0;
  let laborTotal = baseAmount;

  variations.forEach(v => {
    if (v.description.startsWith('[PART]')) {
      partsTotal += v.amount;
    } else {
      laborTotal += v.amount;
    }
  });

  const platformFee = laborTotal * rate;
  const merchantPayout = (laborTotal - platformFee) + partsTotal;

  return {
    laborTotal,
    partsTotal,
    platformFee,
    merchantPayout,
    commissionRate: rate,
    totalCustomerPrice: laborTotal + partsTotal
  };
}
