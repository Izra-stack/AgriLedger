import { Router } from "express";
import { InventoryController } from "../controllers/inventory.controller.js";

const router = Router();

router.get("/", InventoryController.getAll);
router.get("/:id", InventoryController.getById);
router.post("/", InventoryController.create);
router.put("/:id", InventoryController.update);
router.delete("/:id", InventoryController.delete);

export default router;
