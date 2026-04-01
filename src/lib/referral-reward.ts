import { prisma } from "./prisma";

/**
 * Handles awarding referral credits when a booking is completed.
 * @param bookingId The ID of the completed booking.
 */
export async function processReferralReward(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: {
          include: {
            referralReceived: {
              include: {
                referrer: true
              }
            }
          }
        }
      }
    });

    if (!booking) return;

    // Only reward if the booking is COMPLETED and there's a referrer
    if (booking.status !== "COMPLETED") return;
    
    const referral = booking.customer.referralReceived;
    if (!referral) return;

    const referrer = referral.referrer;
    
    // Reward is 2% of the total amount (Updated from 2% for the passive income program)
    const rewardAmount = Math.floor(booking.totalAmount * 0.02 * 100) / 100;

    await prisma.$transaction([
      // Add credits to referrer
      prisma.user.update({
        where: { id: referrer.id },
        data: {
          referralCredits: {
            increment: rewardAmount
          }
        }
      }),
      // We could also log the transaction or notify the user here
    ]);

    console.log(`Awarded £${rewardAmount} referral credit to ${referrer.email} for booking ${bookingId}`);
  } catch (error) {
    console.error("Error processing referral reward:", error);
  }
}
