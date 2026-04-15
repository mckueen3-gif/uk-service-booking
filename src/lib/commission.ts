/**
 * Unified Platform Commission Logic
 * Single source of truth for all platform fee calculations.
 *
 * ============================================================
 * UK COMPLIANCE MODEL (Fair Working Guidelines)
 * ============================================================
 * ConciergeAI operates a STUDENT/CUSTOMER-PAYS model:
 *
 *  ✅ Platform commission (9%) is deducted from the STUDENT/CUSTOMER payment BEFORE
 *     the net amount is transferred to the service provider (merchant/tutor).
 *
 *  ❌ Tutors and service providers are NEVER charged a listing fee, signup fee,
 *     or job-finding fee. This is to comply with UK fair working guidelines.
 *
 * Example Education payout:
 *   Student pays £100 → Platform retains £9 (9%) → Tutor receives £91
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
 * @returns The commission rate as a decimal (0.09 = 9%)
 */
export function getCommissionRate(_merchant?: { commissionRate: number }): number {
  // Standardised at 9% across all service categories.
  // Always deducted from the customer payment — never charged to the tutor/merchant directly.
  return 0.09;
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
 * Calculates the net payout due to the service provider.
 * The platform deducts its fee from the customer's gross payment.
 *
 * @param grossCustomerPayment Total amount paid by the student/customer
 * @param merchant The merchant object
 * @returns Object with platformFee and merchantPayout
 */
export function calculateNetPayout(grossCustomerPayment: number, merchant: { commissionRate: number }) {
  const rate = getCommissionRate(merchant);
  const platformFee = Math.round(grossCustomerPayment * rate * 100) / 100;
  const merchantPayout = Math.round((grossCustomerPayment - platformFee) * 100) / 100;
  return { platformFee, merchantPayout, commissionRate: rate };
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
