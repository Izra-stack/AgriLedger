import { Router } from "express";
import { TransactionsController } from "../controllers/transactions.controller.js";

const router = Router();

router.get("/", TransactionsController.getAll);
router.get("/:id", TransactionsController.getById);
router.post("/", TransactionsController.create);
router.put("/:id", TransactionsController.update);

export default router;
