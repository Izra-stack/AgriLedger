import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller.js";
import { requireRole } from "../middleware/auth.middleware.js";

const router = Router();

router.get("/", InventoryController.getAll);
router.get("/:id", InventoryController.getById);
router.post("/", InventoryController.create);
router.put("/:id", InventoryController.update);
router.delete("/:id", requireRole("OWNER", "ADMIN"), InventoryController.delete);

export default router;
