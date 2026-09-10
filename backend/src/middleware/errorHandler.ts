import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";

export interface AppError extends Error {
  statusCode?: number;
  status?: string;
  isOperational?: boolean;
}

export const errorHandler: ErrorRequestHandler = (
  err: AppError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const isProduction = process.env.NODE_ENV === "production";

  // In production, mask unexpected 500 errors to prevent schema/stack leakage
  const message =
    isProduction && statusCode === 500 && !err.isOperational
      ? "Internal Server Error"
      : err.message || "Internal Server Error";

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, err);

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message,
    ...(!isProduction && { stack: err.stack }),
  });
};
