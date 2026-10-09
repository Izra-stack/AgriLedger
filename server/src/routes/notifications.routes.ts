import { Router } from "express";
import { NotificationsController } from "../controllers/notifications.controller.js";

const router = Router();

router.get("/", NotificationsController.getDismissed);
router.delete("/:key", NotificationsController.dismiss);

export default router;
