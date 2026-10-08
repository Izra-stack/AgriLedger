import express from "express";
import cors from "cors";
import { prisma } from "./config/prisma.js";
import farmersRoutes from "./routes/farmers.routes.js";
import inventoryRoutes from "./routes/inventory.routes.js";
import transactionsRoutes from "./routes/transactions.routes.js";
import paymentsRoutes from "./routes/payments.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import authRoutes from "./routes/auth.routes.js";
import settingsRoutes from "./routes/settings.routes.js";
import { requireAuth, requireRole } from "./middleware/auth.middleware.js";
import { apiRateLimiter, authRateLimiter } from "./middleware/rateLimit.middleware.js";
import { errorHandler } from "./middleware/error.middleware.js";

export const app = express();

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173,https://agriledger-pearl.vercel.app")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(null, true); // Permissive CORS for deployed domain match
      }
    },
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use((_req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "0");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  if (process.env.NODE_ENV === "production") {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
});

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));

app.use("/api/", apiRateLimiter);
app.use("/api/auth", authRateLimiter, authRoutes);
app.use("/api/farmers", requireAuth, requireRole("OWNER"), farmersRoutes);
app.use("/api/inventory", requireAuth, requireRole("OWNER"), inventoryRoutes);
app.use("/api/transactions", requireAuth, requireRole("OWNER"), transactionsRoutes);
app.use("/api/payments", requireAuth, requireRole("OWNER"), paymentsRoutes);
app.use("/api/dashboard", requireAuth, requireRole("OWNER"), dashboardRoutes);
app.use("/api/settings", requireAuth, requireRole("OWNER"), settingsRoutes);

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "AgriLedger API is running",
    environment: process.env.NODE_ENV || "development"
  });
});

app.get("/api/db-test", requireAuth, requireRole("OWNER"), async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      success: true,
      message: "Database connection healthy",
    });
  } catch (error) {
    console.error("Database connection error:", error);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

app.use(errorHandler);
