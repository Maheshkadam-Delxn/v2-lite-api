import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // keep in .env.local

export function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/**
 * Safely verify JWT from either:
 * - Next.js Request object
 * - Raw token string
 */
export function verifyToken(input) {
  let token;

  // Case 1: input is Request object
  if (input?.headers?.get) {
    const authHeader = input.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
    token = authHeader.split(" ")[1];
  }
  // Case 2: input is raw token string
  else if (typeof input === "string") {
    token = input;
  } else {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded;
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return null;
  }
}
