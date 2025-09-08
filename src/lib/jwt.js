
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // keep in .env.local

export function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}
/*
export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

*/



export function verifyToken(request) {
  // request must be the Next.js Request object
  const authHeader = request.headers.get("authorization");
  console.log("Auth header:", authHeader);

  if (!authHeader) return null;

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded:", decoded);
    return decoded;
  } catch (err) {
    console.error("JWT verify error:", err.message);
    return null;
  }
}

