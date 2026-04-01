import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import { generateUniqueReferralCode } from "./referral-utils";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const email = credentials?.email?.toLowerCase();
        if (!email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          select: { 
            id: true, 
            email: true, 
            name: true, 
            role: true, 
            password: true,
            referralCode: true
          }
        });

        if (!user || !user.password) return null;
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
        if (!isPasswordValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          referralCode: user.referralCode
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.referralCode = (user as any).referralCode;
      }
      
      // 🚀 Facts First: Always provide a safe fallback in token
      if (!token.referralCode) {
        token.referralCode = "REF-SYNCING";
      }

      if (trigger === "update" && session?.referralCode) {
        token.referralCode = session.referralCode;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).referralCode = token.referralCode;
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        
        try {
          const email = user.email.toLowerCase();
          
          // 🚀 ATOMIC UPSERT: Single DB call to find or create.
          // This ensures the USER.ID is valid for the JWT mapping immediately.
          const dbUser = await prisma.user.upsert({
            where: { email },
            update: {
              // Refresh image/name from Google if they exist
              name: user.name || undefined,
              image: user.image || undefined,
            },
            create: {
              email,
              name: user.name,
              image: user.image,
              role: "CUSTOMER",
              // We generate a code here but it might still collide. 
              // referralCode will be finalized by the self-healing API if needed.
              referralCode: `PENDING-${Math.random().toString(36).substring(7)}`,
            },
            select: { id: true, role: true, referralCode: true }
          });

          user.id = dbUser.id;
          (user as any).role = dbUser.role;
          (user as any).referralCode = dbUser.referralCode || "REF-SYNCING";
        } catch (error) {
          console.error("Critical SignIn failure:", error);
          // Still allow sign in if DB is slightly laggy, but fallback to base user
          return true;
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  events: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        // 🚀 BACKGROUND AUTO-GENERATION:
        // Now that the user DEFINITELY exists (via upsert), ensure the referral code is professional.
        try {
          const dbUser = await prisma.user.findUnique({
            where: { email: user.email.toLowerCase() },
            select: { id: true, referralCode: true, name: true }
          });

          if (dbUser && (!dbUser.referralCode || dbUser.referralCode.startsWith("PENDING-"))) {
            const finalCode = await generateUniqueReferralCode(dbUser.name || "USER");
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { referralCode: finalCode }
            });
          }
        } catch (e) {
          console.error("Background referral finalization failed:", e);
        }
      }
    }
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "UK_SERVICE_HUB_FALLBACK_SECRET_2024",
};
