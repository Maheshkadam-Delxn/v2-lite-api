import jwt from "jsonwebtoken";

export function authMiddleware(handler, roles = []) {
  return async (req, ...args) => {
    try {
      const authHeader = req.headers.get("authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return new Response(
          JSON.stringify({ error: "Unauthorized: No token provided" }),
          { status: 401 }
        );
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user info to request
      req.user = decoded;

      // Check role if specified
      if (roles.length > 0 && !roles.includes(decoded.role)) {
        return new Response(
          JSON.stringify({ error: "Forbidden: Insufficient permissions" }),
          { status: 403 }
        );
      }

      return handler(req, ...args);
    } catch (error) {
      console.error("Auth Middleware Error:", error.message);
      return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 401 });
    }
  };
}
