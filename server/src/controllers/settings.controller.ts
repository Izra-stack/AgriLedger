import { Request, Response } from "express";
import { SettingsService } from "../services/settings.service.js";

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
      const settings = await SettingsService.updateSettings(req.body);
      res.json({ success: true, data: settings });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};
