import StructuredData from "@/components/StructuredData";
import { Metadata } from 'next';
import { prisma } from "@/lib/prisma";
import MerchantProfileClient from "./MerchantProfileClient";

export async function generateMetadata({ params }: { params: Promise<{ merchantId: string }> }): Promise<Metadata> {
  const resolvedParams = await params;
  const merchant = await prisma.merchant.findUnique({
    where: { id: resolvedParams.merchantId }
  });
  
  if (!merchant) return { title: "Merchant Not Found | ConciergeAI" };
  
  return {
    title: `${merchant.companyName} | Certified Services | ConciergeAI`,
    description: `Hire ${merchant.companyName} for professional services. ${merchant.averageRating} star rating with verified reviews.`,
  };
}

export default async function MerchantProfilePage({ params }: { params: Promise<{ merchantId: string }> }) {
  const resolvedParams = await params;
  const currentMerchantId = resolvedParams.merchantId;

  const merchant = await prisma.merchant.findUnique({
    where: { id: currentMerchantId },
    include: {
      services: true,
      reviews: {
        include: { customer: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!merchant) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '1.5rem', backgroundColor: '#f8fafc' }}>
         <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1e293b' }}>Merchant Not Found</div>
         <p style={{ color: '#64748b' }}>The merchant you are looking for does not exist. ID: {currentMerchantId}</p>
      </div>
    );
  }

  const localBusinessLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": merchant.companyName,
    "image": "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&w=300&q=80",
    "@id": `https://conciergeai.uk/merchant/${currentMerchantId}`,
    "url": `https://conciergeai.uk/merchant/${currentMerchantId}`,
    "telephone": "+44 20 7946 0000",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Buckingham Palace Road",
      "addressLocality": merchant.city,
      "postalCode": "SW1A 1AA",
      "addressCountry": "GB"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 51.5014,
      "longitude": -0.1419
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": merchant.averageRating,
      "reviewCount": merchant.totalReviews
    }
  };

  return (
    <>
      <StructuredData data={localBusinessLd} />
      <MerchantProfileClient merchant={merchant} currentMerchantId={currentMerchantId} />
    </>
  );
}
