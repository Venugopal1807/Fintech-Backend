import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./auth.middleware";

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthenticatedRequest).user;

    if (!user) {
      res.status(401).json({ success: false, error: "Authentication required" });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        success: false,
        error: `Forbidden: requires one of [${allowedRoles.join(", ")}]`,
      });
      return;
    }

    next();
  };
}
