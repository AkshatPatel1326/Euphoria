import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes";
import { errorHandler } from "./middleware/errorHandler";
import { generalLimiter } from "./middleware/rateLimiter";

const app: Application = express();

// Trust reverse proxy for accurate IP in rate limiting & logs
app.set("trust proxy", 1);

// Disable technological fingerprinting
app.disable("x-powered-by");

// Standard security headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);

// Secure CORS policy
const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((o) => o.trim().toLowerCase())
  : ["http://localhost:5173", "http://localhost:5000", "http://localhost:3000"];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, S2S webhooks)
      if (!origin) return callback(null, true);
      const normalizedOrigin = origin.toLowerCase().trim();
      if (
        process.env.NODE_ENV !== "production" ||
        allowedOrigins.includes("*") ||
        allowedOrigins.includes(normalizedOrigin)
      ) {
        return callback(null, true);
      }
      callback(new Error(`CORS origin '${origin}' not allowed by policy`));
    },
    credentials: true,
  })
);

// Body Parsing Middleware with bounded payload limits (prevents memory DoS)
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ extended: true, limit: "100kb" }));

// Apply general rate limiter across all /api endpoints
app.use("/api", generalLimiter);

// Root welcome route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    name: "Euphoria Fest API",
    version: "1.0.0",
    status: "online",
    endpoints: {
      health: "/api/health",
    },
  });
});

// Central API Routes
app.use("/api", routes);

// 404 handler for undefined routes
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: "fail",
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;
