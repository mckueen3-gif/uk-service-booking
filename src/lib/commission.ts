/**
 * Unified Platform Commission Logic
 * Single source of truth for all platform fee calculations.
 *
 * ============================================================
 * UK COMPLIANCE MODEL (Fair Working Guidelines)
 * ============================================================
 * ConciergeAI operates a STUDENT/CUSTOMER-PAYS model:
 *
 *  ✅ EDUCATION / TUTORING: 
 *     Platform commission (10%) is ADDED ON TOP of the tutor's base rate.
 *     The student pays the marked-up price, and the tutor receives exactly
 *     their requested rate. (100% payout guarantee to comply with UK guidelines).
 *
 *  ✅ OTHER SECTORS (Trades, Cleaning, etc.):
 *     Platform commission (10%) is DEDUCTED from the merchant's requested rate.
 *     The customer pays exactly the quoted price.
 *
 * Example Education payout:
 *   Tutor sets rate: £100
 *   Student pays £110 → Platform retains £10 → Tutor receives £100
 *
 * Example Plumbing payout:
 *   Plumber quotes: £100
 *   Customer pays £100 → Platform retains £10 → Plumber receives £90
 *
 * This mirrors the model used by MyTutor, Tutorful, and other compliant UK marketplaces.
 * Under this structure, no FCA Payment Institution licence is required as we use
 * Stripe Connect (a regulated payment processor) to manage the fund flow.
 *
 * PROHIBITED:
 *  - Charging tutors/merchants a fee for accessing the platform
 *  - Charging tutors/merchants a subscription to receive bookings
 *  - Double-charging (charging both student AND tutor for the same booking)
 * ============================================================
 */

/**
 * Calculates the platform commission rate.
 * Commission is ALWAYS applied to the STUDENT/CUSTOMER payment amount.
 * The tutor/merchant receives the net amount after the platform fee is deducted.
 *
 * @param _merchant The merchant object (reserved for future tiered rates)
 * @returns The commission rate as a decimal (0.10 = 10%)
 */
export function getCommissionRate(_merchant?: { commissionRate: number }): number {
  // Standardised at 10% across all service categories.
  // Always deducted from the customer payment — never charged to the tutor/merchant directly.
  return 0.10;
}

/**
 * Calculates the dividend split for referrals.
 * Returns { platformFee (8%), referralDividend (2%) } if eligible, 
 * else { platformFee (10%), referralDividend (0) }.
 */
export async function calculateCommissionSplit(customerId: string, totalAmount: number) {
  const { prisma } = await import('./prisma');
  
  const referral = await prisma.referral.findUnique({
    where: { refereeId: customerId },
    select: { createdAt: true, referrerId: true }
  });

  const FIVE_YEARS_MS = 5 * 365 * 24 * 60 * 60 * 1000;
  const isEligible = referral && (Date.now() - new Date(referral.createdAt).getTime()) < FIVE_YEARS_MS;

  if (isEligible) {
    return {
      platformFee: Math.round(totalAmount * 0.08 * 100) / 100,
      referralDividend: Math.round(totalAmount * 0.02 * 100) / 100,
      referrerId: referral.referrerId
    };
  }

  return {
    platformFee: Math.round(totalAmount * 0.10 * 100) / 100,
    referralDividend: 0,
    referrerId: null
  };
}

/**
 * Calculates the platform fee for a given amount.
 * The fee is sourced from the customer's payment, not from the provider.
 *
 * @param amount The total amount paid by the student/customer
 * @param merchant The merchant object
 * @returns The platform fee amount (in pounds)
 */
export function calculatePlatformFee(amount: number, merchant: { commissionRate: number }): number {
  const rate = getCommissionRate(merchant);
  return amount * rate;
}

/**
 * Calculates the gross customer payment and platform fee from a provider's base rate.
 * Education: markup approach (adds to base).
 * Others: deduction approach (subtracts from base).
 *
 * @param providerBaseAmount The amount the tutor/merchant quotes
 * @param merchant The merchant object
 * @param isEducation Whether the service is in the Education category
 * @returns Object with platformFee, totalCustomerPayment, merchantPayout
 */
export function calculateNetPayout(providerBaseAmount: number, merchant: { commissionRate: number }, isEducation: boolean = false) {
  const rate = getCommissionRate(merchant);
  const platformFee = Math.round(providerBaseAmount * rate * 100) / 100;
  
  const totalCustomerPayment = isEducation 
    ? Math.round((providerBaseAmount + platformFee) * 100) / 100 
    : providerBaseAmount;
    
  const merchantPayout = isEducation 
    ? providerBaseAmount 
    : Math.round((providerBaseAmount - platformFee) * 100) / 100;
    
  return { platformFee, merchantPayout, totalCustomerPayment, commissionRate: rate };
}

/**
 * Specialized payout calculation for Car Repairs.
 * Parts are passed through at cost (no commission). Commission only applies to labour.
 *
 * @param baseAmount The original labour estimate
 * @param variations Additional line items (parts/labour)
 * @param merchant The merchant object
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

