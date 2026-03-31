import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getStripeClient } from '@/lib/stripe';

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const stripe = await getStripeClient();
    const session = await getServerSession(authOptions);
    const user = session?.user as any;
    
    if (!session || user.role !== "MERCHANT") {
      return NextResponse.json({ error: 'Unauthorized to access Stripe Connect' }, { status: 401 });
    }

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY === 'sk_test_mock') {
        return NextResponse.json({ error: 'Stripe Secret Key is missing in .env' }, { status: 500 });
    }

    const merchant = await prisma.merchant.findUnique({
      where: { userId: user.id }
    });

    if (!merchant) {
      return NextResponse.json({ error: 'Merchant profile not found. Please complete verification first.' }, { status: 400 });
    }

    let accountId = merchant.stripeAccountId;

    // Step 1: Create an Express connected account if one doesn't exist yet
    if (!accountId) {
      const account = await stripe.accounts.create({
        type: 'express',
        country: 'GB', // Hardcoded to UK marketplace requirements
        email: user.email,
        business_type: 'individual',
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
      });
      accountId = account.id;

      // Save Stripe Account ID into PostgreSQL for the merchant
      await prisma.merchant.update({
        where: { userId: user.id },
        data: { stripeAccountId: accountId }
      });
    }

    // Step 2: Generate the secure onboarding link URL for them to enter their Bank details securely on Stripe
    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: `${process.env.NEXTAUTH_URL}/dashboard?stripe=refresh`, // Where they go if they hit back or time out
      return_url: `${process.env.NEXTAUTH_URL}/dashboard?stripe=success`, // Where they go when fully setup
      type: 'account_onboarding',
    });

    return NextResponse.json({ url: accountLink.url });

  } catch (error: any) {
    console.error("Stripe Connect Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
