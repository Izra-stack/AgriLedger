import { Router } from "express";
import { FarmersController } from "../controllers/farmers.controller.js";
import { requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", FarmersController.getAll);
router.get("/:id", FarmersController.getById);
router.post("/", FarmersController.create);
router.put("/:id", FarmersController.update);
router.delete("/:id", requireRole("OWNER", "ADMIN"), FarmersController.delete);

export default router;
