// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";


// List of allowed origins
const allowedOrigins = [
  "http://localhost:3000",        // frontend dev
  "http://192.168.1.51:3000"    // frontend on LAN

];

const secret = new TextEncoder().encode(process.env.JWT_SECRET);


export async function middleware(req) {
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


  // ---------- JWT Protection ----------
  // Apply only on /api/auth/*
  if (req.nextUrl.pathname.startsWith("/api/auth")) {
    // Allow public routes (login, register, forgot-password, etc.)
    const publicRoutes = ["/api/auth/login", "/api/auth/register", "/api/auth/forgot-password"];
    if (!publicRoutes.includes(req.nextUrl.pathname)) {
      const token = req.cookies.get("token")?.value;

      if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }

      try {
         await jwtVerify(token, secret);
        // ✅ token is valid → let request continue
      } catch (error) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
      }
    }
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




