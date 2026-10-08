import type { Request, Response } from "express";
import { AuthController } from "../../server/src/controllers/auth.controller.js";

export default function firebaseSessionHandler(req: Request, res: Response) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      success: false,
      error: "Method not allowed",
    });
  }

  return AuthController.firebaseSession(req, res);
}
