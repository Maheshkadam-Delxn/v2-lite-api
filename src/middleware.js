import { NextResponse } from "next/server";

// List of allowed origins
const allowedOrigins = [
  "http://localhost:3000",        // frontend dev
  "http://192.168.1.51:3000"    // frontend on LAN

];

export function middleware(req) {
  const origin = req.headers.get("origin");

  // Handle preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": allowedOrigins.includes(origin) ? origin : "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Allow-Credentials": "true",
      },
    });
  }

  // For other requests, set CORS headers
  const response = NextResponse.next();
  response.headers.set(
    "Access-Control-Allow-Origin",
    allowedOrigins.includes(origin) ? origin : "*"
  );
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS"
  );
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  return response;
}

// Apply middleware only to API routes
export const config = {
  matcher: "/api/:path*",
};
