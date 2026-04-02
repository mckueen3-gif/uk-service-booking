import React from 'react';
import LegalLayout from '../LegalLayout';
import Link from 'next/link';

export default function CookiePolicy() {
  return (
    <LegalLayout 
      title="Cookie Policy" 
      lastUpdated="March 28, 2026"
    >
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">1. What are Cookies?</h2>
        <p>
          Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the owners of the site.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">2. Types of Cookies We Use</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-slate-800">Necessary Cookies</h3>
            <p>
              These cookies are essential for the operation of our Platform. They include, for example, cookies that enable you to log into secure areas of our Platform or use our booking and payment services.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4 text-slate-800">Analytical/Performance Cookies</h3>
            <p>
              They allow us to recognize and count the number of visitors and to see how visitors move around our Platform when they are using it. This helps us to improve the way our Platform works.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">3. Managing Your Cookies</h2>
        <p>
          You can choose to accept or refuse cookies. Most web browsers automatically accept cookies, but you can usually modify your browser setting to decline cookies if you prefer. 
        </p>
        <p className="mt-4">
          Please note that disabling necessary cookies may prevent you from using certain features of the ConciergeAI platform, such as persistent login and booking management.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">4. Consent</h2>
        <p>
          Upon your first visit to ConciergeAI, we display a cookie consent banner. By clicking "Accept All", you consent to our use of all cookies mentioned in this policy.
        </p>
      </section>

      <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center text-sm font-medium">
        <Link href="/legal/privacy" className="text-blue-600 hover:text-blue-700 transition-colors">
          &larr; View Privacy Policy
        </Link>
        <Link href="/" className="text-slate-500 hover:text-slate-700 transition-colors">
          Return Home
        </Link>
      </div>
    </LegalLayout>
  );
}
