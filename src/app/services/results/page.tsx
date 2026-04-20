import { Metadata } from 'next';
import { Suspense } from 'react';
import SearchResultsClient from './SearchResultsClient';
import { Loader2 } from 'lucide-react';

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = (await searchParams) || {};
  const category = (resolvedParams.cat as string) || "Expert";
  const location = (resolvedParams.location as string) || "UK";
  const query = (resolvedParams.q as string) || "";

  let title = `Top 1% Verified ${category} Specialists in ${location} | ConciergeAI`;
  let description = `Instantly book the highest-rated verified ${category} specialists in ${location}.`;

  if (query) {
    title = `Top 1% Verified Experts for "${query}" in ${location} | ConciergeAI`;
    description = `Analyze and book elite specialists for "${query}" in ${location}. AI-verified expertise, insured service, and guaranteed reliability.`;
  }

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ['/images/og-search.png'],
    },
  };
}

export default function SearchResultsPage() {
  return (
    <Suspense fallback={
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '10rem 0', opacity: 0.5 }}>
            <Loader2 className="animate-spin" size={48} />
            <p style={{ marginTop: '1rem' }}>Initializing Search Architecture...</p>
        </div>
    }>
      <SearchResultsClient />
    </Suspense>
  );
}
