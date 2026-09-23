import { Request, Response } from "express";
import { SettingsService } from "../services/settings.service.js";
import { z } from "zod";

const settingsSchema = z.object({
  businessName: z.string().trim().min(2).max(150),
  registrationNumber: z.string().trim().min(2).max(100),
  address: z.string().trim().min(5),
  email: z.string().email().max(255),
  phone: z.string().trim().min(7).max(50),
});

export const SettingsController = {
  async get(req: Request, res: Response) {
    try {
      const settings = await SettingsService.getSettings();
      res.json({ success: true, data: settings });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  async update(req: Request, res: Response) {
    try {
      const parsed = settingsSchema.safeParse(req.body);
      if (!parsed.success) {
        return res.status(400).json({ success: false, error: parsed.error.flatten() });
      }
      const settings = await SettingsService.updateSettings(parsed.data);
      res.json({ success: true, data: settings });
    } catch (error: any) {
      res.status(500).json({ success: false, error: "Failed to update settings" });
    }
  }
};
