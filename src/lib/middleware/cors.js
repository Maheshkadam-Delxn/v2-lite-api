export function corsMiddleware(handler, allowedOrigins = []) {
  return async (req, ...args) => {
    const origin = req.headers.get("origin");

    // Check if request origin is allowed
    if (allowedOrigins.length > 0 && !allowedOrigins.includes(origin)) {
      return new Response(JSON.stringify({ error: "CORS blocked: Origin not allowed" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Set CORS headers
    const headers = {
      "Access-Control-Allow-Origin": origin || "*",
      "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type,Authorization",
    };

    // Handle preflight requests
    if (req.method === "OPTIONS") {
      return new Response(null, { status: 204, headers });
    }

    // Call the actual handler
    const res = await handler(req, ...args);

    // Attach CORS headers to response
    return new Response(await res.text(), { ...res, headers: { ...res.headers, ...headers } });
  };
}
