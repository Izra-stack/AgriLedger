import type { NextFunction, Request, Response } from "express";

const healthResponse = (res: Response) =>
  res.status(200).json({
    success: true,
    message: "AgriLedger API is running",
    environment: process.env.NODE_ENV || "production",
  });

export default async function apiHandler(req: Request, res: Response, next: NextFunction) {
  const requestPath = (req.url || "").split("?")[0];
  const normalizedPath = requestPath.replace(/^\/api/, "") || "/";

  if (normalizedPath === "/health") {
    return healthResponse(res);
  }

  if (!requestPath.startsWith("/api")) {
    req.url = `/api${requestPath.startsWith("/") ? "" : "/"}${requestPath}`;
  }

  const { app } = await import("../server/src/app.js");
  return app(req, res, next);
}
