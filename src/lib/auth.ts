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

        const user = await prisma.user.findFirst({
          where: { email: { equals: email, mode: 'insensitive' } },
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
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        if (!user.email) return false;
        
        try {
          const email = user.email.toLowerCase();
          
          // 🚀 Case-Insensitive Lookup (CRITICAL for preventing duplicate P2002 errors)
          let dbUser = await prisma.user.findFirst({
            where: { email: { equals: email, mode: 'insensitive' } },
            select: { id: true, role: true, referralCode: true, name: true, image: true }
          });

          if (dbUser) {
            // Only update if Google provided new info
            if ((user.name && user.name !== dbUser.name) || (user.image && user.image !== dbUser.image)) {
              await prisma.user.update({
                where: { id: dbUser.id },
                data: {
                  name: user.name || dbUser.name,
                  image: user.image || dbUser.image,
                }
              });
            }
          } else {
            // Create user
            dbUser = await prisma.user.create({
              data: {
                email,
                name: user.name,
                image: user.image,
                role: "CUSTOMER",
                referralCode: `PENDING-${Math.random().toString(36).substring(7)}`,
              },
              select: { id: true, role: true, referralCode: true, name: true, image: true }
            });
          }

          // 🛡️ BIND DB ID to JWT token immediately
          user.id = dbUser.id;
          (user as any).role = dbUser.role;
          (user as any).referralCode = dbUser.referralCode || "REF-SYNCING";
          
          return true;
        } catch (error) {
          console.error("Critical SignIn failure:", error);
          // If we fail to write to the DB, DO NOT allow a ghost session!
          // NextAuth will redirect to the error page, which is safer than breaking the whole UI loop.
          return false;
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
        try {
          const email = user.email.toLowerCase();
          const dbUser = await prisma.user.findFirst({
            where: { email: { equals: email, mode: 'insensitive' } },
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
