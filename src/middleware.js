// // middleware.js
// import { NextResponse } from "next/server";
// import { jwtVerify } from "jose";

// // List of allowed origins (can also use process.env.ALLOWED_ORIGIN for flexibility)
// const allowedOrigins = [
//   "http://localhost:3000",        // frontend dev
//   "http://192.168.1.51:3000"      // frontend on LAN
// ];

// const secret = new TextEncoder().encode(process.env.JWT_SECRET);

// // Helper: set CORS headers
// function setCorsHeaders(res, origin) {
//   // const allowedOrigin = allowedOrigins.includes(origin) ? origin : allowedOrigins[0];
//   res.headers.set("Access-Control-Allow-Origin", "*");
//   res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
//   res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.headers.set("Access-Control-Allow-Credentials", "true"); // essential for cookies
//   return res;
// }

// export async function middleware(req) {
//   const origin = req.headers.get("origin");

//   // Handle preflight request (OPTIONS)
//   if (req.method === "OPTIONS") {
//     let preflightRes = new NextResponse(null, { status: 204 });
//     return setCorsHeaders(preflightRes, origin);
//   }

//   // ---------- JWT Protection ----------
//   if (req.nextUrl.pathname.startsWith("/api/auth")) {
//     // Public routes
//     const publicRoutes = [
//       "/api/auth/login",
//       "/api/auth/register",
//       "/api/auth/forgot-password"
//     ];

//     if (!publicRoutes.includes(req.nextUrl.pathname)) {
//       const token = req.cookies.get("token")?.value;

//       if (!token) {
//         return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
//       }

//       try {
//         await jwtVerify(token, secret);
//         // ✅ token valid → continue
//       } catch (error) {
//         return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
//       }
//     }
//   }

//   // For other requests, apply CORS headers
//   let res = NextResponse.next();
//   return setCorsHeaders(res, origin);
// }

// // Apply middleware only to API routes
// export const config = {
//   matcher: "/api/:path*",
// };








// middleware.js
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
 
// List of allowed origins (can also use process.env.ALLOWED_ORIGIN for flexibility)
const allowedOrigins = [
  "http://localhost:3000",        // frontend dev
  "http://192.168.1.51:3000"      // frontend on LAN
];
 
const secret = new TextEncoder().encode(process.env.JWT_SECRET);
 
// Helper: set CORS headers
function setCorsHeaders(res, origin) {
  
  
  res.headers.set("Access-Control-Allow-Origin", "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.headers.set("Access-Control-Allow-Credentials", "true"); // essential for cookies
  return res;
}
 
export async function middleware(req) {
  const origin = req.headers.get("origin");
 
  // Handle preflight request (OPTIONS)
  if (req.method === "OPTIONS") {
    let preflightRes = new NextResponse(null, { status: 204 });
    return setCorsHeaders(preflightRes, origin);
  }
 
  // ---------- JWT Protection ----------
  if (req.nextUrl.pathname.startsWith("/api/auth")) {
    // Public routes
    const publicRoutes = [
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/forgot-password"
    ];
 
    if (!publicRoutes.includes(req.nextUrl.pathname)) {
      const token = req.cookies.get("token")?.value;
 
      if (!token) {
        return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
      }
 
      try {
        await jwtVerify(token, secret);
        // ✅ token valid → continue
      } catch (error) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
      }
    }
  }
 
  // For other requests, apply CORS headers
  let res = NextResponse.next();
  return setCorsHeaders(res, origin);
}
 
// Apply middleware only to API routes
export const config = {
  matcher: "/api/:path*",
};






