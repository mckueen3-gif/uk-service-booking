import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import AIChatbot from "@/components/AIChatbot";
import StructuredData from "@/components/StructuredData";
import ChatWidget from "@/components/chat/ChatWidget";
import NavbarSearch from "@/app/components/NavbarSearch";
import CookieBanner from "@/components/legal/CookieBanner";
import NotificationHub from "@/components/dashboard/NotificationHub";
import { User } from "lucide-react";

import { LanguageProvider } from "@/components/LanguageContext";
import { LocationProvider } from "@/components/LocationContext";
import { AppNavbar, AppFooter } from "@/app/components/ClientLayout";

export const metadata: Metadata = {
  title: "ServiceHub | Professional UK Service Booking",
  description: "Book verified electricians, plumbers, and home cleaners in the UK instantly.",
  alternates: {
    canonical: 'https://uk-services.com',
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

import { AuthProvider } from "@/app/components/AuthProvider";

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
    <html lang="en">
      <body style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', padding: 0, margin: 0, transition: 'background-color 0.3s ease' }}>
        <AuthProvider>
          <LanguageProvider>
            <LocationProvider>
              <AppNavbar session={session} />
              <main style={{ minHeight: 'calc(100vh - 80px)', paddingTop: '80px' }}>
                {children}
              </main>
              <AppFooter />
              <AIChatbot />
              <CookieBanner />
              <NotificationHub /> 
            </LocationProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
