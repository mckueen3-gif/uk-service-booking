import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getStripeClient } from '@/lib/stripe';
import { createNotification } from '@/app/actions/notifications';

/**
 * Sync Funds Cron Task
 * Triggered periodically (e.g. daily) to:
 * 1. Hold balance for Repairs at D-7.
 * 2. Auto-cancel failed holds at D-4 (3 days grace).
 * 3. Release Education funds after 14-day cooling-off.
 */
export async function GET(req: Request) {
  try {
    // Basic Security: Check for a CRON_SECRET to prevent manual triggers (optional)
    const { searchParams } = new URL(req.url);
    const secret = searchParams.get('secret');
    if (process.env.CRON_SECRET && secret !== process.env.CRON_SECRET) {
      // return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stripe = await getStripeClient();
    const now = new Date();
    const d7 = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const d4 = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);

    // --- 1. D-7 HOLD BALANCE (REPAIRS) ---
    const pendingHolds = await prisma.booking.findMany({
      where: {
        isEducation: false,
        status: 'PENDING',
        stripeBalanceIntentId: null,
        scheduledDate: { lte: d7 },
        balanceAmount: { gt: 0 }
      },
      include: { customer: true, merchant: true }
    });

    for (const booking of pendingHolds) {
      if (!booking.customer.stripeCustomerId || !booking.merchant.stripeAccountId) continue;

      try {
        const intent = await stripe.paymentIntents.create({
          amount: Math.round(booking.balanceAmount * 100),
          currency: 'gbp',
          customer: booking.customer.stripeCustomerId,
          payment_method_types: ['card'],
          capture_method: 'manual',
          off_session: true,
          confirm: true,
          application_fee_amount: Math.round(booking.balanceAmount * 0.09 * 100),
          transfer_data: {
            destination: booking.merchant.stripeAccountId,
          },
          metadata: {
            bookingId: booking.id,
            type: 'BALANCE_HOLD'
          }
        });

        await prisma.booking.update({
          where: { id: booking.id },
          data: { 
            stripeBalanceIntentId: intent.id,
            status: 'CONFIRMED' // Or a specific 'HELD' status if we add one
          }
        });

        // Update Wallet: Move from "Potential" to "Authorized"
        await prisma.merchantWallet.update({
          where: { merchantId: booking.merchantId },
          data: {
            authorizedBalance: { increment: booking.balanceAmount * 0.91 }
          }
        });

        console.log(`[Cron] ✅ Held balance for Booking ${booking.id}`);

        // Notification: Hold Success
        await createNotification({
          userId: booking.customerId,
          title: "🔒 服務尾款已成功鎖定",
          message: `我們已成功為您的預約 (ID: ${booking.id.slice(-6).toUpperCase()}) 鎖定 £${(booking.balanceAmount || 0).toFixed(2)} 的尾款。服務完成後將正式扣款。`,
          type: 'SUCCESS',
          link: '/dashboard/bookings'
        });

      } catch (err: any) {
        console.error(`[Cron] ❌ Failed to hold balance for Booking ${booking.id}:`, err.message);
        
        // Mark for 3-day grace period
        await prisma.booking.update({
          where: { id: booking.id },
          data: { 
            reauthDeadline: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
          }
        });

        // Notification: Hold Failure (Update Required)
        await createNotification({
          userId: booking.customerId,
          title: "⚠️ 支付提醒：尾款鎖定失敗",
          message: `我們無法鎖定您的預約尾款。請在 3 天內更新您的支付卡片，否則預約將自動取消且 20% 訂金不予退還。`,
          type: 'ALERT',
          link: '/dashboard/bookings'
        });
      }
    }

    // --- 2. D-4 AUTO-CANCEL (FAILED HOLDS) ---
    const failedBookings = await prisma.booking.findMany({
      where: {
        reauthDeadline: { lte: now },
        status: { not: 'COMPLETED' },
        stripeBalanceIntentId: null
      }
    });

    for (const booking of failedBookings) {
      await prisma.booking.update({
        where: { id: booking.id },
        data: { status: 'CANCELLED' }
      });
      
      // Notification: Auto-Cancelled
      await createNotification({
        userId: booking.customerId,
        title: "❌ 預約已自動取消",
        message: `由於未能成功鎖定尾款，您的預約 (ID: ${booking.id.slice(-6).toUpperCase()}) 已自動取消。根據條款，20% 訂金將不予退還。`,
        type: 'ALERT',
        link: '/dashboard/bookings'
      });

      console.log(`[Cron] 🗑️ Auto-cancelled Booking ${booking.id} due to failed re-auth.`);
    }

    // --- 3. RELEASE EDUCATION FUNDS (14 DAYS) ---
    const maturedBookings = await prisma.booking.findMany({
      where: {
        isEducation: true,
        coolingOffUntil: { lte: now },
        status: { not: 'CANCELLED' }
      }
    });

    for (const booking of maturedBookings) {
      const netAmount = booking.depositPaid * 0.91;
      
      // Move from Pending to Available
      await prisma.merchantWallet.update({
        where: { merchantId: booking.merchantId },
        data: {
          pendingBalance: { decrement: netAmount },
          availableBalance: { increment: netAmount }
        }
      });

      // Clear the coolingOffUntil to prevent re-releases
      await prisma.booking.update({
        where: { id: booking.id },
        data: { coolingOffUntil: null }
      });
      
      console.log(`[Cron] 🔓 Released Education funds for Booking ${booking.id}`);
    }

    return NextResponse.json({ 
      processed: true, 
      holds: pendingHolds.length, 
      matured: maturedBookings.length,
      cancelled: failedBookings.length 
    });

  } catch (err: any) {
    console.error(`[Cron Error]`, err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
