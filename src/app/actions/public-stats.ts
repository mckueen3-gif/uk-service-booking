"use server";

import { prisma } from "@/lib/prisma";

/**
 * Fetches the actual number of merchants and customers for the public homepage.
 */
export async function getPublicStats() {
  try {
    const [actualExperts, actualCustomers] = await Promise.all([
      prisma.merchant.count(),
      prisma.user.count({
        where: {
          role: "CUSTOMER"
        }
      })
    ]);

    return {
      success: true,
      actualExperts,
      actualCustomers
    };
  } catch (error) {
    console.error("Error fetching public stats:", error);
    return {
      success: false,
      actualExperts: 0,
      actualCustomers: 0
    };
  }
}
