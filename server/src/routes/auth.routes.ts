import { Router } from "express";
import { AuthController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/firebase-session", AuthController.firebaseSession);
router.get("/me", requireAuth, AuthController.me);

export default router;
