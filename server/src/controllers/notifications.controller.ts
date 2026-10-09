import { Request, Response } from "express";
import { z } from "zod";
import { NotificationsService } from "../services/notifications.service.js";

const notificationKeySchema = z.string().regex(/^[a-z0-9-]+$/, "Invalid notification key");

export const NotificationsController = {
  async getDismissed(req: Request, res: Response) {
    const keys = await NotificationsService.getDismissedKeys(req.user!.id);
    res.json({ success: true, data: keys });
  },

  async dismiss(req: Request, res: Response) {
    const result = notificationKeySchema.safeParse(req.params.key);
    if (!result.success) {
      return res.status(400).json({ success: false, error: "Invalid notification key" });
    }
    await NotificationsService.dismiss(req.user!.id, result.data);
    res.json({ success: true, message: "Notification deleted" });
  },
};
