import { Router } from "express";
import { SettingsController } from "../controllers/settings.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, SettingsController.get);
router.put("/", requireAuth, requireRole("OWNER", "ADMIN"), SettingsController.update);

export default router;
