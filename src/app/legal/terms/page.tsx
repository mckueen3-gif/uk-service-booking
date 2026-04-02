import React from 'react';
import LegalLayout from '../LegalLayout';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <LegalLayout 
      title="Terms of Service" 
      lastUpdated="March 28, 2026"
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">1. Acceptance of Terms</h2>
        <p>
          By accessing or using the ConciergeAI platform (the "Platform"), you agree to be bound by these Terms of Service. If you are using the Platform on behalf of a business, you represent that you have the authority to bind that business to these terms.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">2. Our Role as a Marketplace</h2>
        <p>
          ConciergeAI provides a marketplace that connects customers ("Customers") with independent service providers ("Merchants"). ConciergeAI is not a provider of automotive, home repair, or professional services. The contract for the provision of services is directly between the Customer and the Merchant.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">3. Booking and Variations</h2>
        <p>
          Bookings are made via the Platform. Merchants may propose price variations ("Variations") during the course of a service if additional work or parts are required. 
        </p>
        <ul className="list-disc pl-6 space-y-4">
          <li>Variations must be supported by photographic evidence uploaded to the Platform.</li>
          <li>Customers have the right to accept or dispute Variations.</li>
          <li>Unaccepted Variations may result in the work being paused or terminated.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">4. AI Dispute Arbitration</h2>
        <p>
          In the event of a dispute regarding a Variation or service quality, ConciergeAI utilizes an <strong>AI Dispute Arbiter</strong> to provide a neutral resolution recommendation based on photographic evidence and user input.
        </p>
        <p>
          By using the Platform, you acknowledge that AI will be used to expedite resolution. However, all AI decisions are subject to <strong>Manual Oversight</strong> by ConciergeAI administrators to ensure fairness and compliance with UK Consumer Rights.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">5. Payments and Refunds</h2>
        <p>
          Payment for services is processed via Stripe. Funds are held in escrow until service completion. 
        </p>
        <ul className="list-disc pl-6 space-y-4">
          <li>Refunds will be processed in accordance with the AI/Admin dispute resolution outcome.</li>
          <li>Merchant payouts occur typically 2-7 days after successful job completion.</li>
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">6. Liability</h2>
        <p>
          To the maximum extent permitted by UK law (Consumer Rights Act 2015), ConciergeAI's liability is limited to the platform fee paid for the specific booking in question.
        </p>
      </section>

      <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center text-sm font-medium">
        <Link href="/legal/privacy" className="text-blue-600 hover:text-blue-700 transition-colors">
          View Privacy Policy &rarr;
        </Link>
        <Link href="/" className="text-slate-500 hover:text-slate-700 transition-colors">
          Return Home
        </Link>
      </div>
    </LegalLayout>
  );
}
