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
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(401).json({ success: false, error: error.message });
    }
  },
  
  async me(req: Request, res: Response) {
    // req.user is set by auth middleware
    res.json({ success: true, data: { user: req.user } });
  }
};
