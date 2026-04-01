import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

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
      
      // 🚀 Facts First: Do NOT block on DB lookup here. 
      // If code is missing, we let the Dashboard background sync handle it.
      if (!token.referralCode) {
        token.referralCode = "REF-SYNCING";
      }

      // Allow dynamic session updates
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
        
        // 🚀 Fast Path for SignIn: Only do essential checks
        try {
          const email = user.email.toLowerCase();
          const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true, role: true, referralCode: true }
          });

          if (existingUser) {
            user.id = existingUser.id;
            (user as any).role = existingUser.role;
            (user as any).referralCode = existingUser.referralCode || "REF-SYNCING";
          } else {
            // New users will be created in the background event to avoid blocking
            (user as any).role = "CUSTOMER";
            (user as any).referralCode = "REF-SYNCING";
          }
        } catch (error) {
          console.error("Fast SignIn check failed:", error);
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
        // 🚀 BACKGROUND SYNC: This runs asynchronously after the user is redirected.
        try {
          const email = user.email.toLowerCase();
          const dbUser = await prisma.user.findUnique({ where: { email } });

          if (!dbUser) {
            const prefix = (user.name || "USER").substring(0, 3).toUpperCase().replace(/\s/g, '');
            const random = Math.floor(1000 + Math.random() * 9000);
            const referralCode = `${prefix}${random}`;

            await prisma.user.create({
              data: {
                email,
                name: user.name,
                image: user.image,
                role: "CUSTOMER",
                referralCode,
              }
            });
          } else if (!dbUser.referralCode) {
            const prefix = (dbUser.name || "USER").substring(0, 3).toUpperCase().replace(/\s/g, '');
            const random = Math.floor(1000 + Math.random() * 9000);
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { referralCode: `${prefix}${random}` }
            });
          }
        } catch (e) {
          console.error("Background sync failed:", e);
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
