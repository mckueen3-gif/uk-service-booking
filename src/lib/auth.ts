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
      
      // 🛡️ RECOVERY: If code is missing in token, try a quick DB lookup or generate one
      if (!token.referralCode && token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { referralCode: true, name: true }
          });
          
          if (dbUser?.referralCode) {
            token.referralCode = dbUser.referralCode;
          } else if (dbUser) {
            // Generate immediately if still missing
            const prefix = (dbUser.name || "USER").substring(0, 3).toUpperCase().replace(/\s/g, '');
            const random = Math.floor(1000 + Math.random() * 9000);
            const newCode = `${prefix}${random}`;
            await prisma.user.update({
              where: { id: token.id as string },
              data: { referralCode: newCode }
            });
            token.referralCode = newCode;
          }
        } catch (e) {
          console.error("JWT Referral lookup failed:", e);
        }
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
        
        try {
          const email = user.email.toLowerCase();
          const existingUser = await prisma.user.findUnique({
            where: { email }
          });

          if (!existingUser) {
            const prefix = (user.name || "USER").substring(0, 3).toUpperCase().replace(/\s/g, '');
            const random = Math.floor(1000 + Math.random() * 9000);
            const referralCode = `${prefix}${random}`;

            const newUser = await prisma.user.create({
              data: {
                email,
                name: user.name,
                image: user.image,
                role: "CUSTOMER",
                referralCode,
              }
            });
            user.id = newUser.id;
            (user as any).role = newUser.role;
            (user as any).referralCode = newUser.referralCode;
          } else {
            user.id = existingUser.id;
            (user as any).role = existingUser.role;
            
            if (!existingUser.referralCode) {
              const prefix = (existingUser.name || "USER").substring(0, 3).toUpperCase().replace(/\s/g, '');
              const random = Math.floor(1000 + Math.random() * 9000);
              const referralCode = `${prefix}${random}`;
              
              await prisma.user.update({
                where: { id: existingUser.id },
                data: { referralCode }
              });
              (user as any).referralCode = referralCode;
            } else {
              (user as any).referralCode = existingUser.referralCode;
            }
          }
        } catch (error) {
          console.error("Google SignIn Sync Error:", error);
        }
      }
      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "UK_SERVICE_HUB_FALLBACK_SECRET_2024",
};
