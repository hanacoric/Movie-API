import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

/**
 * middleware to verify JWT token
 */
export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.header("auth-token");

  if (!token) {
    res.status(400).json({ error: "Access denied." });
    return;
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET as string);
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token." });
  }
}
