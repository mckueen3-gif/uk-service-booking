"use server";

import { prisma } from "@/lib/prisma";
import { jsPDF } from "jspdf";

export async function generateAndSaveReceipt(bookingId: string) {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        customer: true,
        merchant: true,
        service: true
      }
    });

    if (!booking) throw new Error("Booking not found");

    // Check if receipt already exists
    const existing = await prisma.receipt.findUnique({ where: { bookingId } });
    if (existing) return existing;

    // Generate PDF
    const doc = new jsPDF();
    const receiptNumber = `RC-${booking.id.slice(-8).toUpperCase()}-${Date.now().toString().slice(-4)}`;

    // Professional Styles
    doc.setFontSize(22);
    doc.setTextColor(212, 175, 55); // Concierge Gold
    doc.text("ConciergeAI", 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text("The Elite Service Ecosystem", 105, 28, { align: 'center' });

    doc.setDrawColor(230);
    doc.line(20, 35, 190, 35);

    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("TAX INVOICE / RECEIPT", 20, 50);
    
    doc.setFontSize(10);
    doc.text(`Receipt #: ${receiptNumber}`, 140, 50);
    doc.text(`Date: ${new Date().toLocaleDateString('en-GB')}`, 140, 55);

    // Merchant Info
    doc.setFontSize(11);
    doc.text("EXPERT INFO", 20, 70);
    doc.setFontSize(10);
    doc.text(booking.merchant.companyName, 20, 78);
    doc.text(booking.merchant.city, 20, 84);
    if (booking.merchant.vatNumber) doc.text(`VAT: ${booking.merchant.vatNumber}`, 20, 90);

    // Customer Info
    doc.setFontSize(11);
    doc.text("BILL TO", 120, 70);
    doc.setFontSize(10);
    doc.text(booking.customer.name || "Valued Customer", 120, 78);
    doc.text(booking.customer.email, 120, 84);

    // Table Header
    doc.setFillColor(245, 245, 245);
    doc.rect(20, 105, 170, 10, 'F');
    doc.setFontSize(10);
    doc.text("Service Description", 25, 112);
    doc.text("Amount", 170, 112, { align: 'right' });

    // Table Content
    doc.text(booking.service.name, 25, 125);
    doc.text(`£${booking.totalAmount.toFixed(2)}`, 170, 125, { align: 'right' });

    doc.line(20, 135, 190, 135);

    // Totals
    const subtotal = booking.totalAmount;
    doc.setFontSize(12);
    doc.text("Total Paid:", 140, 150);
    doc.setFontSize(14);
    doc.setTextColor(21, 128, 61); // Green
    doc.text(`£${subtotal.toFixed(2)}`, 170, 150, { align: 'right' });

    doc.setTextColor(150);
    doc.setFontSize(8);
    doc.text("Thank you for using ConciergeAI. This receipt is automatically generated for your records.", 105, 190, { align: 'center' });

    // Output as Data URI (Base64)
    const pdfBase64 = doc.output('datauristring');

    // Save to Vault
    const receipt = await prisma.receipt.create({
      data: {
        bookingId: booking.id,
        receiptNumber,
        totalAmount: booking.totalAmount,
        taxAmount: 0, // Simplified for now
        fileUrl: pdfBase64
      }
    });

    return receipt;
  } catch (error) {
    console.error("Receipt Generation Error:", error);
    return null;
  }
}

export async function getBookingReceipt(bookingId: string) {
  return await prisma.receipt.findUnique({
    where: { bookingId }
  });
}
