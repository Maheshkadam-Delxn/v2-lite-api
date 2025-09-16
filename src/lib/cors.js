import { NextResponse } from "next/server";

export function withCors(handler) {
  return async (req, ctx) => {
    // Handle preflight (OPTIONS request)
    if (req.method === "OPTIONS") {
      const res = NextResponse.json({}, { status: 200 });
      setCorsHeaders(res);
      return res;
    }

    // Normal request → call the original handler
    const res = await handler(req, ctx);

    // Ensure CORS headers are set
    setCorsHeaders(res);

    return res;
  };
}

function setCorsHeaders(res) {
  res.headers.set("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
}
