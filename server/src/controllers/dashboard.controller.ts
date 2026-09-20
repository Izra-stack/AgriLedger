import { Request, Response } from "express";
import { DashboardService } from "../services/dashboard.service.js";

export const DashboardController = {
  async getSummary(req: Request, res: Response) {
    try {
      const summary = await DashboardService.getSummary();
      res.json({ success: true, data: summary });
    } catch (error) {
      console.error("Error fetching dashboard summary:", error);
      res.status(500).json({ success: false, error: "Failed to fetch dashboard summary" });
    }
  },

  async getAnalytics(req: Request, res: Response) {
    try {
      const analytics = await DashboardService.getAnalytics();
      res.json({ success: true, data: analytics });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ success: false, error: "Failed to fetch analytics" });
    }
  }
};
