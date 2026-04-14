import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isMerchantPage = req.nextUrl.pathname.startsWith("/merchant");
    
    // Authorization: Restrict /merchant to MERCHANTS or ADMINS
    if (isMerchantPage && token?.role !== "MERCHANT" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/member", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
      // Always allow /diagnosis even if token is missing
      if (req.nextUrl.pathname === "/diagnosis") return true;
      return !!token;
    },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: ["/member/:path*", "/merchant/:path*"],
};
