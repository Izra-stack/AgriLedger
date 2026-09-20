import { Router } from "express";
import { PaymentsController } from "../controllers/payments.controller.js";

const router = Router();

router.get("/", PaymentsController.getAll);
router.get("/:id", PaymentsController.getById);
router.post("/", PaymentsController.create);

export default router;
