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

const app = express();
const PORT = Number(process.env.PORT || 5000);

app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:5173",
  credentials: false,
}));
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoutes);
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
    const result = await prisma.$queryRaw<
      { current_database: string; current_schema: string }[]
    >`
      SELECT
        current_database(),
        current_schema()
    `;

    res.json({
      success: true,
      database: result[0]?.current_database,
      schema: result[0]?.current_schema,
      message: "Prisma is connected to PostgreSQL",
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
