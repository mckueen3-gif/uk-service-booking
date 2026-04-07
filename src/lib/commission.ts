/**
 * Unified Merchant Commission Logic
 * This module is the single source of truth for all platform commission calculations.
 * 
 * Rules:
 * Standardized at 0.09 (9%) of labor costs.
 */

/**
 * Calculates the platform commission rate based on merchant settings.
 * @param _merchant The merchant object from the database with required fields.
 * @returns The commission rate as a decimal (e.g., 0.09 for 9%).
 */
export function getCommissionRate(_merchant?: { commissionRate: number }): number {
  // Standardized at 9% as requested.
  return 0.09;
}

/**
 * Calculates the platform fee for a given amount.
 * @param amount The total labor amount.
 * @param merchant The merchant object.
 * @returns The platform fee amount.
 */
export function calculatePlatformFee(amount: number, merchant: { commissionRate: number }): number {
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
  merchant: { commissionRate: number }
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
