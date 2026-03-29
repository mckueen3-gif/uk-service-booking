/**
 * Tiered Merchant Commission Logic
 * Phase 1: 0-5 jobs = 0%
 * Phase 2: >5 jobs = 8% (base)
 * Escalation: Increases by 1% for every 50 additional jobs, capped at 12%
 */

export const MERCHANT_COMMISSION_TIERS = {
  FREE_JOBS_LIMIT: 5,
  BASE_RATE: 0.08,
  MAX_RATE: 0.12,
  ESCALATION_STEP: 50,
  ESCALATION_RATE: 0.01,
};

/**
 * Calculates the platform commission rate based on completed jobs count.
 * @param completedJobsCount The number of jobs completed by the merchant.
 * @returns The commission rate as a decimal (e.g., 0.08 for 8%).
 */
export function getCommissionRate(completedJobsCount: number): number {
  const { FREE_JOBS_LIMIT, BASE_RATE, MAX_RATE, ESCALATION_STEP, ESCALATION_RATE } = MERCHANT_COMMISSION_TIERS;

  if (completedJobsCount <= FREE_JOBS_LIMIT) {
    return 0;
  }

  // Calculate tiers after the free period
  // We subtract 6 to ensure the first 50 jobs (6-55) are in tier 0
  const tiers = Math.floor((completedJobsCount - 6) / ESCALATION_STEP);
  
  const calculatedRate = BASE_RATE + (tiers * ESCALATION_RATE);
  
  return Math.min(calculatedRate, MAX_RATE);
}

/**
 * Calculates the platform fee for a given amount.
 * @param amount The total labor amount.
 * @param completedJobsCount The number of jobs completed by the merchant.
 * @returns The platform fee amount.
 */
export function calculatePlatformFee(amount: number, completedJobsCount: number): number {
  const rate = getCommissionRate(completedJobsCount);
  return amount * rate;
}

/**
 * Specialized payout calculation for Car Repairs.
 * Parts (marked with [PART] in description) have 0% commission.
 * Labor (Base amount + variations with [LABOR]) have standard commission.
 */
export function calculateCarRepairPayout(
  baseAmount: number, 
  variations: { description: string; amount: number }[],
  completedJobsCount: number
) {
  const rate = getCommissionRate(completedJobsCount);
  
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
