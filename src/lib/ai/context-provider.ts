import { prisma } from '@/lib/prisma';
import { getMaintenanceTimeline } from '@/app/actions/maintenance';
import { Prisma } from '@prisma/client';

export interface MerchantContextOptions {
  city?: string;
  category?: string;
  limit?: number;
}

/**
 * Fetches top-rated merchants to provide as context for the AI.
 * Uses a simplified version of the search logic to prioritize 'Elite Pro' status.
 */
export async function getEliteMerchantContext(options: MerchantContextOptions = {}): Promise<string> {
  try {
    const { city, category, limit = 3 } = options;
    
    const where: Prisma.MerchantWhereInput = {
      isVerified: true,
      averageRating: { gte: 4.5 }
    };

    if (city) {
      where.city = { contains: city, mode: 'insensitive' };
    }

    if (category) {
      where.services = {
        some: {
          category: { equals: category, mode: 'insensitive' }
        }
      };
    }

    const merchants = await prisma.merchant.findMany({
      where,
      take: limit,
      orderBy: { averageRating: 'desc' },
      include: {
        services: { take: 3 },
        documents: { 
          where: { status: { in: ['APPROVED', 'PENDING'] } } 
        }
      }
    });

    if (merchants.length === 0) return "No specific elite merchants found for this criteria yet.";

    const context = merchants.map(m => {
      const topServices = m.services.map(s => s.name).join(', ');
      
      // Analyze verification status
      const hasApprovedInsurance = m.documents.some(d => d.type === 'PUBLIC_LIABILITY' && d.status === 'APPROVED');
      const hasPendingInsurance = m.documents.some(d => d.type === 'PUBLIC_LIABILITY' && d.status === 'PENDING');
      
      const approvedCerts = m.documents
        .filter(d => d.status === 'APPROVED' && d.type !== 'PUBLIC_LIABILITY')
        .map(d => d.type);

      const pendingCerts = m.documents
        .filter(d => d.status === 'PENDING' && d.type !== 'PUBLIC_LIABILITY')
        .map(d => d.type);

      let verificationTag = "[VERIFICATION_NEEDED]";
      if (hasApprovedInsurance && approvedCerts.length > 0) {
        verificationTag = `[FULLY_VERIFIED: Insured & Certified (${approvedCerts.join('/')})]`;
      } else if (hasApprovedInsurance) {
        verificationTag = "[INSURED_ONLY: Pending specialized certifications review]";
      } else if (hasPendingInsurance || pendingCerts.length > 0) {
        verificationTag = "[ADMIN_REVIEW_PENDING: Documents are currently being manually verified for your safety]";
      }

      return `- ${m.companyName} (${m.city}): Rated ${m.averageRating}/5. ${verificationTag}. Specializes in: ${topServices}.`;
    }).join('\n');

    return `TOP RECOMMENDED EXPERTS & VERIFICATION STATUS:\n${context}`;
  } catch (error) {
    console.error('[AI Context Provider] Failed to fetch merchant context:', error);
    return "Merchant data is currently unavailable.";
  }
}

/**
 * Fetches the user's scheduled maintenance events.
 */
export async function getUserTimelineContext(): Promise<string> {
  try {
    const timeline = await getMaintenanceTimeline();
    if (!timeline || timeline.length === 0) {
      return "No upcoming maintenance scheduled yet.";
    }

    const events = timeline.map(e => 
      `- ${e.title} for ${e.assetName} on ${new Date(e.dueDate).toLocaleDateString()} (Status: ${e.status})`
    ).join('\n');

    return `PLANNED MAINTENANCE EVENTS:\n${events}`;
  } catch (error) {
    console.error('[AI Context Provider] Failed to fetch timeline context:', error);
    return "User schedule is currently unavailable.";
  }
}
