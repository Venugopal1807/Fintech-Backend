import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/env";

export interface JwtPayload {
  id: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    res.status(401).json({ success: false, error: "Missing or malformed authorization header" });
    return;
  }

  const token = header.slice(7);

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;

    if (!decoded.id || !decoded.role) {
      res.status(401).json({ success: false, error: "Invalid token payload" });
      return;
    }

    (req as AuthenticatedRequest).user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    const message =
      err instanceof jwt.TokenExpiredError
        ? "Token expired"
        : "Invalid token";

    res.status(401).json({ success: false, error: message });
  }
}
