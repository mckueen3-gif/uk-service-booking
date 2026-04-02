import React from 'react';
import LegalLayout from '../LegalLayout';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <LegalLayout 
      title="Privacy Policy" 
      lastUpdated="March 28, 2026"
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">1. Introduction</h2>
        <p>
          ConciergeAI ("we", "our", or "us") is committed to protecting and respecting your privacy. This policy explains how we collect, use, and process your personal data in accordance with the UK General Data Protection Regulation (UK GDPR) and the Data Protection Act 2018.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">2. Data We Collect</h2>
        <p>We may collect and process the following data about you:</p>
        <ul className="list-disc pl-6 space-y-4">
          <li><strong>Identity Data</strong>: Name, username, or similar identifier.</li>
          <li><strong>Contact Data</strong>: Email address, phone number, and physical address.</li>
          <li><strong>Asset Data</strong>: Information about your vehicles (Reg, Make, Model) or properties.</li>
          <li><strong>Financial Data</strong>: Payment card details (processed securely via Stripe).</li>
          <li><strong>Transaction Data</strong>: Details about services you have booked or provided.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">3. How We Use Your Data</h2>
        <p>We use your data to:</p>
        <ul className="list-disc pl-6 space-y-4">
          <li>Provide and manage your bookings.</li>
          <li>Process payments and prevent fraud.</li>
          <li>Utilize AI services (Gemini Vision) for dispute resolution by analyzing uploaded photos.</li>
          <li>Notify you about changes to our service.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">4. Data Sharing</h2>
        <p>
          We share your data with Merchants (to facilitate bookings) and third-party service providers (Stripe for payments, Google for AI analysis). We do not sell your personal data to third parties.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">5. Your Legal Rights</h2>
        <p>Under UK GDPR, you have the right to:</p>
        <ul className="list-disc pl-6 space-y-4">
          <li>Request access to your personal data.</li>
          <li>Request correction or erasure of your data ("Right to be Forgotten").</li>
          <li>Object to processing of your personal data.</li>
          <li>Request the transfer of your data to another party.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">6. Contact Us</h2>
        <p>
          If you have any questions about this privacy policy or our privacy practices, please contact our Data Protection Officer at <code className="bg-slate-100 px-2 py-0.5 rounded text-blue-600">privacy@conciergeai.co.uk</code>.
        </p>
      </section>

      <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center text-sm font-medium">
        <Link href="/legal/terms" className="text-blue-600 hover:text-blue-700 transition-colors">
          &larr; View Terms of Service
        </Link>
        <Link href="/" className="text-slate-500 hover:text-slate-700 transition-colors">
          Return Home
        </Link>
      </div>
    </LegalLayout>
  );
}
