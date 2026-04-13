"use server";

import { revalidatePath } from 'next/cache';
import { sendBookingConfirmationEmail, sendMerchantJobAlert } from '@/lib/mail';
import { prisma } from '@/lib/prisma';
import { getStripeClient } from '@/lib/stripe';
import { sendEmergencyAlert } from '@/lib/sms';

export async function finalizeBooking(sessionId: string) {
  try {
    const stripe = await getStripeClient();
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== 'paid') {
      return { error: "Payment not completed" };
    }

    const { merchantId, customerId, scheduledDate, serviceId, serviceName, vehicleInfo, isUrgent } = session.metadata || {};
    const urgentFlag = isUrgent === 'true';

    if (!merchantId || !customerId) {
        return { error: "Missing metadata in session" };
    }

    // Check if booking already exists for this session to avoid duplicates
    const existing = await prisma.booking.findUnique({
      where: { stripePaymentIntentId: session.payment_intent as string }
    });

    if (existing) return { success: true, bookingId: existing.id };

    // Find the service ID (or create a generic one if missing)
    let service;
    if (serviceId) {
      service = await prisma.service.findUnique({ where: { id: serviceId } });
    }
    
    if (!service) {
      service = await prisma.service.findFirst({
        where: { merchantId, name: serviceName }
      });
    }

    if (!service) {
      service = await prisma.service.create({
        data: {
          merchantId,
          name: serviceName || "General Service",
          category: "General",
          price: (session.amount_total || 0) / 100
        }
      });
    }

    const vehicle = JSON.parse(vehicleInfo || "{}");

    // 🚀 NEW: Update Merchant Wallet & Log Platform Fee
    const { recordInitialBookingPayment } = await import('@/lib/finance');
    const depositAmount = (session.amount_total || 0) / 100;
    const { merchantPayout, platformFee } = await recordInitialBookingPayment(merchantId, depositAmount);

    const booking = await (prisma.booking as any).create({
      data: {
        customerId,
        merchantId,
        serviceId: service.id,
        scheduledDate: new Date(scheduledDate || Date.now()),
        status: 'PENDING',
        totalAmount: depositAmount,
        depositPaid: depositAmount, // Treating total as deposit initially for standard repairs/education
        merchantAmount: merchantPayout,
        platformFee: platformFee,
        stripePaymentIntentId: session.payment_intent as string,
        isUrgent: urgentFlag,
        vehicleReg: vehicle.reg || null,
        vehicleMake: vehicle.make || null,
        vehicleModel: vehicle.model || null,
        vehicleYear: vehicle.year || null,
      }
    });

    // 🚀 NEW: Trigger Real-world Communications (Post-Prisma creation)
    const [fullCustomer, fullMerchant] = await Promise.all([
      prisma.user.findUnique({ where: { id: customerId }, select: { email: true, name: true } }),
      prisma.merchant.findUnique({ where: { id: merchantId }, include: { user: { select: { email: true, name: true } } } })
    ]);

    if (fullCustomer?.email && fullMerchant?.user?.email) {
       // Fire-and-forget emails (don't block the UI)
       sendBookingConfirmationEmail(fullCustomer.email, {
         customerName: fullCustomer.name || "Customer",
         serviceName: service.name,
         date: new Date(scheduledDate || Date.now()).toLocaleDateString(),
         price: (session.amount_total || 0) / 100
       }).catch(console.error);

       sendMerchantJobAlert(fullMerchant.user.email, {
         merchantName: fullMerchant.user.name || fullMerchant.companyName,
         serviceName: service.name,
         customerName: fullCustomer.name || "Customer",
         date: new Date(scheduledDate || Date.now()).toLocaleDateString()
       }).catch(console.error);

       // ⚡ EMERGENCY SMS ALERT
       if (urgentFlag && fullMerchant?.user?.phone) {
         sendEmergencyAlert(
           fullMerchant.user.phone, 
           fullMerchant.companyName, 
           service.name
         ).catch(console.error);
       }
    }

    revalidatePath('/dashboard');
    return { success: true, bookingId: booking.id };

  } catch (err: any) {
    console.error("Finalize Booking Error:", err);
    return { error: err.message };
  }
}
