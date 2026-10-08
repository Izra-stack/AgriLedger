import type { Request, Response } from "express";

export default function healthHandler(_req: Request, res: Response) {
  return res.status(200).json({
    success: true,
    message: "AgriLedger API is running",
    environment: process.env.NODE_ENV || "production",
  });
}
