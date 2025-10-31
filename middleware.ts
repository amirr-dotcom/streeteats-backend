import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith("/api")) {
    const origin = request.headers.get("origin");

    // Handle preflight OPTIONS requests
    if (request.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 204 });

      // Allow all origins
      response.headers.set("Access-Control-Allow-Origin", origin || "*");
      response.headers.set(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS, PATCH"
      );
      response.headers.set(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, X-Requested-With"
      );
      response.headers.set("Access-Control-Allow-Credentials", "true");
      response.headers.set("Access-Control-Max-Age", "86400");

      return response;
    }

    // For actual requests, add CORS headers to the response
    const response = NextResponse.next();

    // Allow all origins
    response.headers.set("Access-Control-Allow-Origin", origin || "*");
    response.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS, PATCH"
    );
    response.headers.set(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Requested-With"
    );
    response.headers.set("Access-Control-Allow-Credentials", "true");

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
