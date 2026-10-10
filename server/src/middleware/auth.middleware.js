import jwt from "jsonwebtoken";
export function authenticate(req, res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: "Authentication required" });
  try { req.user = jwt.verify(token, process.env.JWT_ACCESS_SECRET); next(); }
  catch { return res.status(401).json({ success: false, message: "Invalid or expired access token" }); }
}
