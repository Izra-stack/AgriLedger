import { Router } from "express";
import { FarmersController } from "../controllers/farmers.controller.js";

const router = Router();

router.get("/", FarmersController.getAll);
router.get("/:id", FarmersController.getById);
router.post("/", FarmersController.create);
router.put("/:id", FarmersController.update);
router.delete("/:id", FarmersController.delete);

export default router;
