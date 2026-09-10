import "dotenv/config";
import type { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { Role } from "../../generated/prisma/client";
import type { AuthenticatedRequest, JwtUserPayload } from "../types";
import { getJwtSecret } from "../lib/jwtConfig";

const JWT_SECRET = getJwtSecret();

/**
 * Middleware that requires a valid JWT Bearer token.
 * Attaches the verified user payload (id, email, role) to req.user.
 */
export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      status: "fail",
      message: "Authentication required. Please provide a valid Bearer token.",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({
      status: "fail",
      message: "Authentication token missing from Authorization header.",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtUserPayload;
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        status: "fail",
        message: "Token has expired. Please log in again.",
      });
      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        status: "fail",
        message: "Invalid authentication token. Verification failed.",
      });
      return;
    }

    res.status(401).json({
      status: "fail",
      message: "Authentication failed.",
    });
    return;
  }
};

/**
 * Reusable role-based authorization middleware.
 * Example: requireRole("ADMIN") or requireRole("ADMIN", "ORGANIZER")
 */
export const requireRole = (...roles: Role[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): void => {
    if (!req.user) {
      res.status(401).json({
        status: "fail",
        message: "Authentication required before checking permissions.",
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        status: "fail",
        message: `Access denied. Requires one of the following roles: ${roles.join(", ")}`,
      });
      return;
    }

    next();
  };
};

/**
 * Optional authentication middleware.
 * If a valid user JWT is present, attaches req.user.
 * If not present or invalid (e.g. guest or verification token), continues without req.user.
 */
export const optionalAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next();
  }

  const token = authHeader.split(" ")[1];
  if (!token) return next();

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtUserPayload;
    if (decoded && decoded.id && decoded.role) {
      req.user = {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      };
    }
  } catch {
    // Continue as unauthenticated guest
  }

  next();
};
