import { Metadata } from 'next';
import HomeClient from './HomeClient';
import StructuredData from '@/components/StructuredData';

export const metadata: Metadata = {
  title: 'ServiceHub | Hire Top Local Experts in the UK',
  description: 'Book verified electricians, plumbers, legal experts, and home cleaners instantly. Secure payments and AI-driven dispute resolution for a peace of mind.',
};

export default function HomePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ServiceHub",
    "url": "https://uk-services.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": "https://uk-services.com/services?q={search_term_string}"
      },
      "query-input": "required name=search_term_string"
    }
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "ServiceHub UK",
    "url": "https://uk-services.com",
    "logo": "https://uk-services.com/logo.png",
    "sameAs": [
      "https://facebook.com/servicehubuk",
      "https://twitter.com/servicehubuk"
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
