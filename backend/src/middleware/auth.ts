/**
 * Auth Middleware
 * Single Responsibility: JWT verification and role-based access
 * Dependency Inversion: Uses injected security utilities
 */

import type { Request, Response, NextFunction } from "express";
import { UnauthorizedError, ForbiddenError } from "../errors";
import { extractToken, verifyToken } from "../utils/security";
import type { AuthPayload } from "../types";

/**
 * Extended request with user context
 */
export interface AuthRequest extends Request {
  user?: AuthPayload;
}

/**
 * Verify JWT token middleware
 * Single Responsibility: Token validation only
 */
export function verifyJWT(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = extractToken(req.headers.authorization);
    if (!token) {
      throw new UnauthorizedError("Missing authorization token");
    }

    const payload = verifyToken(token);
    if (!payload) {
      throw new UnauthorizedError("Invalid or expired token");
    }

    req.user = payload;
    next();
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      res.status(401).json({
        success: false,
        message: error.message,
        timestamp: new Date().toISOString(),
      });
    } else {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
        timestamp: new Date().toISOString(),
      });
    }
  }
}

/**
 * Role-based access control middleware
 * Single Responsibility: Role validation only
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: "Insufficient permissions",
        timestamp: new Date().toISOString(),
      });
      return;
    }

    next();
  };
}
