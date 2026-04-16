import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

// Sub-paths that require merchant login (dashboard pages)
const MERCHANT_DASHBOARD_PATHS = [
  "/merchant/schedule",
  "/merchant/availability",
  "/merchant/services",
  "/merchant/wallet",
  "/merchant/earnings",
  "/merchant/portfolio",
  "/merchant/reviews",
  "/merchant/accounting",
  "/merchant/verification",
  "/merchant/page",   // catches /merchant exactly
];

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // /merchant/[id] = public profile page — allow everyone
    const isMerchantDashboard = MERCHANT_DASHBOARD_PATHS.some(p =>
      pathname === p || pathname.startsWith(p + "/")
    ) || pathname === "/merchant";

    const isMemberRoot = pathname === "/member" || pathname === "/member/";
    const isPublicHome = pathname === "/";

    if (isMemberRoot) {
      return NextResponse.redirect(new URL("/member/home", req.url));
    }

    if (isPublicHome && token) {
      if (token.role === "MERCHANT" || token.role === "ADMIN") {
        return NextResponse.redirect(new URL("/merchant", req.url));
      }
      return NextResponse.redirect(new URL("/member/home", req.url));
    }

    if (isMerchantDashboard) {
      // Must be logged in as MERCHANT or ADMIN
      if (token?.role !== "MERCHANT" && token?.role !== "ADMIN") {
        return NextResponse.redirect(new URL("/member", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname.replace(/\/$/, "");

        // Public routes — no login required
        if (path === "" || path === "/diagnosis") return true;
        if (path === "/services" || path.startsWith("/services/")) return true;

        // /merchant/[id] is a single segment — public profile page
        const merchantSegments = path.split("/").filter(Boolean);
        if (merchantSegments[0] === "merchant" && merchantSegments.length === 1) {
          // /merchant itself is dashboard — require login
          return !!token;
        }
        if (merchantSegments[0] === "merchant" && merchantSegments.length === 2) {
          // /merchant/[id] = public profile — allow guests
          return true;
        }

        // All other protected routes require login
        return !!token;
      },
    },
    pages: {
      signIn: "/auth/login",
    },
  }
);

export const config = {
  matcher: ["/", "/member/:path*", "/merchant/:path*", "/book/:path*"],
};
