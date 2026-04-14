import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import AIChatbot from "@/components/AIChatbot";
import StructuredData from "@/components/StructuredData";
import NavbarSearch from "@/app/components/NavbarSearch";
import CookieBanner from "@/components/legal/CookieBanner";
import ScrollProgress from "@/app/components/ScrollProgress";
import { User } from "lucide-react";

import { LanguageProvider } from "@/components/LanguageContext";
import { LocationProvider } from "@/components/LocationContext";
import { ThemeProvider } from "@/components/ThemeContext";
import { AppNavbar, AppFooter } from "@/app/components/ClientLayout";
import { AuthProvider } from "@/app/components/AuthProvider";
import { GoogleMapsProvider } from "@/components/GoogleMapProvider";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const outfit = Outfit({ subsets: ["latin"], variable: "--font-heading" });

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    default: "ConciergeAI | Elite UK & HK Service Experts",
    template: "%s | ConciergeAI Elite"
  },
  description: "Access the top 1% of verified professionals in the UK & HK. AI-driven diagnostics, insured specialists, and guaranteed results for home, legal, and business needs.",
  keywords: ["verified experts", "emergency repairs", "elite professionals", "UK service booking", "Hong Kong experts", "AI diagnostics", "professional cleaning", "legal advice"],
  authors: [{ name: "ConciergeAI Elite Team" }],
  openGraph: {
    title: "ConciergeAI | Instantly Book Top 1% Verified Experts",
    description: "Experience the most elite service marketplace. Fully verified, insured, and AI-optimized professionals.",
    url: "https://conciergeai.uk",
    siteName: "ConciergeAI Elite",
    images: [{ url: "/images/og-premium.png", width: 1200, height: 630, alt: "ConciergeAI Elite Services" }],
    locale: "en_GB",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ConciergeAI | Top 1% Verified Experts",
    description: "Book insured and AI-monitored professionals instantly. The UK & HK standard for excellence.",
    images: ["/images/og-premium.png"],
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (err) {
    console.error("Auth Session Error:", err);
  }

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`} data-concierge-version="4.4-OMEGA">
      <body>
        <ScrollProgress />
        <GoogleMapsProvider>
          <AuthProvider>
            <ThemeProvider>
              <LanguageProvider>
                <LocationProvider>
                  <AppNavbar session={session} />
                  <main className="main-content" style={{ paddingTop: '80px' }}>
                    {children}
                  </main>
                  <AppFooter />
                  <AIChatbot />
                  <CookieBanner />
                </LocationProvider>
              </LanguageProvider>
            </ThemeProvider>
          </AuthProvider>
        </GoogleMapsProvider>
      </body>
    </html>
  );
}
