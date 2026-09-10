import { rateLimit } from "express-rate-limit";

/**
 * General API rate limiter
 * Allows up to 500 requests per 15 minutes per IP
 */
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 500,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many requests from this IP address, please try again later.",
  },
});

/**
 * Authentication rate limiter
 * Blocks brute force / credential stuffing: max 15 attempts per 15 minutes per IP
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 15,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many authentication attempts. Please try again in 15 minutes.",
  },
});

/**
 * OTP send rate limiter
 * Protects email quotas and prevents spam bombing: max 5 requests per minute per IP
 */
export const otpSendLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many verification requests. Please wait a minute before requesting another code.",
  },
});

/**
 * OTP verification rate limiter
 * Max 15 verification submissions per 10 minutes per IP
 */
export const otpVerifyLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 15,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many verification attempts from this IP. Please try again later.",
  },
});

/**
 * Payment initiation rate limiter
 * Max 20 checkout initiation attempts per 10 minutes per IP
 */
export const paymentLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 20,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many payment checkout requests. Please wait a moment before trying again.",
  },
});
