import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import ReviewForm from '@/components/ReviewForm';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  const booking = await prisma.booking.findUnique({
    where: { id },
    include: {
      merchant: {
        include: { user: true }
      }
    }
  });

  if (!booking || booking.status !== 'COMPLETED') {
    notFound();
  }

  return (
    <div className="container" style={{ paddingTop: '8rem', paddingBottom: '10rem' }}>
       <div style={{ marginBottom: '2rem' }}>
          <Link href={`/dashboard/repair/${id}`} className="btn btn-secondary" style={{ display: 'inline-flex', padding: '0.6rem 1.2rem' }}>
             <ArrowLeft size={18} /> Back to Tracker
          </Link>
       </div>

       <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <ReviewForm 
            bookingId={id} 
            merchantName={booking.merchant.user.name || booking.merchant.companyName} 
          />
       </div>
    </div>
  );
}
