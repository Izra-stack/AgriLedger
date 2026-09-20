import { Request, Response } from "express";
import { AuthService } from "../services/auth.service.js";

export const AuthController = {
  async register(req: Request, res: Response) {
    try {
      const result = await AuthService.register(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  async login(req: Request, res: Response) {
    try {
      const result = await AuthService.login(req.body);
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
