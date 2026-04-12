import { NextResponse } from 'next/server';
import { searchMerchants } from '@/app/actions/search';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || undefined;
  const category = searchParams.get('category') || undefined;
  const location = searchParams.get('location') || undefined;
  const minRating = searchParams.get('minRating') ? parseFloat(searchParams.get('minRating')!) : undefined;
  const isVerified = searchParams.get('isVerified') === 'true';

  try {
    const merchants = await searchMerchants({
      query,
      category,
      location,
      minRating,
      isVerified,
      sortBy: 'rating'
    });

    const results = merchants.map(m => ({
      id: m.id,
      name: m.companyName,
      expertise: m.services[0]?.name || 'Professional Specialist',
      rate: m.basePrice,
      rating: m.averageRating,
      reviews: (m as any).reviewsCount || (m as any).reviews?.length || 0,
      location: m.city,
      verified: m.isVerified,
      matchScore: Math.floor(m.aiScore || 0),
      avatarUrl: (m as any).avatarUrl || null
    }));

    return NextResponse.json({ specialists: results });
  } catch (error) {
    console.error('[API Merchants Error]:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
