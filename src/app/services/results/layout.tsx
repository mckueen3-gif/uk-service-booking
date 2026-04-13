import { Metadata } from 'next';

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }): Promise<Metadata> {
  const resolvedParams = await searchParams || {};
  const category = (resolvedParams.cat as string) || "Expert";
  const location = resolvedParams.location as string || "UK";
  const query = resolvedParams.q as string || "";

  let title = `Top 1% Verified ${category} Services in ${location} | ConciergeAI`;
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
      type: 'website',
      images: [{ url: '/images/og-search.png', width: 1200, height: 630 }]
    }
  };
}

export default function ResultsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
