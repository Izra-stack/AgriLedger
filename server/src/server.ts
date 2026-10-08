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

const app = express();
const PORT = Number(process.env.PORT || 5000);

const allowedOrigins = (process.env.FRONTEND_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation"));
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

import { errorHandler } from "./middleware/error.middleware.js";
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`AgriLedger API running on http://localhost:${PORT}`);
});
