import { Metadata } from 'next';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';
import StructuredData from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'ConciergeAI | Hire Top Local Experts in the UK',
  description: 'Book verified electricians, plumbers, legal experts, and home cleaners instantly. Secure payments and AI-driven dispute resolution for a peace of mind.',
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ConciergeAI",
    "url": "https://conciergeai.uk",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://conciergeai.uk/services?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ConciergeAI UK",
    "url": "https://conciergeai.uk",
    "logo": "https://conciergeai.uk/images/logo_concierge_ai.png",
    "sameAs": [
      "https://facebook.com/conciergeaiuk",
      "https://twitter.com/conciergeaiuk"
    ]
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <StructuredData data={organizationLd} />
      <HomeClient />
    </>
  );
}
