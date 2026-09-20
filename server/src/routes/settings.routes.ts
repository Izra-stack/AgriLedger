import { Router } from "express";
import { SettingsController } from "../controllers/settings.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", requireAuth, SettingsController.get);
router.put("/", requireAuth, SettingsController.update);

export default router;
