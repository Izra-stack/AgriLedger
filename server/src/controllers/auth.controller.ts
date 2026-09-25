import { Request, Response } from "express";
import { firebaseAdminAuth } from "../config/firebase.js";
import { AuthService } from "../services/auth.service.js";

export const AuthController = {
  async firebaseSession(req: Request, res: Response) {
    try {
      const { idToken } = req.body;
      if (!idToken || typeof idToken !== "string") {
        return res.status(400).json({ success: false, error: "Firebase ID token is required" });
      }

      const decoded = await firebaseAdminAuth.verifyIdToken(idToken);
      const result = await AuthService.syncFirebaseUser(decoded);
      if (result.user.role !== "OWNER") {
        return res.status(403).json({ success: false, error: "Forbidden: OWNER authorization required" });
      }
      res.json({ success: true, data: result });
    } catch (error: any) {
      const status = error?.message?.startsWith("Forbidden:") ? 403 : 401;
      res.status(status).json({ success: false, error: error.message });
    }
  },
  
  async me(req: Request, res: Response) {
    // req.user is set by auth middleware
    res.json({ success: true, data: { user: req.user } });
  }
};
