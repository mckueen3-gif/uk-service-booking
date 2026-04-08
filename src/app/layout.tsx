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

export const metadata: Metadata = {
  title: "ConciergeAI | Professional UK Service Booking",
  description: "Book verified electricians, plumbers, and home cleaners in the UK instantly.",
  alternates: {
    canonical: 'https://conciergeai.uk',
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
